import type { Metadata } from "next";
import { getLocaleMeta } from "@/i18n/locales";
import type { AppLocale } from "@/i18n/routing";

export const SITE_URL = "https://ckcapital.co.uk";
export const SITE_NAME = "CK Propfirm";

export const DEFAULT_OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "CK Propfirm — Prop Trading Firm. Simulated funded accounts up to $750K with an 80% profit split.",
};

interface PageSeoOptions {
  title: string;
  description: string;
  path: string;
  locale?: AppLocale;
  type?: "website" | "article";
  images?: Metadata["openGraph"] extends infer _T ? { url: string; width?: number; height?: number; alt?: string }[] : never;
}

const HREFLANG_MAP: Record<AppLocale, string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
  ar: "ar",
  de: "de-DE",
  fr: "fr-FR",
  hi: "hi-IN",
};

const ALL_OG_LOCALES = ["en_US", "es_ES", "pt_BR", "ar_AR", "de_DE", "fr_FR", "hi_IN"];

/** Build a per-page Metadata object with canonical URL, full hreflang alternates, OG and Twitter cards. */
export function pageSeo({ title, description, path, locale = "en", type = "website", images }: PageSeoOptions): Metadata {
  const localeMeta = getLocaleMeta(locale);
  const cleanPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const url = `${SITE_URL}/${locale}${cleanPath}`;
  const ogImages = images && images.length ? images : [DEFAULT_OG_IMAGE];

  const languages: Record<string, string> = {};
  for (const loc of ["en", "es", "pt", "ar", "de", "fr", "hi"] as AppLocale[]) {
    languages[HREFLANG_MAP[loc]] = `${SITE_URL}/${loc}${cleanPath}`;
  }
  languages["x-default"] = `${SITE_URL}/en${cleanPath}`;

  const currentOgLocale = localeMeta?.ogLocale ?? "en_US";

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: currentOgLocale,
      alternateLocale: ALL_OG_LOCALES.filter((l) => l !== currentOgLocale),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
