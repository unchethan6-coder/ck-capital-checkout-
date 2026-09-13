"use client";

import { motion } from "framer-motion";
import {
  Award,
  Check,
  CheckCircle2,
  Compass,
  Gauge,
  Lock,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EvaluationPathVisualProps {
  className?: string;
  compact?: boolean;
}

export function EvaluationPathVisual({
  className,
  compact = false,
}: EvaluationPathVisualProps) {
  return (
    <div
      className={cn("relative w-full select-none mb-8 sm:mb-6", className)}
      data-od-id="hero-evaluation-path"
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
              <span>app.ckcapital.co.uk/evaluation/phase-1</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#A98BFF]">
              <Target size={11} className="text-[#A98BFF]" />
              Phase 1 · 80% Complete
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
                  Evaluation Account #CK-EVAL100
                </p>
                <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-[#A98BFF] border border-violet-200">
                  $100K 2-STEP
                </span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A0A0C]">
                +$6,400.00{" "}
                <span className="text-xs font-semibold text-emerald-600">
                  of $8,000 Target
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2">
              <Trophy size={15} className="text-[#A98BFF] shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#A98BFF]">
                  Funded Goal
                </p>
                <p className="text-sm font-extrabold text-[#0A0A0C]">
                  $100,000 Live
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar & Phase Stepper */}
          <div className="mt-5 space-y-4">
            {/* Live Progress Bar */}
            <div className="rounded-xl border border-gray-200 bg-white p-3.5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0A0A0C]">Phase 1 Target Progress</span>
                <span className="font-mono font-bold text-[#A98BFF]">80.0% ($6,400 / $8,000)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-gradient-to-r from-[#703AD7] to-[#894CEF] w-[80%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                <span>Start: $100,000</span>
                <span>Remaining: $1,600 to Pass</span>
              </div>
            </div>

            {/* Stepped Phases Matrix */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {/* Phase 1 */}
              <div className="rounded-xl border border-violet-300 bg-violet-50 p-3 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-[#703AD7]" />
                <p className="text-[9.5px] font-bold uppercase text-[#A98BFF]">Phase 1</p>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#0A0A0C]">8% Goal</p>
                <span className="mt-1.5 inline-block rounded bg-violet-100 px-1.5 py-0.5 text-[8.5px] font-bold text-[#A98BFF]">
                  IN PROGRESS
                </span>
              </div>

              {/* Phase 2 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center relative overflow-hidden opacity-85">
                <p className="text-[9.5px] font-bold uppercase text-[#6B7280]">Phase 2</p>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#0A0A0C]">5% Goal</p>
                <span className="mt-1.5 inline-block rounded bg-gray-200 px-1.5 py-0.5 text-[8.5px] font-semibold text-[#4B5563]">
                  NEXT STEP
                </span>
              </div>

              {/* Funded Master */}
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-center relative overflow-hidden">
                <p className="text-[9.5px] font-bold uppercase text-emerald-700">Master Trader</p>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#0A0A0C]">100% Split</p>
                <span className="mt-1.5 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[8.5px] font-bold text-emerald-700">
                  REWARD
                </span>
              </div>
            </div>

            {/* Safety Metrics Shield HUD */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span>Daily Loss Meter</span>
                  <span className="text-emerald-700 font-bold">1.2% / 5% Max</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-emerald-600 w-[24%]" />
                </div>
                <p className="mt-1 text-[9.5px] text-[#6B7280] font-semibold">Healthy safety cushion</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span>Max Drawdown</span>
                  <span className="text-emerald-700 font-bold">2.1% / 10% Max</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-emerald-600 w-[21%]" />
                </div>
                <p className="mt-1 text-[9.5px] text-[#6B7280] font-semibold">Static drawdown protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Recent Settlement Activity Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-[#0A0A0C]">
              Trading Time Limit:
            </span>
            <span className="text-[#0A0A0C] font-bold">Unlimited Days</span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
            PASS AT YOUR PACE
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
              <Award size={20} className="text-[#A98BFF]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                Evaluation Pathway
              </p>
              <p className="font-[family-name:var(--font-jakarta)] text-sm sm:text-base font-extrabold text-[#0A0A0C]">
                No Minimum or Max Days
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
