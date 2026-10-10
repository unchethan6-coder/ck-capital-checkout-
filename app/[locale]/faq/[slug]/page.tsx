import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { ArticleBody } from "@/components/help/ArticleBody";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { HELP_ARTICLES, blocksToText, excerpt, getHelpArticle, getHelpCollection } from "@/lib/help";
import { pageSeo } from "@/lib/seo";

// Every article is known at build time; anything else is a 404, not a render.
export const dynamicParams = false;

export function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ slug: a.slug }));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getHelpArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return pageSeo({
    title: article.title,
    description: excerpt(blocksToText(article.blocks)),
    path: `/faq/${article.slug}`,
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    type: "article",
  });
}

export default async function HelpArticlePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getHelpArticle(slug);
  if (!article) notFound();

  const t = await getTranslations("helpCenter");
  const format = await getFormatter();
  const collection = getHelpCollection(article.collection);
  const siblings = (collection?.sections ?? [])
    .flatMap((s) => s.articles)
    .filter((s) => s !== article.slug)
    .map(getHelpArticle)
    .filter((a) => a !== undefined);

  return (
    <div className="min-h-screen bg-background" data-od-id="faq-article-page">
      <Container className="py-10 md:py-16">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-foreground/55">
            <Link href="/faq" className="inline-flex min-h-9 items-center gap-1 transition-colors hover:text-[#A98BFF]">
              <ChevronLeft size={14} aria-hidden className="rtl:rotate-180" />
              {t("eyebrow")}
            </Link>
            {collection && (
              <>
                <span aria-hidden className="text-foreground/25">/</span>
                <Link href={`/faq/collections/${collection.slug}` as never} dir="ltr" className="inline-flex min-h-9 items-center transition-colors hover:text-[#A98BFF]">
                  {collection.name}
                </Link>
              </>
            )}
          </nav>

          <article className="mt-5 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6 sm:p-10" data-od-id="faq-article">
            <h1
              dir="ltr"
              className="font-[family-name:var(--font-jakarta)] text-3xl leading-[1.15] font-extrabold tracking-[-0.02em] text-balance text-foreground md:text-4xl"
            >
              {article.title}
            </h1>
            <p className="mt-3 text-xs text-foreground/50">
              {t("updated", { date: format.dateTime(new Date(article.updated), { dateStyle: "long", timeZone: "UTC" }) })}
            </p>
            <ArticleBody blocks={article.blocks} className="mt-7" />
          </article>

          {collection && siblings.length > 0 && (
            <section className="mt-10" data-od-id="faq-article-related">
              <h2 className="text-xs font-bold tracking-[0.12em] text-foreground/55 uppercase">
                {t("moreIn", { collection: collection.name })}
              </h2>
              <ul dir="ltr" className="mt-3 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.03]">
                {siblings.slice(0, 6).map((a) => (
                  <li key={a.slug} className="border-b border-foreground/10 last:border-0">
                    <Link
                      href={`/faq/${a.slug}` as never}
                      className="flex min-h-12 items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground/85 transition-colors hover:bg-foreground/[0.05] hover:text-[#A98BFF] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]"
                    >
                      <span className="min-w-0">{a.title}</span>
                      <ChevronRight size={15} aria-hidden className="shrink-0 text-foreground/35" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
