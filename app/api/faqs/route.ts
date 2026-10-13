import { NextResponse } from "next/server";
import { getFaqs } from "@/lib/cms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const faqs = await getFaqs();
    // Return all firm-detail or CK propfirm FAQs from Strapi CMS
    const firmFaqs = faqs.filter(
      (f) => f.scope === "firm-detail" || f.firmSlug === "ck-capital" || f.firmSlug === "ck-propfirm"
    );
    return NextResponse.json({ data: firmFaqs.length > 0 ? firmFaqs : faqs }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
