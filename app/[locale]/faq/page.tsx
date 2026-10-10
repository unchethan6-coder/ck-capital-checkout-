import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { COLLECTION_GLOW, CollectionIcon } from "@/components/help/CollectionIcon";
import { HelpSearch } from "@/components/help/HelpSearch";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { HELP_ARTICLES, HELP_COLLECTIONS, blocksToText } from "@/lib/help";
import { pageSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    title: "Help Center & FAQ",
    description:
      "Official CK Prop Firm answers on evaluations, account rules, funded accounts, payouts, giveaways and the affiliate program.",
    path: "/faq",
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
  });
}

/** Rich-result markup is capped so the page does not ship every article twice. */
const JSON_LD_QUESTIONS = 20;

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("helpCenter");
  const tFaq = await getTranslations("faq");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HELP_ARTICLES.filter((a) => a.title.trim().endsWith("?"))
      .slice(0, JSON_LD_QUESTIONS)
      .map((a) => ({
        "@type": "Question",
        name: a.title,
        acceptedAnswer: { "@type": "Answer", text: blocksToText(a.blocks) },
      })),
  };

  return (
    <div className="min-h-screen bg-background" data-od-id="faq-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* ─────────────── Hero + search ─────────────── */}
      <section className="relative bg-background" data-od-id="faq-hero">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 0%, rgba(121,67,224,0.22), transparent 45%), radial-gradient(circle at 5% 100%, rgba(121,67,224,0.10), transparent 40%)",
          }}
        />
        <Container className="relative py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10.5px] font-bold tracking-[0.16em] text-[#A98BFF] uppercase">
              {t("eyebrow")}
            </span>
            <h1
              className="mt-5 font-[family-name:var(--font-jakarta)] text-3xl leading-[1.1] font-extrabold tracking-[-0.02em] text-balance text-foreground md:text-[44px]"
              data-od-id="faq-hero-title"
            >
              {t("heading")}
            </h1>
            <div className="mt-8">
              <HelpSearch />
            </div>
            {locale !== "en" && <p className="mt-4 text-xs text-foreground/50">{t("englishOnly")}</p>}
          </div>
        </Container>
      </section>

      {/* ─────────────── Collections ─────────────── */}
      <section className="bg-muted py-14 md:py-20" data-od-id="faq">
        <Container>
          <ul dir="ltr" className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HELP_COLLECTIONS.map((collection) => {
              const count = collection.sections.reduce((n, s) => n + s.articles.length, 0);
              return (
                <li key={collection.slug}>
                  <Link
                    href={`/faq/collections/${collection.slug}` as never}
                    data-od-id={`faq-collection-${collection.slug}`}
                    className="dark-panel group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#070B1F] text-center transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-[#894CEF]/60 hover:shadow-[0_18px_50px_-18px_rgba(137,76,239,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span className="relative flex h-[150px] items-center justify-center">
                      <span
                        aria-hidden
                        className="absolute inset-0 opacity-90 transition-opacity duration-200 group-hover:opacity-100"
                        style={{ background: COLLECTION_GLOW }}
                      />
                      <CollectionIcon slug={collection.slug} className="relative" />
                    </span>
                    <span className="flex flex-1 flex-col px-6 pt-4 pb-7">
                      <span className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-white">
                        {collection.name}
                      </span>
                      <span className="mt-1.5 line-clamp-3 text-[15px] leading-relaxed text-white/75">
                        {collection.description}
                      </span>
                      <span className="mt-auto pt-5 text-[15px] text-white/60">{t("articlesCount", { count })}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="bg-background py-14 md:py-20" data-od-id="faq-cta">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/25 bg-primary/[0.06] p-8 text-center sm:p-12">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
              <MessageCircle size={24} className="text-[#A98BFF]" aria-hidden />
            </div>
            <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-foreground md:text-3xl">
              {tFaq("stillQuestions")}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-foreground/65">{tFaq("supportAvailable")}</p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/contact"
                data-od-id="faq-cta-primary"
                className="brand-gradient-btn inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-black text-[#1A1030] shadow-md transition-transform duration-200 ease-out hover:-translate-y-0.5"
              >
                {t("contactSupport")} <ArrowRight size={16} aria-hidden className="rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
