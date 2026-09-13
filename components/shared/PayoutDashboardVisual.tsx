"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  DollarSign,
  Lock,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PayoutDashboardVisualProps {
  className?: string;
  compact?: boolean;
}

const PAYOUT_SCENARIOS = [
  {
    accountId: "CK-98241",
    accountTier: "$100K MASTER",
    profit: "$14,850.00",
    profitPct: "+14.85% Profit",
    splitRate: "100% Payout Rate",
    isCrypto: true,
    method: "USDT / Crypto",
    methodSub: "TRC20 / ERC20",
    amount: "14,850.00",
    address: "TQn9Y2...98xKp (Verified)",
    settlementAmount: "$12,450.00",
    settlementTime: "processed in 4.2 hours",
    countryFlag: "🇬🇧",
    countryName: "United Kingdom",
    speedText: "12H Guaranteed",
  },
  {
    accountId: "CK-67104",
    accountTier: "$200K MASTER",
    profit: "$23,400.00",
    profitPct: "+11.70% Profit",
    splitRate: "100% Payout Rate",
    isCrypto: false,
    method: "Bank Wire / Rise",
    methodSub: "Direct Wire Clearing",
    amount: "23,400.00",
    address: "GB82 BARC...4491 (Verified)",
    settlementAmount: "$18,920.00",
    settlementTime: "processed in 2.8 hours",
    countryFlag: "🇩🇪",
    countryName: "Germany",
    speedText: "Priority Fast-Track",
  },
  {
    accountId: "CK-41982",
    accountTier: "$50K MASTER",
    profit: "$6,890.00",
    profitPct: "+13.78% Profit",
    splitRate: "100% Payout Rate",
    isCrypto: true,
    method: "USDC / Crypto",
    methodSub: "Solana / Arbitrum",
    amount: "6,890.00",
    address: "8FmQ8...3k9P (Verified)",
    settlementAmount: "$6,890.00",
    settlementTime: "processed in 1.5 hours",
    countryFlag: "🇦🇪",
    countryName: "United Arab Emirates",
    speedText: "Instant Auto-Release",
  },
  {
    accountId: "CK-11459",
    accountTier: "$100K MASTER",
    profit: "$11,200.00",
    profitPct: "+11.20% Profit",
    splitRate: "100% Payout Rate",
    isCrypto: true,
    method: "USDT / Crypto",
    methodSub: "TRC20 Network",
    amount: "11,200.00",
    address: "TLv8P...92mZ (Verified)",
    settlementAmount: "$9,750.00",
    settlementTime: "processed in 3.1 hours",
    countryFlag: "🇺🇸",
    countryName: "United States",
    speedText: "12H Guaranteed",
  },
  {
    accountId: "CK-83021",
    accountTier: "$150K MASTER",
    profit: "$19,650.00",
    profitPct: "+13.10% Profit",
    splitRate: "100% Payout Rate",
    isCrypto: false,
    method: "Direct Wire / Rise",
    methodSub: "Swift Clearing Node",
    amount: "19,650.00",
    address: "CH93 0076...8820 (Verified)",
    settlementAmount: "$15,300.00",
    settlementTime: "processed in 5.0 hours",
    countryFlag: "🇸🇬",
    countryName: "Singapore",
    speedText: "Priority Settlement",
  },
  {
    accountId: "CK-55230",
    accountTier: "$100K MASTER",
    profit: "$8,940.00",
    profitPct: "+8.94% Profit",
    splitRate: "100% Payout Rate",
    isCrypto: true,
    method: "USDT / Crypto",
    methodSub: "TRC20 Network",
    amount: "8,940.00",
    address: "TXw4K...11nL (Verified)",
    settlementAmount: "$8,940.00",
    settlementTime: "processed in 2.1 hours",
    countryFlag: "🇦🇺",
    countryName: "Australia",
    speedText: "12H Guaranteed",
  },
];

export function PayoutDashboardVisual({
  className,
  compact = false,
}: PayoutDashboardVisualProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PAYOUT_SCENARIOS.length);
    }, 7500);
    return () => clearInterval(interval);
  }, []);

  const current = PAYOUT_SCENARIOS[index];

  return (
    <div
      className={cn("relative w-full select-none mb-8 sm:mb-6", className)}
      data-od-id="hero-payout-window"
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
              <span>app.ckcapital.co.uk/dashboard/payouts</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
              Live Settlement Feed
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 sm:p-6 lg:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.accountId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-5"
            >
              {/* Header Account Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#0A0A0C]">{current.countryFlag}</span>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                      Simulated Account #{current.accountId}
                    </p>
                    <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-[#A98BFF] border border-violet-200">
                      {current.accountTier}
                    </span>
                  </div>
                  <p className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A0A0C]">
                    {current.profit}{" "}
                    <span className="text-xs font-semibold text-emerald-600">
                      {current.profitPct}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2">
                  <Sparkles size={15} className="text-[#A98BFF] shrink-0" />
                  <div className="text-left">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#A98BFF]">
                      Profit Split
                    </p>
                    <p className="text-sm font-extrabold text-[#0A0A0C]">
                      {current.splitRate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payout Request Main Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0C]">
                      Request Payout
                    </p>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#6B7280]">
                    <Clock size={12} className="text-[#A98BFF]" /> ~12 Hours Processing
                  </span>
                </div>

                {/* Payout Methods Selector */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Crypto Option */}
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-xl p-3 text-left transition-all",
                      current.isCrypto
                        ? "border border-[#703AD7] bg-violet-50/50 ring-1 ring-[#703AD7]/40"
                        : "border border-gray-200 bg-gray-50 opacity-70"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg",
                          current.isCrypto
                            ? "bg-violet-100 text-[#A98BFF]"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        <Coins size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0A0A0C]">
                          {current.isCrypto ? current.method : "USDT / Crypto"}
                        </p>
                        <p className="text-[10px] text-[#6B7280]">
                          {current.isCrypto ? current.methodSub : "TRC20 / ERC20"}
                        </p>
                      </div>
                    </div>
                    {current.isCrypto ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#703AD7] text-white">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                  </div>

                  {/* Bank Option */}
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-xl p-3 text-left transition-all",
                      !current.isCrypto
                        ? "border border-[#703AD7] bg-violet-50/50 ring-1 ring-[#703AD7]/40"
                        : "border border-gray-200 bg-gray-50 opacity-70"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg",
                          !current.isCrypto
                            ? "bg-violet-100 text-[#A98BFF]"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0A0A0C]">
                          {!current.isCrypto ? current.method : "Bank Transfer"}
                        </p>
                        <p className="text-[10px] text-[#6B7280]">
                          {!current.isCrypto ? current.methodSub : "Direct Wire / Rise"}
                        </p>
                      </div>
                    </div>
                    {!current.isCrypto ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#703AD7] text-white">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                  </div>
                </div>

                {/* Payout Amount Field Mock */}
                <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                    <span>Amount to Withdraw</span>
                    <span className="font-semibold text-[#0A0A0C]">
                      Available: {current.profit}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign size={20} className="text-[#0A0A0C] font-bold" />
                      <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#0A0A0C]">
                        {current.amount}
                      </span>
                      <span className="text-xs font-bold text-[#6B7280]">USD</span>
                    </div>
                    <span className="rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-[#A98BFF]">
                      MAX
                    </span>
                  </div>
                </div>

                {/* Wallet Address Field Mock */}
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2 text-[#4B5563]">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span className="font-mono text-[11px]">
                      {current.address}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Auto-Confirmed
                  </span>
                </div>

                {/* Submit CTA Button Mock */}
                <div className="relative pt-1">
                  <a
                    href="https://app.ckcapital.co.uk/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-brand-standard group relative flex w-full items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-bold"
                  >
                    <Zap size={16} className="fill-white" />
                    <span>Submit Payout Request</span>
                    <span className="ml-1 rounded bg-black/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                      {current.speedText}
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Recent Settlements Activity Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 text-[11px] text-[#6B7280]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.settlementAmount}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span className="font-semibold text-[#0A0A0C]">
                Latest settlement:
              </span>
              <span className="text-[#0A0A0C] font-bold">
                {current.settlementAmount}
              </span>
              <span className="text-[#6B7280] hidden sm:inline">
                {current.settlementTime}
              </span>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
              100% PROFIT RETAINED
            </span>
          </div>
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
                Speed Guarantee
              </p>
              <p className="font-[family-name:var(--font-jakarta)] text-sm sm:text-base font-extrabold text-[#0A0A0C]">
                Average 12-Hour Settlement
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

