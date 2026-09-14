"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { FALLBACK_VIDEOS, VIDEO_META, type VideoItem } from "@/components/sections/Testimonials";

/**
 * Trader stories carousel (homepage, light) — Infinite looping marquee
 * with full-card frosted glass hover overlay (backdrop blur), hover pause,
 * 1-to-1 video metadata alignment, arrow controls, and a YouTube lightbox.
 */
export function TraderStories({ videos = FALLBACK_VIDEOS }: { videos?: VideoItem[] }) {
  const t = useTranslations("stories");
  const [playing, setPlaying] = useState<string | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const isPausedRef = useRef(false);

  const rawList = videos.length ? videos : FALLBACK_VIDEOS;
  const items = rawList.map((v) => {
    const meta = VIDEO_META[v.id];
    const fallbackThumb = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
    return {
      ...v,
      title: meta?.title || v.title || "Trader Success Story",
      reward: v.reward || meta?.reward || null,
      desc: meta?.desc || v.desc || "Verified Trader • CK Propfirm",
      thumbnail: meta?.thumbnail || v.thumbnail || fallbackThumb,
    };
  });

  // Quadruple items to provide a robust, seamless loop across all screen sizes
  const repeatedItems = [...items, ...items, ...items, ...items];

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let raf: number;

    const tick = () => {
      if (!row.isConnected) return;
      if (!isPausedRef.current) {
        posRef.current += 0.45;
        const half = row.scrollWidth / 2;
        if (posRef.current >= half) {
          posRef.current -= half;
        }
        row.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nudge = useCallback((dir: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const card = row.querySelector("article");
    const step = (card ? card.getBoundingClientRect().width : 380) + 16;
    const half = row.scrollWidth / 2;
    posRef.current += dir * step;
    if (posRef.current >= half) posRef.current -= half;
    if (posRef.current < 0) posRef.current += half;
    row.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
  }, []);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [playing]);

  return (
    <section className="bg-white py-16 text-[#0A0A0C] md:py-24" data-od-id="trader-stories">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.02em] text-[#0A0A0C] sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-gray-500">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Carousel — full-bleed infinite marquee */}
      <div
        className="relative mt-12"
        onMouseEnter={() => {
          isPausedRef.current = true;
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
        }}
      >
        <div className="overflow-hidden">
          <div ref={rowRef} className="flex w-max gap-4 px-4 sm:px-6 lg:px-8 will-change-transform">
            {repeatedItems.map((v, i) => {
              const key = `${v.id}-${i}`;
              return (
                <article
                  key={key}
                  role="button"
                  tabIndex={0}
                  onClick={() => setPlaying(v.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPlaying(v.id);
                    }
                  }}
                  className="group relative w-[85vw] max-w-[360px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-gray-200/80 bg-[#0A0A0C] shadow-[0_20px_44px_-20px_rgba(10,10,12,0.35)] sm:w-[360px]"
                  data-od-id={`story-card-${v.id}`}
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    {/* Thumbnail Image */}
                    <Image
                      src={v.thumbnail}
                      alt={v.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 320px, 420px"
                    />

                    {/* Idle State: Clean view with subtle top tag */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 transition-opacity duration-300 group-hover:opacity-0" />
                    <p className="absolute left-4 top-3.5 text-[11px] font-black tracking-[0.18em] text-white/90 drop-shadow transition-opacity duration-300 group-hover:opacity-0">
                      CK PROPFIRM
                    </p>

                    {/* Hover State: Full-card Frosted Glass Overlay (Backdrop Blur) */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-5 bg-black/65 backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100">
                      {/* Top row: Badge & Branding */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider bg-[#894CEF] text-[#030A1C] shadow-sm">
                          {t("successStory")}
                        </span>
                        <span className="text-[10.5px] font-black tracking-[0.18em] text-white/90">
                          CK PROPFIRM
                        </span>
                      </div>

                      {/* Center: Radiant Play Button */}
                      <div className="flex items-center justify-center my-auto">
                        <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#894CEF] text-[#030A1C] shadow-[0_0_24px_rgba(1,162,239,0.6)] transition-transform duration-300 group-hover:scale-110">
                          <Play size={20} fill="#030A1C" stroke="none" className="ml-1" />
                        </span>
                      </div>

                      {/* Bottom: Title & Description */}
                      <div className="pt-2">
                        <p className="text-[13.5px] sm:text-[14.5px] font-bold text-white leading-snug line-clamp-2">
                          {v.title}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-white/70 line-clamp-1">
                          {v.desc || "Verified Trader • CK Propfirm"}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Previous stories"
          className="absolute left-4 top-1/2 z-30 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-[#0A0A0C] shadow-[0_10px_28px_rgba(10,10,12,0.18)] transition-transform hover:scale-105 active:scale-95 sm:left-8"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Next stories"
          className="absolute right-4 top-1/2 z-30 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-[#0A0A0C] shadow-[0_10px_28px_rgba(10,10,12,0.18)] transition-transform hover:scale-105 active:scale-95 sm:right-8"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Discord Community CTA */}
      <div className="mx-auto mt-10 flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
        <a
          href="https://discord.com/invite/hGSVx9CmS2"
          target="_blank"
          rel="noopener noreferrer"
          className="brand-gradient-btn inline-flex h-12 items-center justify-center rounded-xl px-8 text-[15px] font-bold text-[#1A1030] shadow-lg transition-all hover:opacity-95"
        >
          Join Our Community
        </a>
      </div>

      {/* Lightbox */}
      {playing ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setPlaying(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Trader story video"
        >
          <button
            type="button"
            onClick={() => setPlaying(null)}
            aria-label="Close video"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
          >
            <X size={22} />
          </button>
          <div
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${playing}?autoplay=1&rel=0`}
              title="Trader story video"
              className="absolute inset-0 h-full w-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
