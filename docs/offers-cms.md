# Offers and news collection

The offers centre reads a Strapi collection named `news-items`. Until that
collection exists the site serves the bundled set in `lib/offers/content.ts`,
so the feature works before any CMS work is done and keeps working whenever
the CMS is unreachable.

Create a collection type with the API ID `news-item` and these fields.

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | UID | Used as the item id; also the share anchor. |
| `title` | Text | Headline. Required — rows without one are skipped. |
| `author` | Text | Shown under the headline. Defaults to "CK Capital". |
| `summary` | Text (long) | Lead paragraph. |
| `body` | JSON (array of strings) | One entry per paragraph, rendered in order. |
| `tags` | JSON (array of strings) | Short labels above the headline, e.g. `["Offer","New"]`. |
| `imageUrl` | Text | Absolute URL of the hero artwork. |
| `imageAlt` | Text | Describe the artwork; leave empty only if decorative. |
| `startsAt` | DateTime | The item stays hidden until this moment. |
| `endsAt` | DateTime | The item disappears at this moment. Empty = limited-time with no announced deadline. |
| `coupon` | Text | Copyable code, also appended to the CTA link. |
| `pricingGlobal` | JSON | `[{ "plan": "...", "original": "$65.99", "discounted": "$44.99" }]` |
| `pricingUsa` | JSON | Same shape, used for US visitors. |
| `rules` | JSON (array of strings) | Redemption limits, eligibility, exclusions. |
| `ctaHref` | Text | Destination. Defaults to `/#start-challenge`. |
| `ctaLabel` | Text | Defaults to the translated "Join Now". |
| `rating` | Decimal | Trust score shown on the artwork, e.g. `4.5`. |
| `priority` | Integer | Higher sorts first. |
| `locales` | JSON (array of strings) | Target locales, e.g. `["en","es"]`. Empty targets everyone. |

## Things the server decides, not the author

- **Saving percentages** are computed from `original` and `discounted`. Do not
  author them: a hand-written percentage goes stale the first time a price is
  edited, and the badge would then contradict the numbers beside it.
- **Scheduling.** `startsAt` and `endsAt` are applied server-side, so an offer
  appears and expires on its own with no deployment.
- **Region.** US visitors get `pricingUsa`, everyone else `pricingGlobal`,
  resolved from the same edge headers the locale middleware uses. Only the
  viewer's own region is sent to the browser, so the wrong table cannot be
  shown.

## Frequency capping

The centre opens itself at most once per 24 hours per browser, and never for
an item that browser has already seen. Both are stored in `localStorage`
(`ck:offers:seen`, `ck:offers:lastAutoOpen`). The launcher is always available
regardless of the cap.

## Analytics

Events are pushed to `dataLayer` and mirrored to `gtag` when present:
`offer_impression`, `offer_open`, `offer_coupon_copy`, `offer_cta_click`,
`offer_share`, `offer_dismiss`. They are no-ops until a tag manager is
installed.
