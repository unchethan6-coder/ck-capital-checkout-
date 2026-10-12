/**
 * Ad Click Attribution Capture and Persistence
 *
 * Captures ad click identifiers (twclid, fbclid, gclid, ttclid, rdt_cid) on landing,
 * persists them in first-party storage, and binds them to outbound checkout links.
 * For X (Twitter), sends twclid to /api/attribution/x to establish a 90-day HttpOnly cookie.
 */

const ATTRIBUTION_KEYS = ["twclid", "fbclid", "gclid", "ttclid", "rdt_cid", "msclkid"] as const;
type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];

const STORAGE_PREFIX = "ck_attr_";

/** Safe client cookie setter */
function setClientCookie(name: string, value: string, days = 90) {
  if (typeof document === "undefined") return;
  try {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {
    // Cookie access disabled or restricted
  }
}

/** Safe client cookie getter */
function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
    return match ? decodeURIComponent(match[3]) : null;
  } catch {
    return null;
  }
}

/**
 * Capture attribution parameters from URL query string on landing.
 * Should be called once on mount.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    const params = new URLSearchParams(window.location.search);
    let capturedTwclid: string | null = null;

    for (const key of ATTRIBUTION_KEYS) {
      const val = params.get(key);
      if (val && val.trim().length > 0 && val.length <= 512) {
        const cleanVal = val.trim();
        // Persist to localStorage
        try {
          window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, cleanVal);
        } catch {
          // localStorage disabled in private browsing
        }
        // Persist to client cookie as fallback
        setClientCookie(`ck_${key}`, cleanVal, 90);

        if (key === "twclid") {
          capturedTwclid = cleanVal;
        }
      }
    }

    // Spec Section 6: Forward twclid to backend attribution endpoint
    if (capturedTwclid) {
      void fetch("/api/attribution/x", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twclid: capturedTwclid }),
      }).catch(() => {
        // Silently fail network issues; client storage still preserves attribution
      });
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Retrieve all currently stored attribution IDs from localStorage or cookies.
 */
export function getStoredAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const result: Record<string, string> = {};

  for (const key of ATTRIBUTION_KEYS) {
    let val: string | null = null;
    try {
      val = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    } catch {
      // Ignore
    }
    if (!val) {
      val = getClientCookie(`ck_${key}`);
    }
    if (val) {
      result[key] = val;
    }
  }

  return result;
}

/**
 * Enrich an outbound portal/checkout URL with captured attribution parameters.
 */
export function enrichUrlWithAttribution(targetUrl: string): string {
  if (typeof window === "undefined") return targetUrl;

  try {
    const url = new URL(targetUrl, window.location.origin);
    const stored = getStoredAttribution();

    for (const [key, value] of Object.entries(stored)) {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    }

    return url.toString();
  } catch {
    return targetUrl;
  }
}
