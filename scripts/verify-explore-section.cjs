const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Prevent newsletter popup overlay from interfering with screenshots
  await context.addCookies([
    {
      name: "ck_newsletter_popup_dismissed",
      value: "true",
      domain: "127.0.0.1",
      path: "/",
    },
  ]);

  // Prevent cookie banner overlay from interfering with screenshots
  await context.addInitScript(() => {
    window.localStorage.setItem("ck-cookie-consent", "all");
  });

  const page = await context.newPage();

  const url = process.env.BASE_URL || "http://127.0.0.1:3001/en";
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: "networkidle" });

  const section = page.locator('[data-od-id="challenge-types"]');
  await section.waitFor({ state: "visible", timeout: 15000 });
  await section.scrollIntoViewIfNeeded();

  const outDir = path.resolve("./screenshots");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. Desktop (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);
  await section.screenshot({ path: path.join(outDir, "explore-desktop.png") });

  // Also capture the combined section (Explore + What's New + Challenge Selection)
  const compSection = page.locator('[data-od-id="challenge-comparison"]');
  await compSection.screenshot({ path: path.join(outDir, "combined-desktop.png") });

  // 2. Tablet (768x1024)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  await section.screenshot({ path: path.join(outDir, "explore-tablet.png") });

  // 3. Mobile (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await section.screenshot({ path: path.join(outDir, "explore-mobile.png") });

  // 4. Arabic RTL Test
  await page.goto(url.replace("/en", "/ar"), { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const arSection = page.locator('[data-od-id="challenge-types"]');
  await arSection.waitFor({ state: "visible", timeout: 15000 });
  await arSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await arSection.screenshot({ path: path.join(outDir, "explore-arabic-rtl.png") });

  console.log("All screenshots saved to ./screenshots/");
  await browser.close();
}

main().catch(console.error);
