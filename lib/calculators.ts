/**
 * Pure maths for the CK Capital calculator suite.
 *
 * Everything here is deterministic and side-effect free so the formulas can be
 * unit-tested without a browser (see tests/calculators.spec.ts). Prices and FX
 * rates are passed in; fetching them is the caller's job.
 */

export type InstrumentGroup = "fx" | "metal" | "index" | "crypto";

export interface Instrument {
  symbol: string;
  name: string;
  group: InstrumentGroup;
  /** Currency the contract is denominated in (the "base"). */
  base: string;
  /** Currency the price is quoted in. */
  quote: string;
  /** Units of the base currency/asset in one standard lot. */
  contractSize: number;
  /** One pip expressed in quote-currency price units. */
  pip: number;
  /** Price decimals for display. */
  digits: number;
  /** Indicative price, used until a live rate replaces it. */
  indicativePrice: number;
  /** Indicative swap in points per lot per night (broker-specific). */
  swapLong: number;
  swapShort: number;
}

export const INSTRUMENTS: Instrument[] = [
  { symbol: "EURUSD", name: "Euro / US Dollar",        group: "fx",     base: "EUR", quote: "USD", contractSize: 100_000, pip: 0.0001, digits: 5, indicativePrice: 1.0842,  swapLong: -7.2,  swapShort: 2.1 },
  { symbol: "GBPUSD", name: "Pound / US Dollar",       group: "fx",     base: "GBP", quote: "USD", contractSize: 100_000, pip: 0.0001, digits: 5, indicativePrice: 1.2734,  swapLong: -5.9,  swapShort: 1.4 },
  { symbol: "USDJPY", name: "US Dollar / Yen",         group: "fx",     base: "USD", quote: "JPY", contractSize: 100_000, pip: 0.01,   digits: 3, indicativePrice: 147.50,  swapLong: 6.8,   swapShort: -12.4 },
  { symbol: "AUDUSD", name: "Aussie / US Dollar",      group: "fx",     base: "AUD", quote: "USD", contractSize: 100_000, pip: 0.0001, digits: 5, indicativePrice: 0.6534,  swapLong: -3.1,  swapShort: 0.6 },
  { symbol: "USDCAD", name: "US Dollar / Loonie",      group: "fx",     base: "USD", quote: "CAD", contractSize: 100_000, pip: 0.0001, digits: 5, indicativePrice: 1.3600,  swapLong: -2.4,  swapShort: 0.3 },
  { symbol: "USDCHF", name: "US Dollar / Franc",       group: "fx",     base: "USD", quote: "CHF", contractSize: 100_000, pip: 0.0001, digits: 5, indicativePrice: 0.8800,  swapLong: 1.9,   swapShort: -6.5 },
  { symbol: "NZDUSD", name: "Kiwi / US Dollar",        group: "fx",     base: "NZD", quote: "USD", contractSize: 100_000, pip: 0.0001, digits: 5, indicativePrice: 0.6012,  swapLong: -2.8,  swapShort: 0.4 },
  { symbol: "EURJPY", name: "Euro / Yen",              group: "fx",     base: "EUR", quote: "JPY", contractSize: 100_000, pip: 0.01,   digits: 3, indicativePrice: 159.90,  swapLong: 2.2,   swapShort: -9.8 },
  { symbol: "GBPJPY", name: "Pound / Yen",             group: "fx",     base: "GBP", quote: "JPY", contractSize: 100_000, pip: 0.01,   digits: 3, indicativePrice: 187.80,  swapLong: 3.4,   swapShort: -11.2 },
  { symbol: "XAUUSD", name: "Gold / US Dollar",        group: "metal",  base: "XAU", quote: "USD", contractSize: 100,     pip: 0.01,   digits: 2, indicativePrice: 2418.60, swapLong: -18.5, swapShort: 6.2 },
  { symbol: "XAGUSD", name: "Silver / US Dollar",      group: "metal",  base: "XAG", quote: "USD", contractSize: 5_000,   pip: 0.001,  digits: 3, indicativePrice: 30.120,  swapLong: -9.4,  swapShort: 2.8 },
  { symbol: "US30",   name: "Dow Jones 30",            group: "index",  base: "USD", quote: "USD", contractSize: 1,       pip: 1,      digits: 2, indicativePrice: 39_120,  swapLong: -12.0, swapShort: -4.0 },
  { symbol: "NAS100", name: "Nasdaq 100",              group: "index",  base: "USD", quote: "USD", contractSize: 1,       pip: 1,      digits: 2, indicativePrice: 19_824,  swapLong: -9.5,  swapShort: -3.2 },
  { symbol: "SPX500", name: "S&P 500",                 group: "index",  base: "USD", quote: "USD", contractSize: 1,       pip: 1,      digits: 2, indicativePrice: 5_488,   swapLong: -6.1,  swapShort: -2.0 },
  { symbol: "GER40",  name: "DAX 40",                  group: "index",  base: "EUR", quote: "EUR", contractSize: 1,       pip: 1,      digits: 2, indicativePrice: 18_430,  swapLong: -5.4,  swapShort: -1.8 },
  { symbol: "BTCUSD", name: "Bitcoin / US Dollar",     group: "crypto", base: "BTC", quote: "USD", contractSize: 1,       pip: 1,      digits: 2, indicativePrice: 67_824,  swapLong: -45.0, swapShort: -45.0 },
  { symbol: "ETHUSD", name: "Ethereum / US Dollar",    group: "crypto", base: "ETH", quote: "USD", contractSize: 1,       pip: 1,      digits: 2, indicativePrice: 3_512,   swapLong: -22.0, swapShort: -22.0 },
];

export const LEVERAGE_OPTIONS = [100, 50, 30, 20, 10, 5, 2, 1];

export const LOT_PRESETS = [0.01, 0.1, 0.5, 1, 2, 5];

/** Rates are quoted as "units of CCY per 1 USD". */
export type RateTable = Record<string, number>;

/** Convert an amount in `ccy` into USD. Unknown currencies fall back to 1:1. */
export function toUsd(amount: number, ccy: string, rates: RateTable): number {
  if (ccy === "USD") return amount;
  const perUsd = rates[ccy];
  if (!perUsd || !Number.isFinite(perUsd) || perUsd <= 0) return amount;
  return amount / perUsd;
}

/** Price of 1 unit of `ccy` in USD. */
export function usdPerUnit(ccy: string, rates: RateTable): number {
  return toUsd(1, ccy, rates);
}

/**
 * Required margin, in USD.
 * Notional is `lots x contractSize` units of the base asset, valued at the
 * quoted price, divided by leverage.
 */
export function marginRequired(
  instrument: Instrument,
  lots: number,
  price: number,
  leverage: number,
  rates: RateTable
): number {
  if (lots <= 0 || price <= 0 || leverage <= 0) return 0;
  const notionalQuote = lots * instrument.contractSize * price;
  return toUsd(notionalQuote, instrument.quote, rates) / leverage;
}

/** Notional (contract) value of the position in USD. */
export function notionalValue(
  instrument: Instrument,
  lots: number,
  price: number,
  rates: RateTable
): number {
  if (lots <= 0 || price <= 0) return 0;
  return toUsd(lots * instrument.contractSize * price, instrument.quote, rates);
}

/** Value of one pip for the given lot size, in USD. */
export function pipValue(
  instrument: Instrument,
  lots: number,
  rates: RateTable
): number {
  if (lots <= 0) return 0;
  return toUsd(instrument.pip * instrument.contractSize * lots, instrument.quote, rates);
}

/** Distance between two prices expressed in pips. */
export function priceDistanceInPips(instrument: Instrument, from: number, to: number): number {
  return Math.abs(to - from) / instrument.pip;
}

export type Direction = "buy" | "sell";

export interface PnlResult {
  pips: number;
  gross: number;
  pipValue: number;
  returnOnBalance: number | null;
}

/** Profit or loss in USD for a closed position. */
export function profitLoss(
  instrument: Instrument,
  lots: number,
  entry: number,
  exit: number,
  direction: Direction,
  rates: RateTable,
  balance?: number
): PnlResult {
  const signed = direction === "buy" ? exit - entry : entry - exit;
  const gross = toUsd(signed * instrument.contractSize * lots, instrument.quote, rates);
  const pips = (signed / instrument.pip) || 0;
  return {
    pips,
    gross,
    pipValue: pipValue(instrument, lots, rates),
    returnOnBalance: balance && balance > 0 ? (gross / balance) * 100 : null,
  };
}

/** Lot size that risks exactly `riskAmount` over `stopPips`. */
export function lotsForRisk(
  instrument: Instrument,
  riskAmount: number,
  stopPips: number,
  rates: RateTable
): number {
  if (riskAmount <= 0 || stopPips <= 0) return 0;
  const perLot = pipValue(instrument, 1, rates);
  if (perLot <= 0) return 0;
  return riskAmount / (stopPips * perLot);
}

/**
 * Overnight financing in USD.
 * `points` is the broker's swap rate per lot per night, in points.
 * Most venues charge triple swap on the Wednesday rollover.
 */
export function swapCost(
  instrument: Instrument,
  lots: number,
  points: number,
  nights: number,
  rates: RateTable,
  tripleWednesday = true
): { perNight: number; total: number; chargedNights: number } {
  const perNight = toUsd(points * instrument.pip * instrument.contractSize * lots, instrument.quote, rates);
  const wednesdays = tripleWednesday ? Math.floor(Math.max(0, nights) / 7) * 2 : 0;
  const chargedNights = Math.max(0, nights) + wednesdays;
  return { perNight, total: perNight * chargedNights, chargedNights };
}

/* ------------------------------------------------------------------ */
/* CK programme rules — mirrors lib/content.ts and the payout policy   */
/* ------------------------------------------------------------------ */

export interface ProgrammeRule {
  id: string;
  label: string;
  /** Phase 1 profit target, as a share of the starting balance. */
  phase1: number | null;
  phase2: number | null;
  dailyLoss: number;
  maxLoss: number;
  trailing: boolean;
  /** Consistency score applied to funded payouts, or null when none applies. */
  fundedConsistency: number | null;
  sizes: number[];
}

const EVAL_SIZES = [10_000, 25_000, 50_000, 100_000, 200_000, 300_000];
const INSTANT_SIZES = [10_000, 25_000, 50_000, 100_000];

export const PROGRAMMES: ProgrammeRule[] = [
  { id: "1step",    label: "1 Step Standard", phase1: 0.10, phase2: null, dailyLoss: 0.03, maxLoss: 0.06, trailing: true,  fundedConsistency: 0.30, sizes: EVAL_SIZES },
  { id: "standard", label: "2 Step Standard", phase1: 0.10, phase2: 0.05, dailyLoss: 0.04, maxLoss: 0.08, trailing: true,  fundedConsistency: 0.50, sizes: EVAL_SIZES },
  { id: "pro",      label: "2 Step Pro",      phase1: 0.10, phase2: 0.05, dailyLoss: 0.04, maxLoss: 0.08, trailing: false, fundedConsistency: null, sizes: EVAL_SIZES },
  { id: "instant",  label: "Instant Funding", phase1: null, phase2: null, dailyLoss: 0.03, maxLoss: 0.05, trailing: true,  fundedConsistency: 0.20, sizes: INSTANT_SIZES },
];

export function programmeById(id: string): ProgrammeRule {
  return PROGRAMMES.find((p) => p.id === id) ?? PROGRAMMES[1];
}

/**
 * Payout policy tables, taken verbatim from the CK payout FAQ rather than
 * derived, because the published figures do not follow one clean percentage.
 */
export const REQUIRED_BALANCE: Record<number, number> = {
  10_000: 10_700,
  25_000: 26_100,
  50_000: 52_100,
  100_000: 103_100,
  200_000: 206_100,
  300_000: 309_100,
};

export const PAYOUT_THRESHOLD: Record<number, { first: number; next: number }> = {
  10_000: { first: 250, next: 300 },
  25_000: { first: 625, next: 750 },
  50_000: { first: 1_250, next: 1_500 },
  100_000: { first: 2_500, next: 3_000 },
  200_000: { first: 5_000, next: 6_000 },
  300_000: { first: 7_500, next: 9_000 },
};

/** Global floor on any withdrawal request. */
export const MIN_PAYOUT_REQUEST = 500;

/** Trader's share of an approved payout. */
export const PAYOUT_SPLIT = 0.8;

export interface RuleCheck {
  dailyLossLimit: number;
  maxLossLimit: number;
  /** Balance that must stay intact before a payout: max loss + $100. */
  payoutBuffer: number;
  /** Minimum net profit for the first payout cycle (2.5% of the balance). */
  firstPayoutTarget: number;
  /** Minimum net profit from the second cycle onwards (3%). */
  nextPayoutTarget: number;
  phase1Target: number | null;
  phase2Target: number | null;
  /** Risk as a share of the daily loss limit, 0-1+, when a risk is supplied. */
  riskOfDaily: number | null;
  riskOfMax: number | null;
  breachesDaily: boolean;
  breachesMax: boolean;
}

export function ruleCheck(
  programme: ProgrammeRule,
  balance: number,
  riskAmount?: number
): RuleCheck {
  const dailyLossLimit = balance * programme.dailyLoss;
  const maxLossLimit = balance * programme.maxLoss;
  const risk = riskAmount && riskAmount > 0 ? riskAmount : null;
  return {
    dailyLossLimit,
    maxLossLimit,
    payoutBuffer: REQUIRED_BALANCE[balance] ?? balance + maxLossLimit + 100,
    firstPayoutTarget: PAYOUT_THRESHOLD[balance]?.first ?? balance * 0.025,
    nextPayoutTarget: PAYOUT_THRESHOLD[balance]?.next ?? balance * 0.03,
    phase1Target: programme.phase1 === null ? null : balance * programme.phase1,
    phase2Target: programme.phase2 === null ? null : balance * programme.phase2,
    riskOfDaily: risk === null ? null : risk / dailyLossLimit,
    riskOfMax: risk === null ? null : risk / maxLossLimit,
    breachesDaily: risk !== null && risk > dailyLossLimit,
    breachesMax: risk !== null && risk > maxLossLimit,
  };
}

export function formatMoney(value: number, currency = "USD", digits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}
