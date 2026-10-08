/** Types for the offers and news centre. */

/**
 * Pricing region. The split mirrors how the offers are actually sold: the US
 * carries different discounts to the rest of the world.
 */
export type OfferRegion = "global" | "usa";

/** One row of an offer's pricing table. */
export interface OfferPrice {
  /** Plan name as sold, e.g. "1-Step 6K". */
  plan: string;
  /** Undiscounted price, formatted with its currency symbol. */
  original: string;
  /** Price after the coupon, formatted with its currency symbol. */
  discounted: string;
  /**
   * Saving as a whole percent. Derived on the server from the two prices
   * rather than authored, so the badge can never disagree with the numbers
   * beside it.
   */
  savingPct: number;
}

export interface NewsItem {
  id: string;
  /** Short labels shown above the headline, e.g. "Event", "New". */
  tags: string[];
  title: string;
  /** Who published it, shown under the headline. */
  author: string;
  /** Lead paragraph. */
  summary: string;
  /** Body paragraphs, rendered in order. */
  body: string[];
  /** Hero artwork. */
  image: { src: string; alt: string } | null;
  /** When the offer opens, as an ISO instant. */
  startsAt: string | null;
  /** When it closes. Null means limited-time with no announced deadline. */
  endsAt: string | null;
  /** Coupon code, copyable and appended to the CTA link. */
  coupon: string | null;
  /** Pricing per region; absent for a pure news post. */
  pricing: Partial<Record<OfferRegion, OfferPrice[]>>;
  /** Eligibility, redemption limits and exclusions. */
  rules: string[];
  /** Destination for the primary call to action. */
  ctaHref: string;
  ctaLabel: string | null;
  /** Public trust score shown beside the artwork, e.g. 4.5. */
  rating: number | null;
  /** Higher sorts first; ties fall back to the start date. */
  priority: number;
  /**
   * Locales this item targets. Empty means every locale.
   */
  locales: string[];
}

export interface OffersPayload {
  items: NewsItem[];
  /** Region the server resolved for this request. */
  region: OfferRegion;
  /** False when the CMS could not be reached and bundled content is serving. */
  fromCms: boolean;
}
