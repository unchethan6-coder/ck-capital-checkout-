import type { EventImpact } from "@/lib/calendar/types";

/**
 * Presentation metadata for the calendar: which currencies the feed carries,
 * the flag to show beside each, and the colour each impact level uses.
 */

/** Currency → ISO country code for the flag chip. "All" has no flag. */
export const CURRENCY_FLAG: Record<string, string | null> = {
  All: null,
  USD: "US",
  EUR: "EU",
  GBP: "GB",
  JPY: "JP",
  AUD: "AU",
  NZD: "NZ",
  CAD: "CA",
  CHF: "CH",
  CNY: "CN",
};

/** Chip order, mirroring how the major pairs are usually listed. */
export const CURRENCIES = ["All", "USD", "EUR", "GBP", "JPY", "AUD", "NZD", "CAD", "CHF", "CNY"];

export const IMPACTS: EventImpact[] = ["High", "Medium", "Low", "Holiday"];

/**
 * Impact colours. High and Medium carry the warning tones; Holiday is green
 * because it means the market is shut rather than volatile.
 */
export const IMPACT_STYLE: Record<EventImpact, { dot: string; text: string; bg: string; border: string }> = {
  High:    { dot: "bg-[#f87171]", text: "text-[#f87171]", bg: "bg-[#f87171]/10", border: "border-[#f87171]/30" },
  Medium:  { dot: "bg-[#E9BE57]", text: "text-[#E9BE57]", bg: "bg-[#E9BE57]/10", border: "border-[#E9BE57]/30" },
  Low:     { dot: "bg-[#A98BFF]", text: "text-[#A98BFF]", bg: "bg-[#A98BFF]/10", border: "border-[#A98BFF]/30" },
  Holiday: { dot: "bg-[#34d399]", text: "text-[#34d399]", bg: "bg-[#34d399]/10", border: "border-[#34d399]/30" },
};

/** Day-of-week chips, Sunday first to match the feed's week. */
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
