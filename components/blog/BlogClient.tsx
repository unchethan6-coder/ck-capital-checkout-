"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, FileText, Sparkles, User, ShieldCheck, Newspaper } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { GoldButton } from "@/components/shared/GoldButton";
import { Aurora } from "@/components/fx/Aurora";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { BlogHeroVisual } from "@/components/shared/BlogHeroVisual";
import { ARTICLE_CATEGORIES } from "@/lib/cms";
import type { CmsArticle } from "@/lib/cms";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogClient({ articles }: { articles: CmsArticle[] }) {
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all" ? articles : articles.filter((a) => a.category === active);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-background" data-od-id="blog-page">
      {/* ─────────────── Hero (DARK) ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] flex min-h-[calc(100dvh-44px)] flex-col overflow-hidden border-b border-gray-200 bg-white" data-od-id="blog-hero">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
          <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
          <div className="absolute top-[20%] -right-[10%] w-[55%] h-[65%] rounded-full opacity-55 fx-hero-glow-3" />
          <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[50%] rounded-full opacity-40 fx-hero-glow-4" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <Aurora variant="hero" grid className="absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pb-10 pt-20 sm:px-6 md:pb-10 md:pt-24 lg:px-8">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-7 xl:col-span-6 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-[#7943E0]/30 bg-[#7943E0]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">
                  <Sparkles size={12} /> Insights &amp; Market Analysis
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-6 max-w-3xl font-[family-name:var(--font-jakarta)] text-[clamp(38px,7vw,44px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0A0A0C] sm:text-[52px] md:text-[60px] lg:text-[54px] xl:text-[68px]"
                data-od-id="blog-hero-title"
              >
                CK Capital <span className="shimmer-text">Blog</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#4B5563] sm:text-[15px]"
              >
                Expert trading tips, systematic market analysis, risk management strategies, and success stories from our global analyst community.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.36 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <a href="#blog-feed" data-od-id="blog-hero-primary">
                  <GoldButton size="lg">
                    Browse Articles <ArrowRight size={16} />
                  </GoldButton>
                </a>
                <a
                  href="/#start-challenge"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#4B5563] hover:text-[#0A0A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                >
                  Start Evaluation <ArrowRight size={15} />
                </a>
              </motion.div>

              <div className="mt-14 flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                <span className="inline-flex items-center gap-2"><Newspaper size={14} className="text-[#A98BFF]" /> Curated Content</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-[#A98BFF]" /> Risk & Strategy Guides</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 xl:col-span-6 min-w-0"
              data-od-id="blog-hero-dashboard"
            >
              <BlogHeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── Blog Feed ─────────────── */}
      <section id="blog-feed" className="scroll-mt-24 bg-white border-b border-[#E5E7EB] py-16 md:py-24 text-[#0A0A0C]" data-od-id="blog-feed">
        <Container>
          {articles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-xl rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center shadow-sm sm:py-20"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                <FileText size={24} className="text-[#0A0A0C]" />
              </div>
              <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-extrabold text-[#0A0A0C] md:text-2xl">
                Articles Coming Soon
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#4B5563]">
                We&apos;re putting the finishing touches on our insights hub. Trading tips,
                market analysis, and trader success stories will be published here shortly.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-12">
              {/* Category filter */}
              <div className="flex flex-wrap gap-2 pb-2 justify-center px-1" data-od-id="blog-filter">
                {ARTICLE_CATEGORIES.map((cat) => {
                  const isActive = active === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActive(cat.value)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs font-bold transition-all",
                        isActive
                          ? "border-[#703AD7] bg-[#703AD7] text-white font-extrabold shadow-sm"
                          : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-gray-300 hover:text-[#0A0A0C]"
                      )}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Featured post */}
              {featured && (
                <div data-od-id="blog-featured">
                  <AnimatePresence mode="wait">
                    <motion.article
                      key={featured.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-7 sm:p-10 shadow-sm hover:shadow-md transition-all"
                      data-od-id="blog-featured-card"
                    >
                      <div className="relative">
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-[#703AD7] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
                            Featured
                          </span>
                          <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
                            {featured.category}
                          </span>
                        </div>
                        <h2 className="max-w-2xl font-[family-name:var(--font-jakarta)] text-2xl font-extrabold leading-tight text-[#0A0A0C] md:text-3xl">
                          {featured.title}
                        </h2>
                        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#4B5563]">
                          {featured.excerpt}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E7EB] pt-5">
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                              <Calendar size={12} className="text-[#6B7280]" />
                              {formatDate(featured.publishedAt)}
                            </span>
                            {featured.author && (
                              <span className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                                <User size={12} className="text-[#6B7280]" />
                                {featured.author}
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/blog/${featured.slug}`}
                            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0A0A0C] hover:text-[#A98BFF] underline"
                          >
                            Read More <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  </AnimatePresence>
                </div>
              )}

              {/* Blog grid */}
              {rest.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" data-od-id="blog-grid">
                  {rest.map((post) => (
                    <article
                      key={post.slug}
                      className="group flex flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                      data-od-id={`blog-card-${post.slug}`}
                    >
                      {post.coverImage ? (
                        <div className="relative h-44 w-full overflow-hidden rounded-t-2xl border-b border-[#E5E7EB]">
                          <Image
                            src={post.coverImage.url}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
                            {post.category}
                          </span>
                        </div>
                        <h2 className="font-[family-name:var(--font-jakarta)] text-lg font-bold leading-snug text-[#0A0A0C] transition-colors group-hover:text-[#A98BFF]">
                          {post.title}
                        </h2>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4B5563]">
                          {post.excerpt}
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
                          <span className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                            <Calendar size={11} className="text-[#6B7280]" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0A0A0C] hover:text-[#A98BFF] underline"
                          >
                            Read <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-[15px] text-[#6B7280]">
                    No other posts in this category yet — check back soon.
                  </p>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* ─────────────── Closing CTA ─────────────── */}
      <section className="relative overflow-hidden bg-white border-t border-gray-200 py-20 md:py-28 text-[#0A0A0C]" data-od-id="blog-closing-cta">
        <Container className="relative text-center">
          <SectionReveal>
            <h2 className="mx-auto max-w-3xl font-[family-name:var(--font-jakarta)] text-4xl font-extrabold tracking-[-0.04em] text-[#0A0A0C] md:text-6xl">
              Apply Your Knowledge Today
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#4B5563]">
              Put proven market analysis into action with a simulated evaluation account on MT5 or TradeLocker.
            </p>
            <div className="mt-8">
              <a href="/#start-challenge">
                <GoldButton size="lg">
                  Start Challenge <ArrowRight size={16} />
                </GoldButton>
              </a>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </div>
  );
}
