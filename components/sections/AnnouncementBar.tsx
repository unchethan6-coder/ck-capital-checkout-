"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

export function AnnouncementBar({ banners }: { banners?: string[] } = {}) {
  const [visible, setVisible] = useState(true);
  const t = useTranslations("announcement");

  if (!visible) return null;

  return (
    <div
      className="relative z-30 flex items-center justify-center bg-[#030A1C] px-4 py-2.5 text-center text-xs sm:text-[13px] border-b border-white/[0.08]"
      data-od-id="announcement-bar"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 pr-7 sm:pr-8">
        <span className="text-sm">🎁</span>
        <span className="font-semibold text-white/95 tracking-wide">
          <span className="text-[#A98BFF]">{t("badge")}:</span> {t("discount")} {t("allEvaluations")}!
        </span>
        <span className="inline-flex items-center rounded border border-[#894CEF]/40 bg-[#894CEF]/10 px-2 py-0.5 font-mono text-[11px] sm:text-xs font-bold text-[#A98BFF]">
          {t("codeLabel")}: 10KFOR19
        </span>
        <a
          href="/#start-challenge"
          className="inline-flex min-h-11 items-center gap-1 py-1 font-bold text-[#A98BFF] hover:underline sm:min-h-0 sm:py-0"
        >
          {t("claimOffer")} <span>→</span>
        </a>
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

