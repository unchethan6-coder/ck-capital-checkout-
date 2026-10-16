import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { COLLECTION_GLOW, CollectionIcon } from "@/components/help/CollectionIcon";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { HELP_COLLECTIONS, getHelpCollectionAsync, getHelpCollectionsAsync, getHelpArticlesAsync } from "@/lib/help";
import { pageSeo, SITE_URL } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  const [staticSlugs, cmsCollections] = await Promise.all([
    HELP_COLLECTIONS.map((c) => ({ collection: c.slug })),
    getHelpCollectionsAsync().catch(() => []),
  ]);
  const seen = new Set(staticSlugs.map((s) => s.collection));
  for (const c of cmsCollections) {
    if (!seen.has(c.slug)) {
      seen.add(c.slug);
      staticSlugs.push({ collection: c.slug });
    }
  }
  return staticSlugs;
}

type Params = Promise<{ locale: string; collection: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, collection: slug } = await params;
  const collection = await getHelpCollectionAsync(slug);
  if (!collection) return { title: "Collection Not Found" };
  return pageSeo({
    title: `${collection.name} — Help Center`,
    description: `${collection.description} — official CK Prop Firm help articles.`,
    path: `/faq/collections/${collection.slug}`,
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
  });
}

export default async function HelpCollectionPage({ params }: { params: Params }) {
  const { locale, collection: slug } = await params;
  setRequestLocale(locale);
  const [collection, allArticles] = await Promise.all([
    getHelpCollectionAsync(slug),
    getHelpArticlesAsync(),
  ]);
  if (!collection) notFound();
  const titlesBySlug = new Map(allArticles.map((a) => [a.slug, a.title]));

  const t = await getTranslations("helpCenter");
  const count = collection.sections.reduce((n, s) => n + s.articles.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Help Center",
        item: `${SITE_URL}/${locale}/faq`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collection.name,
        item: `${SITE_URL}/${locale}/faq/collections/${collection.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background" data-od-id="faq-collection-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Container className="py-10 md:py-16">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-[13px] text-foreground/55">
            <Link href="/faq" className="inline-flex min-h-9 items-center gap-1 transition-colors hover:text-[#A98BFF]">
              <ChevronLeft size={14} aria-hidden className="rtl:rotate-180" />
              {t("eyebrow")}
            </Link>
          </nav>

          <header
            dir="ltr"
            className="dark-panel relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#070B1F] px-6 pt-10 pb-8 text-center"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40" style={{ background: COLLECTION_GLOW }} />
            <CollectionIcon slug={collection.slug} className="relative mx-auto" />
            <h1 className="relative mt-6 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.02em] text-white md:text-4xl">
              {collection.name}
            </h1>
            <p className="relative mt-2 text-[15px] text-white/70">{collection.description}</p>
            <p className="relative mt-4 text-sm text-white/55">{t("articlesCount", { count })}</p>
          </header>

          <div dir="ltr" className="mt-8 space-y-8">
            {collection.sections.map((section) => (
              <section key={section.name ?? "_"}>
                {section.name && (
                  <h2 className="mb-2 text-xs font-bold tracking-[0.12em] text-[#A98BFF] uppercase">{section.name}</h2>
                )}
                <ul className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.03]">
                  {section.articles.map((articleSlug) => (
                    <li key={articleSlug} className="border-b border-foreground/10 last:border-0">
                      <Link
                        href={`/faq/${articleSlug}` as never}
                        className="flex min-h-12 items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground/85 transition-colors hover:bg-foreground/[0.05] hover:text-[#A98BFF] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]"
                      >
                        <span className="min-w-0">{titlesBySlug.get(articleSlug) ?? articleSlug}</span>
                        <ChevronRight size={15} aria-hidden className="shrink-0 text-foreground/35" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
