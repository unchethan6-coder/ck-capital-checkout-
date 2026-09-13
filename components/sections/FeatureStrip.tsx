"use client";

import { useTranslations } from "next-intl";
import {
  RefreshCw,
  Clock,
  Calendar,
  Monitor,
  GraduationCap,
} from "lucide-react";

export function FeatureStrip() {
  const t = useTranslations("featureStrip");

  const features = [
    {
      icon: RefreshCw,
      title: t("fastPayouts"),
      description: t("fastPayoutsDesc"),
    },
    {
      icon: Clock,
      title: t("noTimeLimits"),
      description: t("noTimeLimitsDesc"),
    },
    {
      icon: Calendar,
      title: t("economicCalendar"),
      description: t("economicCalendarDesc"),
    },
    {
      icon: Monitor,
      title: t("advancedPlatform"),
      description: t("advancedPlatformDesc"),
    },
    {
      icon: GraduationCap,
      title: t("education"),
      description: t("educationDesc"),
    },
  ];

  return (
    <section
      className="relative z-20 border-y border-white/[0.08] bg-[#030A1C] py-10 sm:py-12"
      data-od-id="feature-strip"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6 lg:divide-x lg:divide-white/[0.08] items-start">
          {features.map((item, idx) => (
            <div
              key={item.title}
              className={`group flex items-start gap-3.5 px-2 sm:px-4 cursor-default transition-transform duration-200 hover:-translate-y-0.5 ${
                idx === 4 ? "sm:col-span-1" : ""
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#894CEF]/25 bg-[#894CEF]/10 text-[#A98BFF] group-hover:border-[#894CEF]/60 group-hover:bg-[#894CEF]/20 group-hover:shadow-[0_0_15px_rgba(1,162,239,0.25)] transition-all duration-200">
                <item.icon size={22} strokeWidth={1.75} />
              </div>
              <div className="text-left">
                <h3 className="font-[family-name:var(--font-jakarta)] text-[14px] font-black text-white group-hover:text-[#A98BFF] transition-colors duration-150">
                  {item.title}
                </h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[#999BA3]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
