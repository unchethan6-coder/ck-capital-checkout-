import { NextResponse } from "next/server";
import { loadHelpData } from "@/lib/help/cms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Help-centre articles for client-side search. CMS-first with the bundled
 * static snapshot as fallback — mirrors lib/help/cms.ts server logic.
 */
export async function GET() {
  try {
    const { data } = await loadHelpData();
    return NextResponse.json(
      { data: data.articles, collections: data.collections },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    const { HELP_ARTICLES, HELP_COLLECTIONS } = await import("@/lib/help");
    return NextResponse.json(
      { data: HELP_ARTICLES, collections: HELP_COLLECTIONS },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
