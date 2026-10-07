import { fetchCrypto, fetchFxRates, fetchYahoo, type Tick } from "./providers";
import { CRYPTO_SPECS, FXRATES_SPECS, SYMBOL_SPECS, YAHOO_SPECS } from "./symbols";
import type { Quote, QuoteStatus, SymbolSpec } from "./types";

/**
 * Process-wide market data hub.
 *
 * One poller serves every connected client: subscribers register a callback,
 * the hub fans each upstream refresh out to all of them, and polling stops
 * once the last subscriber leaves. This keeps upstream load flat no matter how
 * many people have the symbols page open.
 *
 * State is intentionally module-level. In a multi-instance deployment each
 * instance keeps its own copy, which is fine — the data is read-only and
 * identical upstream.
 */

/** Crypto venues publish a real book, so they can be polled aggressively. */
const CRYPTO_INTERVAL_MS = 1_000;
/** Yahoo is rate-limited and only moves on trades; 4s keeps us well inside it. */
const YAHOO_INTERVAL_MS = 4_000;
/** The FX table is republished about once a minute; polling faster just burns quota. */
const FXRATES_INTERVAL_MS = 20_000;
/** Stop polling this long after the last subscriber disconnects. */
const IDLE_SHUTDOWN_MS = 60_000;
/** A symbol we have not refreshed within this window is flagged disconnected. */
const DISCONNECTED_AFTER_MS = 30_000;
/**
 * Upstream prints older than this mean the market is closed rather than that
 * anything is broken. The spark feed timestamps the last 5-minute bar, so a
 * healthy open market can legitimately be ~15 minutes behind; the threshold is
 * set well clear of that so only genuinely dormant sessions are flagged.
 */
const STALE_AFTER_MS = 60 * 60_000;

type Listener = (changed: Quote[]) => void;

interface HubState {
  quotes: Map<string, Quote>;
  /** When we last successfully read each symbol from upstream. */
  lastFetchOk: Map<string, number>;
  listeners: Set<Listener>;
  timers: ReturnType<typeof setInterval>[];
  idleTimer: ReturnType<typeof setTimeout> | null;
  running: boolean;
  /** Resolves once an in-flight refresh completes; shared by concurrent callers. */
  primed: Promise<void> | null;
  /** When the last full refresh finished, for on-demand freshness checks. */
  lastRefreshAt: number;
}

/**
 * Survives dev-mode hot reloads — without this each reload would leak a poller.
 */
const globalForHub = globalThis as unknown as { __ckMarketHub?: HubState };

const state: HubState =
  globalForHub.__ckMarketHub ??
  (globalForHub.__ckMarketHub = {
    quotes: new Map(),
    lastFetchOk: new Map(),
    listeners: new Set(),
    timers: [],
    idleTimer: null,
    running: false,
    primed: null,
    lastRefreshAt: 0,
  });

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/**
 * Turn an upstream tick into a displayable quote.
 *
 * Bid and ask are rounded to the instrument's precision *before* the spread is
 * computed, so the spread column always equals the ask and bid shown next to
 * it — never a value that looks off by a tick because of rounding.
 */
function toQuote(spec: SymbolSpec, tick: Tick, previous: Quote | undefined): Quote {
  const derived = tick.bid === undefined || tick.ask === undefined;

  // For derived quotes the ask is anchored to the rounded bid rather than
  // rounded independently, otherwise an odd-width spread rounds outward on both
  // sides and the row shows a wider spread than the one we publish.
  const bid = round(derived ? tick.mid - spec.spread / 2 : tick.bid!, spec.digits);
  const ask = derived ? round(bid + spec.spread, spec.digits) : round(tick.ask!, spec.digits);
  const spread = round(ask - bid, spec.digits);

  const mid = (bid + ask) / 2;
  const prevMid = previous ? (previous.bid + previous.ask) / 2 : mid;
  const direction: Quote["direction"] = mid > prevMid ? 1 : mid < prevMid ? -1 : previous?.direction ?? 0;

  const changePct =
    tick.prevClose && tick.prevClose > 0
      ? ((mid - tick.prevClose) / tick.prevClose) * 100
      : previous?.changePct ?? 0;

  return {
    symbol: spec.symbol,
    bid,
    ask,
    spread,
    changePct: Math.round(changePct * 100) / 100,
    direction,
    ts: tick.ts,
    status: "live",
    derived,
  };
}

/** Recompute status from fetch health and upstream freshness. */
function statusFor(symbol: string, quoteTs: number, now: number): QuoteStatus {
  const lastOk = state.lastFetchOk.get(symbol);
  if (lastOk === undefined || now - lastOk > DISCONNECTED_AFTER_MS) return "disconnected";
  if (now - quoteTs > STALE_AFTER_MS) return "stale";
  return "live";
}

/** Apply a batch of ticks, returning only the quotes that actually changed. */
function applyTicks(ticks: Map<string, Tick>, specs: SymbolSpec[]): Quote[] {
  const now = Date.now();
  const changed: Quote[] = [];

  for (const spec of specs) {
    const tick = ticks.get(spec.symbol);
    const previous = state.quotes.get(spec.symbol);

    if (tick) {
      state.lastFetchOk.set(spec.symbol, now);
      const next = toQuote(spec, tick, previous);
      next.status = statusFor(spec.symbol, next.ts, now);
      // Only emit when something a viewer would notice has moved.
      if (
        !previous ||
        previous.bid !== next.bid ||
        previous.ask !== next.ask ||
        previous.status !== next.status ||
        previous.changePct !== next.changePct
      ) {
        state.quotes.set(spec.symbol, next);
        changed.push(next);
      }
      continue;
    }

    // No tick this round — re-evaluate staleness on the price we already have.
    if (previous) {
      const status = statusFor(spec.symbol, previous.ts, now);
      if (status !== previous.status) {
        const next = { ...previous, status };
        state.quotes.set(spec.symbol, next);
        changed.push(next);
      }
    }
  }
  return changed;
}

function emit(changed: Quote[]) {
  if (changed.length === 0) return;
  for (const listener of state.listeners) {
    try {
      listener(changed);
    } catch {
      // A broken client must never stop the feed for everyone else.
    }
  }
}

async function refreshCrypto() {
  emit(applyTicks(await fetchCrypto(), CRYPTO_SPECS));
  state.lastRefreshAt = Date.now();
}

async function refreshYahoo() {
  emit(applyTicks(await fetchYahoo(), YAHOO_SPECS));
  state.lastRefreshAt = Date.now();
}

async function refreshFxRates() {
  emit(applyTicks(await fetchFxRates(), FXRATES_SPECS));
  state.lastRefreshAt = Date.now();
}

function startPolling() {
  // `running` can be true with an empty timer list after a hot reload, so the
  // timers themselves are the source of truth.
  if (state.running && state.timers.length > 0) return;
  stopPolling();
  state.running = true;
  state.timers = [
    setInterval(() => void refreshCrypto(), CRYPTO_INTERVAL_MS),
    setInterval(() => void refreshYahoo(), YAHOO_INTERVAL_MS),
    setInterval(() => void refreshFxRates(), FXRATES_INTERVAL_MS),
  ];
}

function stopPolling() {
  for (const timer of state.timers) clearInterval(timer);
  state.timers = [];
  state.running = false;
}

/**
 * How old the cached data may be before an on-demand caller refreshes it.
 * Only relevant while no one is subscribed — the poller keeps data fresher
 * than this whenever the stream is in use.
 */
const ON_DEMAND_MAX_AGE_MS = 5_000;

/**
 * Ensure the hub has reasonably fresh data before a one-shot read.
 *
 * Without subscribers there is no poller running, so a snapshot request or a
 * page render would otherwise be served from however old the cache happened to
 * be. Concurrent callers share a single in-flight refresh.
 */
export function prime(): Promise<void> {
  const fresh = state.quotes.size > 0 && Date.now() - state.lastRefreshAt < ON_DEMAND_MAX_AGE_MS;
  if (fresh) return Promise.resolve();

  state.primed ??= Promise.all([refreshCrypto(), refreshYahoo(), refreshFxRates()])
    .then(() => undefined)
    .finally(() => {
      state.primed = null;
    });
  return state.primed;
}

/**
 * Prime, but never block a page render for longer than `ms`.
 *
 * A cold instance whose upstream is slow would otherwise hold the response for
 * the full fetch timeout. Returning early is safe: the client opens the stream
 * on hydration and fills in whatever was missing within a second.
 */
export async function primeWithin(ms: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      prime(),
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/** Current quotes for every instrument we have seen, in catalogue order. */
export function getSnapshot(): Quote[] {
  const now = Date.now();
  const out: Quote[] = [];
  for (const spec of SYMBOL_SPECS) {
    const quote = state.quotes.get(spec.symbol);
    if (quote) out.push({ ...quote, status: statusFor(spec.symbol, quote.ts, now) });
  }
  return out;
}

/**
 * Register for live updates. Starts the poller on the first subscriber and
 * schedules shutdown when the last one leaves. Returns an unsubscribe function.
 */
export function subscribe(listener: Listener): () => void {
  state.listeners.add(listener);
  if (state.idleTimer) {
    clearTimeout(state.idleTimer);
    state.idleTimer = null;
  }
  startPolling();

  return () => {
    state.listeners.delete(listener);
    if (state.listeners.size === 0 && !state.idleTimer) {
      state.idleTimer = setTimeout(() => {
        state.idleTimer = null;
        if (state.listeners.size === 0) stopPolling();
      }, IDLE_SHUTDOWN_MS);
    }
  };
}
