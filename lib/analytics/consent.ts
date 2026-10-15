/**
 * Google Consent Mode v2 defaults with UK/EEA region scoping.
 *
 * Non-UK/EEA visitors default to `granted` so ad platforms can set their
 * cookies and decorate outbound links; visitors in the UK/EEA default to
 * `denied` until they accept the cookie banner (GDPR/PECR). Google resolves
 * the visitor's region itself, so no IP geolocation plumbing is needed here.
 *
 * An explicit stored choice always wins over the regional default via
 * `gtag('consent', 'update', ...)`.
 */

import type { CookieChoice } from "@/components/shared/CookieConsent";

/**
 * ISO 3166-1 alpha-2 region codes where consent defaults to denied:
 * the United Kingdom plus the EU/EEA (EU-27 + Iceland, Liechtenstein,
 * Norway). Google matches these against the visitor's region.
 */
export const STRICT_CONSENT_REGIONS = [
  "GB", // United Kingdom
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", // EU-27
  "IS", "LI", "NO", // rest of the EEA
] as const;

export interface ConsentState {
  ad_storage: "granted" | "denied";
  analytics_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
}

export const CONSENT_GRANTED: ConsentState = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

export const CONSENT_DENIED: ConsentState = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

/**
 * Apply the visitor's stored banner choice on top of the regional defaults.
 * Safe to call when gtag/fbq/ttq are not (yet) loaded.
 */
export function applyConsentChoice(choice: CookieChoice): void {
  if (typeof window === "undefined") return;
  try {
    if (choice === "all") {
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.(
        "consent",
        "update",
        { ...CONSENT_GRANTED }
      );
      (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq?.("consent", "grant");
      (window as unknown as { ttq?: { grantConsent?: () => void } }).ttq?.grantConsent?.();
    } else {
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.(
        "consent",
        "update",
        { ...CONSENT_DENIED }
      );
      (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq?.("consent", "revoke");
      (window as unknown as { ttq?: { revokeConsent?: () => void } }).ttq?.revokeConsent?.();
    }
  } catch {
    // Consent application must never break the page
  }
}
