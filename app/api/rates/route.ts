import { NextResponse } from "next/server";

/**
 * USD-based FX rates for the calculator suite.
 *
 * The upstream feed is free and unauthenticated, so it is treated as
 * best-effort: on any failure or timeout we answer with the last known static
 * table and flag the response as stale. The endpoint therefore always answers,
 * which is what the calculators need — a missing rate must never block a
 * calculation.
 */

const UPSTREAM = "https://open.er-api.com/v6/latest/USD";
const TIMEOUT_MS = 2500;

/** Quote currencies the calculators can ask for. */
const WANTED = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"] as const;

/** Last-resort table so the endpoint still answers when the feed is down. */
const FALLBACK: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 147.5,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  NZD: 1.66,
};

export const revalidate = 300;

export async function GET() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(UPSTREAM, {
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const data = (await res.json()) as { rates?: Record<string, number>; time_last_update_unix?: number };
    const rates: Record<string, number> = {};
    for (const code of WANTED) {
      const value = data.rates?.[code];
      if (typeof value === "number" && Number.isFinite(value) && value > 0) rates[code] = value;
    }
    if (Object.keys(rates).length < WANTED.length) throw new Error("incomplete feed");

    return NextResponse.json(
      { base: "USD", rates, source: "live", updatedAt: (data.time_last_update_unix ?? Date.now() / 1000) * 1000 },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
    );
  } catch {
    return NextResponse.json(
      { base: "USD", rates: FALLBACK, source: "fallback", updatedAt: null },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  }
}
