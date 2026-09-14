# Strapi CMS Setup Guide — full content-type instructions

Project reads content from Strapi at `https://cms.fundedproptraders.com`.
Credentials live in `.env.local` (`STRAPI_BASE_URL`, `STRAPI_API_TOKEN`, `REVALIDATE_SECRET`).

The site always falls back to bundled static content, so nothing breaks if a type
is missing or the CMS is down — but CMS-driven sections stay on fallback until the
types below exist.

## What is already wired

| Site surface | CMS source | Status |
|---|---|---|
| Blog list + article pages (`/blog`, `/blog/[slug]`) | `article` filtered by brand `ck-capital` | ✅ live (1 CK article) |
| Trader Reviews (home) | `firm-review` filtered by `firmSlug = ck-capital` | ✅ live (6 seeded) |
| Video testimonials (home) | `video-review` filtered by `firmSlug = ck-capital` | ✅ live (4 seeded) |
| Payout marquee (home) | `payout` | ✅ live (5 seeded) |
| Promo (offers strip, promo-code chip) | `promo` | ✅ live (JUN70) |
| Announcement banner (top) | `banner` | ✅ live |
| Challenge rules / prices / splits | `challenge-config` (single type) | ✅ live — seeded via API (2026-08-06) |
| Trader Feedback (Discord & testimonials) | `feedback` | ⏳ pending creation in CMS |

---

## How to create a content type (Strapi v5 admin)

1. Go to **Settings → Content-Type Builder** (left sidebar, bottom section).
2. Click **Create new collection type** (or **Create new single type**).
3. Give it a **display name** and, critically, set the **API name (singular / plural)**
   exactly as listed below — the site queries these endpoints.
4. Click **+ Add another field** for each field. The **Name** input is the API key the
   site reads — type it **exactly** (camelCase, lowercase first letter).
5. Turn **on** the **Draft & publish** toggle on the creation screen.
6. Click **Save**. Strapi restarts; then create entries under **Content Manager**.

---

## 1. Promo — collection type

| Setting | Value |
|---|---|
| Display name | `Promo` |
| Singular (API) name | `promo` |
| Plural (API) name | `promos` |
| Draft & publish | **On** |

Fields:

| Name (exact) | Type | Required | Notes |
|---|---|---|---|
| `code` | Text (short) | yes | e.g. `JUN70` — shown in the offers strip button and the challenge table copy-code chip |
| `title` | Text (short) | no | offer headline, e.g. `Your First Challenge, 70% Off` |
| `subtitle` | Text (long) | no | offer subcopy, used verbatim |
| `ctaLabel` | Text (short) | no | button label, e.g. `Use Code: JUN70` |
| `discountLabel` | Text (short) | no | e.g. `70%` |
| `active` | Boolean | no | default `false`; only `active: true` entries are read |
| `sortOrder` | Number | no | integer, lowest wins when several are active |

Create one entry (Content Manager → Promo → Create new entry): set `active` to
`true`, fill `code`/`title`/`subtitle`, save + **Publish**.

---

## 2. Banner — collection type

| Setting | Value |
|---|---|
| Display name | `Banner` |
| Singular (API) name | `banner` |
| Plural (API) name | `banners` |
| Draft & publish | **On** |

Fields:

| Name (exact) | Type | Required | Notes |
|---|---|---|---|
| `text` | Text (long) | yes | the top ticker message |
| `link` | Text (short) | no | optional destination |
| `active` | Boolean | no | default `false`; only `active: true` entries are read |

Create an entry with `active: true` and a message, then **Publish**.

---

## 3. Payout — collection type

| Setting | Value |
|---|---|
| Display name | `Payout` |
| Singular (API) name | `payout` |
| Plural (API) name | `payouts` |
| Draft & publish | **On** |

Fields:

| Name (exact) | Type | Required | Notes |
|---|---|---|---|
| `title` | Text (short) | no | image alt text |
| `amount` | Text (short) | no | e.g. `$38,200` — shown as a badge on the card |
| `image` | Media (single) | yes | upload the payout certificate screenshot |

Upload files via **Media Library** (or the media picker in the field). Only entries
with an image render. Publish each entry.

---

## 4. Challenge Config — single type

| Setting | Value |
|---|---|
| Display name | `Challenge Config` |
| API name (single) | `challenge-config` |
| Draft & publish | **On** |

Fields:

| Name (exact) | Type | Required | Notes |
|---|---|---|---|
| `config` | JSON | yes | the whole challenge matrix — see below |

Paste the full JSON below into the `config` field (adjust any prices/rules as
needed), save, and **Publish**. Any key you omit falls back to the static default,
so you can also start with a partial object and override a little at a time.

### Full reference JSON

```json
{
  "rules": {
    "standard": {
      "$5K":   { "phase1": "$500",   "phase2": "$250",    "maxDaily": "$200",    "maxLoss": "$400",    "consistency": "N/A" },
      "$10K":  { "phase1": "$1,000", "phase2": "$500",    "maxDaily": "$400",    "maxLoss": "$800",    "consistency": "N/A" },
      "$25K":  { "phase1": "$2,500", "phase2": "$1,250",  "maxDaily": "$1,000",  "maxLoss": "$2,000",  "consistency": "N/A" },
      "$50K":  { "phase1": "$5,000", "phase2": "$2,500",  "maxDaily": "$2,000",  "maxLoss": "$4,000",  "consistency": "N/A" },
      "$100K": { "phase1": "$10,000", "phase2": "$5,000", "maxDaily": "$4,000",  "maxLoss": "$8,000",  "consistency": "N/A" },
      "$200K": { "phase1": "$20,000", "phase2": "$10,000", "maxDaily": "$8,000", "maxLoss": "$16,000", "consistency": "N/A" },
      "$300K": { "phase1": "$30,000", "phase2": "$15,000", "maxDaily": "$12,000", "maxLoss": "$24,000", "consistency": "N/A" }
    },
    "middleweight": {
      "$5K":   { "phase1": "$400",   "phase2": "$250",   "maxDaily": "$200",    "maxLoss": "$600",    "consistency": "30%" },
      "$10K":  { "phase1": "$800",   "phase2": "$500",   "maxDaily": "$400",    "maxLoss": "$1,200",  "consistency": "30%" },
      "$25K":  { "phase1": "$2,000", "phase2": "$1,250", "maxDaily": "$1,000",  "maxLoss": "$3,000",  "consistency": "30%" },
      "$50K":  { "phase1": "$4,000", "phase2": "$2,500", "maxDaily": "$2,000",  "maxLoss": "$6,000",  "consistency": "30%" },
      "$100K": { "phase1": "$8,000", "phase2": "$5,000", "maxDaily": "$4,000",  "maxLoss": "$12,000", "consistency": "30%" },
      "$200K": { "phase1": "$16,000", "phase2": "$10,000", "maxDaily": "$8,000", "maxLoss": "$24,000", "consistency": "30%" },
      "$300K": { "phase1": "$24,000", "phase2": "$15,000", "maxDaily": "$12,000", "maxLoss": "$36,000", "consistency": "30%" }
    },
    "one-step": {
      "$5K":   { "phase1": "$500",   "phase2": "$0", "maxDaily": "$200",    "maxLoss": "$300",    "consistency": "N/A" },
      "$10K":  { "phase1": "$1,000", "phase2": "$0", "maxDaily": "$400",    "maxLoss": "$600",    "consistency": "N/A" },
      "$25K":  { "phase1": "$2,500", "phase2": "$0", "maxDaily": "$1,000",  "maxLoss": "$1,500",  "consistency": "N/A" },
      "$50K":  { "phase1": "$5,000", "phase2": "$0", "maxDaily": "$2,000",  "maxLoss": "$3,000",  "consistency": "N/A" },
      "$100K": { "phase1": "$10,000", "phase2": "$0", "maxDaily": "$4,000", "maxLoss": "$6,000",  "consistency": "N/A" },
      "$200K": { "phase1": "$20,000", "phase2": "$0", "maxDaily": "$8,000", "maxLoss": "$12,000", "consistency": "N/A" },
      "$300K": { "phase1": "$30,000", "phase2": "$0", "maxDaily": "$12,000", "maxLoss": "$18,000", "consistency": "N/A" }
    },
    "instant": {
      "$5K":   { "phase1": "$0", "phase2": "$0", "maxDaily": "$150",   "maxLoss": "$250",   "consistency": "20%" },
      "$10K":  { "phase1": "$0", "phase2": "$0", "maxDaily": "$300",   "maxLoss": "$500",   "consistency": "20%" },
      "$25K":  { "phase1": "$0", "phase2": "$0", "maxDaily": "$750",   "maxLoss": "$1,250", "consistency": "20%" },
      "$50K":  { "phase1": "$0", "phase2": "$0", "maxDaily": "$1,500", "maxLoss": "$2,500", "consistency": "20%" },
      "$100K": { "phase1": "$0", "phase2": "$0", "maxDaily": "$3,000", "maxLoss": "$5,000", "consistency": "20%" },
      "$200K": { "phase1": "$0", "phase2": "$0", "maxDaily": "$6,000", "maxLoss": "$10,000", "consistency": "20%" }
    }
  },
  "prices": {
    "standard": {
      "$5K":   { "price": "$19.20",   "oldPrice": "$64.00" },
      "$10K":  { "price": "$58.00",   "oldPrice": "$193.33" },
      "$25K":  { "price": "$68.40",   "oldPrice": "$228.00" },
      "$50K":  { "price": "$108.24",  "oldPrice": "$360.80" },
      "$100K": { "price": "$229.00",  "oldPrice": "$763.33" },
      "$200K": { "price": "$634.50",  "oldPrice": "$2,115.00" },
      "$300K": { "price": "$984.50",  "oldPrice": "$3,281.67" }
    },
    "middleweight": {
      "$5K":   { "price": "$19.20",   "oldPrice": "$64.00" },
      "$10K":  { "price": "$58.00",   "oldPrice": "$193.33" },
      "$25K":  { "price": "$68.40",   "oldPrice": "$228.00" },
      "$50K":  { "price": "$108.24",  "oldPrice": "$360.80" },
      "$100K": { "price": "$229.00",  "oldPrice": "$763.33" },
      "$200K": { "price": "$634.50",  "oldPrice": "$2,115.00" },
      "$300K": { "price": "$984.50",  "oldPrice": "$3,281.67" }
    },
    "one-step": {
      "$5K":   { "price": "$19.20",   "oldPrice": "$64.00" },
      "$10K":  { "price": "$58.00",   "oldPrice": "$193.33" },
      "$25K":  { "price": "$68.40",   "oldPrice": "$228.00" },
      "$50K":  { "price": "$108.24",  "oldPrice": "$360.80" },
      "$100K": { "price": "$229.00",  "oldPrice": "$763.33" },
      "$200K": { "price": "$634.50",  "oldPrice": "$2,115.00" },
      "$300K": { "price": "$984.50",  "oldPrice": "$3,281.67" }
    },
    "instant": {
      "$5K":   { "price": "$48.00",   "oldPrice": "$160.00" },
      "$10K":  { "price": "$78.00",   "oldPrice": "$260.00" },
      "$25K":  { "price": "$139.00",  "oldPrice": "$463.33" },
      "$50K":  { "price": "$274.50",  "oldPrice": "$915.00" },
      "$100K": { "price": "$549.00",  "oldPrice": "$1,830.00" },
      "$200K": { "price": "$1,098.00", "oldPrice": "$3,660.00" }
    }
  },
  "splits": {
    "standard": "50% / 75% / 100%",
    "middleweight": "50% / 75% / 100%",
    "one-step": "50% / 75% / 100%",
    "instant": "Bi-weekly 50%"
  },
  "access": [
    "Trader Dashboard",
    "MT5 & TradeLocker",
    "Discord Community",
    "24/7 Support",
    "Economic Calendar",
    "Reset & Top-Up Options"
  ],
  "sizes": ["$5K", "$10K", "$25K", "$50K", "$100K", "$200K", "$300K"]
}
```

> Rules of thumb: `phase2` set to `"$0"` hides Phase 2 (used by `one-step`).
> `instant` has **no** `$300K` size. Consistency values: `N/A`, `30%`, or `20%`.

---

## 5. Feedback — collection type

Dedicated collection for CK Propfirm trader feedback and Discord proof screenshots (isolated from FPT).

| Setting | Value |
|---|---|
| Display name | `Feedback` |
| Singular (API) name | `feedback` |
| Plural (API) name | `feedbacks` |
| Draft & publish | **On** |

Fields:

| Name (exact) | Type | Required | Notes |
|---|---|---|---|
| `username` | Text (short) | yes | Discord handle / trader username (e.g. `doksab`, `Pedro Perez`, `George`) |
| `message` | Text (long) | yes | Feedback comment or testimonial text |
| `image` | Media (single) | no | Screenshot of the feedback/payout proof from Discord |
| `rating` | Number (integer) | no | 1–5 stars (default 5) |
| `source` | Text (short) | no | e.g. `Discord` |
| `amount` | Text (short) | no | Payout amount if mentioned (e.g. `$6,578.00`) |
| `date` | Text (short) | no | e.g. `2025-06-24` |

---

## Tagging articles to the CK Capital brand

Articles only appear on `/blog` when the **Brand** relation is set to **CK Capital**
(slug `ck-capital` — already created). In the article editor, set *Brand* →
*CK Capital*, then Publish. Non-branded articles (including the leftover
`this-is-a-test` entry) never appear.

## Seeding notes (2026-08-06)

All content types were seeded via API from the site's then-current static content:

- **Promo** — `JUN70` (active, sortOrder 0). Offer title/subtitle/cta mirror the
  offers strip; edit or re-add entries in Content Manager to change them.
- **Banner** — "🏆 Join Now & Get JUN70 Code for 70% Off" (active).
- **Payouts** — 5 entries linked to uploaded copies of `public/images/payouts/cert-1..5.png`.
- **Firm reviews** — 6 entries (`summary` = review text, `rating` 5).
- **Video reviews** — 4 entries (youtube IDs + titles from the testimonials carousel).

> **Field caveats:** `firm-review` has no author-name/location/source fields, so
> CMS review cards render as "Verified Trader". `video-review` has no
> reward/description fields, so CMS testimonial cards show title only (no reward
> badge / description). To restore that fidelity, add `authorName`, `location`,
> `source` to Firm Review and `reward`, `description` to Video Review in the
> Content-Type Builder, then update the card mapping in the site.
> Also note: `firmSlug` was originally **unique** on both — the constraint was
> removed so multiple reviews/videos per firm can exist.

---

## Revalidation webhook (instant content updates)

1. Strapi admin → **Settings → Webhooks → Create new webhook**.
2. Name: `CK Capital revalidate`.
3. URL: `https://ckcapital.co.uk/api/revalidate`
4. Headers: key `x-strapi-webhook-secret`, value = the `REVALIDATE_SECRET` in `.env.local`.
5. Events: tick **Publish / Unpublish** for: Article, Promo, Banner, Payout,
   Firm Review, Video Review, Challenge Config.
6. Save. Pages also refresh on their own within ~5 minutes via ISR.

---

## Verifying a new type

After creating + publishing an entry, check the API responds (token in `STRAPI_API_TOKEN`):

```bash
curl -H "Authorization: Bearer $STRAPI_API_TOKEN" \
  "https://cms.fundedproptraders.com/api/promos?filters[active][\$eq]=true"
```

Empty or 404 responses are expected until the type exists — the site falls back to
static content in that case.
