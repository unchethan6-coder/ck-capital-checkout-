import type { CalendarEvent, CalendarPayload, EventImpact } from "./types";

/**
 * Economic calendar feed.
 *
 * The upstream publishes one rolling week as JSON. It is read on the server
 * and cached in-process, so a burst of visitors costs one upstream call. A
 * failed read is never fatal: the last good week is served with `live: false`
 * so the page can say the data is not current rather than showing nothing.
 */

const UPSTREAM = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
export const SOURCE_LABEL = "forexfactory.com";

/** How long a successful read is reused before the upstream is asked again. */
const CACHE_TTL_MS = 5 * 60_000;
const FETCH_TIMEOUT_MS = 8_000;

interface UpstreamEvent {
  title?: string;
  country?: string;
  date?: string;
  impact?: string;
  forecast?: string;
  previous?: string;
}

interface CacheEntry {
  payload: CalendarPayload;
  fetchedAt: number;
}

/** Survives dev hot reloads so a reload does not drop the cache. */
const globalForFeed = globalThis as unknown as {
  __ckCalendar?: { cache: CacheEntry | null; inflight: Promise<CalendarPayload> | null };
};
const store = (globalForFeed.__ckCalendar ??= { cache: null, inflight: null });

const VALID_IMPACTS: EventImpact[] = ["High", "Medium", "Low", "Holiday"];

function normaliseImpact(raw: string | undefined): EventImpact {
  const match = VALID_IMPACTS.find((i) => i.toLowerCase() === (raw ?? "").toLowerCase());
  // Anything unrecognised is treated as low rather than dropped, so a new
  // upstream label never silently removes events from the calendar.
  return match ?? "Low";
}

/**
 * Build a stable id. The upstream has no identifier of its own, so the id is
 * derived from the fields that together identify a release.
 */
function makeId(date: string, currency: string, title: string): string {
  return `${date}|${currency}|${title}`.replace(/\s+/g, "-").toLowerCase();
}

function normalise(raw: UpstreamEvent[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  for (const row of raw) {
    if (!row.title || !row.date) continue;
    const parsed = Date.parse(row.date);
    if (Number.isNaN(parsed)) continue;
    const date = new Date(parsed).toISOString();
    const currency = (row.country ?? "All").trim() || "All";
    events.push({
      id: makeId(date, currency, row.title),
      title: row.title.trim(),
      date,
      currency,
      impact: normaliseImpact(row.impact),
      forecast: (row.forecast ?? "").trim(),
      previous: (row.previous ?? "").trim(),
    });
  }
  // Chronological, so pagination walks the week in order.
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

async function readUpstream(): Promise<CalendarPayload> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(UPSTREAM, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (compatible; CKCapital/1.0)" },
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const events = normalise((await res.json()) as UpstreamEvent[]);
    if (events.length === 0) throw new Error("empty feed");

    const payload: CalendarPayload = {
      events,
      updatedAt: new Date().toISOString(),
      source: SOURCE_LABEL,
      live: true,
    };
    store.cache = { payload, fetchedAt: Date.now() };
    return payload;
  } catch {
    // Serve the last good week, flagged, rather than an empty calendar.
    if (store.cache) return { ...store.cache.payload, live: false };
    return { events: [], updatedAt: new Date().toISOString(), source: SOURCE_LABEL, live: false };
  } finally {
    clearTimeout(timer);
  }
}

/** Cached calendar for the current week. Concurrent callers share one read. */
export function getCalendar(): Promise<CalendarPayload> {
  const cached = store.cache;
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return Promise.resolve(cached.payload);
  }
  store.inflight ??= readUpstream().finally(() => {
    store.inflight = null;
  });
  return store.inflight;
}

/**
 * Which page the calendar should open on.
 *
 * Decided here rather than in an effect so the server already renders the
 * right page: computing it after hydration meant the first paint showed the
 * start of the week — several days in the past by midweek — and then jumped.
 */
export function initialPageFor(events: CalendarEvent[], pageSize: number): number {
  const now = Date.now();
  const next = events.findIndex((e) => Date.parse(e.date) >= now);
  if (next === -1) return Math.max(1, Math.ceil(events.length / pageSize));
  return Math.floor(next / pageSize) + 1;
}
