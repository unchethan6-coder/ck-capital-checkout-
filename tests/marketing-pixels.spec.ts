import { test, expect } from "@playwright/test";

test.describe("Marketing Tracking Pixels & Attribution", () => {
  test("loads GTM, Meta, TikTok, X, and Reddit pixels", async ({ page }) => {
    // Navigate with a test twclid to verify attribution capture
    await page.goto("/en?twclid=test-twclid-12345");

    // Check noscript fallbacks exist in raw page content
    const pageHtml = await page.content();
    expect(pageHtml).toContain("https://www.googletagmanager.com/ns.html?id=GTM-P5Q75TM2");
    expect(pageHtml).toContain("facebook.com/tr?id=1102958381163703");

    // Accept cookies if consent banner is visible
    const acceptCookiesBtn = page.locator('button:has-text("Accept all cookies")');
    if (await acceptCookiesBtn.isVisible()) {
      await acceptCookiesBtn.click();
    }

    // Verify script tags in DOM
    const gtmScript = page.locator('script#gtm-base');
    await expect(gtmScript).toHaveCount(1);
    const gtmContent = await gtmScript.innerHTML();
    expect(gtmContent).toContain("GTM-P5Q75TM2");

    const metaScript = page.locator('script#meta-pixel');
    await expect(metaScript).toHaveCount(1);
    const metaContent = await metaScript.innerHTML();
    expect(metaContent).toContain("1102958381163703");

    const tiktokScript = page.locator('script#tiktok-pixel');
    await expect(tiktokScript).toHaveCount(1);
    const tiktokContent = await tiktokScript.innerHTML();
    expect(tiktokContent).toContain("D9L0M8BC77U349A6OIL0");

    const xScript = page.locator('script#x-pixel');
    await expect(xScript).toHaveCount(1);
    const xContent = await xScript.innerHTML();
    expect(xContent).toContain("qs40m");

    const redditScript = page.locator('script#reddit-pixel');
    await expect(redditScript).toHaveCount(1);
    const redditContent = await redditScript.innerHTML();
    expect(redditContent).toContain("a2_jsyccfi50kgl");

    // Verify localStorage has persisted twclid
    const savedTwclid = await page.evaluate(() => localStorage.getItem("ck_attr_twclid"));
    expect(savedTwclid).toBe("test-twclid-12345");

    // Verify window.dataLayer contains GTM initialization
    const dataLayerEvents = await page.evaluate(() => (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer || []);
    expect(dataLayerEvents.length).toBeGreaterThan(0);
  });

  test("attribution endpoint sets 90-day cookie", async ({ request }) => {
    const response = await request.post("/api/attribution/x", {
      data: { twclid: "tw-valid-test-click-9988" },
    });
    expect(response.status()).toBe(204);

    const headers = response.headers();
    const setCookie = headers["set-cookie"] || "";
    expect(setCookie).toContain("ck_twclid=tw-valid-test-click-9988");
    expect(setCookie.toLowerCase()).toContain("httponly");
  });

  test("clicking challenge checkout CTA enriches URL and triggers begin_checkout", async ({ page }) => {
    await page.goto("/en?twclid=test-tw-777&fbclid=test-fb-888");

    // Click cookie consent
    const acceptCookiesBtn = page.locator('button:has-text("Accept all cookies")');
    if (await acceptCookiesBtn.isVisible()) {
      await acceptCookiesBtn.click();
    }

    // Scroll down to challenge comparison
    const startChallengeBtn = page.locator('button:has-text("Start Challenge")').first();
    await startChallengeBtn.scrollIntoViewIfNeeded();

    // Click and check dataLayer for begin_checkout
    await startChallengeBtn.click();

    // Verify parent anchor has enriched attribution params
    const ctaAnchor = startChallengeBtn.locator("xpath=..");
    const href = await ctaAnchor.getAttribute("href");
    expect(href).toContain("my.ckpropfirm.com/auth/signup");
    expect(href).toContain("twclid=test-tw-777");
    expect(href).toContain("fbclid=test-fb-888");

    const checkoutEvent = await page.evaluate(() => {
      const dl = (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer || [];
      return dl.find((e) => e.event === "begin_checkout");
    });
    expect(checkoutEvent).toBeDefined();
    expect((checkoutEvent as unknown as { ecommerce: { value: number } })?.ecommerce?.value).toBeGreaterThan(0);
  });
});
