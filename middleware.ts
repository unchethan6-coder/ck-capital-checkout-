import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing, locales, defaultLocale } from "./i18n/routing";
import { COUNTRY_TO_LOCALE } from "./i18n/countries";

const intlMiddleware = createMiddleware(routing);

export const config = {
  // Middleware only runs for document/asset requests, never for /api, /_next,
  // or static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

const LOCALE_COOKIE = "NEXT_LOCALE";
const DETECTED_COOKIE = "ck-geo-detected";

// Public geolocation endpoints, tried in order when the host injects no country
// header (Vercel/Cloudflare). Each is called at most once per visitor.
const GEO_ENDPOINTS: Array<{ url: string; field: string }> = [
  { url: "https://ipapi.co/json/", field: "country_code" },
  { url: "https://ip-api.com/json/?fields=countryCode,status", field: "countryCode" },
  { url: "https://cloudflare.com/cdn-cgi/trace", field: "loc" },
];

async function detectCountryFromIp(): Promise<string | null> {
  for (const endpoint of GEO_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(endpoint.url, {
        signal: controller.signal,
        headers: { Accept: "text/plain" },
        cache: "no-store",
      });
      clearTimeout(timer);
      if (!res.ok) continue;
      const text = await res.text();

      if (endpoint.url.includes("cloudflare.com")) {
        const match = text.match(/^loc=([A-Z]{2})$/m);
        if (match) return match[1];
      } else {
        try {
          const data = JSON.parse(text);
          const value = data[endpoint.field];
          if (typeof value === "string" && /^[A-Z]{2}$/.test(value)) return value;
        } catch {
          /* try next endpoint */
        }
      }
    } catch {
      /* try next endpoint */
    }
  }
  return null;
}

/** Resolve a country code → supported locale, with fallbacks to the locale's
 *  primary markets. Falls back to the default locale. */
function countryToLocale(country: string | null | undefined): string {
  if (country && COUNTRY_TO_LOCALE[country]) return COUNTRY_TO_LOCALE[country];
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The challenge configurator is a standalone checkout-style surface and
  // intentionally does not use the marketing locale shell.
  if (pathname === '/configure' || pathname.startsWith('/configure/')) {
    return NextResponse.next();
  }

  // Prefixed paths (explicit user intent) go straight to next-intl.
  const hasPrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasPrefix) {
    return intlMiddleware(request);
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const alreadyDetected = request.cookies.get(DETECTED_COOKIE)?.value;

  let detectedLocale: string | null = null;
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    detectedLocale = cookieLocale;
  }

  if (!detectedLocale) {
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      null;
    if (country) {
      detectedLocale = countryToLocale(country);
    } else if (!alreadyDetected) {
      const resolved = await detectCountryFromIp();
      detectedLocale = countryToLocale(resolved);
    }
  }

  if (!detectedLocale) {
    detectedLocale = defaultLocale;
  }

  // Redirect to the prefixed path. The NEXT_LOCALE cookie is set so the
  // choice sticks without repeating the geo lookup. Preserve the query string
  // and hash (e.g. /#start-challenge → /en/#start-challenge).
  const suffix = request.nextUrl.search + (request.nextUrl.hash || "");
  const response = NextResponse.redirect(
    new URL(`/${detectedLocale}${pathname === "/" ? "" : pathname}${suffix}`, request.url)
  );

  response.cookies.set(LOCALE_COOKIE, detectedLocale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  if (!alreadyDetected) {
    response.cookies.set(DETECTED_COOKIE, "1", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
