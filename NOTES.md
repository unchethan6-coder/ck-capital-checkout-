# CK Propfirm — Clone Notes

## Source
- **Origin:** https://ck-website-2.vercel.app
- **Cloned:** 2026-08-02
- **Clone mode:** High-fidelity faithful clone
- **Complexity:** L3 (Next.js marketing site, no WebGL, standard interactions)

## Stack
- Next.js 16.2.12 (App Router, TypeScript)
- Tailwind CSS v4
- shadcn/ui (base-ui/react — Accordion, Tabs, Dialog, Select)
- Framer Motion
- Embla Carousel + Autoplay
- Lucide React icons
- `next/font/google` — Inter, Inter Tight, Manrope, Sora (variable)

## Dev server
```bash
cd "/Users/kimjoshuadr/CKCapital Latest"
npm run dev
# → http://localhost:3000
```

## Design tokens (extracted via recon-site.mjs)
| Token | Value | Source |
|---|---|---|
| `--background` | `#0b0a07` | computed body bg |
| `--foreground` | `#f4f6f8` | computed body color |
| `--primary` (gold) | `#d4af37` | CSS `--primary` |
| `--primary-dark` | `#a6770a` | CSS `--primary-dark` |
| `--secondary` (teal) | `#14b8a6` | CSS `--secondary` |
| `--muted-foreground` | `#9aa2ad` | CSS `--muted-foreground` |
| `--border` | `#ffffff1a` | CSS `--border` |
| `--card` | `#ffffff0a` | CSS `--card` |
| `--radius` | `0.75rem` | CSS `--radius` |
| Gold gradient | `linear-gradient(135deg, #d4af37, #f5d570, #d4af37)` | CSS `--ck-gold-gradient` |
| Footer bg | `#0F0D08` | computed |
| Theme | Dark default (matches source), light opt-in via nav toggle | `app/layout.tsx` boot script |
| Font (display + body) | Inter variable (wght 100–900) | `@font-face` / `next/font` |

## Section map
| # | Component | File | Notes |
|---|---|---|---|
| 1 | AnnouncementBar | `components/sections/AnnouncementBar.tsx` | Gold shimmer "Summer Sale" ticker |
| 2 | TopNav | `components/sections/TopNav.tsx` | Sticky, glass blur on scroll, mobile menu |
| 3 | Hero | `components/sections/Hero.tsx` | Countdown persisted in `localStorage` |
| 4 | PricingGrid | `components/sections/PricingGrid.tsx` | USD/GBP/EUR switcher, 3 cards |
| 5 | OffersStrip | `components/sections/OffersStrip.tsx` | Promo code JUN70 |
| 6 | StatsStrip | `components/sections/StatsStrip.tsx` | 12H / 100% / $100K / 24/7 animated in-view |
| 7 | PaymentsMarquee | `components/sections/PaymentsMarquee.tsx` | Dual-direction infinite marquee |
| 8 | ChallengeComparison | `components/sections/ChallengeComparison.tsx` | 4 tabs × 7 sizes × 3 currencies |
| 9 | HowItWorks | `components/sections/HowItWorks.tsx` | 3-step hover cards |
| 10 | TradingPlatforms | `components/sections/TradingPlatforms.tsx` | MT5 + TradeLocker with SVG candlestick mockup |
| 11 | WhyChooseUs | `components/sections/WhyChooseUs.tsx` | 6 feature cards |
| 12 | PayoutCarousel | `components/sections/PayoutCarousel.tsx` | Embla autoplay, draggable |
| 13 | CommunityGrid | `components/sections/CommunityGrid.tsx` | Discord / Dashboard / Support 3-up |
| 14 | Testimonials | `components/sections/Testimonials.tsx` | 6s auto-rotate, dot nav |
| 15 | InstrumentsShowcase | `components/sections/InstrumentsShowcase.tsx` | Long/Short toggle |
| 16 | FaqAccordion | `components/sections/FaqAccordion.tsx` | base-ui Accordion, single-open |
| 17 | SiteFooter | `components/sections/SiteFooter.tsx` | 4-column links + CTA banner |

## Latest fixes (2026-08-03)
- **Challenge table data rebuilt to source** — the phase rows were previously computed from *percentage* rules, which gave wrong dollar values. Now uses the original's exact per-size dollar matrix (chunk `0sjzj9maezk44.js`): `CHALLENGE_RULES` / `CHALLENGE_PRICES` / `CHALLENGE_SPLITS` in `lib/content.ts`.
- **Per-model column layout now faithful** — Standard/Middleweight = Phase 1 + Phase 2 + CK Account (3 cols); **1 Step = Phase 1 + CK Account** (Phase 2 hidden); **Instant = single CK Account column** (no phases, "Bi-weekly 50%" split, "20%" consistency, $300/$500 losses). Previously all four models rendered 3 columns.
- **Compare Sizes fully cloned** — it's now a real grid with one column per account size (rail + 7 size cards for standard/middleweight/1-Step, 6 for Instant), BEST VALUE/-70% badges on $100K, gold price/old-price, per-card Start buttons, and it responds to the Show Numbers toggle ($ ↔ %). Previously it only hid a phase column.
- **Copy-code chip** — clicking `Code: JUN70-10` copies to clipboard with "✓ Copied!" feedback (matches source).
- **Access list + disclaimer** — "You will also get access to" chips and the simulated-trading disclaimer added under the table.
- **Compare Sizes / Show Phases** — now a real two-way segmented toggle (gold pill active state, matches source); previously a dead button.
- **Funded-stage column colors** — aligned to source: gold-tint `bg-[#D4AF37]/[0.08]` + gold text `#F7D774` on header and all cells (was white-on-weak-tint).
- **Section background rhythm** — StatsStrip `bg-foreground/[0.03]`, HowItWorks/Testimonials `bg-foreground/[0.02]` bands with borders, Community `bg-[#0a0a0a]` + border-t, FAQ `bg-muted`; breaks up the flat dark.
- **Hero gold radial glows** — added the two source radial-gradients that were missing (hero brightness now exceeds source).
- **Real payout certificate images** — replaced placeholder white PNGs with the 5 harvested postimg certs.
- **Dev-mode hydration fix** — `next.config.ts` `allowedDevOrigins: ["127.0.0.1","localhost"]`. Without it Next 16 blocked `127.0.0.1` dev resources, so **all** client interactions (tabs, accordion, toggles) silently failed in dev.
- **Dark theme default** — boot script no longer falls back to OS `prefers-color-scheme`; source is always dark.

## Working interactions
- [x] Sticky nav with glass blur on scroll
- [x] Mobile hamburger menu
- [x] Hero countdown (24h rolling, persisted via `localStorage`)
- [x] Pricing currency switcher (USD / GBP / EUR)
- [x] Challenge type tabs (Standard / Middleweight / 1-Step / Instant)
- [x] Account size selector (7 sizes)
- [x] Long/Short instrument toggle
- [x] Auto-scrolling payment marquee (dual direction, pauses on hover)
- [x] Payout certificate carousel (Embla, autoplay, draggable, dot nav)
- [x] Testimonial auto-rotation (6s, manual dots)
- [x] FAQ accordion (single-item-open)
- [x] In-view scroll reveals (Framer Motion)

### 2026-08-06 — DevOps / Coolify deployment
- **Repo:** `kimjoshuadr/ck-capital` (private). Branches: `main` → production, `staging` → staging.
- **Coolify:** 4.1.2 at coolify.fundedproptraders.com, server 178.105.229.60. Apps: `ck-capital:main` (production, `https://ckpropfirm.com`, running:healthy) + `ck-capital:staging` (staging env in Product project, `https://staging.ckpropfirm.com`, basic-auth protected).
- **Build:** custom `Dockerfile` (node:22-alpine, `output: "standalone"`, healthcheck) + `.dockerignore`. Env vars live in Coolify (STRAPI_BASE_URL, STRAPI_API_TOKEN read-only, REVALIDATE_SECRET).
- **CI:** `.github/workflows/ci.yml` — typecheck+build on PR/push; Playwright smoke against staging on `staging` branch (secrets `STAGING_URL`, `STAGING_BASIC_AUTH`).
- **Tests:** `tests/smoke.spec.ts` (route 200s, key sections, theme toggle, basic-auth guard).
- **Local:** `.env.local` uses the read-only Strapi token; standalone build verified locally.
- See `docs/devops.md` for the runbook.

## Content model
Most copy is typed in `lib/content.ts`. To update any text, price, FAQ, or testimonial, edit that file only — no JSX hunting required.

### 2026-08-06 — Strapi CMS integration
- **CMS:** `https://cms.fundedproptraders.com` (shared multi-brand Strapi v5; same operator). Token + base URL in `.env.local` (gitignored, server-only).
- **Client layer:** `lib/cms.ts` — typed fetchers with ISR (`revalidate = 300`), `"cms"` cache tag, 8s timeout, and graceful fallback to the static content model on any error. Import from server components/route handlers only.
- **Blog:** `/blog` + `/blog/[slug]` are server components fetching `article` filtered by brand `ck-capital` (`lib/cms.ts` `getArticles`/`getArticleBySlug`). Bodies render via `components/blog/BlocksRenderer.tsx` (Strapi v5 blocks). Sitemap appends article slugs. CK article tagged via brand relation; leftover test article excluded.
- **Reviews/videos/payouts/promos/banners/challenges:** home + layout fetch CMS and pass props to sections (`TraderReviews`, `Testimonials`, `PayoutCarousel`, `OffersStrip`, `AnnouncementBar`, `ChallengeComparison`). Each falls back to static content when the CMS type is missing/empty.
- **`challenge-config`:** single-type JSON overrides `CHALLENGE_RULES/PRICES/SPLITS/ACCESS` (deep-merged over static). Evaluation page converted to a server component (`EvaluationIntro` client component holds hero/steps).
- **Revalidate:** `app/api/revalidate/route.ts` — Strapi webhook (secret in `x-strapi-webhook-secret` header) → `revalidatePath` + `revalidateTag("cms", { expire: 0 })`.
- **Schemas to create in Strapi admin** (API tokens can't create content types): `promo`, `banner`, `payout`, `challenge-config`. See `docs/strapi-cms.md`.
- **2026-08-06 follow-up:** types created by user in admin; `challenge-config` seeded + published via API (PUT upsert; single-type create/publish POST routes aren't exposed to API tokens — publish via `PUT /api/challenge-config?status=published`). Seeded promo (JUN70), banner, 5 payouts (uploaded cert-1..5 to media lib), 6 firm reviews, 4 video reviews — all from the then-current static content. `firmSlug` unique constraint removed in admin to allow multiple entries. Site verified rendering all CMS content on `/`.
- Verified: `npm run build` clean; `/blog` shows the tagged CK article; article body renders all block types; revalidate route 401/200; unknown slug → 404.

---

## ⚠️ REPLACE BEFORE PUBLIC DEPLOY

This is a local learning clone. The following items **must** be replaced or cleared before any public deployment:

### Brand / IP
- [x] "CK Capital" name and "CK CAPITAL" wordmark removed / rebranded to CK Propfirm
- [ ] All testimonials are illustrative placeholders — replace with real, verifiable reviews or mark as "example"
- [x] Trustpilot badge and external trustpilot.com links completely removed
- [ ] Payment method logos (Visa, Mastercard, etc.) are trademarks — acceptable for "we accept" display only

### Tracking / analytics (already removed)
- Google Analytics (`gtag/js?id=G-TMM875YWHK`) — removed ✓
- Google Ads (`AW-18140473298`) — removed ✓
- Facebook Pixel (`1102958381163703`) — removed ✓
- Vercel Insights — removed ✓

### Legal copy (carry verbatim from source if you operate as a prop firm)
- [ ] "Simulated Trading Environment" disclaimer in footer
- [ ] "No Investment Services" disclaimer
- [ ] All regulatory / risk warnings — legally load-bearing if you present as a real prop firm

### Imagery
- Payout certificate cards are placeholder data — replace with real payout screenshots if you have them
- Platform mockups are SVG-generated — replace with real screenshots of MT5 / TradeLocker if available

### Functionality
- [ ] "Start Challenge" / "Start Now" buttons go nowhere — wire to your real checkout/onboarding URL
- [ ] "Sign In" is a dead link — wire to your auth provider (Supabase, Clerk, Auth0, etc.)
- [ ] Chat support button has no handler — wire to Intercom / Crisp / Tawk.to
- [ ] Affiliate links have `href="#"` — replace with real affiliate portal URL

---

## Fidelity score (self-assessed)
| Dimension | Score | Notes |
|---|---|---|
| Structure / layout | 9/10 | All 17 sections, correct order |
| Visual / colours | 9/10 | Exact hex tokens from recon; Inter font from `next/font` |
| Interactions | 8/10 | All stateful interactions working; no real auth/payment |
| Responsive | 9/10 | Mobile 390 / tablet 768 / desktop 1440 all tested |
| Content accuracy | 9/10 | Copy verbatim from source; testimonials and cert amounts are illustrative |
| Zero console errors | ✓ | Verified via recon-site.mjs clone scan |

### 2026-08-06 — Light-mode contrast + richness pass
- Tokens: `--card` solid white + visible border; `--primary-foreground` → dark `#1a1508` (dark-on-gold, same posture as dark theme; was white-on-gold ≈3.2:1, now ≈4.9:1); `--muted` band strengthened.
- Global light overrides (all pages): `.glow-card` warm-white + gold corner wash + soft gold shadow; `text-primary` → `#9a7a1c` (≈4.9:1 on cream) incl. `/50–/80` eyebrow labels; alpha ink text (`text-foreground/10–75`) remapped to solid warm neutrals ≥4.5:1; `bg-foreground/[0.02–0.08]` fills/chips/hover states bumped to visible warm tints; `.dark-panel` subtrees restored to dark blends (challenge table keeps gold-on-dark).
- `CommunityGrid` band `bg-[#0a0a0a]` → `bg-foreground/[0.03]` (theme-aware).
- Light shimmer + gradient-text stops deepened for AA.
- Verified via Playwright computed styles: cream body `#f8f4ea`, dark-on-gold primary button, warm section bands, gold preserved inside dark-panels; `npm run build` clean. Note: dev-mode React hydration mismatch on the theme-toggle icon is pre-existing (production build clean).

### 2026-08-06 — Dev console error fixes
- ThemeProvider hydration failure: SSR renders `dark`, but the boot script had already set `html.light` before client hydration, so the client initializer returned `light` → React regenerated the whole tree. Fixed by mount-guarding the theme state (null during SSR + first client render, resolved in an effect), so server DOM and hydrated tree always agree. Verified toggle still works + persists.
- Remaining dev-only warnings (React 19 + Next 16 dev): "Encountered a script tag" (next/script beforeInteractive) and "attributes didn't match" on the animated chart polyline — both confirmed absent in the production build (`npm run build && next start`: zero console/page errors). Production is clean.

### 2026-08-06 — Responsive QAQC (mobile + tablet)
- **Challenge table → stacked cards on mobile**: both the Phases table and Compare Sizes grid now render as vertical stacked cards below `md` (table/grid only at `md+`). Verified: 3 phase cards / 7 size cards on phone.
- **Fixed page-wide horizontal overflow**: SupportSection's framer-motion `x:30` entrance transform widened `document.documentElement` by 14px on every breakpoint. Global fix: `overflow-x: clip` on `html` (base layer) + `body`. Verified `scrollX` stays 0 and `scrollWidth == clientWidth` at 360/390/430/600/768/820/1024 on all pages.
- **Touch targets ≥44px**: ThemeToggle (was 28px), hamburger (was 36px), challenge tabs/currency/size pills, Show Numbers, Show Phases/Compare Sizes toggles all bumped to `min-h-11`. FAQ triggers already 54px. Verified via computed heights.
- **Tablet tuning**: desktop nav appears at lg (1024) with hamburger hidden; 2-col grids hold at 768; challenge table `min-w-[640px]` fits at 768. No overflow at 768/820/1024.

### 2026-08-06 — Favicon + Technical SEO setup
- **Favicon set** (generated from the brand logo via open-source `sharp` + `to-ico`): `favicon.ico` (16/32/48 multi-ICO), `favicon-16x16/32x32/48x48/192x192/512x512.png`, `apple-touch-icon.png` (180). Replaced Next default `app/favicon.ico`.
- **OG social card**: `public/og-image.jpg` rebuilt at 1200×630 — dark brand bg (#0b0a07), gold radial glows, white rounded logo tile, gold title "CK PROPFIRM", tagline, and Start Trading pill. `og-image.png` kept as source.
- **`app/sitemap.ts`**: 14 URLs under `https://ckpropfirm.com` with priority/changeFrequency.
- **`app/robots.ts`**: allow all, disallow `/api/` + `/_next/`, sitemap link.
- **`app/manifest.ts`**: PWA manifest (name, theme `#0b0a07`, icons 192/512/180).
- **`app/layout.tsx`**: `metadataBase` = ckpropfirm.com, `title.template` ("%s | CK Propfirm"), full icon set (favicon ico + pngs, apple-touch), OG/Twitter defaults + 1200×630 image, robots rules, manifest link, and JSON-LD `@graph` (Organization + WebSite) via inline `application/ld+json`.
- **Per-page metadata**: `lib/seo.ts` `pageSeo()` helper adds canonical + OG + Twitter. Added to all 13 content/policy pages (server `layout.tsx` wrappers for the 7 client-component pages; `pageSeo` in the 5 policy pages + FAQ). FAQ page also emits `FAQPage` JSON-LD (10 Q&As from source).
- Verified: sitemap/robots/manifest serve (200), correct per-page `<title>` everywhere, JSON-LD parses (Organization/WebSite/FAQPage), icons + og-image serve, `npm run build` clean.

---

### 2026-08-14 — Upcomers-style revamp — Phase 1 (homepage)

Executed `upcomers-revamp-plan.md` Phase 1. CK tokens/copy unchanged; only *how* effects are used changed. Git snapshot at `625c781`.

**New fx system** (`app/globals.css` + `components/fx/*`):
- `--brand-rgb: 212 175 55` (gold as rgb triplet for alpha compositing).
- **Aurora** (`components/fx/Aurora.tsx`, `.fx-aurora-a/b/core/dots`): layered gold radial glows with opacity-pulse keyframes (3.6s/4.6s/2.8s) + masked 24px dot grid; `variant="hero" | "section"`. Light-mode alpha ~50%; dot grid remapped to dark-on-cream.
- **Conic border-spin** (`@property --upc-angle` + `.fx-border-spin::before`): 4s orbiting gold ring via conic-gradient + mask-composite exclude. Used on exactly one element per viewport (hero popular pricing card + challenge Compare-Sizes $100K card).
- **Terminal choreography** (`components/fx/TerminalCard.tsx`, `term-line-in / term-type / term-caret / term-spark`): types the existing 18-line algo scripts line-by-line with clip-path reveal + blinking caret + ✦ spark, loops cleanly, pauses off-screen (`useInView`), renders statically under `prefers-reduced-motion`.
- **Live chart** (`components/fx/LiveChart.tsx`): progressing teal line (new points from the right every 800ms), `fx-chart-line` stroke remaps to `#0f766e` on light.
- **CountUp** (`components/fx/CountUp.tsx`): parses formatted values ("12H", "100%", "$100K") and counts up on in-view; SSR-safe + reduced-motion safe.
- **LivePayoutPill** (`components/fx/LivePayoutPill.tsx`): pulsing gold dot + honest static "Payouts processed in ~12 hours". Ticking-amount mode (`baseAmount`) exists but is OFF — needs an approved base figure (OQ-3).
- **Chip pop** (`fx-chip-in`) + **check draw** (`fx-check-draw`) keyframes; `.cv-auto` (`content-visibility`) utility.

**Homepage blueprint (S1→S10) in `app/page.tsx`:**
1. **Hero** — slides under the transparent nav (`-mt-[72px] md:-mt-[76px]`, verified heroTop=40, nav over hero), `Aurora hero+grid`, LivePayoutPill, kept CK H1/subcopy/feature bullets, single gold CTA "Start Your Challenge" + text link "See how it works ↓", popular pricing card gets `fx-border-spin`. Removed the countdown + "70% OFF" gold line (sale stays in the announcement bar + prices + promo chip).
2. **StatsStrip** — CountUp on the 4 honest stats (kept `TRUST_STATS`, incl. on `/evaluation`).
3. **WhyChooseUs** — asymmetric bento (6 cards): 100%-split card with CountUp + honest chips, trading-conditions card with live chart, + 4 standard cards, framer stagger reveals.
4. **HowItWorks** — numbered rows `01/02/03` with gold dots on a connecting hairline + aurora `section` behind.
5. **ChallengeComparison** — visual-only: universal-conditions chips ("Profit split up to 100%" / "Leverage 1:100" [source risk-disclosure] / "Payouts in ~12 hours"), `fx-check-draw` on access-list checks, `fx-border-spin` on the Compare-Sizes $100K card. **All interactions preserved** (verified tab switch, deep-link preselect, compare grid, mobile stacked cards).
6. **PayoutCarousel** — honest header (no invented $8.5M), hover-pause on both marquee rows, "✓ Verified payout" chip per cert.
7. **Testimonials** — play button gold-ring hover.
8. **CommunityGrid** — merged with the algo terminal: left community card ("Trade Smarter Together", 65k+ from content, Discord CTA), right TerminalCard.
9. **TraderReviews** — stagger reveal grid.
10. **ClosingCta** — new `min-h-[56vh]` finale, aurora hero (no grid), "Ready to trade CK's capital?" + single gold CTA.

Kept (not removed): PaymentsMarquee (after stats), TradingPlatforms (after challenge — earlier user request), SupportSection (before FAQ), FaqAccordion. Removed from homepage: OffersStrip (folded into S5 chips), InstrumentsShowcase standalone (absorbed into S3 bento chart + S8 terminal). File still exists for reference.

**Verification (Phase 1 gate):**
- `npm run build` clean (Next 16.2.12, zero TS errors).
- Playwright vs **production** (`next start`, port 3001): **24/24 checks** — dark default, hero slide-under (top 40px), aurora + border-spin live (conic angle mid-rotation), no overflow @1440/768/390, **zero console errors** (home/evaluation/light), challenge interactions (1-Step→2 cols, Compare Sizes grid, `?type=instant&size=$100K` deep-link preselect), light-mode cream bg + black-on-gold CTA (52px), reduced-motion terminal static.
- The dev-only "attributes didn't match" warning is the known React 19 artifact: server vs client chart `points` are **byte-identical** (969 chars) — confirmed false positive, absent in production.

**Open items (from plan §8):** OQ-1 hero H1 kept as existing CK copy; OQ-2 no verified payout total → honest framing kept; OQ-3 live-pill ticking amount OFF pending an approved base figure. Phases 2–4 (rollout to `/evaluation`, `/instant`, content pages, legal pages) not started.

---

### 2026-08-14 — Hero Three.js gold aurora field (Phase 1 follow-up)

**Correction to plan §1:** the earlier recon claiming upcomers.com has "zero canvas" was **wrong** — it has a full-viewport WebGL canvas in the hero (`absolute inset-0`, `webgl`, behind the copy; pixel analysis: dark base `meanRGB [51,37,86]`, ~25% bright pixels, cool purple nebula). Rebuilt as the CK equivalent with Three.js.

**New: `components/fx/HeroField.tsx`** (`three@0.185`, `@types/three@0.185` — new deps, deliberate deviation from the "no new dependencies" guardrail since the user explicitly asked for a Three.js hero):
- Three additive ShaderMaterial particle clouds (diffuse gold nebula + tighter bright core + cream highlights) drifting via `sin/cos` flow in the vertex shader, gold→amber depth colors from the CK palette.
- Mouse parallax (lerped group rotation), slow ambient spin, full-viewport, adaptive particle count + pixel-ratio clamp.
- Theme-aware: **hidden + paused in light mode** (MutationObserver on `html` class; the CSS aurora's light remaps take over). `prefers-reduced-motion` → one static frame, no loop. WebGL unavailable → CSS aurora fallback. Full dispose on unmount.
- Integrated in `Hero.tsx` via `next/dynamic` `ssr:false` (three lazy-loaded out of the main bundle), z-order: `HeroField (z-0) → Aurora (z-[1]) → content (z-10)`.

**Verified (production, 11/11):** WebGL canvas full hero size + zero console errors on dark/light/reduced-motion/mobile; light hides the canvas (opacity 0) with CSS aurora intact; reduced-motion renders a static frame; no overflow at 390. Hero screenshot pixel analysis confirms visible warm gold field (`meanRGB [52,45,22]`, ~96k gold highlight pixels). Dev server serves the lazy chunk with only the known pre-existing dev-only hydration artifact (absent in production).

**⚠️ Environment gotcha:** this runtime exports `NODE_ENV=production`, which makes npm default to `omit=dev` — a plain `npm install`/`npm ci` silently skips all devDependencies (`tailwindcss`, `@tailwindcss/postcss`, `typescript`, `@playwright/test`, `@types/*`), breaking `next build`. Always use **`npm ci --include=dev`** (or `NODE_ENV= npm ci`) in this shell. This bit during the `three` install (which pruned `@tailwindcss/postcss`); resolved with `npm ci --include=dev`.

**Fix (same day): reduced-motion hydration error.** `TerminalCard` branched its render on `useReducedMotion()` — true on the client under `prefers-reduced-motion`, null during SSR — so the server rendered the 18 lines at `opacity:0` while the reduced-motion client rendered them at `opacity:1` → React error #418 (hydration). Fixed by mount-guarding `staticMode = mounted && reduceMotion` (resolved in an effect), so the client's first render matches the server and the static full-script view appears after mount. Also removed a leftover duplicate `const staticMode` declaration. **Final production gate: 19/19 checks pass** (WebGL hero, challenge interactions, deep-links, overflow at 1440/768/390, light mode, reduced motion, `/evaluation`) with **zero console/page errors including reduced-motion**.

---

### 2026-08-14 — Award-winning hero cinematics (hero-cinematics-plan.md)

Locked (plan-brief): column skyline matured · parallax-fade hand-off · full 2.2s entrance · full ambient loops · parallax-only pointer.

**`components/fx/HeroField.tsx` (rewritten):**
- **Camera choreography:** expo-out entrance dolly (0,4.2,22)→(0,5,18) over 2s; scroll dolly forward+up (z−4, y+1.4) + fog density 0.018→0.03 as the hero scrolls away; smoothed mouse orbit (parallax only); gentle ambient bob.
- **Gold dust particles:** additive Points shader field (~320 desktop / 120 mobile), upward drift + twinkle via `mod()` wrap and `sin` alpha, brand golds.
- **Scene craft:** breathing grid rotation (sin, 0.02 rad), per-column sway, pulsing point glow (starts as intro runs), slow teal rim glow orbiting behind the grid, ground-glow radial plane under the columns, row-depth height fade for back rows (misty skyline), emissive tint on gold materials.
- **Mobile profile:** 5×4 columns, DPR ≤1.5, 120 particles. IntersectionObserver pauses the loop off-screen (battery). Reduced-motion → one static frame. Light → hidden + paused. Full dispose.

**`components/sections/Hero.tsx` (rewritten):**
- Staged 2.2s entrance: pill (0.30) → H1 word-mask (line1 0.45 + 0.04/word, line2 0.62) → subcopy (0.85) → CTA (1.00) → feature chips (1.15 + stagger) → pricing cards (1.25 + 0.12 stagger) → ticker (1.70). Mask reveals via `overflow-hidden` inline-blocks + `y:115%→0`.
- Scroll-linked parallax (`useScroll` + `useTransform`, offset `start start → end start`): copy y−80/opacity→0, WebGL y+40, glows y+120/opacity→0.6, dots y+70, ticker fades by 0.92.
- **`components/fx/MagneticWrapper.tsx`** (new): primary CTA follows cursor ≤6px (spring), disabled on touch/reduced-motion.
- **`fx-sheen`** one-shot gold sweep across the primary CTA at 1.5s; **`fx-pill-bump`** micro-bump on the live-pill dot when the ticker increments.
- `MarketTicker` accepts `revealDelay` (entrance slide-up). `MotionConfig reducedMotion="user"` wraps the hero.

**Verification (production, 15/15):** WebGL canvas 1440×856, entrance completes (h1 + cards + ticker visible), word-mask wrappers present (8), copy parallax active after scroll (opacity 0.026 at y500), no overflow @1440/390, **zero console errors**, reduced-motion static + clean, light hides canvas, deep-link `?type=instant&size=$100K` preselects. Nav transparent over hero → solid on scroll (unchanged).

**Environment note:** forcing `NODE_ENV=development npm run build` breaks prerender of `/_global-error`+`/about-us` (dev-mode react-diff artifacts) — always use the plain `npm run build`.

---

### 2026-08-14 — Hero cinematics Rev 2: nebula hybrid + passive motion + contrast hardening (hero-cinematics-plan.md §4–§6)

Locked from plan-brief answers (OQ-6→OQ-9): columns + nebula hybrid · all four contrast targets · "alive" passive motion · pointer/scroll retained as secondary layers. Git snapshot `1d730b5`.

**`components/fx/HeroField.tsx`:**
- **Nebula field** (`buildNebula`, Rev 2 centerpiece): fullscreen ShaderMaterial quad at z=−40 (deepest layer, `depthWrite:false`, no fog), domain-warped fbm (3 octaves mobile / 5 desktop) driven by a `uTime` clock uniform — full morph cycle ≈50s, flow visible within ~5s. Gold ramp `#8a6410→#d4af37→#f5d570` + teal `#14b8a6` fringe at ≤15% blend. Vignette grounds the edges. **Luminance budget:** output scaled ×0.75 and pixel-verified columns stay the brightest element (columns ~188 vs nebula ~6 in readback).
- **Quiet zone** (the contrast engine): screen-space smooth mask (`uQuietCenter/uQuietSize/uQuietStrength`, no DOM overlay, no hard edge) dims nebula 40–55% + thins stream B density behind the copy block — left ~55% of frame desktop, upper band mobile. Tracks layout breakpoint at build.
- **Autonomous camera drift** (`renderFrame(simT)` refactor): non-harmonic 26s/34s/48s clock loops (x ±0.6 / y ±0.35 / z ±0.4), amplitude ramps 0→full over 1s after the 2s entrance. Pointer parallax reduced to ±0.8/±0.5 and scroll dolly summed on top — composed, never fighting.
- **Particle stream B**: sparse second Points cloud drifting laterally along the nebula current (0.15 units/s wrap-around), additive, quiet-zone-thinned.
- Render loop now a pure `renderFrame(simT)`; reduced-motion renders one static composed frame at simT=12s (nebula frozen mid-flow); resize updates nebula `uResolution/uAspect`; dispose extended to `THREE.Points`.

**Contrast layer (§5) — `Hero.tsx`, `LivePayoutPill.tsx`, `MarketTicker.tsx`, `app/globals.css`:**
- **Copy scrim** (`.fx-copy-scrim`): radial `--background @55%` behind the copy, bleeds 4–14 inset, travels at the copy column's rate (same parallax transform) so it can never detach. Token-driven → auto-cream in light mode.
- **Copy insurance** (`.fx-copy-shadow`): `0 2px 24px rgb(11 10 15 / .45)` on H1 + subcopy; light remaps to cream halo.
- **CTA plate + halo** (`.fx-cta-plate`): 16px-radius plate `--background @40%` + backdrop-blur + `1px rgb(212 175 55 / .35)` ring + gold shadow. Button never touches raw scene pixels. Hover sheen (`fx-sheen-hover::before`, transition-based, reduced-motion-disabled) on top of the existing entrance sheen.
- **Pricing cards**: heavier glass — `--background-secondary @72%` + `backdrop-blur-md` (popular card keeps its dark gradient + border-spin).
- **Pill**: solid chip `--background @80%` + blur + `border-primary/25` (was gold-on-gold-tint). **Ticker**: grounding band `--background @65%` + `backdrop-blur-md`.

**Also:** fixed a pre-existing `MarketTicker` hydration mismatch (moved to `initial="hidden"`/`animate="show"` variants so it agrees with the server under `MotionConfig reducedMotion="user"`). The remaining dev-only hydration warning is the known `LiveChart` polygon artifact (WhyChooseUs, byte-identical server/client points, absent in production — pre-existing, out of scope).

**Verification:** `npm run build` clean. Dev (Edge) — idle drift with **zero input** at 1440 and 390 (`skyA≠skyB` across 1.5s), reduced-motion static (loop frozen, scene present, sky luma ≈53), nebula warm gold behind the columns, columns remain brightest, no overflow @1440/390, no WebGL/shader errors (`gl.getError=0`), no hero hydration warnings. **Production** (`next start`) — dark 1440 + tablet 768 drift active / no overflow / **zero console errors**; light mode hides the canvas (parentOpacity 0) and the scrim/plate remap to cream (oklab L≈0.96) via token `color-mix`.

---

### 2026-08-14 — Hero Rev 3: organic aurora scene (user redesign)

**User direction:** "no major movement, the bars are just bricks of yellow" → the rigid gold column skyline was **removed** and replaced with an organic, continuously-flowing composition. This supersedes OQ-1 (column skyline).

**`components/fx/HeroField.tsx` (rewritten scene):**
- **Aurora-silk ribbons (signature):** 5 flowing sheets (3 mobile) — wide `PlaneGeometry(≈42×12, 128×1)` with vertices displaced by **layered traveling waves** in the vertex shader (3 sine components per ribbon, per-ribbon freq/speed/amp/phase). Amplitudes ≈0.6–1.7 units, speeds ≈0.8–2.1 rad/s → crests visibly travel. Additive gold (`#d4af37→#f5d570` core, fading edges), teal ≤15% on two sheets, per-ribbon breathing opacity, quiet-zone-dimmed behind the copy via `gl_FragCoord` mask. Positioned z≈−4…−14 with slight y-rotations so the sheets cross for depth.
- **Deep nebula base (kept, enriched):** larger noise cells (scale 3.0), faster flow (`uTime*0.07` + slow rotation), alpha floor 0.16 so the field always reads; vignette + quiet zone + teal fringe ≤15% kept.
- **Gold dust (kept, denser):** 420 desktop / 160 mobile, faster upward drift (0.5), opacity 0.85.
- **Stream B (kept):** lateral wrap flow, more visible (0.35).
- **Camera reframe:** FOV 50, rest (0, 3.2, 16), lookAt (0, 1.8, 0) — frames the ribbons; entrance dolly + 26/34/48s drift + scroll dolly + parallax (±0.6/±0.4) retained. Column grid, floor, lights, env map all removed (scene is now fully shader-lit/additive).

**Measured (Playwright readback, idle, zero input):** `mean |ΔRGB| ≈ 13.7 / 0.5s` (was ~0 with the static bricks) — major, continuous motion; luminance distribution P10=6 / P50=20 / P90=42 — dark valleys + gold peaks, not a wash. Drift confirmed @1440 and 390; reduced-motion static frame; no overflow; `npm run build` clean; no shader/WebGL errors.

**Uncommitted** — working tree (HeroField.tsx + docs) ready for a snapshot when approved.
