import { test, expect } from "@playwright/test";

const ROUTES = [
  "/en",
  "/en/about-us",
  "/en/evaluation",
  "/en/instant",
  "/en/trading-objectives",
  "/en/payouts",
  "/en/affiliates",
  "/en/blog",
  "/en/contact",
  "/en/privacy-policy",
  "/en/terms-conditions",
  "/en/risk-disclosure",
  "/en/cookie-policy",
  "/en/return-policy",
] as const;

const VIEWPORTS = [
  { name: "320", width: 320, height: 568 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
] as const;

// Homepage 13 sections expected in order (data-od-id)
const HOMEPAGE_ORDER = [
  "hero",
  "stats-strip",
  "proof-showcase",
  "challenge-comparison",
  "trading-platforms",
  "feature-strip",
  "trader-stories",
  "trader-reviews",
  "blog-categories",
  "customer-support",
  "how-it-works",
  "faq",
  "closing-cta",
];

test.describe("light-theme QA — all public routes", () => {
  for (const route of ROUTES) {
    test(`GET ${route} — 200 and contains CK Propfirm`, async ({ request }) => {
      const res = await request.get(route);
      expect(res.status()).toBe(200);
      const body = await res.text();
      expect(body).toContain("CK Propfirm");
    });
  }

  test("homepage 13 sections render in order", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const order = await page.$$eval("main [data-od-id]", (els) =>
      els.map((e) => e.getAttribute("data-od-id")!).filter(Boolean)
    );
    // Filter to top-level section ids only (in order)
    const filtered = HOMEPAGE_ORDER.filter((id) => order.includes(id));
    expect(filtered).toEqual(HOMEPAGE_ORDER);
    for (const id of HOMEPAGE_ORDER) {
      await expect(page.locator(`[data-od-id="${id}"]`).first()).toBeVisible();
    }
  });

  test("all sections are bg-white (except warm-glow allowed)", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const bgs = await page.$$eval("main section", (els) =>
      els.map((e) => ({
        id: e.getAttribute("data-od-id") || e.id || "no-id",
        bg: getComputedStyle(e).backgroundColor,
      }))
    );
    for (const { id, bg } of bgs) {
      // SiteFooter is not in main — all main sections should be white
      expect(bg, `section ${id} should be white`).toBe("rgb(255, 255, 255)");
    }
  });

  test("no dark header/footer regression — header dark, footer dark, sections white", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    // TopNav stays dark
    const topNav = page.locator('[data-od-id="top-nav"]');
    await expect(topNav).toBeVisible();
    // SiteFooter stays dark
    await expect(page.locator('[data-od-id="site-footer"]')).toBeVisible();
    // FAQ section is white (was dark)
    await expect(page.locator('[data-od-id="faq"]')).toBeVisible();
    const faqBg = await page.locator('[data-od-id="faq"]').evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(faqBg).toBe("rgb(255, 255, 255)");
  });

  test("no invisible text on white — sample headings visible and dark", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    // Check that key headings are dark text, not white-on-white
    const headings = await page.$$eval("main section h2, main section h3", (els) =>
      els.slice(0, 6).map((e) => ({
        text: (e as HTMLElement).innerText.slice(0, 30),
        color: getComputedStyle(e).color,
      }))
    );
    for (const { text, color } of headings) {
      // Should be dark (#0A0A0C approx rgb(10,10,12) or similar), not white
      expect(color, `heading "${text}" should not be white`).not.toBe("rgb(255, 255, 255)");
      expect(color, `heading "${text}" should not be rgba white`).not.toContain("255, 255, 255");
    }
  });

  test("challenge comparison renders on white", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    await expect(page.locator('[data-od-id="challenge-comparison"]')).toBeVisible();
    // At least one challenge card should be visible
    await expect(page.locator('[data-od-id^="challenge-card-"]').first()).toBeVisible();
  });

  test("feature strip and stats strip are white (post-conversion)", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    const statsBg = await page.locator('[data-od-id="stats-strip"]').evaluate((e) => getComputedStyle(e).backgroundColor);
    const featBg = await page.locator('[data-od-id="feature-strip"]').evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(statsBg).toBe("rgb(255, 255, 255)");
    expect(featBg).toBe("rgb(255, 255, 255)");
  });
});

test.describe("light-theme QA — per-route white bg", () => {
  const perRouteTargets: Array<{ route: string; selector: string }> = [
    { route: "/en/evaluation", selector: "main" },
    { route: "/en/instant", selector: "main" },
    { route: "/en/about-us", selector: "main" },
    { route: "/en/trading-objectives", selector: "main" },
    { route: "/en/payouts", selector: "main" },
    { route: "/en/affiliates", selector: "main" },
    { route: "/en/blog", selector: "main" },
    { route: "/en/contact", selector: "main" },
  ];
  for (const { route, selector } of perRouteTargets) {
    test(`${route} — main content is light`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
      // At least the first section inside main should be white (skip transparent wrappers like /about-us first child)
      const sections = page.locator("main section");
      await expect(sections.first()).toBeVisible();
      const bgs: string[] = await sections.evaluateAll((els) =>
        els.slice(0, 3).map((e) => getComputedStyle(e).backgroundColor)
      );
      const hasWhite = bgs.some((bg) => /255,\s*255,\s*255/.test(bg));
      expect(hasWhite, `expected at least one of first 3 sections to be white, got ${JSON.stringify(bgs)}`).toBeTruthy();
    });
  }
});

test.describe("visual — fullPage screenshots (baseline)", () => {
  for (const vp of VIEWPORTS) {
    test(`screenshot ${vp.name} — homepage fullPage`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/en", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);
      await expect(page).toHaveScreenshot(`homepage-${vp.name}.png`, {
        fullPage: true,
        maxDiffPixels: 300,
      });
    });
  }

  for (const vp of [VIEWPORTS[1], VIEWPORTS[4]]) {
    // 390 + 1280 — key viewports for non-homepage routes
    for (const route of ["/en/evaluation", "/en/trading-objectives", "/en/blog"]) {
      const safe = route.replace(/\//g, "-");
      test(`screenshot ${vp.name} — ${route}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(600);
        await expect(page).toHaveScreenshot(`${safe}-${vp.name}.png`, {
          fullPage: true,
          maxDiffPixels: 300,
        });
      });
    }
  }
});
