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

  test("consent defaults to granted outside UK/EEA with region-scoped denial", async ({ page }) => {
    await page.goto("/en");

    const gtmScript = page.locator("script#gtm-base");
    await expect(gtmScript).toHaveCount(1);
    const gtmContent = await gtmScript.innerHTML();

    // Global default is granted (non-UK/EEA visitors)
    expect(gtmContent).toContain('"ad_storage":"granted"');
    expect(gtmContent).toContain('"analytics_storage":"granted"');
    // …with a region-scoped denied default covering the UK and EEA
    expect(gtmContent).toContain('"ad_storage":"denied"');
    expect(gtmContent).toContain("region");
    for (const code of ["GB", "DE", "FR", "ES", "IT", "IE", "NL", "NO"]) {
      expect(gtmContent).toContain(`"${code}"`);
    }
  });

  test("banner accept switches consent mode to granted", async ({ page }) => {
    await page.goto("/en");

    // gtm-base defines window.gtag; wait for it so the accept handler can update consent.
    await page.waitForFunction(() => typeof (window as unknown as { gtag?: unknown }).gtag === "function");

    const acceptCookiesBtn = page.locator('button:has-text("Accept all cookies")');
    if (await acceptCookiesBtn.isVisible()) {
      await acceptCookiesBtn.click();
    }

    const update = await page.evaluate(() => {
      const dl = (window as unknown as { dataLayer: ArrayLike<unknown> }).dataLayer || [];
      return Array.from(dl).find(
        (e) =>
          Array.isArray(e) ||
          (typeof e === "object" && e !== null && (e as { 0?: unknown })[0] === "consent")
      );
    });
    expect(update).toBeDefined();
    const payload = (update as unknown[])[2] as Record<string, string>;
    expect(payload.ad_storage).toBe("granted");
    expect(payload.analytics_storage).toBe("granted");
  });

  test("raw portal links are enriched with attribution at click time", async ({ page }) => {
    await page.goto("/en?gclid=test-g-111&fbclid=test-f-222");

    // Wait for hydration: capture + decorator effects must have run.
    await page.waitForFunction(() => window.localStorage.getItem("ck_attr_gclid") === "test-g-111");

    // The TopNav Sign In link renders the raw portal URL (no SSR enrichment).
    // Capture-phase decorator mutates href before our bubble listener stops navigation.
    const href = await page.evaluate(() => {
      const anchor = document.querySelector(
        'a[href^="https://my.ckpropfirm.com/auth/signin"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return null;
      if (anchor.href.includes("gclid=")) return "ALREADY-ENRICHED:" + anchor.href;
      let seen: string | null = null;
      const stop = (e: Event) => {
        // Bubble phase runs after the capture-phase decorator, so the
        // anchor href is already enriched here.
        seen = anchor.href;
        e.preventDefault();
      };
      document.addEventListener("click", stop, false);
      anchor.click();
      document.removeEventListener("click", stop, false);
      return seen;
    });

    expect(href).not.toBeNull();
    expect(href as string).not.toContain("ALREADY-ENRICHED");
    expect(href as string).toContain("my.ckpropfirm.com/auth/signin");
    expect(href as string).toContain("gclid=test-g-111");
    expect(href as string).toContain("fbclid=test-f-222");
  });

  test("portal redirects forward attribution cookies and preserve query", async ({ request }) => {
    const withCookie = await request.get("/en/signup", {
      headers: { cookie: "ck_gclid=cookie-g-999" },
      maxRedirects: 0,
    });
    expect(withCookie.status()).toBe(307);
    const loc = withCookie.headers()["location"] || "";
    expect(loc).toContain("my.ckpropfirm.com/auth/signup");
    expect(loc).toContain("gclid=cookie-g-999");

    // Explicit query params win over cookie values
    const withBoth = await request.get("/en/signup?plan=instant&gclid=url-g-1", {
      headers: { cookie: "ck_gclid=cookie-g-999" },
      maxRedirects: 0,
    });
    expect(withBoth.status()).toBe(307);
    const loc2 = withBoth.headers()["location"] || "";
    expect(loc2).toContain("plan=instant");
    expect(loc2).toContain("gclid=url-g-1");
    expect(loc2).not.toContain("cookie-g-999");
  });
});
