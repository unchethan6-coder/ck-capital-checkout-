"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { getCookieConsent, type CookieChoice } from "@/components/shared/CookieConsent";
import { captureAttribution } from "@/lib/analytics/attribution";
import {
  STRICT_CONSENT_REGIONS,
  CONSENT_GRANTED,
  CONSENT_DENIED,
  applyConsentChoice,
} from "@/lib/analytics/consent";
import { trackPageView } from "@/lib/analytics/events";

// Official platform IDs registered in the CK Propfirm Implementation Guide
export const GTM_ID = "GTM-P5Q75TM2";
export const META_PIXEL_ID = "1102958381163703";
export const META_PIXEL_ID_SECONDARY = "1771596324072142";
/** All Meta Pixel IDs fired on every PageView / standard event via dual fbq init. */
export const META_PIXEL_IDS = [META_PIXEL_ID, META_PIXEL_ID_SECONDARY];
export const TIKTOK_PIXEL_ID = "D9L0M8BC77U349A6OIL0";
export const X_PIXEL_ID = "qs40m";
export const REDDIT_PIXEL_ID = "a2_jsyccfi50kgl";

function PixelTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consent, setConsent] = useState<CookieChoice | null>(null);
  const isFirstRender = useRef(true);

  // Initialize consent & listen for user updates
  useEffect(() => {
    // Capture twclid, fbclid, gclid, ttclid, rdt_cid on landing
    captureAttribution();

    // gtm-base (which defines window.gtag) loads afterInteractive, so a
    // stored choice or a fast banner click can land before it exists.
    // Retry until gtag appears so the explicit choice is never lost.
    const retryTimers: number[] = [];
    const applyWithRetry = (choice: CookieChoice) => {
      applyConsentChoice(choice);
      if (typeof window !== "undefined" && !(window as unknown as { gtag?: unknown }).gtag) {
        const id = window.setInterval(() => {
          if ((window as unknown as { gtag?: unknown }).gtag) {
            applyConsentChoice(choice);
            window.clearInterval(id);
          }
        }, 500);
        retryTimers.push(id);
        window.setTimeout(() => window.clearInterval(id), 10000);
      }
    };

    // Check stored consent choice. An explicit choice always wins over the
    // regional defaults via a consent update; with no stored choice the
    // region-scoped defaults below apply (granted outside UK/EEA).
    const stored = getCookieConsent();
    setConsent(stored);
    if (stored) applyWithRetry(stored);

    const onConsentChange = (event: Event) => {
      const custom = event as CustomEvent<CookieChoice>;
      setConsent(custom.detail);
      applyWithRetry(custom.detail);
    };

    window.addEventListener("ck:cookie-consent", onConsentChange);
    return () => {
      window.removeEventListener("ck:cookie-consent", onConsentChange);
      for (const id of retryTimers) window.clearInterval(id);
    };
  }, []);

  // Track SPA route changes in Next.js
  useEffect(() => {
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only dispatch virtual page view if consent isn't rejected
    if (consent !== "essential") {
      trackPageView(fullPath);
    }
  }, [pathname, searchParams, consent]);

  const canLoadMarketing = consent !== "essential";

  return (
    <>
      {/* 1. Google Tag Manager (GTM-P5Q75TM2) with Consent Mode v2.
          Defaults to granted everywhere EXCEPT the UK/EEA, where it
          defaults to denied until the visitor accepts the cookie banner
          (which dispatches a consent update). Google resolves the
          visitor's region itself. */}
      <Script
        id="gtm-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', ${JSON.stringify(CONSENT_GRANTED)});
            gtag('consent', 'default', ${JSON.stringify(CONSENT_DENIED)}, { region: ${JSON.stringify(STRICT_CONSENT_REGIONS)} });
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />

      {/* Direct Base Pixels load when user has not opted out */}
      {canLoadMarketing && (
        <>
          {/* 2. Meta (Facebook) Pixel (dual init: 1102958381163703 + 1771596324072142) */}
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s) {
                  if (f.fbq) return;
                  n = f.fbq = function() {
                    n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments);
                  };
                  if (!f._fbq) f._fbq = n;
                  n.push = n;
                  n.loaded = true;
                  n.version = '2.0';
                  n.queue = [];
                  t = b.createElement(e);
                  t.async = true;
                  t.src = v;
                  s = b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s);
                }(window, document, 'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('init', '${META_PIXEL_ID_SECONDARY}');
                fbq('track', 'PageView');
              `,
            }}
          />

          {/* 3. TikTok Pixel (D9L0M8BC77U349A6OIL0) */}
          <Script
            id="tiktok-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
                  var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
                  ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                  ttq.load('${TIKTOK_PIXEL_ID}');
                  ttq.page();
                }(window, document, 'ttq');
              `,
            }}
          />

          {/* 4. X (Twitter) Pixel (qs40m) */}
          <Script
            id="x-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
                },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
                a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
                twq('config','${X_PIXEL_ID}');
                twq('track','PageView');
              `,
            }}
          />

          {/* 5. Reddit Pixel (a2_jsyccfi50kgl) */}
          <Script
            id="reddit-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=${REDDIT_PIXEL_ID}",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
                rdt('init','${REDDIT_PIXEL_ID}');
                rdt('track','PageVisit');
              `,
            }}
          />
        </>
      )}
    </>
  );
}

export function MarketingPixels() {
  return (
    <Suspense fallback={null}>
      <PixelTrackerInner />
    </Suspense>
  );
}
