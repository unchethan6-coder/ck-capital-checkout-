import { NextResponse } from "next/server";
import { getSnapshot, prime } from "@/lib/market/hub";

/**
 * Snapshot of every instrument, used for the server-rendered first paint and
 * as the polling fallback when a client cannot hold an SSE connection open
 * (corporate proxies, some mobile networks).
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  await prime();
  return NextResponse.json(
    { quotes: getSnapshot(), serverTime: Date.now() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
