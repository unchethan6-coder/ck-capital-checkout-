import { BUNDLED_NEWS } from "./content";
import type { NewsItem, OfferPrice, OfferRegion, OffersPayload } from "./types";

/**
 * Offers and news source.
 *
 * Items come from the CMS when the collection is reachable and fall back to
 * the bundled set otherwise, so the centre never renders empty. Scheduling,
 * locale targeting and the saving percentages are all resolved here rather
 * than in the UI, which keeps what a visitor sees identical to what the
 * server decided.
 */

const BASE_URL = process.env.STRAPI_BASE_URL ?? "";
const API_TOKEN = process.env.STRAPI_API_TOKEN ?? "";
const FETCH_TIMEOUT_MS = 5_000;
/** Offers change rarely; a short cache keeps the modal instant. */
const CACHE_TTL_MS = 60_000;

interface CacheEntry {
  items: NewsItem[];
  fromCms: boolean;
  fetchedAt: number;
}

const globalForOffers = globalThis as unknown as { __ckOffers?: { cache: CacheEntry | null } };
const store = (globalForOffers.__ckOffers ??= { cache: null });

/** Parse a formatted price like "$112.80" into a number, or null. */
function priceValue(formatted: string): number | null {
  const n = Number(formatted.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Derive the saving percentage from the two prices.
 *
 * Authored percentages drift out of step with the numbers beside them the
 * first time a price is edited, so the badge is always computed.
 */
function withSavings(rows: OfferPrice[]): OfferPrice[] {
  return rows.map((row) => {
    const from = priceValue(row.original);
    const to = priceValue(row.discounted);
    const savingPct = from && to && to < from ? Math.round(((from - to) / from) * 100) : 0;
    return { ...row, savingPct };
  });
}

/** True when the item's scheduled window contains `now`. */
function isScheduled(item: NewsItem, now: number): boolean {
  if (item.startsAt && Date.parse(item.startsAt) > now) return false;
  if (item.endsAt && Date.parse(item.endsAt) <= now) return false;
  return true;
}

/** True when the item targets this locale (empty targeting means all). */
function targetsLocale(item: NewsItem, locale: string): boolean {
  return item.locales.length === 0 || item.locales.includes(locale);
}

/* ─────────────────────────────────────────────────────────────────── CMS */

interface CmsRow {
  id?: number;
  slug?: string;
  tags?: unknown;
  title?: string;
  author?: string;
  summary?: string;
  body?: unknown;
  imageUrl?: string;
  imageAlt?: string;
  startsAt?: string;
  endsAt?: string;
  coupon?: string;
  pricingGlobal?: unknown;
  pricingUsa?: unknown;
  rules?: unknown;
  ctaHref?: string;
  ctaLabel?: string;
  rating?: number;
  priority?: number;
  locales?: unknown;
}

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

const asPriceRows = (v: unknown): OfferPrice[] =>
  Array.isArray(v)
    ? v.flatMap((r) => {
        const row = r as Partial<OfferPrice>;
        if (!row?.plan || !row?.original || !row?.discounted) return [];
        return [{ plan: row.plan, original: row.original, discounted: row.discounted, savingPct: 0 }];
      })
    : [];

function fromCmsRow(raw: CmsRow): NewsItem | null {
  if (!raw.title) return null;
  return {
    id: raw.slug || String(raw.id ?? raw.title),
    tags: asStringArray(raw.tags),
    title: raw.title,
    author: raw.author ?? "CK Capital",
    summary: raw.summary ?? "",
    body: asStringArray(raw.body),
    image: raw.imageUrl ? { src: raw.imageUrl, alt: raw.imageAlt ?? "" } : null,
    startsAt: raw.startsAt ?? null,
    endsAt: raw.endsAt ?? null,
    coupon: raw.coupon ?? null,
    pricing: {
      global: asPriceRows(raw.pricingGlobal),
      usa: asPriceRows(raw.pricingUsa),
    },
    rules: asStringArray(raw.rules),
    ctaHref: raw.ctaHref ?? "/#start-challenge",
    ctaLabel: raw.ctaLabel ?? null,
    rating: typeof raw.rating === "number" ? raw.rating : null,
    priority: typeof raw.priority === "number" ? raw.priority : 0,
    locales: asStringArray(raw.locales),
  };
}

async function fetchFromCms(): Promise<NewsItem[] | null> {
  if (!BASE_URL) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const url = `${BASE_URL.replace(/\/$/, "")}/api/news-items?pagination[pageSize]=50&sort=priority:desc`;
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: CmsRow[] };
    const rows = json?.data;
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const items = rows.map(fromCmsRow).filter((i): i is NewsItem => i !== null);
    return items.length > 0 ? items : null;
  } catch {
    // Unreachable or malformed — the bundled set covers it.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ───────────────────────────────────────────────────────────────── public */

/** US visitors see the US pricing table; everyone else sees global. */
export function regionForCountry(country: string | null | undefined): OfferRegion {
  return (country ?? "").toUpperCase() === "US" ? "usa" : "global";
}

/**
 * Active items for a locale and region, newest-priority first.
 *
 * Expired and not-yet-started items are removed here, which is what lets an
 * admin schedule and expire an offer without a deployment.
 */
export async function getOffers(locale: string, region: OfferRegion): Promise<OffersPayload> {
  const cached = store.cache;
  let items: NewsItem[];
  let fromCms: boolean;

  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    items = cached.items;
    fromCms = cached.fromCms;
  } else {
    const live = await fetchFromCms();
    items = live ?? BUNDLED_NEWS;
    fromCms = live !== null;
    store.cache = { items, fromCms, fetchedAt: Date.now() };
  }

  const now = Date.now();
  const active = items
    .filter((i) => isScheduled(i, now) && targetsLocale(i, locale))
    .sort((a, b) => b.priority - a.priority || (b.startsAt ?? "").localeCompare(a.startsAt ?? ""))
    .map((item) => ({
      ...item,
      // Only the viewer's region is sent, so the table cannot show the wrong one.
      pricing: { [region]: withSavings(item.pricing[region] ?? []) },
    }));

  return { items: active, region, fromCms };
}
