import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllArticleSlugs } from "@/lib/cms";
import { locales } from "@/i18n/routing";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/evaluation", priority: 0.9, changeFrequency: "weekly" },
  { path: "/instant", priority: 0.9, changeFrequency: "weekly" },
  { path: "/trading-objectives", priority: 0.8, changeFrequency: "weekly" },
  { path: "/affiliates", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/payouts", priority: 0.7, changeFrequency: "monthly" },
  { path: "/symbols", priority: 0.8, changeFrequency: "daily" },
  { path: "/economic-calendar", priority: 0.8, changeFrequency: "daily" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms-conditions", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/risk-disclosure", priority: 0.2, changeFrequency: "yearly" },
  { path: "/return-policy", priority: 0.2, changeFrequency: "yearly" },
];

const languages: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
  ar: "ar",
  de: "de-DE",
  fr: "fr-FR",
  hi: "hi-IN",
};

function alternatesFor(path: string) {
  const languageMap: Record<string, string> = {};
  for (const locale of locales) {
    languageMap[languages[locale]] = `${SITE_URL}/${locale}${path}`;
  }
  return {
    languages: languageMap,
    canonical: `${SITE_URL}/en${path}`,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries = routes.flatMap((r) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${r.path}`,
      lastModified,
      changeFrequency: r.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: r.priority,
      alternates: alternatesFor(r.path),
    }))
  );

  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllArticleSlugs();
    articleEntries = slugs.flatMap((slug) =>
      locales.map((locale) => ({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: alternatesFor(`/blog/${slug}`),
      }))
    );
  } catch {
    // CMS unreachable — static routes only
  }

  return [...staticEntries, ...articleEntries];
}
