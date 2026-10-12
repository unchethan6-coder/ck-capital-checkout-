import crypto from "node:crypto";

/**
 * Server-Side Conversion API (CAPI) Utilities
 * Provides resilient, privacy-safe implementations for X (Twitter), Meta, and Reddit Conversions APIs.
 * All functions are guarded by environment variables and fail gracefully if disabled or unconfigured.
 */

const sha256 = (value: string): string =>
  crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

const normaliseEmail = (value?: string): string =>
  value ? value.trim().toLowerCase() : "";

const normalisePhoneE164 = (value?: string): string => {
  const phone = String(value ?? "").trim();
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : "";
};

export interface ServerConversionInput {
  conversionId: string;
  paidAt: string | Date;
  value: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  twclid?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  email?: string;
  phoneE164?: string;
  ipAddress?: string;
  userAgent?: string;
  eventSourceUrl?: string;
}

/**
 * Send X (Twitter) Purchase Conversion API event (Spec Section 9)
 */
export async function sendXConversion(input: ServerConversionInput) {
  if (process.env.X_CAPI_ENABLED !== "true") {
    return { skipped: true, reason: "X_CAPI_ENABLED is not true" };
  }

  const pixelId = process.env.X_PIXEL_ID || "qs40m";
  const eventId = process.env.X_PURCHASE_EVENT_ID || "13lgxz";
  const token = process.env.X_ADS_ACCESS_TOKEN || process.env.X_PIXEL_TOKEN;

  if (!token) {
    throw new Error("Missing X_ADS_ACCESS_TOKEN / X_PIXEL_TOKEN");
  }

  const version = process.env.X_ADS_API_VERSION || "12";
  const url = `https://ads-api.x.com/${version}/measurement/conversions/${pixelId}`;

  const identifiers: Array<Record<string, string>> = [];
  if (input.twclid) {
    identifiers.push({ twclid: String(input.twclid) });
  }
  const email = normaliseEmail(input.email);
  if (email) {
    identifiers.push({ hashed_email: sha256(email) });
  }
  const phone = normalisePhoneE164(input.phoneE164);
  if (phone) {
    identifiers.push({ hashed_phone_number: sha256(phone) });
  }
  if (input.ipAddress && input.userAgent) {
    identifiers.push({
      ip_address: String(input.ipAddress),
      user_agent: String(input.userAgent),
    });
  }

  if (identifiers.length === 0) {
    throw new Error("X conversion requires at least one match identifier (twclid, email, phone, or IP+UA)");
  }

  const paidDate = typeof input.paidAt === "string" ? new Date(input.paidAt) : input.paidAt;
  const numItems = input.items.reduce((acc, i) => acc + (i.quantity || 1), 0);

  const payload = {
    conversions: [
      {
        conversion_time: paidDate.toISOString(),
        event_id: eventId,
        conversion_id: String(input.conversionId),
        event_source_url: input.eventSourceUrl || "https://ckpropfirm.com",
        identifiers,
        value: Number(input.value).toFixed(2),
        number_items: numItems,
        description: "CK Propfirm evaluation purchase",
        contents: input.items.map((item) => ({
          content_id: String(item.id),
          content_name: String(item.name),
          content_type: "product",
          content_price: Number(item.price),
          num_items: Number(item.quantity || 1),
        })),
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-Pixel-Token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`X CAPI HTTP ${response.status}: ${JSON.stringify(result)}`);
    throw error;
  }

  return {
    success: true,
    processed: result?.conversions_processed,
    debugId: result?.debug_id,
  };
}

/**
 * Send Meta (Facebook) Purchase Conversion API event (Spec Meta Section 8)
 */
export async function sendMetaConversion(input: ServerConversionInput) {
  if (process.env.META_CAPI_ENABLED !== "true") {
    return { skipped: true, reason: "META_CAPI_ENABLED is not true" };
  }

  const datasetId = process.env.META_DATASET_ID || "1102958381163703";
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const version = process.env.META_GRAPH_API_VERSION || "v19.0";

  if (!token) {
    throw new Error("Missing META_CAPI_ACCESS_TOKEN");
  }

  const url = new URL(`https://graph.facebook.com/${version}/${datasetId}/events`);
  url.searchParams.set("access_token", token);

  const paidDate = typeof input.paidAt === "string" ? new Date(input.paidAt) : input.paidAt;
  const eventTime = Math.floor(paidDate.getTime() / 1000);

  const userData: Record<string, unknown> = {};
  const email = normaliseEmail(input.email);
  if (email) userData.em = [sha256(email)];
  const phone = normalisePhoneE164(input.phoneE164);
  if (phone) userData.ph = [sha256(phone)];
  if (input.ipAddress) userData.client_ip_address = input.ipAddress;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc || input.fbclid) userData.fbc = input.fbc || `fb.1.${Date.now()}.${input.fbclid}`;

  const eventPayload: Record<string, unknown> = {
    event_name: "Purchase",
    event_time: eventTime,
    event_id: String(input.conversionId),
    action_source: "website",
    event_source_url: input.eventSourceUrl || "https://ckpropfirm.com",
    user_data: userData,
    custom_data: {
      currency: input.currency.toUpperCase(),
      value: Number(input.value.toFixed(2)),
      order_id: String(input.conversionId),
      content_type: "product",
      content_ids: input.items.map((i) => String(i.id)),
    },
  };

  const body: Record<string, unknown> = {
    data: [eventPayload],
  };

  if (process.env.NODE_ENV !== "production" && process.env.META_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || (result as { error?: unknown }).error) {
    throw new Error(`Meta CAPI HTTP ${response.status}: ${JSON.stringify(result)}`);
  }

  return { success: true, result };
}

/**
 * Send Reddit Purchase Conversion API event (Spec Reddit Section 2)
 */
export async function sendRedditConversion(input: ServerConversionInput) {
  if (process.env.REDDIT_CAPI_ENABLED !== "true") {
    return { skipped: true, reason: "REDDIT_CAPI_ENABLED is not true" };
  }

  const pixelId = process.env.REDDIT_PIXEL_ID || "a2_jsyccfi50kgl";
  const token = process.env.REDDIT_CAPI_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing REDDIT_CAPI_ACCESS_TOKEN");
  }

  const url = `https://ads-api.reddit.com/api/v3/pixels/${pixelId}/conversion_events`;
  const paidDate = typeof input.paidAt === "string" ? new Date(input.paidAt) : input.paidAt;
  const numItems = input.items.reduce((acc, i) => acc + (i.quantity || 1), 0);

  const user: Record<string, unknown> = {};
  if (input.ipAddress) user.ip_address = input.ipAddress;
  if (input.userAgent) user.user_agent = input.userAgent;
  const email = normaliseEmail(input.email);
  if (email) user.email = sha256(email);

  const payload = {
    data: {
      events: [
        {
          event_at: paidDate.getTime(),
          action_source: "website",
          type: { tracking_type: "PURCHASE" },
          user,
          metadata: {
            currency: input.currency.toUpperCase(),
            value: Number(input.value.toFixed(2)),
            item_count: numItems,
            conversion_id: String(input.conversionId),
          },
        },
      ],
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Reddit CAPI HTTP ${response.status}: ${JSON.stringify(result)}`);
  }

  return { success: true, result };
}
