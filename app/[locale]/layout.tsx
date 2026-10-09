import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Noto_Kufi_Arabic } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { TopNav } from "@/components/sections/TopNav";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { SupportWidget } from "@/components/support/SupportWidget";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getActiveBanners } from "@/lib/cms";
import { routing } from "@/i18n/routing";
import { getLocaleMeta } from "@/i18n/locales";
import { ScrollHandler } from "@/components/shared/ScrollHandler";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

// Display face for prominent headings and card titles.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

// Arabic is RTL and needs glyph coverage that the Latin display/body faces
// do not provide. Loaded only for the `ar` locale.
const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport = {
  width: "device-width" as const,
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = hasLocale(routing.locales, localeParam) ? localeParam : routing.defaultLocale;
  const meta = getLocaleMeta(locale);
  const url = `${SITE_URL}/${locale}/`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `CK Propfirm — Get Funded Up to $750K | 80% Profit Split`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      "CK Propfirm provides proprietary trading evaluations and simulated funded accounts up to $750K with an 80% profit split, fast payouts, and 24/7 support.",
    applicationName: SITE_NAME,
    alternates: {
      canonical: url,
      languages: {
        "en-US": `${SITE_URL}/en/`,
        "es-ES": `${SITE_URL}/es/`,
        "pt-BR": `${SITE_URL}/pt/`,
        ar: `${SITE_URL}/ar/`,
        "de-DE": `${SITE_URL}/de/`,
        "fr-FR": `${SITE_URL}/fr/`,
        "hi-IN": `${SITE_URL}/hi/`,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      locale: meta.ogLocale,
      title: `CK Propfirm — Get Funded Up to $750K | 80% Profit Split`,
      description:
        "Proprietary trading evaluations and simulated funded accounts up to $750K with an 80% profit split.",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `CK Propfirm — Get Funded Up to $750K | 80% Profit Split`,
      description:
        "Proprietary trading evaluations and simulated funded accounts up to $750K with an 80% profit split.",
      images: ["/og-image.jpg"],
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

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: localeParam } = await params;
  const locale = hasLocale(routing.locales, localeParam) ? localeParam : routing.defaultLocale;
  setRequestLocale(locale);

  const meta = getLocaleMeta(locale);
  const dir = meta.dir;

  const banners = await getActiveBanners();

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable} ${
        locale === "ar" ? notoKufiArabic.variable : ""
      } h-full antialiased dark`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ScrollHandler />
          <TopNav />
          <AnnouncementBar banners={banners.length ? banners : undefined} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CookieConsent />
          <SupportWidget />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": `${SITE_URL}/#organization`,
                    name: SITE_NAME,
                    url: SITE_URL,
                    logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon-192x192.png` },
                    description:
                      "CK Propfirm is a proprietary trading firm offering simulated funded accounts up to $750K with an 80% profit split.",
                  },
                  {
                    "@type": "WebSite",
                    "@id": `${SITE_URL}/#website`,
                    url: SITE_URL,
                    name: SITE_NAME,
                    publisher: { "@id": `${SITE_URL}/#organization` },
                    inLanguage: locale,
                  },
                ],
              }),
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
