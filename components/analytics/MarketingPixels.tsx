"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { getCookieConsent, type CookieChoice } from "@/components/shared/CookieConsent";
import { captureAttribution } from "@/lib/analytics/attribution";
import { trackPageView } from "@/lib/analytics/events";

// Official platform IDs registered in the CK Propfirm Implementation Guide
export const GTM_ID = "GTM-P5Q75TM2";
export const META_PIXEL_ID = "1102958381163703";
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

    // Check stored consent choice
    const stored = getCookieConsent();
    setConsent(stored);

    const onConsentChange = (event: Event) => {
      const custom = event as CustomEvent<CookieChoice>;
      setConsent(custom.detail);

      // If user accepted all, update Google consent mode & pixel states
      if (custom.detail === "all") {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("consent", "update", {
            ad_storage: "granted",
            analytics_storage: "granted",
            ad_user_data: "granted",
            ad_personalization: "granted",
          });
        }
        window.fbq?.("consent", "grant");
        window.ttq?.grantConsent?.();
      } else if (custom.detail === "essential") {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("consent", "update", {
            ad_storage: "denied",
            analytics_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
          });
        }
        window.fbq?.("consent", "revoke");
        window.ttq?.revokeConsent?.();
      }
    };

    window.addEventListener("ck:cookie-consent", onConsentChange);
    return () => window.removeEventListener("ck:cookie-consent", onConsentChange);
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
      {/* 1. Google Tag Manager (GTM-P5Q75TM2) with Consent Mode */}
      <Script
        id="gtm-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': '${consent === "all" ? "granted" : "denied"}',
              'analytics_storage': '${consent === "all" ? "granted" : "denied"}',
              'ad_user_data': '${consent === "all" ? "granted" : "denied"}',
              'ad_personalization': '${consent === "all" ? "granted" : "denied"}'
            });
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
          {/* 2. Meta (Facebook) Pixel (1102958381163703) */}
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
