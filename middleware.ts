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

function getClientIp(request: NextRequest): string | null {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return null;
}

function isPublicIp(ip: string): boolean {
  if (!ip) return false;
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return false;
  if (/^10\./.test(ip)) return false;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return false;
  if (/^192\.168\./.test(ip)) return false;
  if (/^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./.test(ip)) return false;
  if (/^169\.254\./.test(ip)) return false;
  if (/^(fc00|fe80)/i.test(ip)) return false;
  return true;
}

async function detectCountryFromIp(clientIp: string): Promise<string | null> {
  if (!clientIp || !isPublicIp(clientIp)) return null;

  const endpoints = [
    { url: `https://ipwho.is/${encodeURIComponent(clientIp)}`, field: "country_code" },
    { url: `https://freeipapi.com/api/json/${encodeURIComponent(clientIp)}`, field: "countryCode" },
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1800);
      const res = await fetch(endpoint.url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      clearTimeout(timer);
      if (!res.ok) continue;
      const data = await res.json();
      const value = data[endpoint.field];
      if (typeof value === "string" && /^[A-Z]{2}$/i.test(value)) {
        return value.toUpperCase();
      }
    } catch {
      /* try next endpoint */
    }
  }
  return null;
}

function getLocaleFromAcceptLanguage(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;
  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, qVal] = part.trim().split(";");
      const q = qVal ? parseFloat(qVal.replace("q=", "")) : 1.0;
      const code = lang.split("-")[0].toLowerCase();
      return { code, q: isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const pref of preferences) {
    if ((locales as readonly string[]).includes(pref.code)) {
      return pref.code;
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

  // Intercept portal and auth paths, redirecting to my.ckpropfirm.com
  const cleanPath = pathname
    .replace(/^\/(?:en|es|pt|ar|de|fr|hi)(?=\/|$)/, "")
    .replace(/^\//, "");
  const authRedirects: Record<string, string> = {
    portal: "https://my.ckpropfirm.com",
    dashboard: "https://my.ckpropfirm.com",
    signin: "https://my.ckpropfirm.com/auth/signin",
    login: "https://my.ckpropfirm.com/auth/signin",
    signup: "https://my.ckpropfirm.com/auth/signup",
    register: "https://my.ckpropfirm.com/auth/signup",
  };

  if (cleanPath in authRedirects) {
    const dest = new URL(authRedirects[cleanPath]);
    dest.search = request.nextUrl.search;
    return NextResponse.redirect(dest, 307);
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
    // 1. Check edge / reverse-proxy country headers
    const country =
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("x-country-code") ||
      request.headers.get("geoip-country-code") ||
      null;

    if (
      country &&
      /^[A-Z]{2}$/i.test(country) &&
      country.toUpperCase() !== "XX" &&
      country.toUpperCase() !== "T1"
    ) {
      detectedLocale = countryToLocale(country.toUpperCase());
    } else if (!alreadyDetected) {
      // 2. Fall back to visitor's public IP geolocation
      const clientIp = getClientIp(request);
      if (clientIp && isPublicIp(clientIp)) {
        const resolvedCountry = await detectCountryFromIp(clientIp);
        if (resolvedCountry) {
          detectedLocale = countryToLocale(resolvedCountry);
        }
      }
    }

    // 3. Fall back to visitor browser's Accept-Language header
    if (!detectedLocale) {
      const browserLocale = getLocaleFromAcceptLanguage(
        request.headers.get("accept-language")
      );
      if (browserLocale) {
        detectedLocale = browserLocale;
      }
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
