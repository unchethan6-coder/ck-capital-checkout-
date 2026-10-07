import { NextResponse } from "next/server";
import { fetchYahoo } from "@/lib/market/providers";
import { debugState, prime } from "@/lib/market/hub";

/**
 * TEMPORARY diagnostic — reports what the Yahoo endpoints return as seen from
 * the server, so a datacenter-IP data difference can be confirmed rather than
 * guessed at. Delete once the equity feed is settled.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UA = "Mozilla/5.0 (compatible; CKCapital/1.0)";

async function get(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store", headers: { Accept: "application/json", "User-Agent": UA } });
    return { status: res.status, body: await res.json() };
  } catch (err) {
    return { status: 0, error: err instanceof Error ? err.message : "unknown" };
  }
}

export async function GET() {
  const now = Date.now();

  // What the provider itself returns, and what the hub is holding.
  await prime();
  const direct = await fetchYahoo();
  const providerSaw = ["AAPL", "MSFT", "US30"].map((s) => {
    const t = direct.get(s);
    return { symbol: s, mid: t?.mid ?? null, upstreamAgeMin: t ? Math.round((now - t.ts) / 60000) : null };
  });
  const hub = debugState();
  const age = (t?: number) => (t ? Math.round((now - t * 1000) / 60000) : null);

  const spark = await get(
    "https://query1.finance.yahoo.com/v7/finance/spark?symbols=AAPL,MSFT,YM%3DF&range=1d&interval=5m"
  );
  const chart = await get(
    "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1m&range=1d"
  );

  type SparkRow = { symbol: string; response?: { meta?: { regularMarketPrice?: number; regularMarketTime?: number } }[] };
  const sparkRows = (spark.body as { spark?: { result?: SparkRow[] } })?.spark?.result ?? [];

  const chartMeta = (chart.body as { chart?: { result?: { meta?: { regularMarketPrice?: number; regularMarketTime?: number } }[] } })
    ?.chart?.result?.[0]?.meta;

  return NextResponse.json(
    {
      serverTime: new Date(now).toISOString(),
      providerReturned: direct.size,
      providerSaw,
      hub,
      region: process.env.VERCEL_REGION ?? null,
      sparkStatus: spark.status,
      spark: sparkRows.map((r) => ({
        symbol: r.symbol,
        price: r.response?.[0]?.meta?.regularMarketPrice,
        ageMinutes: age(r.response?.[0]?.meta?.regularMarketTime),
      })),
      chartStatus: chart.status,
      chartAAPL: { price: chartMeta?.regularMarketPrice, ageMinutes: age(chartMeta?.regularMarketTime) },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
