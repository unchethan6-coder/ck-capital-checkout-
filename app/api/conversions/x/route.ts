import { NextResponse, type NextRequest } from "next/server";
import { sendXConversion } from "@/lib/analytics/capi";

/**
 * Secured manual trigger for the X (Twitter) Conversion API.
 * The external portal is not managed by us, so there is no purchase
 * webhook — this endpoint exists to validate the wiring (token, payload,
 * event IDs) with a clearly-marked TEST conversion before ad spend relies
 * on the web pixel + UTM tracking. Guarded by REVALIDATE_SECRET.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-test-secret");
  if (!secret || !process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items = rawItems.map((entry) => {
    const row = entry as Record<string, unknown>;
    return {
      id: String(row.id ?? "test-item"),
      name: String(row.name ?? "CAPI test item"),
      price: Number(row.price ?? 0),
      quantity: Number(row.quantity ?? 1),
    };
  });

  try {
    const result = await sendXConversion({
      conversionId: String(body.conversionId ?? `TEST-${Date.now()}`),
      paidAt: typeof body.paidAt === "string" ? body.paidAt : new Date().toISOString(),
      value: Number(body.value ?? 0),
      currency: String(body.currency ?? "USD"),
      items,
      twclid: typeof body.twclid === "string" ? body.twclid : undefined,
      email: typeof body.email === "string" ? body.email : undefined,
      phoneE164: typeof body.phone === "string" ? body.phone : undefined,
      ipAddress: typeof body.ipAddress === "string" ? body.ipAddress : undefined,
      userAgent: typeof body.userAgent === "string" ? body.userAgent : undefined,
      eventSourceUrl: typeof body.eventSourceUrl === "string" ? body.eventSourceUrl : undefined,
    });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "X CAPI failed" },
      { status: 502 }
    );
  }
}
