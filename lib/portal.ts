/** Portal and authentication URLs for CK Propfirm */
export const PORTAL_URL = "https://my.ckpropfirm.com";
export const PORTAL_SIGNIN_URL = "https://my.ckpropfirm.com/auth/signin";
export const PORTAL_SIGNUP_URL = "https://my.ckpropfirm.com/auth/signup";

import { enrichUrlWithAttribution } from "./analytics/attribution";

export function getPortalSignupUrl(params?: Record<string, string | number | boolean | undefined | null>): string {
  let url = PORTAL_SIGNUP_URL;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    }
    const query = searchParams.toString();
    url = query ? `${PORTAL_SIGNUP_URL}?${query}` : PORTAL_SIGNUP_URL;
  }
  return enrichUrlWithAttribution(url);
}
