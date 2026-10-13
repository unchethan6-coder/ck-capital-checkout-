import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "https://staging.ckpropfirm.com";

const PUBLIC_ROUTES = ["/", "/evaluation", "/instant", "/blog", "/faq", "/about-us", "/contact"];

test.describe("staging smoke", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`GET ${route} responds 200 with site content`, async ({ request }) => {
      const res = await request.get(route);
      expect(res.status()).toBe(200);
      const body = await res.text();
      expect(body).toContain("CK Propfirm");
    });
  }

  test("homepage renders key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-od-id="hero"]')).toBeVisible();
    await expect(page.locator('[data-od-id="challenge-comparison"]')).toBeVisible();
    await expect(page.locator('[data-od-id="site-footer"]')).toBeVisible();
  });

  test("pricing table renders a challenge price", async ({ page }) => {
    await page.goto("/#start-challenge");
    await expect(page.locator('[data-od-id="challenge-table"]')).toBeVisible();
  });

  test("dark theme is active and support launcher renders", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
    const launcher = page.locator('[data-od-id="support-launcher"]');
    await expect(launcher).toBeVisible();
  });

  test("staging is protected by basic auth (401 without credentials)", async () => {
    const res = await fetch(`${BASE}/`, { redirect: "manual" });
    expect(res.status).toBe(401);
  });
});
