import type { SymbolSpec } from "./types";

/**
 * The CK Capital instrument catalogue.
 *
 * Spreads are CK's published typical spreads in price units. For every feed
 * except crypto the upstream only gives a last traded price, so these values
 * are what the bid/ask is built around — keep them in sync with the trading
 * conditions published elsewhere on the site.
 */
export const SYMBOL_SPECS: SymbolSpec[] = [
  /* ──────────────────────────────────────────────── FX — majors */
  { symbol: "EURUSD", name: "Euro / US Dollar",        category: "fx", mostTraded: true, digits: 5, contractSize: 100000, spread: 0.00002, leverage: 100, source: { kind: "fxrates", base: "EUR", quote: "USD" } },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", category: "fx", mostTraded: true, digits: 5, contractSize: 100000, spread: 0.00003, leverage: 100, source: { kind: "fxrates", base: "GBP", quote: "USD" } },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", category: "fx", mostTraded: true, digits: 3, contractSize: 100000, spread: 0.005,   leverage: 100, source: { kind: "fxrates", base: "USD", quote: "JPY" } },
  { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", category: "fx", mostTraded: true, digits: 5, contractSize: 100000, spread: 0.00003, leverage: 100, source: { kind: "fxrates", base: "AUD", quote: "USD" } },
  { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", category: "fx", digits: 5, contractSize: 100000, spread: 0.00004, leverage: 100, source: { kind: "fxrates", base: "USD", quote: "CAD" } },
  { symbol: "USDCHF", name: "US Dollar / Swiss Franc", category: "fx", digits: 5, contractSize: 100000, spread: 0.00004, leverage: 100, source: { kind: "fxrates", base: "USD", quote: "CHF" } },
  { symbol: "NZDUSD", name: "New Zealand Dollar / US Dollar", category: "fx", digits: 5, contractSize: 100000, spread: 0.00004, leverage: 100, source: { kind: "fxrates", base: "NZD", quote: "USD" } },
  /* FX — crosses */
  { symbol: "EURGBP", name: "Euro / British Pound",   category: "fx", digits: 5, contractSize: 100000, spread: 0.00004, leverage: 100, source: { kind: "fxrates", base: "EUR", quote: "GBP" } },
  { symbol: "EURJPY", name: "Euro / Japanese Yen",    category: "fx", digits: 3, contractSize: 100000, spread: 0.007,   leverage: 100, source: { kind: "fxrates", base: "EUR", quote: "JPY" } },
  { symbol: "GBPJPY", name: "British Pound / Japanese Yen", category: "fx", digits: 3, contractSize: 100000, spread: 0.012, leverage: 100, source: { kind: "fxrates", base: "GBP", quote: "JPY" } },
  { symbol: "AUDJPY", name: "Australian Dollar / Japanese Yen", category: "fx", digits: 3, contractSize: 100000, spread: 0.009, leverage: 100, source: { kind: "fxrates", base: "AUD", quote: "JPY" } },
  { symbol: "EURAUD", name: "Euro / Australian Dollar", category: "fx", digits: 5, contractSize: 100000, spread: 0.00008, leverage: 100, source: { kind: "fxrates", base: "EUR", quote: "AUD" } },
  { symbol: "EURCHF", name: "Euro / Swiss Franc",     category: "fx", digits: 5, contractSize: 100000, spread: 0.00006, leverage: 100, source: { kind: "fxrates", base: "EUR", quote: "CHF" } },
  { symbol: "GBPAUD", name: "British Pound / Australian Dollar", category: "fx", digits: 5, contractSize: 100000, spread: 0.00011, leverage: 100, source: { kind: "fxrates", base: "GBP", quote: "AUD" } },
  { symbol: "USDMXN", name: "US Dollar / Mexican Peso", category: "fx", digits: 4, contractSize: 100000, spread: 0.0085, leverage: 50, source: { kind: "fxrates", base: "USD", quote: "MXN" } },
  { symbol: "USDZAR", name: "US Dollar / South African Rand", category: "fx", digits: 4, contractSize: 100000, spread: 0.0090, leverage: 50, source: { kind: "fxrates", base: "USD", quote: "ZAR" } },

  /*
   * Indices quote the futures where a liquid one exists. The cash index only
   * prints during its own session, so outside it a row would show a price many
   * hours old; the future tracks the same market nearly 24/5, which is what an
   * index CFD follows. European and Asian cash indices have no usable futures
   * on this feed, so they stay on cash and are labelled closed out of hours.
   */
  /* ──────────────────────────────────────────────── Indices */
  { symbol: "US30",   name: "Dow Jones 30",      category: "indices", mostTraded: true, digits: 2, contractSize: 10, spread: 2.34,  leverage: 50, source: { kind: "yahoo", ticker: "YM=F" } },
  { symbol: "NDX100", name: "Nasdaq 100",        category: "indices", mostTraded: true, digits: 2, contractSize: 10, spread: 1.84,  leverage: 50, source: { kind: "yahoo", ticker: "NQ=F" } },
  { symbol: "SPX500", name: "S&P 500",           category: "indices", mostTraded: true, digits: 2, contractSize: 10, spread: 0.73,  leverage: 50, source: { kind: "yahoo", ticker: "ES=F" } },
  { symbol: "GER30",  name: "DAX 40",            category: "indices", mostTraded: true, digits: 2, contractSize: 10, spread: 2.00,  leverage: 50, source: { kind: "yahoo", ticker: "^GDAXI" } },
  { symbol: "UK100",  name: "FTSE 100",          category: "indices", digits: 2, contractSize: 10, spread: 1.80, leverage: 50, source: { kind: "yahoo", ticker: "^FTSE" } },
  { symbol: "FRA40",  name: "CAC 40",            category: "indices", digits: 2, contractSize: 10, spread: 1.50, leverage: 50, source: { kind: "yahoo", ticker: "^FCHI" } },
  { symbol: "JPN225", name: "Nikkei 225",        category: "indices", digits: 2, contractSize: 10, spread: 7.00, leverage: 50, source: { kind: "yahoo", ticker: "NKD=F" } },
  { symbol: "AUS200", name: "ASX 200",           category: "indices", digits: 2, contractSize: 10, spread: 2.20, leverage: 50, source: { kind: "yahoo", ticker: "^AXJO" } },
  { symbol: "HK50",   name: "Hang Seng 50",      category: "indices", digits: 2, contractSize: 10, spread: 6.00, leverage: 50, source: { kind: "yahoo", ticker: "^HSI" } },
  { symbol: "ESP35",  name: "IBEX 35",           category: "indices", digits: 2, contractSize: 10, spread: 4.00, leverage: 50, source: { kind: "yahoo", ticker: "^IBEX" } },

  /* ──────────────────────────────────────────────── Commodities */
  { symbol: "XAUUSD", name: "Gold / US Dollar",    category: "commodities", mostTraded: true, digits: 2, contractSize: 100,  spread: 0.44,  leverage: 100, source: { kind: "yahoo", ticker: "GC=F" } },
  { symbol: "USOUSD", name: "WTI Crude Oil",       category: "commodities", mostTraded: true, digits: 3, contractSize: 100,  spread: 0.067, leverage: 50,  source: { kind: "yahoo", ticker: "CL=F" } },
  { symbol: "XAGUSD", name: "Silver / US Dollar",  category: "commodities", digits: 3, contractSize: 5000, spread: 0.021, leverage: 100, source: { kind: "yahoo", ticker: "SI=F" } },
  { symbol: "UKOUSD", name: "Brent Crude Oil",     category: "commodities", digits: 3, contractSize: 100,  spread: 0.072, leverage: 50,  source: { kind: "yahoo", ticker: "BZ=F" } },
  { symbol: "NATGAS", name: "Natural Gas",         category: "commodities", digits: 3, contractSize: 1000, spread: 0.015, leverage: 50,  source: { kind: "yahoo", ticker: "NG=F" } },
  { symbol: "XPTUSD", name: "Platinum / US Dollar", category: "commodities", digits: 2, contractSize: 50,  spread: 1.60,  leverage: 50,  source: { kind: "yahoo", ticker: "PL=F" } },
  { symbol: "XCUUSD", name: "Copper",              category: "commodities", digits: 4, contractSize: 25000, spread: 0.0030, leverage: 50, source: { kind: "yahoo", ticker: "HG=F" } },

  /* ──────────────────────────────────────────────── Crypto (real bid/ask) */
  /*
   * `spread: 0` means "quote the venue's real book" rather than deriving one.
   * Precision therefore has to be fine enough to express that book: DOGE's
   * venue spread is ~1e-7, so at five decimals it rounded away to a spread of
   * zero, which reads as free execution.
   */
  { symbol: "BTCUSD",  name: "Bitcoin / US Dollar",   category: "crypto", mostTraded: true, digits: 2, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "BTCUSDT", krakenPair: "XBTUSD", krakenKey: "XXBTZUSD" } },
  { symbol: "ETHUSD",  name: "Ethereum / US Dollar",  category: "crypto", mostTraded: true, digits: 2, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "ETHUSDT", krakenPair: "ETHUSD", krakenKey: "XETHZUSD" } },
  { symbol: "SOLUSD",  name: "Solana / US Dollar",    category: "crypto", digits: 3, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "SOLUSDT", krakenPair: "SOLUSD", krakenKey: "SOLUSD" } },
  { symbol: "XRPUSD",  name: "XRP / US Dollar",       category: "crypto", digits: 5, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "XRPUSDT", krakenPair: "XRPUSD", krakenKey: "XXRPZUSD" } },
  { symbol: "ADAUSD",  name: "Cardano / US Dollar",   category: "crypto", digits: 6, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "ADAUSDT", krakenPair: "ADAUSD", krakenKey: "ADAUSD" } },
  { symbol: "DOGEUSD", name: "Dogecoin / US Dollar",  category: "crypto", digits: 7, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "DOGEUSDT", krakenPair: "XDGUSD", krakenKey: "XDGUSD" } },
  { symbol: "LTCUSD",  name: "Litecoin / US Dollar",  category: "crypto", digits: 2, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "LTCUSDT", krakenPair: "LTCUSD", krakenKey: "XLTCZUSD" } },
  { symbol: "BNBUSD",  name: "BNB / US Dollar",       category: "crypto", digits: 2, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "BNBUSDT", krakenPair: "BNBUSD", krakenKey: "BNBUSD" } },
  { symbol: "AVAXUSD", name: "Avalanche / US Dollar", category: "crypto", digits: 3, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "AVAXUSDT", krakenPair: "AVAXUSD", krakenKey: "AVAXUSD" } },
  { symbol: "LINKUSD", name: "Chainlink / US Dollar", category: "crypto", digits: 5, contractSize: 1,   spread: 0, leverage: 5, source: { kind: "crypto", binanceTicker: "LINKUSDT", krakenPair: "LINKUSD", krakenKey: "LINKUSD" } },

  /* ──────────────────────────────────────────────── Stocks */
  { symbol: "AAPL",  name: "Apple Inc.",            category: "stocks", mostTraded: true, digits: 2, contractSize: 1, spread: 0.02, leverage: 20, source: { kind: "yahoo", ticker: "AAPL" } },
  { symbol: "TSLA",  name: "Tesla Inc.",            category: "stocks", mostTraded: true, digits: 2, contractSize: 1, spread: 0.03, leverage: 20, source: { kind: "yahoo", ticker: "TSLA" } },
  { symbol: "NVDA",  name: "NVIDIA Corporation",    category: "stocks", mostTraded: true, digits: 2, contractSize: 1, spread: 0.03, leverage: 20, source: { kind: "yahoo", ticker: "NVDA" } },
  { symbol: "MSFT",  name: "Microsoft Corporation", category: "stocks", digits: 2, contractSize: 1, spread: 0.03, leverage: 20, source: { kind: "yahoo", ticker: "MSFT" } },
  { symbol: "AMZN",  name: "Amazon.com Inc.",       category: "stocks", digits: 2, contractSize: 1, spread: 0.03, leverage: 20, source: { kind: "yahoo", ticker: "AMZN" } },
  { symbol: "GOOGL", name: "Alphabet Inc.",         category: "stocks", digits: 2, contractSize: 1, spread: 0.03, leverage: 20, source: { kind: "yahoo", ticker: "GOOGL" } },
  { symbol: "META",  name: "Meta Platforms Inc.",   category: "stocks", digits: 2, contractSize: 1, spread: 0.04, leverage: 20, source: { kind: "yahoo", ticker: "META" } },
  { symbol: "NFLX",  name: "Netflix Inc.",          category: "stocks", digits: 2, contractSize: 1, spread: 0.06, leverage: 20, source: { kind: "yahoo", ticker: "NFLX" } },
  { symbol: "AMD",   name: "Advanced Micro Devices", category: "stocks", digits: 2, contractSize: 1, spread: 0.02, leverage: 20, source: { kind: "yahoo", ticker: "AMD" } },
  { symbol: "COIN",  name: "Coinbase Global Inc.",  category: "stocks", digits: 2, contractSize: 1, spread: 0.08, leverage: 10, source: { kind: "yahoo", ticker: "COIN" } },
];

/** Fast lookup by CK symbol. */
export const SPEC_BY_SYMBOL: ReadonlyMap<string, SymbolSpec> = new Map(
  SYMBOL_SPECS.map((s) => [s.symbol, s])
);

export const YAHOO_SPECS = SYMBOL_SPECS.filter((s) => s.source.kind === "yahoo");
export const CRYPTO_SPECS = SYMBOL_SPECS.filter((s) => s.source.kind === "crypto");
export const FXRATES_SPECS = SYMBOL_SPECS.filter((s) => s.source.kind === "fxrates");
