"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface BannerSlide {
  id: string;
  tabLabelKey: string;
  defaultTabLabel: string;
  shortTabLabel: string;
  imageSrc: string;
  alt: string;
  targetId?: string;
  glowColor: "amber" | "purple";
}

const SLIDES: BannerSlide[] = [
  {
    id: "promo-70",
    tabLabelKey: "tabPromo",
    defaultTabLabel: "CK Propfirm • 70% Off",
    shortTabLabel: "70% Off",
    imageSrc: "/images/banners/whats-new-promo-70.jpeg",
    alt: "CK Propfirm 70% Off Promo - Get Started",
    targetId: "pricing-calculator",
    glowColor: "amber",
  },
  {
    id: "leverage",
    tabLabelKey: "tabLeverage",
    defaultTabLabel: "1:100 Leverage • Max Exposure",
    shortTabLabel: "1:100 Leverage",
    imageSrc: "/images/banners/whats-new-leverage.jpeg",
    alt: "CK Propfirm 1:100 Leverage - Unlock greater market exposure",
    targetId: "pricing-calculator",
    glowColor: "purple",
  },
  {
    id: "labs",
    tabLabelKey: "tabLabs",
    defaultTabLabel: "CK Labs • Coming Soon",
    shortTabLabel: "CK Labs",
    imageSrc: "/images/banners/whats-new-labs.jpeg",
    alt: "CK Labs Coming Soon",
    targetId: "pricing-calculator",
    glowColor: "purple",
  },
];

const AUTOPLAY_INTERVAL = 6000;

export function WhatsNewBanner({
  viewMode = "cards",
}: {
  viewMode?: "cards" | "table";
}) {
  const t = useTranslations("whatsNew");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isDark = viewMode === "cards";

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay management
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, nextSlide, activeIndex]);

  const activeSlide = SLIDES[activeIndex];

  const handleBannerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeSlide.targetId) {
      const el =
        document.getElementById(activeSlide.targetId) ||
        document.querySelector('[data-od-id="challenge-title"]');
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="w-full flex flex-col gap-3 sm:gap-3.5 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-od-id="whats-new-section"
    >
      {/* Title & Tabs Header */}
      <div className="flex flex-col gap-2.5 sm:gap-3">
        <h3
          className={cn(
            "font-[family-name:var(--font-jakarta)] text-lg sm:text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300",
            isDark ? "text-white" : "text-[#0A0A0C]"
          )}
        >
          {(() => {
            try {
              return t("title") || "What's New";
            } catch {
              return "What's New";
            }
          })()}
        </h3>

        {/* Tab Pills Strip: Concise labels on mobile so all 3 fit side-by-side without clipping */}
        <div
          role="tablist"
          aria-label="What's New announcements"
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap"
        >
          {SLIDES.map((slide, idx) => {
            const isActive = activeIndex === idx;
            let fullLabel = slide.defaultTabLabel;
            try {
              const translated = t(slide.tabLabelKey as "tabPromo" | "tabLeverage" | "tabLabs");
              if (translated && !translated.startsWith("whatsNew.")) {
                fullLabel = translated;
              }
            } catch {
              fullLabel = slide.defaultTabLabel;
            }

            return (
              <button
                key={slide.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative shrink-0 whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-[13px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#894CEF]",
                  isActive
                    ? "bg-[#894CEF] text-white shadow-[0_0_16px_rgba(137,76,239,0.4)] border border-[#A98BFF]/40"
                    : isDark
                    ? "border border-white/15 bg-white/[0.03] text-white/75 hover:border-white/35 hover:text-white hover:bg-white/[0.07]"
                    : "border border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400 hover:text-black hover:bg-gray-200/80"
                )}
              >
                {/* Compact label on mobile viewports so all 3 fit seamlessly */}
                <span className="md:hidden">{slide.shortTabLabel}</span>
                {/* Full label on tablet / desktop */}
                <span className="hidden md:inline">{fullLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Banner Card (subtle dark border to avoid double-border clash with artwork) */}
      <div
        className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#070913] shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-500 hover:border-white/20"
      >
        <a
          href={`#${activeSlide.targetId || "pricing-calculator"}`}
          onClick={handleBannerClick}
          className="block relative w-full aspect-[16/9] sm:aspect-[1981/793] cursor-pointer"
          data-od-id="whats-new-banner-link"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={activeSlide.imageSrc}
                alt={activeSlide.alt}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.012]"
              />
            </motion.div>
          </AnimatePresence>
        </a>

        {/* Prev / Next Controls */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous announcement"
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-md border border-white/10 opacity-0 transition-all duration-200 hover:bg-black/80 hover:text-white hover:scale-105 group-hover:opacity-100 focus:opacity-100"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next announcement"
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-md border border-white/10 opacity-0 transition-all duration-200 hover:bg-black/80 hover:text-white hover:scale-105 group-hover:opacity-100 focus:opacity-100"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  );
}
