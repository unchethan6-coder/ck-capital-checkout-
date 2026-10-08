import { NextResponse } from "next/server";
import { getCalendar } from "@/lib/calendar/feed";

/**
 * Economic calendar for the current week.
 *
 * The feed layer already caches in-process; the CDN headers below let shared
 * caches reuse the response too, so the upstream sees roughly one call per
 * five minutes no matter how many people have the page open.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const payload = await getCalendar();
  return NextResponse.json(payload, {
    headers: {
      // Stale-while-revalidate keeps the page instant while the week refreshes.
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
    },
  });
}
