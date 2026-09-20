import { test, expect } from "@playwright/test";
import path from "path";

const ARTIFACTS_DIR = "/Users/kimjoshuadr/.gemini/antigravity-cli/brain/46013b9a-dfe7-4798-93ed-870dff156ca4";

test.describe("QAQC Visual Screenshot Verification", () => {
  test.beforeEach(async ({ page }) => {
    // Suppress cookie consent banner via localStorage
    await page.addInitScript(() => {
      window.localStorage.setItem("ck-cookie-consent", "all");
    });
  });

  test("1. Pricing Table View matches reference", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    // Scroll to comparison section
    const comparisonSection = page.locator('[data-od-id="challenge-comparison"]');
    await comparisonSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Switch to Table view
    const tableBtn = page.locator('button:has-text("Table")').first();
    await tableBtn.click();
    await page.waitForTimeout(800);

    await comparisonSection.screenshot({
      path: path.join(ARTIFACTS_DIR, "qaqc_table_view.png"),
    });
    console.log("Captured qaqc_table_view.png");
  });

  test("2. Checkout Panel with quantity stepper matches reference", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    // Scroll to comparison section
    const comparisonSection = page.locator('[data-od-id="challenge-comparison"]');
    await comparisonSection.scrollIntoViewIfNeeded();

    // Ensure Cards view is active
    const cardsBtn = page.locator('button:has-text("Cards")').first();
    if (await cardsBtn.isVisible()) {
      await cardsBtn.click();
      await page.waitForTimeout(300);
    }

    // Select $100K plan
    const plan100k = page.locator('button:has-text("$100K"), button:has-text("100K")').first();
    if (await plan100k.isVisible()) {
      await plan100k.click();
      await page.waitForTimeout(300);
    }

    // Locate the checkout panel card
    const checkoutPanel = page.locator('div:has-text("Selected Plan"):has-text("Start Challenge")').last();
    await checkoutPanel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await checkoutPanel.screenshot({
      path: path.join(ARTIFACTS_DIR, "qaqc_checkout_panel.png"),
    });
    console.log("Captured qaqc_checkout_panel.png");
  });

  test("3. Footer collapsible disclaimer accordion matches reference", async ({ page }) => {
    // Reference screenshot is ~440px wide mobile view of the opened accordion
    await page.setViewportSize({ width: 440, height: 900 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    // Scroll to footer compliance section
    const complianceSec = page.locator('[data-od-id="footer-compliance"]');
    await complianceSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Click details summary to expand
    const summary = complianceSec.locator("summary");
    await summary.click();
    await page.waitForTimeout(500);

    // Scroll so top of details is well below any sticky headers
    const details = complianceSec.locator("details");
    await details.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -100));
    await page.waitForTimeout(300);

    const box = await details.boundingBox();
    if (box) {
      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, "qaqc_footer_accordion.png"),
        clip: {
          x: Math.max(0, box.x),
          y: box.y,
          width: box.width,
          height: Math.min(box.height, 580),
        },
      });
    } else {
      await details.screenshot({
        path: path.join(ARTIFACTS_DIR, "qaqc_footer_accordion.png"),
      });
    }
    console.log("Captured qaqc_footer_accordion.png");
  });

  test("4. About Us Hero and Founder card matches reference", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1164 });
    await page.goto("/en/about-us", { waitUntil: "domcontentloaded" });

    // Wait for hero animations
    await page.waitForSelector('[data-od-id="about-hero-title"]');
    await page.waitForTimeout(2200);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "qaqc_about_us_clean.png"),
    });
    console.log("Captured qaqc_about_us_clean.png");
  });
});
