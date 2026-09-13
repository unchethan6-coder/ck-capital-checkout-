"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight, Play, BarChart2, Coins, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Scroll-linked parallax: the artwork drifts up and fades slightly as the
  // hero leaves the viewport, so the section feels layered rather than static.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-14%"]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.06]);
  const artOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduceMotion ? 1 : 0.35]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "18%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduceMotion ? 1 : 0.2]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#030A1C] text-[#F8FAFC] pt-12 sm:pt-16 md:pt-20 pb-14 sm:pb-16 md:pb-20"
      data-od-id="hero"
    >
      {/* Background Aurora & Dots Grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="fx-aurora-a absolute inset-0" />
        <div className="fx-aurora-b absolute inset-0" />
        <div className="fx-aurora-core absolute inset-0" />
        <div className="fx-aurora-dots absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Left Column: Copy & Actions */}
          <motion.div
            style={{ y: copyY, opacity: copyOpacity }}
            className="relative z-10 lg:col-span-5 xl:col-span-5"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full mb-3 sm:mb-4 px-3 py-1 bg-white/[0.04] border border-white/10"
            >
              <span className="h-2 w-2 rounded-full bg-[#894CEF] shadow-[0_0_8px_#894CEF]" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#999BA3]">
                {t("badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-[family-name:var(--font-jakarta)] text-3xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-black uppercase leading-[1.08] tracking-tight text-white"
            >
              {t("headlineLine1")}
              <br />
              <span className="text-white">{t("headlineLine2")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-3.5 sm:mt-4 text-sm sm:text-base font-medium leading-relaxed text-[#999BA3] max-w-lg"
            >
              {t("subcopy")}
            </motion.p>

            {/* 3 Key Feature Chips */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-6 sm:mt-7 flex flex-wrap items-center gap-2 sm:gap-3"
            >
              {/* Feature 1 */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-[#080E24]/80 pl-1.5 pr-3 sm:pr-4 py-1 sm:py-1.5 shadow-sm hover:border-[#894CEF]/40 hover:shadow-[0_0_16px_rgba(1,162,239,0.15)] transition-all duration-200 cursor-default"
              >
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#894CEF]/15 text-[#A98BFF] group-hover:bg-[#894CEF] group-hover:text-black transition-colors duration-200">
                  <BarChart2 size={15} strokeWidth={2.5} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] sm:text-[12px] font-extrabold text-white">
                    Up to 100%
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] font-medium text-[#999BA3]">
                    Profit Split
                  </span>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-[#080E24]/80 pl-1.5 pr-3 sm:pr-4 py-1 sm:py-1.5 shadow-sm hover:border-[#894CEF]/40 hover:shadow-[0_0_16px_rgba(1,162,239,0.15)] transition-all duration-200 cursor-default"
              >
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#894CEF]/15 text-[#A98BFF] group-hover:bg-[#894CEF] group-hover:text-black transition-colors duration-200">
                  <Coins size={15} strokeWidth={2.5} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] sm:text-[12px] font-extrabold text-white">
                    Scale to $1.2M
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] font-medium text-[#999BA3]">
                    Simulated Allocation
                  </span>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-[#080E24]/80 pl-1.5 pr-3 sm:pr-4 py-1 sm:py-1.5 shadow-sm hover:border-[#894CEF]/40 hover:shadow-[0_0_16px_rgba(1,162,239,0.15)] transition-all duration-200 cursor-default"
              >
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#894CEF]/15 text-[#A98BFF] group-hover:bg-[#894CEF] group-hover:text-black transition-colors duration-200">
                  <Zap size={15} strokeWidth={2.5} />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] sm:text-[12px] font-extrabold text-white">
                    Flexible
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] font-medium text-[#999BA3]">
                    Payouts
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Standardized CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <Link
                href="/#start-challenge"
                className="group inline-flex items-center justify-center gap-2 rounded-xl brand-gradient-btn px-6 py-3.5 text-sm sm:text-base font-bold text-[#1A1030] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 text-center shadow-lg hover:shadow-cyan-500/25"
              >
                <span>{t("startChallenge")}</span>
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-3 text-sm sm:text-base font-extrabold text-white hover:border-[#894CEF] hover:bg-white/[0.08] hover:text-white active:translate-y-0 active:scale-[0.98] transition-all duration-200 shadow-sm text-center"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/80 text-white group-hover:border-[#894CEF] group-hover:bg-[#894CEF] group-hover:text-black transition-all duration-200 shrink-0">
                  <Play size={11} className="ml-0.5 fill-current" />
                </div>
                <span>{t("exploreObjectives")}</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: CK mascot artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ y: artY, scale: artScale, opacity: artOpacity }}
            className="relative isolate z-0 mt-6 -mb-14 flex min-h-[340px] w-full max-w-full items-end justify-center overflow-visible sm:-mb-16 sm:mt-8 sm:min-h-[470px] md:-mb-20 lg:col-span-7 lg:mt-0 lg:min-h-[610px] lg:justify-end xl:col-span-7"
          >
            <motion.div
              aria-hidden="true"
              animate={reduceMotion ? undefined : { opacity: [0.75, 1, 0.75], scale: [1, 1.05, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 -z-10 h-[72%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B3DFF]/20 blur-[70px] sm:bg-[#8B3DFF]/18 sm:blur-[95px] lg:left-[58%] lg:h-[68%] lg:w-[72%] lg:blur-[120px]"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-[8%] left-1/2 -z-10 h-[18%] w-[64%] -translate-x-1/2 rounded-full bg-[#B35CFF]/18 blur-[55px] lg:left-[58%]"
            />
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="flex w-full justify-center lg:justify-end"
            >
            <Image
              src="/images/ck-purple-raccoon.png"
              alt="CK Capital futuristic raccoon mascot holding the CK emblem"
              width={1930}
              height={1930}
              priority
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 72vw, 58vw"
              className="hero-mascot relative ml-auto h-auto w-full max-w-[390px] object-contain drop-shadow-[0_0_60px_rgba(139,76,239,0.22)] sm:max-w-[560px] lg:max-w-[720px] xl:max-w-[790px]"
            />
            </motion.div>
            {/* Bottom fade: blends the artwork's hard edge into the section background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[8%] bottom-0 z-10 h-[30%] bg-gradient-to-t from-[#030A1C] via-[#030A1C]/70 to-transparent"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
