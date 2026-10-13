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
    const formId = process.env.KIT_FORM_ID || process.env.CONVERTKIT_FORM_ID || "10038138";

    // 1. Submit directly to Kit web form endpoint (records native form conversion and triggers form automation)
    let webFormSuccess = false;
    try {
      const webParams = new URLSearchParams();
      webParams.append("email_address", email);
      const webRes = await fetch(
        `https://app.kit.com/forms/${encodeURIComponent(formId)}/subscriptions`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: webParams.toString(),
        }
      );
      if (webRes.ok) {
        webFormSuccess = true;
      }
    } catch (e) {
      console.warn("[Newsletter] Kit web form direct endpoint error:", e);
    }

    // 2. If API Key is present, also upsert via Kit REST API
    const isKitV4 = apiKey && apiKey.startsWith("kit_");

    if (apiKey && isKitV4) {
      // Create or upsert subscriber in Kit v4 API
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

      if (subscriberRes.ok && subscriberData?.subscriber?.id) {
        const subscriberId = subscriberData.subscriber.id;

        // Attach subscriber to form in Kit v4 API
        await fetch(
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
        ).catch(() => null);

        return NextResponse.json({
          success: true,
          message: "Subscription confirmed! Welcome to the CK Propfirm community.",
          subscription: {
            id: subscriberId,
            state: subscriberData.subscriber.state || "active",
          },
        });
      }
    }

    // If web form endpoint succeeded and no v3 API key is configured, return success
    if (webFormSuccess) {
      return NextResponse.json({
        success: true,
        message: "Subscription confirmed! Welcome to the CK Propfirm community.",
      });
    }

    // Call Kit (ConvertKit) v3 Form Subscription API (if legacy v3 API key provided)
    if (apiKey && !isKitV4) {
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
    }

    return NextResponse.json({
      success: true,
      message: "Subscription confirmed! Welcome to the CK Propfirm community.",
    });
  } catch (err: any) {
    console.error("[Newsletter] Internal error processing subscription:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
