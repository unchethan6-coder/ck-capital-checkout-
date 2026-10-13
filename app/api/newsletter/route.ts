import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const apiKey = process.env.KIT_API_KEY || process.env.CONVERTKIT_API_KEY;
    const formId = process.env.KIT_FORM_ID || process.env.CONVERTKIT_FORM_ID;

    // Graceful fallback if Kit environment variables are not yet populated
    if (!apiKey || !formId) {
      console.warn(
        `[Newsletter] KIT_API_KEY or KIT_FORM_ID not configured in environment variables. Simulating subscription for: ${email}`
      );
      return NextResponse.json({
        success: true,
        message: "Thank you for subscribing! (Kit API keys pending configuration in environment variables)",
        mock: true,
      });
    }

    const isKitV4 = apiKey.startsWith("kit_");

    if (isKitV4) {
      // 1. Create or upsert subscriber in Kit v4 API
      const subscriberRes = await fetch("https://api.kit.com/v4/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Kit-Api-Key": apiKey,
        },
        body: JSON.stringify({
          email_address: email,
          state: "active",
        }),
      });

      const subscriberData = await subscriberRes.json().catch(() => null);

      if (!subscriberRes.ok || !subscriberData?.subscriber?.id) {
        console.error("[Newsletter] Kit v4 subscriber create error:", subscriberData || subscriberRes.statusText);
        return NextResponse.json(
          {
            success: false,
            error: subscriberData?.errors?.[0] || "Unable to complete subscription with Kit. Please try again.",
          },
          { status: subscriberRes.status || 500 }
        );
      }

      const subscriberId = subscriberData.subscriber.id;

      // 2. Add subscriber to form in Kit v4 API (POST /v4/forms/:form_id/subscribers)
      const formRes = await fetch(
        `https://api.kit.com/v4/forms/${encodeURIComponent(formId)}/subscribers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Kit-Api-Key": apiKey,
          },
          body: JSON.stringify({
            email_address: email,
          }),
        }
      );

      const formData = await formRes.json().catch(() => null);

      if (!formRes.ok && formRes.status !== 200 && formRes.status !== 201) {
        console.error("[Newsletter] Kit v4 form attach error:", formData || formRes.statusText);
      }

      return NextResponse.json({
        success: true,
        message: "Subscription confirmed! Welcome to the CK Propfirm community.",
        subscription: {
          id: subscriberId,
          state: subscriberData.subscriber.state || "active",
        },
      });
    }

    // Call Kit (ConvertKit) v3 Form Subscription API (fallback)
    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${encodeURIComponent(formId)}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          email,
        }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("[Newsletter] Kit API subscription error:", data || res.statusText);
      return NextResponse.json(
        {
          success: false,
          error: data?.message || "Unable to complete subscription with Kit. Please try again.",
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription confirmed! Welcome to the CK Propfirm community.",
      subscription: data?.subscription ? { id: data.subscription.id, state: data.subscription.state } : undefined,
    });
  } catch (err: any) {
    console.error("[Newsletter] Internal error processing subscription:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
