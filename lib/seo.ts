import type { Metadata } from "next";
import { getLocaleMeta } from "@/i18n/locales";
import type { AppLocale } from "@/i18n/routing";

export const SITE_URL = "https://ckcapital.co.uk";
export const SITE_NAME = "CK Capital";

export const DEFAULT_OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "CK Capital — Prop Trading Firm. Simulated funded accounts up to $1.2M with an 80% profit split.",
};

interface PageSeoOptions {
  title: string;
  description: string;
  path: string;
  locale?: AppLocale;
  type?: "website" | "article";
  images?: Metadata["openGraph"] extends infer _T ? { url: string; width?: number; height?: number; alt?: string }[] : never;
}

/** Build a per-page Metadata object with canonical URL, OG and Twitter cards. */
export function pageSeo({ title, description, path, locale = "en", type = "website", images }: PageSeoOptions): Metadata {
  const localeMeta = getLocaleMeta(locale);
  // The canonical URL keeps the locale prefix so each language version is distinct.
  const url = `${SITE_URL}/${locale}${path === "/" ? "/" : path}`;
  const ogImages = images && images.length ? images : [DEFAULT_OG_IMAGE];
  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: localeMeta?.ogLocale ?? "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}
