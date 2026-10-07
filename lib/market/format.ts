import type { SymbolSpec } from "./types";

/**
 * Display helpers shared by the server-rendered first paint and the live
 * client updates, so a value never changes shape when the stream takes over.
 */

/** Fixed-precision price, no grouping — keeps the columns tabular. */
export function formatPrice(value: number, digits: number): string {
  return value.toFixed(digits);
}

/**
 * Spreads are shown at the instrument's own precision. Sub-pip instruments
 * would otherwise collapse to "0.00".
 */
export function formatSpread(value: number, digits: number): string {
  return value.toFixed(digits);
}

export function formatContractSize(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatChangePct(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

/** "1:100" style leverage label. */
export function formatLeverage(value: number): string {
  return `1:${value}`;
}

/** Placeholder shown before the first quote for a symbol arrives. */
export function placeholderFor(spec: SymbolSpec): string {
  return "—".padEnd(spec.digits, "—");
}
