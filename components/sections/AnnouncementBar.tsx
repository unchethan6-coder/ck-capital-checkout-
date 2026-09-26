"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X } from "lucide-react";
import { SITE_META } from "@/lib/content";

export interface AnnouncementBanner {
  id?: number;
  text: string;
  link?: string | null;
}

export function AnnouncementBar({
  banners,
}: {
  banners?: (string | AnnouncementBanner)[];
} = {}) {
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const t = useTranslations("announcement");

  // Normalize banners array into items with text and link
  const bannerList: AnnouncementBanner[] = (banners ?? [])
    .map((b) => (typeof b === "string" ? { text: b } : b))
    .filter((b): b is AnnouncementBanner => Boolean(b && b.text && b.text.trim().length > 0));

  // Auto-rotate if multiple banners
  useEffect(() => {
    if (bannerList.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerList.length, isPaused]);

  if (!visible) return null;

  const currentBanner = bannerList.length > 0 ? bannerList[currentIndex] : null;

  return (
    <div
      className="relative z-30 flex items-center justify-center bg-[#030A1C] px-4 py-2.5 text-center text-xs sm:text-[13px] border-b border-white/[0.08]"
      data-od-id="announcement-bar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 pr-7 sm:pr-8">
        {currentBanner ? (
          <>
            <span className="font-semibold text-white/95 tracking-wide">
              {currentBanner.text}
            </span>
            <Link
              href={currentBanner.link || "/#start-challenge"}
              onClick={(e) => {
                const link = currentBanner.link;
                if (!link || link.startsWith("/#") || link.startsWith("#")) {
                  const targetId = (link ? link.replace(/^\/?#/, "") : "start-challenge");
                  const el = document.getElementById(targetId);
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.replaceState(null, "", `${window.location.pathname}#${targetId}`);
                  }
                }
              }}
              className="inline-flex min-h-11 items-center gap-1 py-1 font-bold text-[#A98BFF] hover:underline sm:min-h-0 sm:py-0"
            >
              {t("claimOffer")} <span>→</span>
            </Link>

            {bannerList.length > 1 && (
              <div className="hidden sm:inline-flex items-center gap-1 ml-2">
                {bannerList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex ? "w-4 bg-[#A98BFF]" : "w-1.5 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <span className="text-sm">🎁</span>
            <span className="font-semibold text-white/95 tracking-wide">
              <span className="text-[#A98BFF]">{t("badge")}:</span> {t("discount")} {t("allEvaluations")}!
            </span>
            <span className="inline-flex items-center rounded border border-[#894CEF]/40 bg-[#894CEF]/10 px-2 py-0.5 font-mono text-[11px] sm:text-xs font-bold text-[#A98BFF]">
              {t("codeLabel")}: {SITE_META.promoCode}
            </span>
            <Link
              href="/#start-challenge"
              onClick={(e) => {
                const el = document.getElementById("start-challenge");
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.replaceState(null, "", `${window.location.pathname}#start-challenge`);
                }
              }}
              className="inline-flex min-h-11 items-center gap-1 py-1 font-bold text-[#A98BFF] hover:underline sm:min-h-0 sm:py-0"
            >
              {t("claimOffer")} <span>→</span>
            </Link>
          </>
        )}
      </div>

      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-white/50 transition-colors hover:text-white flex items-center justify-center min-h-11 min-w-11"
      >
        <X size={15} />
      </button>
    </div>
  );
}
