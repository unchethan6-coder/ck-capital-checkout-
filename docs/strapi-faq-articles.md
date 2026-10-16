# Strapi schema for the CMS-driven help centre

The 68 help articles replicated from the reference site live in
`lib/help/articles.json` (bundled fallback). To manage them from Strapi
instead, create the two collection types below, then run the seed script.
The site reads CMS first and falls back to the snapshot automatically, so
nothing renders empty while you work.

## 1. `faq-collection` (Collection type)

| Field         | Type   | Required | Notes                                    |
| ------------- | ------ | -------- | ---------------------------------------- |
| `name`        | Text   | yes      | e.g. `General`                           |
| `slug`        | UID → `name` | yes | Unique. Must match the site slugs: `about-us`, `general`, `account-rules`, `funded-accounts`, `giveaways`, `affiliates` |
| `description` | Text   | no       | One-line card/hero text                  |
| `sortOrder`   | Number | no       | Display order, 0-based                   |

## 2. `faq-article` (Collection type)

| Field          | Type       | Required | Notes                                                        |
| -------------- | ---------- | -------- | ------------------------------------------------------------ |
| `title`        | Text       | yes      | Article headline                                             |
| `slug`         | UID → `title` | yes   | Unique. Must match the existing slugs (see seed data)        |
| `collection`   | Relation many-to-one → `faq-collection` | yes | One article belongs to one collection |
| `body`         | JSON       | yes      | Article blocks in the site's block format (see below)        |
| `sortOrder`    | Number     | no       | Order inside the collection, 0-based                         |
| `displayDate`  | Date       | no       | Shown as "Updated …". Falls back to Strapi `updatedAt`       |

Draft & Publish: leave ON (recommended). Publish entries after editing.

### `body` block format

```jsonc
// paragraph / heading — runs carry bold/italic/links
{ "type": "p", "runs": [{ "t": "Text", "b": true, "href": "https://…" }] }
{ "type": "h", "level": 4, "runs": [{ "t": "Sub-section" }] }   // level 2–4
// list — each item is an array of blocks (usually one paragraph)
{ "type": "list", "ordered": false, "items": [[{ "type": "p", "runs": […] }]] }
// table — rows of cells, each cell is an array of blocks
{ "type": "table", "rows": [[[{ "type": "p", "runs": […] }]]] }
// CTA button
{ "type": "button", "text": "Start Challenge", "href": "/evaluation" }
```

Rules the renderer enforces: `runs[].t` must be a string, `href` a string,
heading `level` 1–6. An article whose `body` fails validation falls back to
the bundled snapshot for that slug; a collection with zero valid articles
is hidden.

## 3. Seed the content

```bash
node scripts/seed-faq-articles.mjs --dry-run   # preview, writes nothing
node scripts/seed-faq-articles.mjs             # upsert + publish all
```

Upserts by `slug`, so re-running is safe. Needs `STRAPI_API_TOKEN` with
find/create/update/publish permission on both new types.

## 4. Webhook (required for instant updates)

Strapi admin → Settings → Webhooks → the existing `CK Propfirm revalidate`
webhook → also tick **Publish / Unpublish** for `faq-article` and
`faq-collection`. Without this, edits appear within ~5 minutes via ISR
instead of instantly.

## 5. Behaviour notes

- **Existing slugs**: edits publish instantly (webhook) or within ~5 min.
- **Brand-new slugs or collections**: need a site rebuild to generate the
  static page (`dynamicParams` is off by design, unknown slugs 404).
- **Locales**: seed English first. Other locales automatically show the
  English articles (same as today) until localised entries exist.
- The flat `faqs` collection (quick answers) is untouched by this change.
