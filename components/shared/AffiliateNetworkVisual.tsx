"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Coins,
  Copy,
  DollarSign,
  Flame,
  Lock,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AffiliateNetworkVisualProps {
  className?: string;
  compact?: boolean;
}

export function AffiliateNetworkVisual({
  className,
  compact = false,
}: AffiliateNetworkVisualProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn("relative w-full select-none mb-8 sm:mb-6", className)}
      data-od-id="hero-affiliate-portal"
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
              <span>app.ckcapital.co.uk/partners/vip-portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#A98BFF]">
              <Flame size={11} className="text-[#A98BFF] fill-[#7943E0]" />
              Tier 3 VIP Partner
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 sm:p-6 lg:p-7">
          {/* Header Commission Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                  Partner ID #AFF-VIP99
                </p>
                <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-[#A98BFF] border border-violet-200">
                  15% COMMISSION
                </span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A0A0C]">
                $18,420.00{" "}
                <span className="text-xs font-semibold text-emerald-600">
                  +$3,450 This Month
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2">
              <Users size={15} className="text-[#A98BFF] shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#A98BFF]">
                  Active Network
                </p>
                <p className="text-sm font-extrabold text-[#0A0A0C]">
                  142 Traders
                </p>
              </div>
            </div>
          </div>

          {/* Partner Referral Section */}
          <div className="mt-5 space-y-4">
            {/* Referral Link Quick Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0C]">
                  Your Custom Partner Link
                </p>
                <span className="text-[11px] text-[#A98BFF] font-semibold">
                  Cookie Life: 60 Days
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 sm:p-2.5 shadow-sm">
                <div className="flex flex-1 items-center gap-2 px-2 overflow-hidden">
                  <Share2 size={14} className="text-[#A98BFF] shrink-0" />
                  <span className="font-mono text-xs text-[#0A0A0C] truncate">
                    https://ckcapital.co.uk/ref/VIP-PRO
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-bold text-[#A98BFF] hover:bg-violet-100 transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Performance Stats Row */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <p className="text-[10px] uppercase font-bold text-[#6B7280]">Clicks</p>
                <p className="mt-1 font-mono text-base font-extrabold text-[#0A0A0C]">3,892</p>
                <p className="text-[9px] text-emerald-700 font-semibold">+18.2%</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <p className="text-[10px] uppercase font-bold text-[#6B7280]">Conversion</p>
                <p className="mt-1 font-mono text-base font-extrabold text-[#0A0A0C]">9.4%</p>
                <p className="text-[9px] text-[#A98BFF] font-semibold">High Alpha</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <p className="text-[10px] uppercase font-bold text-[#6B7280]">Avg Reward</p>
                <p className="mt-1 font-mono text-base font-extrabold text-[#0A0A0C]">$129.70</p>
                <p className="text-[9px] text-[#6B7280] font-semibold">Per Order</p>
              </div>
            </div>

            {/* Recent Referral Ledger Mock */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#6B7280] border-b border-gray-200 pb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Recent Partner Activity</span>
                <span className="text-[10px] text-emerald-700 font-bold">Auto-Credited</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-violet-100 text-[#A98BFF] flex items-center justify-center font-mono text-[10px] font-bold">
                    #84
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A0A0C] text-[11px]">$100K 2-Step Challenge</p>
                    <p className="text-[9px] text-[#6B7280]">2 mins ago · Direct Link</p>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-emerald-700 text-xs">+$74.85</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-violet-100 text-[#A98BFF] flex items-center justify-center font-mono text-[10px] font-bold">
                    #79
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A0A0C] text-[11px]">$50K Instant Funding</p>
                    <p className="text-[9px] text-[#6B7280]">14 mins ago · Sub-Affiliate Tier 2</p>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-[#A98BFF] text-xs">+$48.50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Recent Settlement Activity Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-[#0A0A0C]">
              Weekly Settlement:
            </span>
            <span className="text-[#0A0A0C] font-bold">Direct USDT (TRC20)</span>
            <span className="text-[#6B7280] hidden sm:inline">every Wednesday</span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
            UP TO 15% RECURRING
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
              <Zap size={20} className="fill-[#7943E0] text-[#A98BFF]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                Top Payout Tier
              </p>
              <p className="font-[family-name:var(--font-jakarta)] text-sm sm:text-base font-extrabold text-[#0A0A0C]">
                Earn Up to 15% Lifetime
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
