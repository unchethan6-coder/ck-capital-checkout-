import { CRYPTO_SPECS, FXRATES_SPECS, YAHOO_SPECS } from "./symbols";
import type { SymbolSpec } from "./types";

/**
 * Upstream market data providers.
 *
 * Each provider returns a partial price picture — mid or top-of-book — which
 * `hub.ts` turns into a full `Quote`. Providers never throw: a failed fetch
 * resolves to an empty map so the hub can mark the affected rows stale instead
 * of taking the whole feed down.
 */

/** Raw price reading from an upstream feed, before CK spreads are applied. */
export interface Tick {
  /** Real top-of-book bid, when the feed publishes one. */
  bid?: number;
  /** Real top-of-book ask, when the feed publishes one. */
  ask?: number;
  /** Last traded / mid price. Always present. */
  mid: number;
  /** Previous session close, used for the day change percentage. */
  prevClose?: number;
  /** Upstream timestamp in ms. */
  ts: number;
}

const FETCH_TIMEOUT_MS = 6000;

/** fetch() with a hard timeout — a hung upstream must not stall the hub. */
async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (compatible; CKCapital/1.0)", ...init?.headers },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ─────────────────────────────────────────────────────────────────── Crypto */

interface BinanceBookTicker {
  symbol: string;
  bidPrice: string;
  askPrice: string;
}

interface Binance24h {
  symbol: string;
  prevClosePrice: string;
}

interface KrakenTicker {
  /** [price, wholeLotVolume, lotVolume] */
  a: string[];
  b: string[];
  /** Today's opening price. */
  o: string;
}

interface KrakenResponse {
  error?: string[];
  result?: Record<string, KrakenTicker>;
}

/**
 * Binance refuses US IPs with a 451, and most serverless regions are in the US.
 * Rather than burn a timeout on every poll once that is established, the venue
 * is parked for a while and Kraken is used directly.
 */
const BINANCE_COOLDOWN_MS = 10 * 60_000;
let binanceBlockedUntil = 0;

/** Binance public book ticker — tightest spreads, but geo-restricted. */
async function fetchFromBinance(specs: SymbolSpec[]): Promise<Map<string, Tick>> {
  const out = new Map<string, Tick>();
  const tickers = specs.map((s) => (s.source as { binanceTicker: string }).binanceTicker);
  const query = encodeURIComponent(JSON.stringify(tickers));

  const [books, stats] = await Promise.all([
    fetchJson<BinanceBookTicker[]>(`https://api.binance.com/api/v3/ticker/bookTicker?symbols=${query}`),
    fetchJson<Binance24h[]>(`https://api.binance.com/api/v3/ticker/24hr?symbols=${query}`),
  ]);
  if (!books) return out;

  const prevByTicker = new Map<string, number>();
  for (const row of stats ?? []) {
    const prev = Number(row.prevClosePrice);
    if (Number.isFinite(prev) && prev > 0) prevByTicker.set(row.symbol, prev);
  }

  const specByTicker = new Map(specs.map((s) => [(s.source as { binanceTicker: string }).binanceTicker, s]));
  const ts = Date.now();

  for (const row of books) {
    const spec = specByTicker.get(row.symbol);
    if (!spec) continue;
    const bid = Number(row.bidPrice);
    const ask = Number(row.askPrice);
    if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask <= 0) continue;
    out.set(spec.symbol, { bid, ask, mid: (bid + ask) / 2, prevClose: prevByTicker.get(row.symbol), ts });
  }
  return out;
}

/**
 * Kraken public ticker — same shape of data, no geo restriction.
 *
 * Kraken answers with its own canonical pair names (XBTUSD comes back as
 * XXBTZUSD), so each spec records the key to read as well as the one to ask
 * for. `o` is the session open, which stands in for the previous close.
 */
async function fetchFromKraken(specs: SymbolSpec[]): Promise<Map<string, Tick>> {
  const out = new Map<string, Tick>();
  const pairs = specs.map((s) => (s.source as { krakenPair: string }).krakenPair).join(",");

  const data = await fetchJson<KrakenResponse>(
    `https://api.kraken.com/0/public/Ticker?pair=${encodeURIComponent(pairs)}`
  );
  const result = data?.result;
  if (!result) return out;

  const ts = Date.now();
  for (const spec of specs) {
    const { krakenKey, krakenPair } = spec.source as { krakenKey: string; krakenPair: string };
    const row = result[krakenKey] ?? result[krakenPair];
    if (!row) continue;
    const bid = Number(row.b?.[0]);
    const ask = Number(row.a?.[0]);
    if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask <= 0) continue;
    const open = Number(row.o);
    out.set(spec.symbol, {
      bid,
      ask,
      mid: (bid + ask) / 2,
      prevClose: Number.isFinite(open) && open > 0 ? open : undefined,
      ts,
    });
  }
  return out;
}

/**
 * Crypto quotes, preferring Binance and falling back to Kraken.
 *
 * Both venues publish a real order book, so either way the bid/ask shown are
 * genuine rather than derived from a mid.
 */
export async function fetchCrypto(specs: SymbolSpec[] = CRYPTO_SPECS): Promise<Map<string, Tick>> {
  if (specs.length === 0) return new Map();

  if (Date.now() >= binanceBlockedUntil) {
    const fromBinance = await fetchFromBinance(specs);
    if (fromBinance.size > 0) return fromBinance;
    // Empty means blocked or down — stop asking for a while.
    binanceBlockedUntil = Date.now() + BINANCE_COOLDOWN_MS;
  }

  return fetchFromKraken(specs);
}

/* ──────────────────────────────────────────────────────────────────── Yahoo */

interface SparkResponse {
  spark?: {
    result?: {
      symbol: string;
      response?: {
        meta?: {
          regularMarketPrice?: number;
          chartPreviousClose?: number;
          previousClose?: number;
          regularMarketTime?: number;
        };
      }[];
    }[];
  };
}

/**
 * Yahoo answers "Number of symbols needs to be less than or equal to 20" above
 * this, and drops the whole batch rather than truncating it — so the chunk size
 * is a hard limit, not a tuning knob.
 */
const YAHOO_CHUNK = 20;

/**
 * FX, indices, commodities and equities via Yahoo's batched spark feed.
 *
 * The feed publishes a last traded price but no order book, so `bid`/`ask` are
 * left undefined here and the hub derives them from CK's published spread.
 */
export async function fetchYahoo(specs: SymbolSpec[] = YAHOO_SPECS): Promise<Map<string, Tick>> {
  const out = new Map<string, Tick>();
  if (specs.length === 0) return out;

  const chunks: SymbolSpec[][] = [];
  for (let i = 0; i < specs.length; i += YAHOO_CHUNK) chunks.push(specs.slice(i, i + YAHOO_CHUNK));

  const responses = await Promise.all(
    chunks.map((chunk) => {
      const symbols = chunk.map((s) => (s.source as { ticker: string }).ticker).join(",");
      const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(symbols)}&range=1d&interval=5m`;
      return fetchJson<SparkResponse>(url);
    })
  );

  const specByTicker = new Map(specs.map((s) => [(s.source as { ticker: string }).ticker, s]));

  for (const data of responses) {
    for (const row of data?.spark?.result ?? []) {
      const spec = specByTicker.get(row.symbol);
      const meta = row.response?.[0]?.meta;
      const mid = meta?.regularMarketPrice;
      if (!spec || typeof mid !== "number" || !Number.isFinite(mid) || mid <= 0) continue;
      const prevClose = meta?.chartPreviousClose ?? meta?.previousClose;
      out.set(spec.symbol, {
        mid,
        prevClose: typeof prevClose === "number" && prevClose > 0 ? prevClose : undefined,
        // Yahoo timestamps are in seconds; fall back to now when absent.
        ts: meta?.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now(),
      });
    }
  }
  return out;
}

/* ────────────────────────────────────────────────────────────────── FX rates */

interface FxRatesResponse {
  rates?: Record<string, number>;
  timestamp?: number;
}

const FXRATES_CURRENCIES = "EUR,GBP,JPY,AUD,CAD,CHF,NZD,MXN,ZAR";
const FXRATES_LATEST = `https://api.fxratesapi.com/latest?base=USD&currencies=${FXRATES_CURRENCIES}`;

/** Previous-session rates change once a day, so they are cached per process. */
let prevCloseCache: { date: string; rates: Record<string, number> } | null = null;

function utcDateMinusDays(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

/** Yesterday's USD rate table, used for the day-change column. */
async function fetchFxPrevClose(): Promise<Record<string, number>> {
  const date = utcDateMinusDays(1);
  if (prevCloseCache?.date === date) return prevCloseCache.rates;

  const data = await fetchJson<FxRatesResponse>(
    `https://api.fxratesapi.com/historical?date=${date}&base=USD&currencies=${FXRATES_CURRENCIES}`
  );
  const rates = data?.rates;
  if (!rates) return prevCloseCache?.rates ?? {};

  prevCloseCache = { date, rates: { ...rates, USD: 1 } };
  return prevCloseCache.rates;
}

/**
 * Cross-rate for BASE/QUOTE from a USD-based table.
 *
 * `rates[X]` is how many X one USD buys, so BASE/QUOTE is simply
 * rates[QUOTE] / rates[BASE]. USD itself is 1 by definition.
 */
function cross(rates: Record<string, number>, base: string, quote: string): number | null {
  const b = base === "USD" ? 1 : rates[base];
  const q = quote === "USD" ? 1 : rates[quote];
  if (!b || !q || !Number.isFinite(b) || !Number.isFinite(q)) return null;
  return q / b;
}

/**
 * FX via a USD-based rate table, which publishes full precision rather than
 * the four significant digits Yahoo gives for currencies. One request covers
 * every pair in the catalogue; crosses are computed locally.
 */
export async function fetchFxRates(specs: SymbolSpec[] = FXRATES_SPECS): Promise<Map<string, Tick>> {
  const out = new Map<string, Tick>();
  if (specs.length === 0) return out;

  const [latest, prevRates] = await Promise.all([
    fetchJson<FxRatesResponse>(FXRATES_LATEST),
    fetchFxPrevClose(),
  ]);
  const rates = latest?.rates;
  if (!rates) return out;

  const ts = latest?.timestamp ? latest.timestamp * 1000 : Date.now();

  for (const spec of specs) {
    const { base, quote } = spec.source as { base: string; quote: string };
    const mid = cross(rates, base, quote);
    if (mid === null || mid <= 0) continue;
    const prevClose = cross(prevRates, base, quote);
    out.set(spec.symbol, { mid, prevClose: prevClose ?? undefined, ts });
  }
  return out;
}
