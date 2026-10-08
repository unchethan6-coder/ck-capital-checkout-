"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CountUp } from "@/components/fx/CountUp";
import { cn } from "@/lib/utils";

export function StatsStrip() {
  const t = useTranslations("trustStats");

  const stats = [
    { art: "/images/stats/traders.png", value: "20,000+", label: t("activeTraders") },
    { art: "/images/stats/worldwide.png", value: t("worldwide"), label: t("globalReach") },
    { art: "/images/stats/payouts.png", value: "$1,385,127.63", label: t("payoutsTotal") },
    { art: "/images/stats/secure.png", value: "100%", label: t("secureTransparent") },
    { art: "/images/stats/support.png", value: "24/7", label: t("traderSupport") },
  ];

  return (
    <section
      className="relative z-20 border-y border-white/[0.08] bg-[#030A1C] py-8 sm:py-10"
      data-od-id="stats-strip"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1.22fr_1fr_1fr] lg:divide-x lg:divide-white/[0.08]">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "group flex items-center gap-2 sm:gap-3 lg:gap-2 xl:gap-2.5 px-2 sm:px-3 lg:px-2 xl:px-3 lg:justify-center cursor-default transition-transform duration-200 hover:-translate-y-0.5",
                i === 2 ? "col-span-2 sm:col-span-1 justify-center sm:justify-start lg:justify-center" : ""
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stat.art}
                alt=""
                aria-hidden="true"
                width={224}
                height={200}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 sm:h-12 sm:w-12 md:h-13 md:w-13 lg:h-11 lg:w-11 xl:h-13 xl:w-13 2xl:h-14 2xl:w-14 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
              />
              <div className="min-w-0 text-left">
                <div
                  className={cn(
                    "font-[family-name:var(--font-jakarta)] font-black tracking-tight tabular-nums text-white group-hover:text-[#A98BFF] transition-colors duration-150 whitespace-nowrap",
                    stat.value.length > 10
                      ? "text-lg sm:text-base md:text-lg lg:text-[14px] xl:text-[18px] 2xl:text-[20px]"
                      : "text-xl sm:text-2xl lg:text-lg xl:text-2xl"
                  )}
                >
                  <CountUp value={stat.value} />
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-[#999BA3] leading-tight whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
