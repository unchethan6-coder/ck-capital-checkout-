"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  Lock,
  Newspaper,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogHeroVisualProps {
  className?: string;
  compact?: boolean;
}

export function BlogHeroVisual({
  className,
  compact = false,
}: BlogHeroVisualProps) {
  return (
    <div
      className={cn("relative w-full select-none mb-8 sm:mb-6", className)}
      data-od-id="hero-blog-intel"
    >
      {/* Main Dashboard Window Container */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        {/* Top Browser / App Window Chrome */}
        <div className="flex h-11 items-center justify-between border-b border-gray-200 bg-gray-50 px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            <div className="ml-3 hidden sm:flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-mono text-[#6B7280]">
              <Lock size={10} className="text-[#A98BFF]" />
              <span>app.ckcapital.co.uk/research/intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#A98BFF]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#894CEF]" />
              Daily Alpha Dossier
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 sm:p-6 lg:p-7">
          {/* Header Article Intelligence Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                  Institutional Research Guild
                </p>
                <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-[#A98BFF] border border-violet-200">
                  EDITION #48
                </span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A0A0C]">
                Market Blueprint{" "}
                <span className="text-xs font-semibold text-[#A98BFF]">
                  Weekly Playbook
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2">
              <BarChart3 size={15} className="text-[#A98BFF] shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#A98BFF]">
                  Win Rate Alpha
                </p>
                <p className="text-sm font-extrabold text-[#0A0A0C]">
                  +18.4% Edge
                </p>
              </div>
            </div>
          </div>

          {/* Featured Article Card Mock */}
          <div className="mt-5 space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-[#1E293B] bg-[#030A1C] bg-gradient-to-br from-[#061B33] via-[#030A1C] to-[#01060F] p-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-md border border-[#894CEF]/40 bg-[#894CEF]/15 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#A98BFF]">
                  Featured Strategy
                </span>
                <span className="text-[11px] text-gray-400 font-medium">5 Min Deep-Dive</span>
              </div>
              <h3 className="mt-2.5 font-[family-name:var(--font-jakarta)] text-base font-extrabold text-white sm:text-lg flex items-center justify-between group">
                <span>Liquidity Sweeps &amp; Institutional Order Flow in Forex</span>
                <ArrowUpRight size={16} className="text-[#A98BFF] shrink-0 opacity-85" />
              </h3>
              <p className="mt-1.5 text-xs text-gray-300 leading-relaxed line-clamp-2">
                Learn how top prop traders protect risk on high-impact news days while capitalizing on session liquidity expansion.
              </p>
              <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-400 border-t border-white/10 pt-2.5">
                <span className="flex items-center gap-1">
                  <FileText size={12} className="text-[#A98BFF]" /> Risk Management
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-400" /> High-Impact Edge
                </span>
              </div>
            </div>

            {/* Quick Articles Sub-Feed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Item 1 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                  <span className="text-[#A98BFF] font-bold">PSYCHOLOGY</span>
                  <span>4m read</span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#0A0A0C] line-clamp-1">
                  Overcoming Tilt in Prop Firm Evaluations
                </p>
                <p className="mt-1 text-[10px] text-[#6B7280]">
                  Daily drawdown discipline &amp; size management
                </p>
              </div>

              {/* Item 2 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                  <span className="text-emerald-700 font-bold">MACRO ECONOMICS</span>
                  <span>6m read</span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#0A0A0C] line-clamp-1">
                  Federal Reserve Rate Cut Playbook for 2026
                </p>
                <p className="mt-1 text-[10px] text-[#6B7280]">
                  Gold (XAU/USD) &amp; Dollar index correlation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Recent Status Activity Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-[#0A0A0C]">
              Curated by:
            </span>
            <span className="text-[#0A0A0C] font-bold">CK Senior Risk Analysts</span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
            VERIFIED ALPHA
          </span>
        </div>
      </div>

      {/* Floating Decorative Total Rewards Badge */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative z-20 mt-4 w-fit max-w-full -ml-1 sm:-ml-4"
        >
          <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-3.5 shadow-xl">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-violet-50 text-[#A98BFF] border border-violet-200">
              <BookOpen size={20} className="text-[#A98BFF]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                Research Guild
              </p>
              <p className="font-[family-name:var(--font-jakarta)] text-sm sm:text-base font-extrabold text-[#0A0A0C]">
                Institutional-Grade Insights
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
