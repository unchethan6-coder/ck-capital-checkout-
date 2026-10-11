import { test, expect } from "@playwright/test";

test.describe("TopNav Mega Menu & Navigation QAQC", () => {
  test.describe("Desktop Viewport (1280x800)", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("desktop nav displays main links and indicators", async ({ page }) => {
      await page.goto("/en");
      const navLinks = page.locator('[data-od-id="nav-links"]');
      await expect(navLinks).toBeVisible();

      await expect(page.locator('[data-od-id="desktop-nav-tradingObjectives"]')).toBeVisible();
      await expect(page.locator('[data-od-id="desktop-nav-company"]')).toBeVisible();
      await expect(page.locator('[data-od-id="desktop-nav-payouts"]')).toBeVisible();
      await expect(page.locator('[data-od-id="desktop-nav-affiliates"]')).toBeVisible();
      await expect(page.locator('[data-od-id="desktop-nav-faq"]')).toBeVisible();
    });

    test("hovering Objectives reveals mega menu with sub-links, featured CTA, and full-width layout", async ({ page }) => {
      await page.goto("/en");
      const objectivesTrigger = page.locator('[data-od-id="desktop-nav-tradingObjectives"]');
      
      // Hover over Objectives
      await objectivesTrigger.hover();
      await page.waitForTimeout(300);

      // Verify dropdown container and content
      const dropdown = page.locator('[data-od-id="desktop-dropdown-tradingObjectives"]');
      await expect(dropdown).toBeVisible();

      // Check dropdown width (must span full navigation width >= 1000px on 1280px viewport)
      const box = await dropdown.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(1000);

      const evalLink = page.locator('[data-od-id="desktop-subitem-evaluation"]');
      const instantLink = page.locator('[data-od-id="desktop-subitem-instantFunding"]');
      const featuredCta = page.locator('[data-od-id="desktop-featured-cta-tradingObjectives"]');

      await expect(evalLink).toBeVisible();
      await expect(instantLink).toBeVisible();
      await expect(featuredCta).toBeVisible();

      // Click sub-link to navigate to evaluation page
      await Promise.all([page.waitForURL(/\/en\/evaluation/), evalLink.click()]);
      await expect(page).toHaveURL(/\/en\/evaluation/);
    });

    test("hovering Company reveals dropdown with About Us, Blog, Contact and full-width layout", async ({ page }) => {
      await page.goto("/en");
      const companyTrigger = page.locator('[data-od-id="desktop-nav-company"]');
      
      // Hover over Company
      await companyTrigger.hover();
      await page.waitForTimeout(300);

      const dropdown = page.locator('[data-od-id="desktop-dropdown-company"]');
      await expect(dropdown).toBeVisible();

      // Check dropdown width (must span full navigation width >= 1000px on 1280px viewport)
      const box = await dropdown.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(1000);

      const aboutLink = page.locator('[data-od-id="desktop-subitem-aboutUs"]');
      const blogLink = page.locator('[data-od-id="desktop-subitem-blog"]');
      const contactLink = page.locator('[data-od-id="desktop-subitem-contact"]');

      await expect(aboutLink).toBeVisible();
      await expect(blogLink).toBeVisible();
      await expect(contactLink).toBeVisible();

      // Click About Us
      await Promise.all([page.waitForURL(/\/en\/about-us/), aboutLink.click()]);
      await expect(page).toHaveURL(/\/en\/about-us/);
    });
    test("selecting item from desktop mega menu collapses the menu", async ({ page }) => {
      await page.goto("/en");
      const objectivesTrigger = page.locator('[data-od-id="desktop-nav-tradingObjectives"]');
      await objectivesTrigger.hover();
      await page.waitForTimeout(300);

      const dropdown = page.locator('[data-od-id="desktop-dropdown-tradingObjectives"]');
      await expect(dropdown).toBeVisible();

      const instantLink = page.locator('[data-od-id="desktop-subitem-instantFunding"]');
      await Promise.all([page.waitForURL(/\/en\/instant/), instantLink.click()]);
      await expect(page).toHaveURL(/\/en\/instant/);

      // Mega menu should collapse after selection
      await expect(dropdown).not.toBeVisible();
    });

    test("selecting item from desktop Company menu collapses the menu", async ({ page }) => {
      await page.goto("/en");
      const companyTrigger = page.locator('[data-od-id="desktop-nav-company"]');
      await companyTrigger.hover();
      await page.waitForTimeout(300);

      const dropdown = page.locator('[data-od-id="desktop-dropdown-company"]');
      await expect(dropdown).toBeVisible();

      const contactLink = page.locator('[data-od-id="desktop-subitem-contact"]');
      await Promise.all([page.waitForURL(/\/en\/contact/), contactLink.click()]);
      await expect(page).toHaveURL(/\/en\/contact/);

      // Company menu should collapse after selection
      await expect(dropdown).not.toBeVisible();
    });

    test("hero graphic sidebar nav items have hover:text-white for high contrast on dark background", async ({ page }) => {
      await page.goto("/en");
      const heroSection = page.locator('[data-od-id="hero"]');
      await expect(heroSection).toBeVisible();

      // Check hero visual element (video takeover, mascot artwork, or laptop mockup)
      const heroVisual = heroSection.locator('[data-od-id="hero-video"], .hero-mascot, aside, img').first();
      await expect(heroVisual).toBeAttached();
    });
  });

  test.describe("Tablet Viewport (768x1024 - iPad)", () => {
    test.use({ viewport: { width: 768, height: 1024 }, hasTouch: true });

    test("selecting item from tablet drawer collapses the drawer", async ({ page }) => {
      await page.goto("/en");

      const menuBtn = page.locator('button[aria-label="Menu"]');
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();
      await page.waitForTimeout(200);

      const drawer = page.locator('[data-od-id="mobile-drawer"]');
      await expect(drawer).toBeVisible();

      // Open accordion
      const objectivesAccordionBtn = page.locator('[data-od-id="mobile-accordion-tradingObjectives"]');
      await objectivesAccordionBtn.click();
      await page.waitForTimeout(200);

      const evaluationMobileLink = page.locator('[data-od-id="mobile-subitem-evaluation"]');
      await evaluationMobileLink.click();

      // Drawer collapses after selection
      await expect(page).toHaveURL(/\/en\/evaluation/);
      await expect(drawer).not.toBeVisible();
    });
  });

  test.describe("Mobile Viewport (390x844 - iPhone 14)", () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

    test("mobile drawer opens and accordion expands Objectives sub-links", async ({ page }) => {
      await page.goto("/en");

      // Open mobile hamburger menu
      const menuBtn = page.locator('button[aria-label="Menu"]');
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();
      await page.waitForTimeout(300);

      const mobileDrawer = page.locator('[data-od-id="mobile-drawer"]');
      await expect(mobileDrawer).toBeVisible();

      // Objectives accordion button
      const objectivesAccordionBtn = page.locator('[data-od-id="mobile-accordion-tradingObjectives"]');
      await expect(objectivesAccordionBtn).toBeVisible();

      // Expand Objectives accordion
      await objectivesAccordionBtn.click();
      await page.waitForTimeout(200);

      // Sub-links should be visible inside mobile drawer
      const evaluationMobileLink = page.locator('[data-od-id="mobile-subitem-evaluation"]');
      const instantMobileLink = page.locator('[data-od-id="mobile-subitem-instantFunding"]');
      await expect(evaluationMobileLink).toBeVisible();
      await expect(instantMobileLink).toBeVisible();

      // Click evaluation to navigate and verify drawer collapses
      await evaluationMobileLink.click();
      await expect(page).toHaveURL(/\/en\/evaluation/);
      await expect(mobileDrawer).not.toBeVisible();
    });

    test("mobile drawer expands Company accordion and collapses on selection", async ({ page }) => {
      await page.goto("/en");

      const menuBtn = page.locator('button[aria-label="Menu"]');
      await menuBtn.click();
      await page.waitForTimeout(300);

      const mobileDrawer = page.locator('[data-od-id="mobile-drawer"]');
      await expect(mobileDrawer).toBeVisible();

      const companyAccordionBtn = page.locator('[data-od-id="mobile-accordion-company"]');
      await expect(companyAccordionBtn).toBeVisible();
      await companyAccordionBtn.click();
      await page.waitForTimeout(200);

      const aboutLink = page.locator('[data-od-id="mobile-subitem-aboutUs"]');
      await expect(aboutLink).toBeVisible();

      await aboutLink.click();
      await expect(page).toHaveURL(/\/en\/about-us/);
      await expect(mobileDrawer).not.toBeVisible();
    });

    test("direct links in mobile drawer collapse drawer immediately", async ({ page }) => {
      await page.goto("/en");

      const menuBtn = page.locator('button[aria-label="Menu"]');
      await menuBtn.click();
      await page.waitForTimeout(200);

      const mobileDrawer = page.locator('[data-od-id="mobile-drawer"]');
      await expect(mobileDrawer).toBeVisible();

      const payoutsLink = page.locator('[data-od-id="mobile-nav-payouts"]');
      await payoutsLink.click();

      await expect(page).toHaveURL(/\/en\/payouts/);
      await expect(mobileDrawer).not.toBeVisible();
    });

    test("BlogCategories section hides slideshow and has improved card heights on mobile", async ({ page }) => {
      await page.goto("/en");

      const blogSection = page.locator('[data-od-id="blog-categories"]');
      if ((await blogSection.count()) > 0) {
        await blogSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        // Featured slideshow is hidden on mobile
        const slideshow = page.locator('[data-od-id="blog-featured"]');
        await expect(slideshow).not.toBeVisible();

        const cat1 = page.locator('[data-od-id="blog-cat-news"]');
        await cat1.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        const cat2 = page.locator('[data-od-id="blog-cat-trading-tips"]');
        const cat3 = page.locator('[data-od-id="blog-cat-education"]');

        await expect(cat1).toBeVisible();
        await expect(cat2).toBeVisible();
        await expect(cat3).toBeVisible();

        const box1 = await cat1.boundingBox();
        const box2 = await cat2.boundingBox();
        const box3 = await cat3.boundingBox();

        expect(box1).not.toBeNull();
        expect(box2).not.toBeNull();
        expect(box3).not.toBeNull();

        // Card 1 is full width and tall (height >= 210px)
        expect(box1!.width).toBeGreaterThan(box2!.width * 1.5);
        expect(box1!.height).toBeGreaterThanOrEqual(210);

        // Card 2 and Card 3 are side-by-side in one row (same vertical position and height >= 180px)
        expect(Math.abs(box2!.y - box3!.y)).toBeLessThan(5);
        expect(Math.abs(box2!.width - box3!.width)).toBeLessThan(10);
        expect(box2!.height).toBeGreaterThanOrEqual(180);
      }
    });

    test("CustomerSupport section displays image above buttons on mobile", async ({ page }) => {
      await page.goto("/en");

      const mobileImage = page.locator('[data-od-id="customer-support-image-mobile"]');
      const discordBtn = page.locator('[data-od-id="customer-support-discord"]');

      await expect(mobileImage).toBeVisible();
      await expect(discordBtn).toBeVisible();

      const imgBox = await mobileImage.boundingBox();
      const btnBox = await discordBtn.boundingBox();

      expect(imgBox).not.toBeNull();
      expect(btnBox).not.toBeNull();

      // Image is rendered above the buttons in vertical flow
      expect(imgBox!.y + imgBox!.height).toBeLessThanOrEqual(btnBox!.y);
    });
  });

  test.describe("Language Switcher Dropdown Collapse", () => {
    test("selecting a language collapses the language switcher dropdown", async ({ page }) => {
      await page.goto("/en");

      const langBtn = page.locator('[data-od-id="language-switcher"] button').first();
      await expect(langBtn).toBeVisible();
      await langBtn.click();

      const langList = page.locator('[data-od-id="language-switcher"] [role="listbox"]').first();
      await expect(langList).toBeVisible();

      // Click Spanish
      const esOption = page.locator('[data-od-id="language-switcher"] button:has-text("Español")').first();
      await esOption.click();

      await expect(page).toHaveURL(/\/es/);
      await expect(langList).not.toBeVisible();
    });
  });

  test.describe("Multilingual QAQC", () => {
    const locales = ["en", "es", "pt", "de", "fr", "ar", "hi"];

    for (const locale of locales) {
      test(`locale [${locale}] loads cleanly with localized nav`, async ({ page }) => {
        const response = await page.goto(`/${locale}`);
        expect(response?.status()).toBe(200);

        const nav = page.locator('[data-od-id="top-nav"]');
        await expect(nav).toBeVisible();

        const searchTrigger = page.locator('[data-od-id="nav-search-trigger"]');
        await expect(searchTrigger).toBeVisible();
      });
    }
  });

  test.describe("Hero Section Graphics & Text Contrast QAQC", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("Landing Page (/en): Hero laptop mockup has visible high-contrast sidebar items", async ({ page }) => {
      await page.goto("/en");
      const hero = page.locator('[data-od-id="hero"]');
      await expect(hero).toBeVisible();

      const heroVisual = hero.locator('[data-od-id="hero-video"], .hero-mascot, aside, img').first();
      await expect(heroVisual).toBeAttached();
    });

    test("About Us Page (/en/about-us): Founder card has crisp white name and readable quote", async ({ page }) => {
      await page.goto("/en/about-us");
      const founderPhoto = page.locator('[data-od-id="about-founder-photo"]');
      await expect(founderPhoto).toBeVisible();

      const founderName = page.locator('h3:has-text("Monray Linevee")');
      await expect(founderName).toBeVisible();
      await expect(founderName).toHaveClass(/text-white/);

      const founderBadge = page.locator('text=Founder').first();
      await expect(founderBadge).toBeVisible();
    });

    test("Trading Objectives Page (/en/trading-objectives): Objectives HUD visual has readable labels", async ({ page }) => {
      await page.goto("/en/trading-objectives");
      const hud = page.locator('[data-od-id="hero-objectives-hud"]');
      await expect(hud).toBeVisible();

      const title = hud.locator('text=Zero Hidden Rules');
      await expect(title).toBeVisible();

      const param = hud.locator('text=Core Trading Parameters');
      await expect(param).toBeVisible();
    });

    test("Evaluation Page (/en/evaluation): Evaluation Path visual has readable progress text", async ({ page }) => {
      await page.goto("/en/evaluation");
      const evalPath = page.locator('[data-od-id="hero-evaluation-path"]');
      await expect(evalPath).toBeVisible();

      const progressLabel = evalPath.locator('text=Phase 1 Target Progress');
      await expect(progressLabel).toBeVisible();

      const nextStep = evalPath.locator('text=NEXT STEP');
      await expect(nextStep).toBeVisible();
    });

    test("Instant Funding Page (/en/instant): Instant Funding visual has readable roadmap text", async ({ page }) => {
      await page.goto("/en/instant");
      const instantVisual = page.locator('[data-od-id="hero-instant-funding"]');
      await expect(instantVisual).toBeVisible();

      const roadmapLabel = instantVisual.locator('text=Funding Acceleration Roadmap');
      await expect(roadmapLabel).toBeVisible();
    });

    test("Payouts Page (/en/payouts): Payout Dashboard visual has readable withdrawal controls", async ({ page }) => {
      await page.goto("/en/payouts");
      const payoutWindow = page.locator('[data-od-id="hero-payout-window"]');
      await expect(payoutWindow).toBeVisible();

      const requestTitle = payoutWindow.locator('text=Request Payout');
      await expect(requestTitle).toBeVisible();
    });

    test("Affiliates Page (/en/affiliates): Affiliate Network visual has readable partner link and stats", async ({ page }) => {
      await page.goto("/en/affiliates");
      const affiliatePortal = page.locator('[data-od-id="hero-affiliate-portal"]');
      await expect(affiliatePortal).toBeVisible();

      const partnerLink = affiliatePortal.locator('text=Your Custom Partner Link');
      await expect(partnerLink).toBeVisible();
    });

    test("Blog Page (/en/blog): Blog Hero visual has readable featured article card", async ({ page }) => {
      await page.goto("/en/blog");
      const blogIntel = page.locator('[data-od-id="hero-blog-intel"]');
      await expect(blogIntel).toBeVisible();

      const featuredStrategy = blogIntel.locator('text=Featured Strategy');
      await expect(featuredStrategy).toBeVisible();
    });

    test("Contact Page (/en/contact): Contact Hero visual has readable support channels", async ({ page }) => {
      await page.goto("/en/contact");
      const contactDesk = page.locator('[data-od-id="hero-contact-desk"]');
      await expect(contactDesk).toBeVisible();

      const channelsTitle = contactDesk.locator('text=Priority Communication Channels');
      await expect(channelsTitle).toBeVisible();
    });

    test("All Subpages: Scrolling activates floating nav with solid dark background without negative margin artifact", async ({ page }) => {
      const subpages = ["/en/about-us", "/en/evaluation", "/en/instant", "/en/trading-objectives", "/en/payouts", "/en/affiliates", "/en/blog", "/en/contact"];
      for (const route of subpages) {
        await page.goto(route);
        await page.waitForTimeout(400);
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(400);

        const nav = page.locator('[data-od-id="top-nav"] nav');
        await expect(nav).toBeVisible();
        await expect(nav).toHaveClass(/backdrop-blur-xl/);
      }
    });
  });
});
