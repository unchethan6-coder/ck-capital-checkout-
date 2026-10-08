import { ACCOUNT_SIZES, FUNDING_PLAN_RAW_DATA, SITE_META } from "@/lib/content";
import type { NewsItem, OfferPrice } from "./types";

/**
 * Bundled offers and news.
 *
 * This is the fallback the site ships with: it keeps the centre working
 * before the CMS collection exists and whenever the CMS is unreachable.
 * Anything authored in the CMS replaces it entirely — see
 * `docs/offers-cms.md`.
 */

/**
 * Build the offer table from the same data the pricing page and checkout
 * read, so the modal cannot quote a size or a price that is not actually
 * sold. Hand-written prices here would be a second source of truth and would
 * drift the first time the real table changed.
 */
function pricingFor(plan: keyof (typeof FUNDING_PLAN_RAW_DATA)["10K"]): OfferPrice[] {
  return ACCOUNT_SIZES.flatMap((size) => {
    const row = FUNDING_PLAN_RAW_DATA[size.replace("$", "")]?.[plan];
    if (!row) return [];
    // savingPct is derived server-side from these two values.
    return [{ plan: size, original: row.orig, discounted: row.disc, savingPct: 0 }];
  });
}

const STANDARD_PRICING = pricingFor("standard");

export const BUNDLED_NEWS: NewsItem[] = [
  {
    id: "ck-october-starter-offer",
    tags: ["Offer", "New"],
    title: "What is the CK Capital October Starter Offer?",
    author: "CK Capital",
    summary:
      "Everything you need to know about our October offer — 75% off every 2-Step Standard evaluation, from $10K through to $300K.",
    body: [
      "CK Capital is offering 75% off our 2-Step Standard evaluations. The offer is open to new and existing traders worldwide.",
      "Use the code at checkout to claim your discount. There is no announced closing date — this is a limited-time offer and may close at any point without advance notice, so redeem it while it is live.",
    ],
    image: null,
    startsAt: "2026-10-01T10:00:00.000Z",
    endsAt: null,
    coupon: SITE_META.promoCode,
    /**
     * CK prices the same worldwide, so both regions read the same table. The
     * per-region split stays available for when an offer really is regional;
     * inventing a different US price here would put a number on screen that
     * checkout would not honour.
     */
    pricing: { global: STANDARD_PRICING, usa: STANDARD_PRICING },
    rules: [
      "Maximum of 5 redemptions per trader.",
      "The discount does not apply to account resets.",
      "No deadline reminder will be sent — the offer may end at any time.",
    ],
    ctaHref: "/#start-challenge",
    ctaLabel: null,
    rating: 4.5,
    priority: 100,
    locales: [],
  },
  {
    id: "ck-symbol-specs-launch",
    tags: ["Product"],
    title: "Live symbol specifications are now available",
    author: "CK Capital",
    summary:
      "Every instrument you can trade at CK Capital, with live bid and ask prices, spreads, contract sizes and leverage.",
    body: [
      "The new symbol specifications page lists all 53 instruments across currencies, indices, commodities, crypto and shares, with prices streaming live.",
      "Search any instrument, sort by spread or contract size, and star the ones you trade to build your own watchlist.",
    ],
    image: null,
    startsAt: null,
    endsAt: null,
    coupon: null,
    pricing: {},
    rules: [],
    ctaHref: "/symbols",
    ctaLabel: null,
    rating: null,
    priority: 50,
    locales: [],
  },
];
