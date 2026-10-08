"use client";

/**
 * Analytics for the offers centre.
 *
 * The site has no analytics vendor wired in yet, so events are pushed to the
 * standard `dataLayer` queue and mirrored to `gtag` when present. Both are
 * no-ops until a tag manager is installed, which means the instrumentation
 * can land now and start reporting the moment one is.
 */

export type OfferEvent =
  | "offer_impression"
  | "offer_open"
  | "offer_coupon_copy"
  | "offer_cta_click"
  | "offer_share"
  | "offer_dismiss";

interface DataLayerWindow {
  dataLayer?: Record<string, unknown>[];
  gtag?: (...args: unknown[]) => void;
}

export function track(event: OfferEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as DataLayerWindow;
  try {
    (w.dataLayer ??= []).push({ event, ...payload });
    w.gtag?.("event", event, payload);
  } catch {
    // Analytics must never break the interface it measures.
  }
}
