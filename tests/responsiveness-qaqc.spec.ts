import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

interface ScreenProfile {
  name: string;
  category: "Extreme Narrow" | "Mobile" | "Foldable / Squarish" | "Tablet" | "Landscape Mobile / Short" | "Desktop" | "Vertical Pivot" | "Ultrawide / 4K";
  width: number;
  height: number;
  takeScreenshot?: boolean;
}

const SCREEN_PROFILES: ScreenProfile[] = [
  // 1. Extreme Narrow & Foldables (Cover screen)
  { name: "Galaxy Fold 1 Outer", category: "Extreme Narrow", width: 280, height: 653, takeScreenshot: true },
  { name: "iPhone SE (Legacy Narrow)", category: "Extreme Narrow", width: 320, height: 568, takeScreenshot: true },
  { name: "Galaxy Z Fold 5 Cover", category: "Extreme Narrow", width: 344, height: 882, takeScreenshot: true },
  { name: "iPhone 8 / SE2", category: "Extreme Narrow", width: 375, height: 667 },

  // 2. Modern Standard Mobile
  { name: "iPhone 14/15", category: "Mobile", width: 390, height: 844 },
  { name: "Pixel 7 / Galaxy S23", category: "Mobile", width: 412, height: 915 },
  { name: "iPhone 15 Pro Max", category: "Mobile", width: 430, height: 932, takeScreenshot: true },

  // 3. Foldables Unfolded & Squarish
  { name: "Surface Duo (Single Screen)", category: "Foldable / Squarish", width: 540, height: 720, takeScreenshot: true },
  { name: "Galaxy Z Fold Unfolded", category: "Foldable / Squarish", width: 768, height: 1076, takeScreenshot: true },
  { name: "Pixel Fold Unfolded", category: "Foldable / Squarish", width: 884, height: 1104, takeScreenshot: true },

  // 4. Tablets & Hybrids
  { name: "iPad Mini Portrait", category: "Tablet", width: 768, height: 1024 },
  { name: "iPad Air Portrait", category: "Tablet", width: 820, height: 1180 },
  { name: "iPad Landscape", category: "Tablet", width: 1024, height: 768 },
  { name: "iPad Pro 12.9 Landscape", category: "Tablet", width: 1366, height: 1024, takeScreenshot: true },

  // 5. Short Height & Landscape Mobile
  { name: "Landscape Phone Short", category: "Landscape Mobile / Short", width: 844, height: 390, takeScreenshot: true },
  { name: "Kiosk / In-Car Screen", category: "Landscape Mobile / Short", width: 1024, height: 500, takeScreenshot: true },
  { name: "Ultrawide Vehicle Display", category: "Landscape Mobile / Short", width: 1280, height: 480, takeScreenshot: true },

  // 6. Laptops & Standard Desktop
  { name: "MacBook Air 13", category: "Desktop", width: 1280, height: 800 },
  { name: "Standard 1080p FHD", category: "Desktop", width: 1920, height: 1080, takeScreenshot: true },

  // 7. Vertical / Pivot Displays (Trading / Coding Setups)
  { name: "Vertical FHD Pivot", category: "Vertical Pivot", width: 1080, height: 1920, takeScreenshot: true },
  { name: "Vertical 2K Pivot", category: "Vertical Pivot", width: 1440, height: 2560, takeScreenshot: true },

  // 8. Ultrawide & 4K Displays
  { name: "2K QHD Display", category: "Ultrawide / 4K", width: 2560, height: 1440 },
  { name: "21:9 Curved Ultrawide", category: "Ultrawide / 4K", width: 3440, height: 1440, takeScreenshot: true },
  { name: "32:9 Super Ultrawide", category: "Ultrawide / 4K", width: 5120, height: 1440, takeScreenshot: true },
  { name: "4K UHD Display", category: "Ultrawide / 4K", width: 3840, height: 2160, takeScreenshot: true },
];

const OUTPUT_DIR = path.join(process.cwd(), "test-results", "qaqc-screenshots");

test.beforeAll(() => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
});

test.describe("QAQC Responsiveness & Cross-Screen Inspection", () => {
  for (const screen of SCREEN_PROFILES) {
    test(`[${screen.category}] ${screen.name} (${screen.width}x${screen.height})`, async ({ page }) => {
      // 1. Set viewport
      await page.setViewportSize({ width: screen.width, height: screen.height });

      // 2. Navigate
      await page.goto("/en", { waitUntil: "domcontentloaded" });

      // 3. Check for unintended horizontal scrollbars (page overflow)
      const overflowMetrics = await page.evaluate(() => {
        const docEl = document.documentElement;
        const scrollWidth = docEl.scrollWidth;
        const clientWidth = docEl.clientWidth;
        const innerWidth = window.innerWidth;
        const hasOverflow = scrollWidth > innerWidth + 2;

        let overflowingElements: string[] = [];
        if (hasOverflow) {
          const allElements = document.querySelectorAll("*");
          allElements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > innerWidth + 2) {
              const tag = el.tagName.toLowerCase();
              const id = el.id ? `#${el.id}` : "";
              const cls = el.className && typeof el.className === "string" ? `.${el.className.split(" ")[0]}` : "";
              overflowingElements.push(`${tag}${id}${cls} (right: ${Math.round(rect.right)}px vs innerWidth: ${innerWidth}px)`);
            }
          });
        }

        return {
          scrollWidth,
          clientWidth,
          innerWidth,
          hasOverflow,
          overflowingElements: overflowingElements.slice(0, 5),
        };
      });

      expect(
        overflowMetrics.hasOverflow,
        `Horizontal overflow detected on ${screen.name} (${screen.width}x${screen.height}): scrollWidth=${overflowMetrics.scrollWidth} > innerWidth=${overflowMetrics.innerWidth}. Overflow elements: ${overflowMetrics.overflowingElements.join(", ")}`
      ).toBe(false);

      // 4. Inspect What's New Section
      const whatsNew = page.locator('[data-od-id="whats-new-section"]');
      await expect(whatsNew).toBeVisible();

      // Scroll section into view
      await whatsNew.scrollIntoViewIfNeeded();

      // Verify section boundaries stay within viewport width
      const whatsNewBox = await whatsNew.boundingBox();
      expect(whatsNewBox).not.toBeNull();
      if (whatsNewBox) {
        expect(whatsNewBox.width).toBeGreaterThan(0);
        expect(whatsNewBox.x).toBeGreaterThanOrEqual(0);
        expect(whatsNewBox.x + whatsNewBox.width).toBeLessThanOrEqual(screen.width + 2);
      }

      // 5. Verify Tabs strip & pill buttons
      const tabs = whatsNew.locator('button[role="tab"]');
      const tabCount = await tabs.count();
      expect(tabCount).toBe(3);

      // Verify active tab is highlighted
      const firstTab = tabs.nth(0);
      await expect(firstTab).toHaveAttribute("aria-selected", "true");

      // Verify banner image is rendered with natural dimensions
      const bannerImg = whatsNew.locator('img[alt*="CK Propfirm"]').first();
      await expect(bannerImg).toBeVisible();
      const imgLoaded = await bannerImg.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
      expect(imgLoaded, "Banner image failed to load or has 0 natural width").toBe(true);

      // 6. Test Interactive Tab Switching on this screen size
      const secondTab = tabs.nth(1);
      await secondTab.click();
      await page.waitForTimeout(400); // Allow framer-motion transition

      await expect(secondTab).toHaveAttribute("aria-selected", "true");
      await expect(firstTab).toHaveAttribute("aria-selected", "false");

      const leverageImg = whatsNew.locator('img[alt*="1:100 Leverage"]').first();
      await expect(leverageImg).toBeVisible();

      // Switch to third tab
      const thirdTab = tabs.nth(2);
      await thirdTab.click();
      await page.waitForTimeout(400);

      await expect(thirdTab).toHaveAttribute("aria-selected", "true");
      const labsImg = whatsNew.locator('img[alt*="CK Labs"]').first();
      await expect(labsImg).toBeVisible();

      // 7. Navigation bar check
      if (screen.width < 1280) {
        // Mobile / tablet: mobile menu trigger should exist
        const mobileMenu = page.locator('[data-od-id="mobile-menu-trigger"]');
        await expect(mobileMenu).toBeVisible();
      } else {
        // Desktop: main navigation links should be visible
        const navLinks = page.locator('[data-od-id="nav-links"]');
        await expect(navLinks).toBeVisible();
      }

      // 8. Capture targeted visual snapshot if specified
      if (screen.takeScreenshot) {
        const safeName = screen.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const filename = path.join(OUTPUT_DIR, `${safeName}-${screen.width}x${screen.height}.png`);
        await whatsNew.screenshot({ path: filename });
      }
    });
  }
});
