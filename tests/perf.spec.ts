import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "320", width: 320, height: 568 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
] as const;

const ROUTES = [
  "/en",
  "/en/evaluation",
  "/en/trading-objectives",
  "/en/payouts",
  "/en/symbols",
  "/en/blog",
  "/en/about-us",
] as const;

test.describe("perf + responsive — no horizontal overflow", () => {
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`no overflow ${vp.name} — ${route}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);
        const overflow = await page.evaluate(() => {
          const de = document.documentElement;
          return { scrollW: de.scrollWidth, clientW: de.clientWidth, innerW: window.innerWidth };
        });
        expect(
          overflow.scrollW,
          `horizontal overflow at ${vp.name} on ${route}: scrollW ${overflow.scrollW} > innerW ${overflow.innerW}`
        ).toBeLessThanOrEqual(overflow.innerW + 1);
      });
    }
  }

  test("prefers-reduced-motion — animations still render without motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en", { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await expect(page.locator('[data-od-id="top-nav"]')).toBeVisible();
    await expect(page.locator('[data-od-id="site-footer"]')).toBeVisible();
    // Main content — allow either main or hero/closing-cta as proof of render
    const hasMain = await page.locator("main").count();
    if (hasMain) await expect(page.locator("main").first()).toBeVisible();
    else await expect(page.locator('[data-od-id="hero"], [data-od-id="closing-cta"]').first()).toBeVisible();
  });

  test("homepage loads within perf budget (domcontentloaded < 10s)", async ({ page }) => {
    const start = Date.now();
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(10_000);
  });
});
