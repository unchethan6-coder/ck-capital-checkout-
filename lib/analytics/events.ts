import type { BeginCheckoutParams, PurchaseOrder } from "./types";

/**
 * Push an event to dataLayer safely
 */
export function pushDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch {
    // Non-blocking
  }
}

/**
 * Dispatch SPA Virtual PageView to all active pixel platforms
 */
export function trackPageView(path?: string): void {
  if (typeof window === "undefined") return;

  const currentPath = path || window.location.pathname + window.location.search;

  try {
    pushDataLayer({
      event: "page_view",
      page_path: currentPath,
      page_location: window.location.href,
      page_title: document.title,
    });

    window.fbq?.("track", "PageView");
    window.ttq?.page();
    window.twq?.("track", "PageView");
    window.rdt?.("track", "PageVisit");
  } catch {
    // Non-blocking
  }
}

/**
 * Dispatch begin_checkout event across dataLayer and all pixel platforms
 * Spec Section 5 / Section 10.3:
 * - One standard begin_checkout event to dataLayer
 * - Clears stale ecommerce data first
 * - X event key: tw-qs40m-13lgxt
 * - Meta event: InitiateCheckout
 * - TikTok event: InitiateCheckout
 * - Reddit event: AddToCart
 */
export function trackBeginCheckout(params: BeginCheckoutParams): void {
  if (typeof window === "undefined") return;

  const qty = params.quantity && params.quantity > 0 ? params.quantity : 1;
  const unitPrice = Number((params.value / qty).toFixed(2));
  const totalValue = Number(params.value.toFixed(2));
  const currency = (params.currency || "USD").toUpperCase();

  const item = {
    item_id: String(params.planId),
    item_name: String(params.planName),
    price: unitPrice,
    quantity: qty,
  };

  try {
    // 1. Google Tag Manager / GA4 dataLayer
    pushDataLayer({ ecommerce: null });
    pushDataLayer({
      event: "begin_checkout",
      ecommerce: {
        currency,
        value: totalValue,
        items: [item],
      },
    });

    // 2. Meta (Facebook) Pixel
    window.fbq?.("track", "InitiateCheckout", {
      value: totalValue,
      currency,
      content_ids: [item.item_id],
      content_name: item.item_name,
      content_type: "product",
      num_items: qty,
    });

    // 3. TikTok Pixel
    window.ttq?.track("InitiateCheckout", {
      value: totalValue,
      currency,
      contents: [
        {
          content_id: item.item_id,
          content_name: item.item_name,
          quantity: qty,
          price: unitPrice,
        },
      ],
    });

    // 4. X (Twitter) Pixel (event key: tw-qs40m-13lgxt)
    window.twq?.("event", "tw-qs40m-13lgxt", {
      value: totalValue,
      currency,
      num_items: qty,
      contents: [
        {
          content_id: item.item_id,
          content_name: item.item_name,
          quantity: qty,
          price: unitPrice,
        },
      ],
    });

    // 5. Reddit Pixel
    window.rdt?.("track", "AddToCart", {
      itemCount: qty,
      value: totalValue,
      currency,
    });
  } catch {
    // Analytics error must never block user flow
  }
}

/**
 * Dispatch ViewContent event (product / pricing view) across dataLayer + pixels.
 * fbq('track') fans out to both Meta Pixel IDs initialized in MarketingPixels.
 */
export function trackViewContent(params?: {
  content_ids?: string[];
  content_name?: string;
  value?: number;
  currency?: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    const currency = (params?.currency || "USD").toUpperCase();
    pushDataLayer({
      event: "view_item",
      ecommerce: {
        currency,
        value: params?.value,
        items: (params?.content_ids || []).map((id) => ({
          item_id: id,
          item_name: params?.content_name || id,
        })),
      },
    });
    window.fbq?.("track", "ViewContent", {
      content_ids: params?.content_ids,
      content_name: params?.content_name,
      content_type: "product",
      ...(typeof params?.value === "number" ? { value: params.value, currency } : {}),
    });
    if (params?.content_ids?.length) {
      window.ttq?.track("ViewContent", {
        content_id: params.content_ids[0],
        content_name: params.content_name,
        ...(typeof params?.value === "number" ? { value: params.value, currency } : {}),
      });
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Dispatch Lead event (newsletter signup, affiliate interest) across dataLayer + pixels.
 */
export function trackLead(params?: { content_name?: string; value?: number; currency?: string }): void {
  if (typeof window === "undefined") return;
  try {
    const currency = (params?.currency || "USD").toUpperCase();
    pushDataLayer({
      event: "generate_lead",
      content_name: params?.content_name,
      value: params?.value,
      currency,
    });
    window.fbq?.("track", "Lead", {
      ...(params?.content_name ? { content_name: params.content_name } : {}),
      ...(typeof params?.value === "number" ? { value: params.value, currency } : {}),
    });
    window.ttq?.track("SubmitForm", {
      ...(params?.content_name ? { content_name: params.content_name } : {}),
    });
    window.rdt?.("track", "Lead");
  } catch {
    // Non-blocking
  }
}

/**
 * Dispatch Contact event (contact intent: Discord join from /contact, support click).
 */
export function trackContact(params?: { content_name?: string }): void {
  if (typeof window === "undefined") return;
  try {
    pushDataLayer({ event: "contact", content_name: params?.content_name });
    window.fbq?.("track", "Contact", {
      ...(params?.content_name ? { content_name: params.content_name } : {}),
    });
    window.ttq?.track("Contact", {
      ...(params?.content_name ? { content_name: params.content_name } : {}),
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Dispatch verified Purchase event across dataLayer and all pixel platforms
 * Spec Section 8:
 * - Checks order is paid and has non-empty ID
 * - Browser deduplication guard via sessionStorage
 * - Pushes canonical purchase and legacy ck_purchase_confirmed to dataLayer
 * - X event key: tw-qs40m-13lgxz with conversion_id
 * - Meta event: Purchase with eventID
 * - TikTok event: CompletePayment with event_id
 * - Reddit event: Purchase with conversionId
 */
export function trackPurchase(order: PurchaseOrder): boolean {
  if (typeof window === "undefined") return false;
  if (!order?.isPaid || !order?.id) return false;

  const transactionId = String(order.id);
  const storageKey = `ck_purchase_pushed:${transactionId}`;

  try {
    if (window.sessionStorage.getItem(storageKey)) {
      // Already pushed in this session — deduplicate
      return false;
    }
  } catch {
    // sessionStorage disabled
  }

  const value = Number(Number(order.value).toFixed(2));
  const currency = String(order.currency || "USD").toUpperCase();
  const items = (order.items || []).map((item) => ({
    item_id: String(item.item_id),
    item_name: String(item.item_name),
    price: Number(Number(item.price).toFixed(2)),
    quantity: Number(item.quantity) || 1,
  }));
  const numItems = items.reduce((acc, i) => acc + i.quantity, 0);

  try {
    // 1. Google Tag Manager / GA4 dataLayer
    pushDataLayer({ ecommerce: null });
    pushDataLayer({
      event: "purchase",
      transaction_id: transactionId,
      value,
      currency,
      items,
      ecommerce: {
        transaction_id: transactionId,
        value,
        currency,
        items,
      },
    });

    // Backwards compatibility for existing GTM tags triggering on ck_purchase_confirmed
    pushDataLayer({
      event: "ck_purchase_confirmed",
      ecommerce: {
        transaction_id: transactionId,
        value,
        currency,
        items,
      },
    });

    // 2. Meta (Facebook) Pixel with server deduplication ID
    window.fbq?.(
      "track",
      "Purchase",
      {
        value,
        currency,
        content_type: "product",
        content_ids: items.map((i) => i.item_id),
        num_items: numItems,
      },
      { eventID: transactionId }
    );

    // 3. TikTok Pixel with server deduplication ID
    window.ttq?.track(
      "CompletePayment",
      {
        value,
        currency,
        contents: items.map((i) => ({
          content_id: i.item_id,
          content_name: i.item_name,
          quantity: i.quantity,
          price: i.price,
        })),
      },
      { event_id: transactionId }
    );

    // 4. X (Twitter) Pixel (event key: tw-qs40m-13lgxz) with conversion_id
    window.twq?.("event", "tw-qs40m-13lgxz", {
      value: value.toFixed(2),
      currency,
      conversion_id: transactionId,
      num_items: numItems,
      contents: items.map((i) => ({
        content_id: i.item_id,
        content_name: i.item_name,
        content_type: "product",
        content_price: i.price,
        num_items: i.quantity,
      })),
    });

    // 5. Reddit Pixel with conversionId
    window.rdt?.("track", "Purchase", {
      conversionId: transactionId,
      value,
      currency,
      itemCount: numItems,
    });

    // Mark as pushed
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Ignore
    }

    return true;
  } catch {
    return false;
  }
}
