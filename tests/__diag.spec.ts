import { test } from "@playwright/test";

test("meta pixel network", async ({ page }) => {
  const fbReqs: string[] = [];
  page.on("request", (r) => {
    const u = r.url();
    if (u.includes("facebook.com/tr") || u.includes("fbevents.js")) fbReqs.push(u);
  });
  await page.goto("/en/landingpage", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  // accept cookies
  const accept = page.locator('button:has-text("Accept all cookies")');
  if (await accept.isVisible().catch(() => false)) await accept.click().catch(() => {});
  await page.waitForTimeout(4000);
  console.log("FB_REQS::" + JSON.stringify(fbReqs));
  // check html
  const html = await page.content();
  console.log("HTML_HAS_NEW_PIXEL::" + html.includes("facebook.com/tr?id=1771596324072142"));
  console.log("HTML_HAS_OLD_PIXEL::" + html.includes("facebook.com/tr?id=1102958381163703"));
  // fbq defined?
  const fbq = await page.evaluate(() => (window as any).fbq ? "defined" : "undefined");
  console.log("FBQ::" + fbq);
});
