import { NextResponse } from "next/server";
import { getOffers, regionForCountry } from "@/lib/offers/source";
import { routing } from "@/i18n/routing";

/**
 * Active offers and news for the caller's locale and region.
 *
 * The region is resolved from the same edge headers the locale middleware
 * uses, so the pricing table a visitor sees matches what checkout will
 * charge them.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("locale") ?? routing.defaultLocale;
  const locale = (routing.locales as readonly string[]).includes(requested)
    ? requested
    : routing.defaultLocale;

  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null;

  const payload = await getOffers(locale, regionForCountry(country));
  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
