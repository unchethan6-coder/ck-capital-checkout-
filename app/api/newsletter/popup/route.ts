import { NextResponse } from "next/server";
import { getNewsletterPopup } from "@/lib/cms";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  try {
    const popup = await getNewsletterPopup();
    return NextResponse.json({
      success: true,
      data: popup,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load newsletter popup configuration" },
      { status: 500 }
    );
  }
}
