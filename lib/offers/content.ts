import type { NewsItem } from "./types";

/**
 * Bundled offers and news.
 *
 * This is the fallback the site ships with: it keeps the centre working
 * before the CMS collection exists and whenever the CMS is unreachable.
 * Anything authored in the CMS replaces it entirely — see
 * `docs/offers-cms.md` for the collection these fields map to.
 *
 * Prices here are the published CK evaluation fees, so the table and the
 * checkout agree. Percentages are derived, never written by hand.
 */
export const BUNDLED_NEWS: NewsItem[] = [
  {
    id: "ck-october-starter-offer",
    tags: ["Offer", "New"],
    title: "What is the CK Capital October Starter Offer?",
    author: "CK Capital",
    summary:
      "Everything you need to know about our October Starter Offer — the lowest entry price we have run on starter-sized evaluations.",
    body: [
      "CK Capital is offering up to 75% off our starter evaluation plans. The offer is open to new and existing traders worldwide.",
      "Use the code at checkout to claim your discount. There is no announced closing date — this is a limited-time offer and may close at any point without advance notice, so redeem it while it is live.",
    ],
    image: null,
    startsAt: "2026-10-01T10:00:00.000Z",
    endsAt: null,
    coupon: "10KFOR19",
    pricing: {
      global: [
        { plan: "1-Step $5K", original: "$112.80", discounted: "$28.20", savingPct: 0 },
        { plan: "2-Step $5K", original: "$75.20", discounted: "$18.80", savingPct: 0 },
        { plan: "2-Step Pro $5K", original: "$150.40", discounted: "$37.60", savingPct: 0 },
        { plan: "Instant $5K", original: "$152.80", discounted: "$38.20", savingPct: 0 },
      ],
      usa: [
        { plan: "1-Step $5K", original: "$112.80", discounted: "$33.84", savingPct: 0 },
        { plan: "2-Step $5K", original: "$75.20", discounted: "$22.56", savingPct: 0 },
        { plan: "2-Step Pro $5K", original: "$150.40", discounted: "$45.12", savingPct: 0 },
        { plan: "Instant $5K", original: "$152.80", discounted: "$45.84", savingPct: 0 },
      ],
    },
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
