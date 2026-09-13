"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Target,
  ArrowRight,
  ChevronDown,
  Scale,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { GoldButton } from "@/components/shared/GoldButton";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { cn } from "@/lib/utils";

interface CoreMetric {
  label: string;
  instantValue: string;
  instantBadge?: string;
  challengeValue: string;
  challengeBadge?: string;
}

interface DetailedRule {
  feature: string;
  instant: string;
  challenge: string;
}

export function InstantVsChallengeComparison() {
  const t = useTranslations("instant");
  const [mobileTab, setMobileTab] = useState<"compare" | "instant" | "challenge">("compare");
  const [expanded, setExpanded] = useState(false);

  const coreMetrics: CoreMetric[] = [
    {
      label: "Evaluation Requirement",
      instantValue: "0 Phases",
      instantBadge: "Direct Account",
      challengeValue: "1 or 2 Steps",
      challengeBadge: "Pass First",
    },
    {
      label: "Time to First Trade",
      instantValue: "Immediate",
      instantBadge: "< 5 Mins",
      challengeValue: "Phase 1 First",
      challengeBadge: "Pass to Fund",
    },
    {
      label: "Profit Target to Qualify",
      instantValue: "0% Target",
      instantBadge: "No Target",
      challengeValue: "8% / 5%",
      challengeBadge: "Required",
    },
    {
      label: "Max Daily Drawdown",
      instantValue: "3% Static",
      challengeValue: "4% - 5%",
      challengeBadge: "Higher Buffer",
    },
    {
      label: "Max Overall Drawdown",
      instantValue: "5% Total",
      challengeValue: "8% - 10%",
      challengeBadge: "Larger Room",
    },
    {
      label: "Capital Scale Potential",
      instantValue: "$200K Direct",
      challengeValue: "$1.2M Pool",
      challengeBadge: "Max Growth",
    },
  ];

  const secondaryRules: DetailedRule[] = [
    {
      feature: "Consistency Rule",
      instant: "20% Best-Day Rule",
      challenge: "Standard Risk Rules",
    },
    {
      feature: "News & Weekend Holding",
      instant: "Fully Allowed (Crypto & FX)",
      challenge: "Fully Allowed (Crypto & FX)",
    },
    {
      feature: "Simulated Profit Split",
      instant: "Up to 100% Payout Rate",
      challenge: "Up to 100% Payout Rate",
    },
    {
      feature: "Payout Processing SLA",
      instant: "~12-Hour SLA Guaranteed",
      challenge: "~12-Hour SLA Guaranteed",
    },
    {
      feature: "Trading Platforms",
      instant: "MT5 & TradeLocker",
      challenge: "MT5 & TradeLocker",
    },
    {
      feature: "Refundable Fee",
      instant: "Direct Access (Non-refundable)",
      challenge: "100% Refunded on First Payout",
    },
  ];

  return (
    <section
      id="instant-comparison"
      className="scroll-mt-24 bg-white border-y border-[#E5E7EB] py-12 sm:py-16 md:py-20 text-[#0A0A0C]"
      data-od-id="instant-head-to-head"
    >
      <Container>
        {/* Section Header */}
        <SectionReveal className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
            <Scale size={12} className="text-[#A98BFF]" />
            HEAD-TO-HEAD
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-2xl font-extrabold tracking-tight text-[#0A0A0C] sm:text-3xl md:text-4xl">
            Instant vs Challenge
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#4B5563]">
            Compare key parameters side-by-side to choose the exact pathway that fits your trading goals.
          </p>
        </SectionReveal>

        {/* Mobile View Toggle Switcher (< md) */}
        <div className="flex md:hidden justify-center mb-5">
          <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setMobileTab("compare")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                mobileTab === "compare"
                  ? "bg-white text-[#0A0A0C] shadow-sm"
                  : "text-[#6B7280] hover:text-[#0A0A0C]"
              )}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("instant")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                mobileTab === "instant"
                  ? "bg-[#894CEF] text-[#030A1C] font-extrabold shadow-sm"
                  : "text-[#6B7280] hover:text-[#0A0A0C]"
              )}
            >
              ⚡ Instant
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("challenge")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                mobileTab === "challenge"
                  ? "bg-white text-[#0A0A0C] shadow-sm"
                  : "text-[#6B7280] hover:text-[#0A0A0C]"
              )}
            >
              🎯 Challenge
            </button>
          </div>
        </div>

        {/* Unified Side-by-Side Comparative Cards Matrix */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-md">
          {/* Card Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Column 1 Header: Instant Funding */}
            {(mobileTab === "compare" || mobileTab === "instant") && (
              <div className="bg-violet-50/40 p-4 sm:p-5 md:p-6 border-b border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-violet-100 text-[#A98BFF]">
                        <Zap size={15} className="fill-[#7943E0]" />
                      </div>
                      <span className="font-[family-name:var(--font-jakarta)] text-base sm:text-lg font-black text-[#0A0A0C]">
                        Instant Funding
                      </span>
                    </div>
                    <span className="rounded-full bg-[#894CEF] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#030A1C]">
                      0 Phase Direct
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#4B5563]">
                    Immediate simulated allocation with bi-weekly reward eligibility.
                  </p>
                </div>
                <div className="mt-3.5 pt-3 border-t border-violet-200/60 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold text-[#0A0A0C]">
                    $5K – $200K Direct
                  </span>
                  <a
                    href="https://app.ckcapital.co.uk/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GoldButton size="sm">
                      Get Instant <ArrowRight size={13} />
                    </GoldButton>
                  </a>
                </div>
              </div>
            )}

            {/* Column 2 Header: Evaluation Challenge */}
            {(mobileTab === "compare" || mobileTab === "challenge") && (
              <div className="bg-gray-50/60 p-4 sm:p-5 md:p-6 border-b border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gray-200/80 text-[#0A0A0C]">
                        <Target size={15} />
                      </div>
                      <span className="font-[family-name:var(--font-jakarta)] text-base sm:text-lg font-black text-[#0A0A0C]">
                        Evaluation Challenge
                      </span>
                    </div>
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#4B5563]">
                      1 & 2-Step
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#4B5563]">
                    Structured phases for maximum capital growth up to $1.2M.
                  </p>
                </div>
                <div className="mt-3.5 pt-3 border-t border-gray-200 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold text-[#0A0A0C]">
                    $5K – $300K Scale
                  </span>
                  <Link href="/evaluation">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-[#0A0A0C] hover:bg-gray-100 transition-colors"
                    >
                      Explore <ArrowRight size={13} />
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Core Metrics: Mobile-optimized Side-by-Side & Desktop Dual-Column */}
          <div className="divide-y divide-gray-100">
            {coreMetrics.map((metric, idx) => (
              <div key={idx} className="transition-colors hover:bg-gray-50/40">
                {/* Mobile View: High-density 2-way comparison block (< md) */}
                {mobileTab === "compare" ? (
                  <div className="p-3 md:hidden flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      {metric.label}
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-violet-50/70 border border-violet-200/80 p-2 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-[#A98BFF]">⚡ Instant</span>
                        <span className="font-mono font-extrabold text-[#0A0A0C]">{metric.instantValue}</span>
                      </div>
                      <div className="rounded-xl bg-gray-50 border border-gray-200 p-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#6B7280]">🎯 Challenge</span>
                        <span className="font-mono font-bold text-[#4B5563]">{metric.challengeValue}</span>
                      </div>
                    </div>
                  </div>
                ) : mobileTab === "instant" ? (
                  <div className="p-3 md:hidden flex items-center justify-between bg-violet-50/20">
                    <span className="text-xs font-bold text-[#0A0A0C]">{metric.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-extrabold text-[#0A0A0C]">{metric.instantValue}</span>
                      {metric.instantBadge && (
                        <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-[#A98BFF]">
                          {metric.instantBadge}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 md:hidden flex items-center justify-between bg-gray-50/30">
                    <span className="text-xs font-bold text-[#0A0A0C]">{metric.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-[#4B5563]">{metric.challengeValue}</span>
                      {metric.challengeBadge && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-[#6B7280]">
                          {metric.challengeBadge}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Desktop View: 2-column side-by-side table row (>= md) */}
                <div className="hidden md:grid md:grid-cols-2 divide-x divide-gray-100">
                  {/* Left Column (Instant) */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 bg-violet-50/10">
                    <span className="text-xs font-bold text-[#0A0A0C]">
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-[#0A0A0C]">
                        {metric.instantValue}
                      </span>
                      {metric.instantBadge && (
                        <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-[#A98BFF]">
                          {metric.instantBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Challenge) */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#6B7280]">
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#4B5563]">
                        {metric.challengeValue}
                      </span>
                      {metric.challengeBadge && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-[#6B7280]">
                          {metric.challengeBadge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Expandable Detailed Rules Drawer */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-gray-200 bg-gray-50/50"
              >
                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-100/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Extended Rules & Parameter Breakdown
                  </p>
                </div>
                <div className="divide-y divide-gray-200/70">
                  {secondaryRules.map((rule, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200/70 text-xs"
                    >
                      <div className="p-2.5 sm:p-3 flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#0A0A0C]">
                          {rule.feature}
                        </span>
                        <span className="font-mono font-bold text-[#0A0A0C]">
                          {rule.instant}
                        </span>
                      </div>
                      <div className="p-2.5 sm:p-3 flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#6B7280] md:hidden">
                          {rule.feature}
                        </span>
                        <span className="font-mono font-medium text-[#4B5563] ml-auto">
                          {rule.challenge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Expansion Trigger Bar */}
          <div className="border-t border-gray-200 bg-gray-50 p-2.5 sm:p-3 text-center">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A98BFF] hover:text-[#0A0A0C] transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-violet-50"
            >
              <span>{expanded ? "Hide Detailed Rules" : "+ View All Detailed Rules (News, Weekend, SLA, Split)"}</span>
              <ChevronDown
                size={14}
                className={cn("transition-transform duration-200", expanded && "rotate-180")}
              />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
