"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import type { CmsArticle } from "@/lib/cms";
import { cn } from "@/lib/utils";

/**
 * "Built by traders, for traders" — exact clone of FundingPips media showcase,
 * re-themed to CK Capital (light #FFFFFF, matching ProofShowcase / ChallengeComparison / TraderStories).
 * Stock trader photos as placeholders + 3.5s auto-scroll, pause on hover, resume 5s after click.
 */

const CATEGORIES: {
  key: CmsArticle["category"];
  labelKey: "catNews" | "catTips" | "catEducation";
}[] = [
  { key: "news", labelKey: "catNews" },
  { key: "trading-tips", labelKey: "catTips" },
  { key: "education", labelKey: "catEducation" },
];

const FALLBACK_IMAGES: Record<CmsArticle["category"], string> = {
  news: "/images/blog/stock-news.jpg",
  "trading-tips": "/images/testimonials/hqdefault-ae10a042fa.jpg",
  education: "/images/testimonials/hqdefault-9c0405cb37.jpg",
};

export function BlogCategories({ articles }: { articles: CmsArticle[] }) {
  const t = useTranslations("insights");
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [pausedByClick, setPausedByClick] = useState(false);

  const latestByCategory = useMemo(() => {
    const map: Record<string, CmsArticle | null> = {};
    for (const cat of CATEGORIES) {
      map[cat.key] =
        articles
          .filter((a) => a.category === cat.key)
          .sort(
            (a, b) =>
              new Date(b.publishedAt ?? 0).getTime() -
              new Date(a.publishedAt ?? 0).getTime()
          )[0] ?? null;
    }
    return map;
  }, [articles]);

  const availableCategories = useMemo(
    () => CATEGORIES.filter((category) => latestByCategory[category.key]),
    [latestByCategory]
  );
  const active = availableCategories[activeIdx] ?? availableCategories[0] ?? CATEGORIES[0];
  const activeArticle = latestByCategory[active.key];
  const cover = activeArticle?.coverImage?.url ?? FALLBACK_IMAGES[active.key];

  // Auto-scroll: 3.5s interval, pause on hover, respect reduced-motion, resume 5s after manual click
  // Use refs so hover pause doesn't teardown the interval (more reliable than effect deps)
  const hoveredRef = useRef(isHovered);
  const pausedRef = useRef(pausedByClick);
  useEffect(() => { hoveredRef.current = isHovered; }, [isHovered]);
  useEffect(() => { pausedRef.current = pausedByClick; }, [pausedByClick]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (hoveredRef.current || pausedRef.current) return;
      if (availableCategories.length > 1) {
        setActiveIdx((i) => (i + 1) % availableCategories.length);
      }
    }, 3500);
    return () => window.clearInterval(id);
  }, [availableCategories.length]);

  const selectIdx = (i: number) => {
    setActiveIdx(i);
    setPausedByClick(true);
    window.setTimeout(() => setPausedByClick(false), 5000);
  };

  if (availableCategories.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-white py-16 text-[#0A0A0C] md:py-24"
      data-od-id="blog-categories"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <Container>
        {/* Header — centered, tight, matching ProofShowcase / ChallengeComparison / TraderStories */}
        <SectionReveal className="text-center">
          <h2 className="mx-auto max-w-2xl font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.02em] text-[#0A0A0C] sm:text-4xl md:text-5xl">
            {t("title1")}
            <br />
            {t("title2")}
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-7 text-gray-500">
            {t("subtitle")}
          </p>
        </SectionReveal>

        {/* Featured slideshow panel — visible on sm+ (hidden on mobile) */}
        <SectionReveal delay={0.08} className="mt-8 sm:mt-10 hidden sm:block">
          <div
            className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[20px] border border-gray-800 bg-[#0A0A0C] shadow-lg"
            data-od-id="blog-featured"
          >
            {/* Fixed heights to match reference */}
            <div className="relative h-[360px] sm:h-[420px] lg:h-[480px]">
              <Image
                key={active.key}
                src={cover}
                alt={activeArticle?.title ?? t(active.labelKey)}
                fill
                className="object-cover opacity-60"
                sizes="(max-width: 1100px) 100vw, 1100px"
                priority={false}
              />
              {/* High contrast overlay — photo stays textured, text gets crystal clear readability */}
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

              {/* Centered content — white on photo via contrast scrim */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 sm:text-xs">
                  {t(active.labelKey)}
                </p>
                <h3 className="max-w-3xl text-balance font-[family-name:var(--font-jakarta)] text-[22px] font-bold leading-[1.15] text-white sm:text-[28px] md:text-[30px] [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
                  {activeArticle ? activeArticle.title : t("comingSoon")}
                </h3>
                {activeArticle ? (
                  <Link
                    href={`/blog/${activeArticle.slug}`}
                    className="mt-2 inline-flex min-h-[38px] items-center justify-center rounded-full border border-white/80 bg-white/15 px-5 text-[13px] font-semibold text-white backdrop-blur-[6px] transition-colors hover:border-white hover:bg-white hover:text-[#0A0A0C]"
                    data-od-id="blog-featured-cta"
                  >
                    {t("readLatest")}
                  </Link>
                ) : (
                  <Link
                    href="/blog"
                    className="mt-2 inline-flex min-h-[38px] items-center justify-center rounded-full border border-white/80 bg-white/15 px-5 text-[13px] font-semibold text-white backdrop-blur-[6px] transition-colors hover:border-white hover:bg-white hover:text-[#0A0A0C]"
                    data-od-id="blog-featured-cta"
                  >
                    {t("visitBlog")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Category selector cards — 1st full width on mobile (230px), 2nd & 3rd half width in one row (190px), 3 equal columns on desktop */}
        <div className="relative z-10 mx-auto mt-8 grid max-w-[980px] grid-cols-2 gap-3.5 px-2 sm:-mt-[68px] sm:grid-cols-3 sm:gap-4">
          {availableCategories.map((cat, i) => {
            const article = latestByCategory[cat.key];
            const cardCover = article?.coverImage?.url ?? FALLBACK_IMAGES[cat.key];
            const isActive = i === activeIdx;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => selectIdx(i)}
                aria-pressed={isActive}
                data-od-id={`blog-cat-${cat.key}`}
                className={cn(
                  "group relative w-full overflow-hidden rounded-2xl border bg-[#0A0A0C] text-white text-left shadow-[0_12px_28px_-16px_rgba(15,23,42,0.12)] transition-all",
                  i === 0
                    ? "col-span-2 h-[230px] sm:h-[164px] sm:col-span-1"
                    : "col-span-1 h-[190px] sm:h-[164px]",
                  isActive
                    ? "border-[#894CEF] ring-2 ring-[#894CEF] ring-offset-2 ring-offset-white"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                )}
              >
                <Image
                  src={cardCover}
                  alt={t(cat.labelKey)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 312px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 pr-4 sm:pr-20">
                  <p className="font-[family-name:var(--font-jakarta)] text-[13px] sm:text-[13.5px] font-bold leading-none text-white">
                    {t(cat.labelKey)}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-[11px] sm:text-[11.5px] font-medium leading-[1.4] text-white/80">
                    {article ? article.title : t("comingSoon")}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Slide indicators — visible on sm+ */}
        <div className="mt-6 hidden sm:flex items-center justify-center gap-2">
          {availableCategories.map((cat, i) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => selectIdx(i)}
              aria-label={`${t(cat.labelKey)} slide`}
              className={cn(
                "h-1 rounded-full transition-all",
                i === activeIdx ? "w-7 bg-[#0A0A0C]" : "w-3.5 bg-[#E5E7EB] hover:bg-[#D1D5DB]"
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
