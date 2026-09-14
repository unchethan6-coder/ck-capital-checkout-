import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "https://staging.ckcapital.co.uk";

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

  test("theme toggle switches dark/light", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('button[role="switch"]').first();
    await expect(toggle).toBeVisible();
    const html = page.locator("html");
    const before = await html.getAttribute("class");
    await toggle.click();
    await page.waitForTimeout(300);
    const after = await html.getAttribute("class");
    expect(after).not.toBe(before);
  });

  test("staging is protected by basic auth (401 without credentials)", async () => {
    const res = await fetch(`${BASE}/`, { redirect: "manual" });
    expect(res.status).toBe(401);
  });
});
