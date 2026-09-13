"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CountUp } from "@/components/fx/CountUp";

export function StatsStrip() {
  const t = useTranslations("trustStats");

  const stats = [
    { art: "/images/stats/traders.png", value: "20,000+", label: t("activeTraders") },
    { art: "/images/stats/worldwide.png", value: t("worldwide"), label: t("globalReach") },
    { art: "/images/stats/payouts.png", value: "$1.2M+", label: t("payoutsTotal") },
    { art: "/images/stats/secure.png", value: "100%", label: t("secureTransparent") },
    { art: "/images/stats/support.png", value: "24/7", label: t("traderSupport") },
  ];

  return (
    <section
      className="relative z-20 border-y border-white/[0.08] bg-[#030A1C] py-8 sm:py-10"
      data-od-id="stats-strip"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-white/[0.08]">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`group flex items-center gap-3.5 px-3 sm:px-5 lg:justify-center cursor-default transition-transform duration-200 hover:-translate-y-0.5 ${
                i === 4 ? "col-span-2 sm:col-span-1 justify-center sm:justify-start" : ""
              }`}
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
                className="h-14 w-14 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110 sm:h-16 sm:w-16"
              />
              <div className="text-left">
                <div className="font-[family-name:var(--font-jakarta)] text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#A98BFF] transition-colors duration-150">
                  <CountUp value={stat.value} />
                </div>
                <div className="text-[11.5px] sm:text-xs font-medium text-[#999BA3] leading-tight">
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
