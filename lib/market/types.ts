/**
 * Shared types for the live market data layer.
 *
 * The layer is deliberately provider-agnostic: `QuoteSource` describes where a
 * symbol's price comes from, and every provider normalises into the same
 * `Quote` shape so the UI never needs to know which feed answered.
 */

export type AssetCategory = "fx" | "indices" | "commodities" | "crypto" | "stocks";

/** Where a symbol's price is fetched from. */
export type QuoteSource =
  /**
   * Crypto with real top-of-book bid/ask and no API key.
   *
   * Two venues are carried because Binance answers 451 to US IPs, which is
   * where most serverless regions live; Kraken has no such restriction and is
   * used as the fallback. Kraken echoes its own canonical pair name rather
   * than the one requested, so both are recorded.
   */
  | { kind: "crypto"; binanceTicker: string; krakenPair: string; krakenKey: string }
  /** Yahoo batched spark feed — last traded price only, bid/ask derived. */
  | { kind: "yahoo"; ticker: string }
  /**
   * FX cross derived from a USD-based rate table. Yahoo only publishes four
   * significant decimals for currencies, which is not enough to quote a
   * five-digit pair honestly, so FX comes from a dedicated rates feed.
   */
  | { kind: "fxrates"; base: string; quote: string };

export interface SymbolSpec {
  /** CK-facing symbol, e.g. "EURUSD". */
  symbol: string;
  /** Human name, e.g. "Euro vs US Dollar". */
  name: string;
  category: AssetCategory;
  /** Shown in the "Most traded" tab. */
  mostTraded?: boolean;
  /** Decimal places used for bid/ask display. */
  digits: number;
  /** Units of the base asset in one standard lot. */
  contractSize: number;
  /**
   * CK's typical spread in price units. Used to derive bid/ask around the mid
   * for feeds that only publish a last price (everything except crypto).
   */
  spread: number;
  /** Maximum leverage offered on the instrument, e.g. 100 → "1:100". */
  leverage: number;
  source: QuoteSource;
}

/** How fresh/trustworthy a quote is. Drives the badge shown on each row. */
export type QuoteStatus =
  /** Updating normally from the upstream feed. */
  | "live"
  /** Upstream answered, but the price is older than the staleness threshold. */
  | "stale"
  /** Upstream is unreachable; the last known price is being shown. */
  | "disconnected";

export interface Quote {
  symbol: string;
  bid: number;
  ask: number;
  /** ask − bid, computed once on the server so every client agrees. */
  spread: number;
  /** Change vs the previous session close, in percent. */
  changePct: number;
  /** Direction of the most recent change: 1 up, -1 down, 0 unchanged. */
  direction: 1 | -1 | 0;
  /** Upstream timestamp in ms — when the market last printed this price. */
  ts: number;
  status: QuoteStatus;
  /**
   * True when bid/ask were derived from a mid price using the instrument's
   * published spread rather than received as real top-of-book quotes.
   */
  derived: boolean;
}

/** Payload pushed over SSE. `type` lets the client distinguish full vs partial. */
export type StreamMessage =
  | { type: "snapshot"; quotes: Quote[]; serverTime: number }
  | { type: "patch"; quotes: Quote[]; serverTime: number };
