/**
 * Help content for the support widget.
 *
 * Questions are grouped into collections and every entry points at an
 * existing translation key, so the widget answers from the same approved copy
 * the FAQ page serves. Nothing here is written twice, and the assistant has no
 * way to state a rule the site does not already publish.
 */

export interface FaqEntry {
  /** Key under the `faq.items` namespace. */
  key: string;
}

export interface FaqCollection {
  id: string;
  /** Key under the `support.collections` namespace. */
  titleKey: string;
  entries: FaqEntry[];
  /** Shown when a collection links out rather than answering inline. */
  href?: string;
}

export const FAQ_COLLECTIONS: FaqCollection[] = [
  {
    id: "payouts",
    titleKey: "payouts",
    entries: [
      { key: "payoutTime" }, { key: "profitSplit" }, { key: "minProfit" }, { key: "buffer" },
      { key: "payoutCaps" }, { key: "pendingPayout" }, { key: "maxAllocation" },
      { key: "instantPayouts" }, { key: "cryptoFunding" },
    ],
  },
  {
    id: "rules",
    titleKey: "rules",
    entries: [
      { key: "drawdown" }, { key: "trailingDrawdown" }, { key: "consistency" }, { key: "consistencyScore" },
      { key: "newsTrading" }, { key: "expertAdvisors" }, { key: "lotSize" }, { key: "copyTrading" },
      { key: "inactivity" },
    ],
  },
  {
    id: "programmes",
    titleKey: "programmes",
    entries: [
      { key: "timeLimit" }, { key: "refundPolicy" }, { key: "topUpReset" },
      { key: "phase2Reset" }, { key: "fundedReset" }, { key: "countries" },
    ],
  },
  {
    id: "platforms",
    titleKey: "platforms",
    entries: [{ key: "platforms" }],
  },
];

/** Every question key, in collection order — used by the search box. */
export const ALL_FAQ_KEYS: string[] = FAQ_COLLECTIONS.flatMap((c) => c.entries.map((e) => e.key));

/** Questions offered on the home tab before anyone searches. */
export const SUGGESTED_FAQ_KEYS = ["payoutTime", "profitSplit", "newsTrading", "expertAdvisors"];

/** The help centre, which leads on to the contact page. Prefix with the locale. */
export const SUPPORT_PATH = "/faq";
