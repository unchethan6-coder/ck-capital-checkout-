import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const twclid = String(body?.twclid ?? "").trim();

    if (!twclid || twclid.length > 512 || /[\u0000-\u001F]/.test(twclid)) {
      return NextResponse.json({ ok: false, error: "Invalid twclid" }, { status: 400 });
    }

    const response = new NextResponse(null, { status: 204 });

    // 90-day first-party HttpOnly cookie as specified in Section 6 of tracking spec
    response.cookies.set("ck_twclid", twclid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 90 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
