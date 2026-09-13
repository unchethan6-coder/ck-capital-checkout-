"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Lock,
  Percent,
  ShieldCheck,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ObjectivesHUDVisualProps {
  className?: string;
  compact?: boolean;
}

export function ObjectivesHUDVisual({
  className,
  compact = false,
}: ObjectivesHUDVisualProps) {
  return (
    <div
      className={cn("relative w-full select-none mb-8 sm:mb-6", className)}
      data-od-id="hero-objectives-hud"
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
              <span>app.ckcapital.co.uk/matrix/risk-engine</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
              Objectives Met (6/6)
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
                  Objectives HUD #CK-RULES
                </p>
                <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-[#A98BFF] border border-violet-200">
                  100% COMPLIANT
                </span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A0A0C]">
                Zero Hidden Rules{" "}
                <span className="text-xs font-semibold text-emerald-600">
                  Fully Transparent
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2">
              <ShieldCheck size={15} className="text-emerald-700 shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-700">
                  Risk Status
                </p>
                <p className="text-sm font-extrabold text-emerald-700">
                  Safe · Unlocked
                </p>
              </div>
            </div>
          </div>

          {/* Objectives Grid */}
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0C]">
                Core Trading Parameters
              </p>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#6B7280]">
                <Activity size={12} className="text-[#A98BFF]" /> Live Compliance Sync
              </span>
            </div>

            {/* Rules Matrix 2x3 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* Rule 1 */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Profit Target</span>
                  <Check size={12} className="text-emerald-700 stroke-[3]" />
                </div>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#0A0A0C]">8% / 5%</p>
                <p className="text-[9px] text-emerald-700 font-semibold">Target Passed</p>
              </div>

              {/* Rule 2 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Daily Loss</span>
                  <Check size={12} className="text-emerald-700 stroke-[3]" />
                </div>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#0A0A0C]">5% Max</p>
                <p className="text-[9px] text-[#6B7280] font-semibold">0.8% Utilized</p>
              </div>

              {/* Rule 3 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Max Drawdown</span>
                  <Check size={12} className="text-emerald-700 stroke-[3]" />
                </div>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#0A0A0C]">10% Max</p>
                <p className="text-[9px] text-[#6B7280] font-semibold">Static Shield</p>
              </div>

              {/* Rule 4 */}
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Min Trading Days</span>
                  <Check size={12} className="text-emerald-700 stroke-[3]" />
                </div>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#0A0A0C]">0 Days</p>
                <p className="text-[9px] text-[#A98BFF] font-semibold">Pass in 1 Day</p>
              </div>

              {/* Rule 5 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">News Trading</span>
                  <Check size={12} className="text-emerald-700 stroke-[3]" />
                </div>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#0A0A0C]">Allowed</p>
                <p className="text-[9px] text-[#6B7280] font-semibold">No Restrictions</p>
              </div>

              {/* Rule 6 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Weekend Holds</span>
                  <Check size={12} className="text-emerald-700 stroke-[3]" />
                </div>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#0A0A0C]">Allowed</p>
                <p className="text-[9px] text-[#6B7280] font-semibold">Crypto &amp; FX</p>
              </div>
            </div>

            {/* Compliance Verified Banner */}
            <div className="flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#0A0A0C]">
                <ShieldCheck size={15} className="text-[#A98BFF] shrink-0" />
                <span className="text-[11px] font-semibold">Real-Time Risk Engine Active · Zero IP or Strategy Bans</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A98BFF]">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Recent Settlement Activity Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-[#0A0A0C]">
              Trading Objective Standard:
            </span>
            <span className="text-[#0A0A0C] font-bold">100% Rules Clarity</span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
            NO TRICK CLAUSES
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
              <Sliders size={20} className="text-[#A98BFF]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                Objective Model
              </p>
              <p className="font-[family-name:var(--font-jakarta)] text-sm sm:text-base font-extrabold text-[#0A0A0C]">
                Built For Serious Traders
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
