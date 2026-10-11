import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft, User, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { GoldButton } from "@/components/shared/GoldButton";
import { BlocksRenderer } from "@/components/blog/BlocksRenderer";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/cms";
import type { CmsArticle } from "@/lib/cms";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getLocaleMeta } from "@/i18n/locales";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function articleOgImage(article: CmsArticle) {
  const img = article.coverImage;
  if (img?.url) {
    return { url: img.url, width: img.width ?? 1200, height: img.height ?? 630, alt: article.title };
  }
  return DEFAULT_OG_IMAGE;
}

type ArticleParams = Promise<{ locale?: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: ArticleParams;
}): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;
  const localeMeta = getLocaleMeta(locale);
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  const url = `${SITE_URL}/${locale}/blog/${article.slug}`;
  const title = article.seoTitle ?? `${article.title} | CK Propfirm`;
  const description = article.seoDescription ?? article.excerpt ?? "";
  const image = articleOgImage(article);
  const imageUrl = image.url.startsWith("http") ? image.url : `${SITE_URL}${image.url}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        "x-default": `${SITE_URL}/en/blog/${article.slug}`,
        "en-US": `${SITE_URL}/en/blog/${article.slug}`,
        "es-ES": `${SITE_URL}/es/blog/${article.slug}`,
        "pt-BR": `${SITE_URL}/pt/blog/${article.slug}`,
        ar: `${SITE_URL}/ar/blog/${article.slug}`,
        "de-DE": `${SITE_URL}/de/blog/${article.slug}`,
        "fr-FR": `${SITE_URL}/fr/blog/${article.slug}`,
        "hi-IN": `${SITE_URL}/hi/blog/${article.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: localeMeta?.ogLocale ?? "en_US",
      alternateLocale: ["en_US", "es_ES", "pt_BR", "ar_AR", "de_DE", "fr_FR", "hi_IN"].filter(
        (l) => l !== (localeMeta?.ogLocale ?? "en_US")
      ),
      images: [image],
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
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

export default async function ArticlePage({
  params,
}: {
  params: ArticleParams;
}) {
  const { slug, locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;
  setRequestLocale(locale);

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const image = articleOgImage(article);
  const imageUrl = image.url.startsWith("http") ? image.url : `${SITE_URL}${image.url}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
            name: "Blog",
            item: `${SITE_URL}/${locale}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${SITE_URL}/${locale}/blog/${article.slug}`,
          },
        ],
      },
      {
        "@type": "BlogPosting",
        headline: article.title,
        description: article.seoDescription ?? article.excerpt ?? "",
        image: imageUrl,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: {
          "@type": "Person",
          name: article.author || SITE_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/favicon-192x192.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/${locale}/blog/${article.slug}`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background" data-od-id="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* ─────────────── Hero Header (LIGHT) ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] overflow-hidden border-b border-gray-200 bg-white pt-28 md:pt-36 pb-14 md:pb-20 text-[#0A0A0C]" data-od-id="article-hero">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
          <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
        </div>
        <Container className="relative z-10">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4B5563] transition-colors hover:text-[#0A0A0C]"
          >
            <ChevronLeft size={16} />
            Back to Blog
          </Link>
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
                {article.category}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                <Calendar size={12} className="text-[#6B7280]" />
                {formatDate(article.publishedAt)}
              </span>
              {article.author && (
                <span className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                  <User size={12} className="text-[#6B7280]" />
                  {article.author}
                </span>
              )}
            </div>
            <h1
              className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-[#0A0A0C] md:text-5xl"
              data-od-id="article-title"
            >
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-5 text-[16px] leading-relaxed text-[#4B5563]">
                {article.excerpt}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* ─────────────── Article Canvas ─────────────── */}
      <section className="bg-white border-b border-[#E5E7EB] py-12 md:py-20 text-[#111827]" data-od-id="article-body">
        <Container className="max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-10 md:p-12 shadow-sm">
            {article.coverImage && (
              <div className="mb-10 overflow-hidden rounded-xl border border-[#E5E7EB]">
                <Image
                  src={article.coverImage.url}
                  alt={article.title}
                  width={article.coverImage.width ?? 1200}
                  height={article.coverImage.height ?? 630}
                  className="h-auto w-full object-cover"
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  priority
                />
              </div>
            )}

            <article className="prose prose-gray max-w-none prose-headings:font-[family-name:var(--font-jakarta)] prose-headings:font-bold prose-headings:text-[#0A0A0C] prose-p:text-[#4B5563] prose-p:leading-relaxed prose-a:text-[#0A0A0C] prose-a:font-semibold hover:prose-a:text-[#A98BFF] prose-a:underline">
              <BlocksRenderer blocks={article.body} />
            </article>
          </div>
        </Container>
      </section>

      {/* ─────────────── Closing CTA ─────────────── */}
      <section className="relative overflow-hidden bg-white border-t border-gray-200 py-20 md:py-28 text-[#0A0A0C]" data-od-id="article-closing-cta">
        <Container className="relative text-center">
          <h2 className="mx-auto max-w-3xl font-[family-name:var(--font-jakarta)] text-4xl font-extrabold tracking-[-0.04em] text-[#0A0A0C] md:text-6xl">
            Start Trading with CK Propfirm
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#4B5563]">
            Take your trading strategy to the next level with our simulated evaluation accounts.
          </p>
          <div className="mt-8">
            <Link href="/#start-challenge">
              <GoldButton size="lg">
                Start Your Evaluation <ArrowRight size={16} />
              </GoldButton>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
