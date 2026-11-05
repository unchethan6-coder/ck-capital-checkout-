/**
 * The Meta ad landing page (/{locale}/landingpage).
 *
 * Shared parts of the site (the nav, the announcement bar) read this to adjust
 * themselves on that page only. Every other page is unaffected.
 */

import { FUNDING_PLAN_RAW_DATA } from "./content";

// With or without the locale prefix: next-intl's usePathname drops it, next/navigation's keeps it.
const AD_LANDING_PATH = /^(\/[a-z]{2})?\/landingpage\/?$/;

export function isAdLandingPath(pathname: string | null | undefined): boolean {
  return !!pathname && AD_LANDING_PATH.test(pathname);
}

/**
 * When the discount banner on the landing page stops showing (ISO date-time).
 * The banner shows "Ends <date>" before then and disappears after it.
 * null = no end date set; the banner shows as it does elsewhere.
 */
export const AD_BANNER_ENDS_AT: string | null = "2026-12-01T23:59:59Z";

/** Nav price keys → the funding models they cover in the pricing table. */
const NAV_MODELS: Record<string, string[]> = {
  oneStepPrice: ["1step"],
  twoStepPrice: ["standard", "pro"],
  instantPrice: ["instant"],
};

/**
 * "From $x" for a nav entry, from the same plans the pricing table shows, so
 * the two can't disagree (the nav's own copy rounds and drifts).
 */
export function navFromPrice(priceKey: string): string | null {
  const models = NAV_MODELS[priceKey];
  if (!models) return null;
  let min = Infinity;
  let label = "";
  for (const byModel of Object.values(FUNDING_PLAN_RAW_DATA)) {
    for (const m of models) {
      const disc = byModel[m]?.disc;
      const n = disc ? Number(disc.replace(/[$,]/g, "")) : NaN;
      if (n < min) {
        min = n;
        label = disc!;
      }
    }
  }
  return Number.isFinite(min) ? label : null;
}
