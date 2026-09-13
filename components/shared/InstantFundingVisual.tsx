"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  FastForward,
  Flame,
  Lock,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InstantFundingVisualProps {
  className?: string;
  compact?: boolean;
}

export function InstantFundingVisual({
  className,
  compact = false,
}: InstantFundingVisualProps) {
  return (
    <div
      className={cn("relative w-full select-none mb-8 sm:mb-6", className)}
      data-od-id="hero-instant-funding"
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
              <span>app.ckcapital.co.uk/instant-capital/direct</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#A98BFF]">
              <Zap size={11} className="text-[#A98BFF] fill-[#7943E0]" />
              Zero Evaluation Mode
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 sm:p-6 lg:p-7">
          {/* Header Account Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                  Direct Live Account #CK-INSTANT
                </p>
                <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-[#A98BFF] border border-violet-200">
                  100% DIRECT FUNDED
                </span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A0A0C]">
                $100,000.00{" "}
                <span className="text-xs font-semibold text-emerald-600">
                  Instant Capital
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2">
              <FastForward size={15} className="text-[#A98BFF] shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#A98BFF]">
                  Evaluation Stage
                </p>
                <p className="text-sm font-extrabold text-[#0A0A0C]">
                  100% Skipped
                </p>
              </div>
            </div>
          </div>

          {/* Instant Stepper Graphic */}
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0C]">
                Funding Acceleration Roadmap
              </p>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <Clock size={12} className="text-emerald-700" /> 60s Account Activation
              </span>
            </div>

            {/* Stepper Timeline Box */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-3 gap-2 relative">
                {/* Step 1: Skipped */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gray-300" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 line-through">Phase 1</p>
                  <p className="mt-1 text-[11px] font-extrabold text-gray-400">8% Target</p>
                  <span className="mt-1.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[8.5px] font-mono text-gray-500">
                    SKIPPED
                  </span>
                </div>

                {/* Step 2: Skipped */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gray-300" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 line-through">Phase 2</p>
                  <p className="mt-1 text-[11px] font-extrabold text-gray-400">5% Target</p>
                  <span className="mt-1.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[8.5px] font-mono text-gray-500">
                    SKIPPED
                  </span>
                </div>

                {/* Step 3: Direct Live */}
                <div className="rounded-lg border border-violet-300 bg-violet-50 p-2.5 text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-[#703AD7]" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#A98BFF]">Live Funded</p>
                  <p className="mt-1 text-[11px] font-extrabold text-[#0A0A0C]">Day 1 Payouts</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-violet-100 px-1.5 py-0.5 text-[8.5px] font-bold text-[#A98BFF]">
                    <Check size={9} strokeWidth={3} /> ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Instant Rules & Specifications HUD */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-700" />
                  <span className="text-xs font-bold text-[#0A0A0C]">Profit Target</span>
                </div>
                <p className="mt-1.5 font-mono text-base font-extrabold text-emerald-700">NO TARGET</p>
                <p className="text-[10px] text-[#6B7280]">Keep your profits from trade #1</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-[#A98BFF]" />
                  <span className="text-xs font-bold text-[#0A0A0C]">Max Loss Shield</span>
                </div>
                <p className="mt-1.5 font-mono text-base font-extrabold text-[#0A0A0C]">6% Static Max</p>
                <p className="text-[10px] text-[#6B7280]">Trailing lock protection enabled</p>
              </div>
            </div>

            {/* Simulated Live Account Status Bar */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Rocket size={14} className="text-[#A98BFF]" />
                <span className="text-[11px]">Server: CK-Capital-Live-01 · Fast Execution</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A98BFF]">
                Ready in 60s
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Recent Settlement Activity Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-[#0A0A0C]">
              Live Trader Split:
            </span>
            <span className="text-[#0A0A0C] font-bold">Up to 100% Payouts</span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
            ZERO WAITING PERIOD
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
              <Rocket size={20} className="text-[#A98BFF]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                Instant Execution
              </p>
              <p className="font-[family-name:var(--font-jakarta)] text-sm sm:text-base font-extrabold text-[#0A0A0C]">
                Trade Simulated Capital Day 1
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
