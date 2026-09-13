"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart2,
  Wallet,
  Users,
  Download,
  User,
  HelpCircle,
  Check,
  ChevronDown,
} from "lucide-react";

/* Shared live-trading simulation — single instance drives phone/tablet/laptop */
function useLiveDashboard() {
  const [liveData, setLiveData] = useState({
    balance: 52845.0,
    profit: 5214.75,
    equity: 58059.75,
    balancePercent: 7.28,
    profitPercent: 12.43,
    totalTrades: 128,
    winRate: 67.2,
    lastTrade: 1214.75,
    lastY: 48,
    isUpTick: true,
  });

  useEffect(() => {
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setLiveData((prev) => {
          const isUp = Math.random() > 0.35;
          const delta = isUp
            ? Math.round((Math.random() * 85 + 15) * 100) / 100
            : -Math.round((Math.random() * 45 + 10) * 100) / 100;

          const newBalance = Math.round((prev.balance + delta) * 100) / 100;
          const newProfit = Math.round((prev.profit + delta) * 100) / 100;
          const newEquity = Math.round((prev.equity + delta) * 100) / 100;

          const newBalancePct = (
            ((newBalance - 50000) / 50000) *
            100
          ).toFixed(2);
          const newProfitPct = (((newProfit - 4500) / 4500) * 100).toFixed(2);

          const yShift = (delta / 85) * -3;
          const newY = Math.max(36, Math.min(58, prev.lastY + yShift));

          const tradeIncrement = Math.random() > 0.85 ? 1 : 0;

          return {
            balance: newBalance,
            profit: newProfit,
            equity: newEquity,
            balancePercent: parseFloat(newBalancePct),
            profitPercent: parseFloat(newProfitPct),
            totalTrades: prev.totalTrades + tradeIncrement,
            winRate: prev.winRate,
            lastTrade: isUp && delta > 50 ? delta * 12 : prev.lastTrade,
            lastY: newY,
            isUpTick: isUp,
          };
        });
      }, 1800);

      return () => clearInterval(interval);
    }, 1800);

    return () => clearTimeout(startTimer);
  }, []);

  return liveData;
}

const SIDEBAR_ITEMS = [
  { icon: TrendingUp, label: "Trading" },
  { icon: BarChart2, label: "Statistics" },
  { icon: Wallet, label: "Payouts" },
  { icon: Users, label: "Partners" },
  { icon: Download, label: "Downloads" },
  { icon: User, label: "Profile" },
  { icon: HelpCircle, label: "Help Center" },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-1.5">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#894CEF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="11 18 5 12 11 6" />
        <polyline points="19 18 13 12 19 6" />
      </svg>
      <span className="text-[11px] font-black tracking-wider text-white">
        CK CAPITAL
      </span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  subTone,
}: {
  label: string;
  value: string;
  sub?: string;
  subTone?: "up" | "down" | "muted";
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0D1E38]/90 p-2">
      <span className="text-[9px] text-gray-400 block">{label}</span>
      <div className="text-[12px] font-bold text-white mt-0.5 tabular-nums transition-colors duration-300 truncate">
        {value}
      </div>
      {sub ? (
        <span
          className={`text-[8px] font-semibold tabular-nums transition-colors ${
            subTone === "up"
              ? "text-emerald-400"
              : subTone === "down"
                ? "text-rose-400"
                : "text-gray-400"
          }`}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}

function GrowthChart({ liveData }: { liveData: ReturnType<typeof useLiveDashboard> }) {
  return (
    <div className="relative flex-1 w-full">
      <svg
        viewBox="0 0 320 120"
        className="h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#894CEF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#703AD7" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1="0" y1="20" x2="320" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        <line x1="0" y1="50" x2="320" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        <line x1="0" y1="80" x2="320" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          d={`M 0 95 C 30 92, 50 82, 70 85 C 90 88, 110 72, 130 68 C 150 64, 170 78, 190 70 C 210 62, 230 65, 250 ${liveData.lastY} C 270 52, 290 38, 320 32 L 320 120 L 0 120 Z`}
          fill="url(#chartGradient)"
        />

        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          d={`M 0 95 C 30 92, 50 82, 70 85 C 90 88, 110 72, 130 68 C 150 64, 170 78, 190 70 C 210 62, 230 65, 250 ${liveData.lastY} C 270 52, 290 38, 320 32`}
          fill="none"
          stroke="#894CEF"
          strokeWidth="2.2"
        />

        <line
          x1="250"
          y1="20"
          x2="250"
          y2="110"
          stroke="#894CEF"
          strokeDasharray="2 2"
          strokeWidth="1"
          opacity="0.6"
        />

        <circle
          cx="250"
          cy={liveData.lastY}
          r="3.5"
          fill="#894CEF"
          stroke="#030A1C"
          strokeWidth="1.5"
          className="transition-all duration-300"
        />
      </svg>

      {/* Live tooltip card (tablet + laptop) */}
      <div className="absolute top-1 right-10 hidden sm:block rounded border border-[#894CEF]/40 bg-[#080E24] px-2 py-1 shadow-lg text-center transition-all duration-300">
        <div className="text-[9px] font-bold text-[#A98BFF] tabular-nums">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(liveData.balance)}
        </div>
        <div className="text-[7.5px] text-gray-400">May 14</div>
      </div>
    </div>
  );
}

export function LaptopMockup() {
  const liveData = useLiveDashboard();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);

  return (
    <div
      className="relative w-full max-w-[300px] sm:max-w-[600px] lg:max-w-[720px] select-none"
      style={{ perspective: "1100px" }}
    >
      {/* Static Ground Shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 sm:-bottom-6 lg:-bottom-8 left-[4%] h-10 sm:h-12 lg:h-16 w-[92%] rounded-full bg-black/25 sm:bg-black/35 lg:bg-black/50 blur-2xl"
      />

      {/* 3D Perspective Wrapper - 3/4 Side View Angle (all devices) */}
      <div
        className="preserve-3d"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          transform: "rotateY(-22deg) rotateX(9deg) rotateZ(-1.5deg)",
        }}
      >
        {/* Device Chassis — phone bezel <sm, tablet bezel sm-lg, laptop bezel lg+ */}
        <div className="relative overflow-hidden rounded-[44px] sm:rounded-[30px] lg:rounded-[20px] border-[10px] sm:border-[14px] lg:border-[11px] border-[#18181B] bg-[#09090B] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4),0_0_30px_rgba(1,162,239,0.2)] w-full">
          {/* Top Bezel Camera Dot (tablet + laptop) */}
          <div className="absolute left-1/2 top-1.5 -translate-x-1/2 hidden sm:flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>

          {/* Dynamic Island (phone) */}
          <div className="absolute left-1/2 top-[7px] -translate-x-1/2 sm:hidden z-10 h-[12px] w-[58px] rounded-full bg-black" />

          {/* Screen Content - Dashboard UI (phone 9:19, tablet 4:3, laptop 16:9) */}
          <div className="mt-2 sm:mt-3 lg:mt-2.5 flex aspect-[9/19] sm:aspect-[4/3] lg:aspect-[16/9] w-full text-white">
            {/* Sidebar (laptop only) */}
            <aside className="hidden lg:flex w-[148px] shrink-0 flex-col justify-between border-r border-white/[0.07] bg-[#080E24] p-3">
              <div>
                <div className="mb-4 flex items-center gap-1.5 px-1">
                  <BrandMark />
                </div>

                <nav className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#703AD7] to-[#894CEF] px-2.5 py-1.5 font-bold text-white shadow-sm">
                    <LayoutDashboard size={13} />
                    <span>Overview</span>
                  </div>
                  {SIDEBAR_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-gray-400 transition-colors hover:text-white hover:bg-white/[0.08] cursor-pointer"
                    >
                      <item.icon size={13} />
                      <span className="text-[10.5px]">{item.label}</span>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content View */}
            <main className="flex flex-1 flex-col overflow-hidden bg-[#030A1C] p-3 sm:p-3.5">
              {/* Status Bar (phone) */}
              <div className="flex sm:hidden items-center justify-between text-[8px] font-semibold text-gray-500 px-1 mb-1.5">
                <span>9:41</span>
                <span className="flex items-center gap-1">
                  <span className="flex items-end gap-[1.5px]">
                    <span className="h-[3px] w-[2px] bg-white/60 rounded-sm" />
                    <span className="h-[5px] w-[2px] bg-white/60 rounded-sm" />
                    <span className="h-[7px] w-[2px] bg-white/60 rounded-sm" />
                  </span>
                  <span className="inline-block h-[7px] w-[12px] rounded-[2px] border border-white/60 relative">
                    <span className="absolute inset-[1px] right-[3px] bg-white/60 rounded-[1px]" />
                  </span>
                </span>
              </div>

              {/* Top Bar (phone + tablet) */}
              <div className="flex lg:hidden items-center justify-between mb-2">
                <BrandMark />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#894CEF]/40 bg-[#894CEF]/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-[#A98BFF]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#894CEF]" />
                  Illustrative
                </span>
              </div>

              <div className="mb-2 hidden justify-end lg:flex">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#894CEF]/35 bg-[#894CEF]/10 px-2 py-1 text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#B395E4]">
                  Illustrative simulation
                </span>
              </div>

              {/* Top Metrics Cards with Live Ticking Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <MetricCard
                  label="Account Balance"
                  value={formatCurrency(liveData.balance)}
                  sub={`${liveData.balancePercent >= 0 ? "+" : ""}${liveData.balancePercent}%`}
                  subTone={liveData.balancePercent >= 0 ? "up" : "down"}
                />
                <MetricCard
                  label="Profit"
                  value={formatCurrency(liveData.profit)}
                  sub={`${liveData.profitPercent >= 0 ? "+" : ""}${liveData.profitPercent}%`}
                  subTone={liveData.profitPercent >= 0 ? "up" : "down"}
                />
                <MetricCard label="Equity" value={formatCurrency(liveData.equity)} />
                <MetricCard label="Profit Split" value="100%" sub="Your Share" subTone="muted" />
              </div>

              {/* Middle Section: Live Chart & Trading Objectives */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 flex-1 min-h-0 mb-2">
                {/* Account Growth Chart */}
                <div className="sm:col-span-7 lg:col-span-8 flex flex-col rounded-lg border border-white/10 bg-[#080E24]/80 p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-white">Account Growth</span>
                    <span className="hidden sm:flex items-center gap-1 text-[8.5px] text-gray-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/5">
                      Last 30 Days <ChevronDown size={9} />
                    </span>
                  </div>

                  <div className="relative h-[110px] sm:h-auto sm:flex-1 w-full">
                    <GrowthChart liveData={liveData} />
                  </div>

                  {/* Date labels */}
                  <div className="flex justify-between text-[7.5px] text-gray-400 pt-1">
                    <span>Apr 16</span>
                    <span>Apr 23</span>
                    <span>Apr 30</span>
                    <span>May 7</span>
                    <span>May 14</span>
                  </div>
                </div>

                {/* Trading Objectives */}
                <div className="sm:col-span-5 lg:col-span-4 flex flex-col justify-start rounded-lg border border-white/10 bg-[#080E24]/80 p-2.5">
                  <div className="text-[10px] font-bold text-white mb-2">Trading Objectives</div>

                  <div className="space-y-2.5 text-[8.5px]">
                    <div>
                      <div className="flex items-center justify-between text-gray-300 mb-0.5">
                        <span>Profit Target</span>
                        <span className="flex items-center gap-0.5 text-white font-bold">
                          $10,000 <Check size={9} className="text-emerald-400" />
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-[#703AD7] to-[#894CEF]"
                        />
                      </div>
                      <span className="text-[7px] text-gray-400 text-right hidden sm:block mt-0.5">$10,000 (100%)</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-gray-300 mb-0.5">
                        <span>Max Daily Loss</span>
                        <span className="flex items-center gap-0.5 text-white font-bold">
                          $2,500 <Check size={9} className="text-emerald-400" />
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "49%" }}
                          transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-[#703AD7] to-[#894CEF]"
                        />
                      </div>
                      <span className="text-[7px] text-gray-400 text-right hidden sm:block mt-0.5">$1,240 (49%)</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-gray-300 mb-0.5">
                        <span>Max Loss</span>
                        <span className="flex items-center gap-0.5 text-white font-bold">
                          $5,000 <Check size={9} className="text-emerald-400" />
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "63%" }}
                          transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-[#703AD7] to-[#894CEF]"
                        />
                      </div>
                      <span className="text-[7px] text-gray-400 text-right hidden sm:block mt-0.5">$3,180 (63%)</span>
                    </div>
                  </div>
                </div>
              </div>

          {/* Bottom Summary Metrics Row — padded so text isn't clipped by bottom bezel */}
              <div className="grid grid-cols-4 gap-2 border-t border-white/[0.06] pb-2 pt-2 text-[9px]">
                <div>
                  <span className="text-gray-400 block text-[7.5px]">Total Trades</span>
                  <span className="text-[11px] font-bold text-white tabular-nums">
                    {liveData.totalTrades}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[7.5px]">Win Rate</span>
                  <span className="text-[11px] font-bold text-white tabular-nums">
                    {liveData.winRate}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[7.5px]">Best Trade</span>
                  <span className="text-[11px] font-bold text-white tabular-nums truncate block">
                    {formatCurrency(liveData.lastTrade)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[7.5px]">Avg. R:R</span>
                  <span className="text-[11px] font-bold text-white">1.82</span>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Laptop Bottom Aluminum Base & Keyboard Deck Lip (laptop only) */}
        <div className="relative hidden lg:block -mt-1 mx-auto h-3.5 w-[105%] -translate-x-[2.5%] rounded-b-xl border-t border-white/20 bg-[#1E1E22] shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
          {/* Center Thumb Notch */}
          <div className="mx-auto h-1.5 w-16 rounded-b-md bg-[#0F0F12]" />
        </div>
      </div>
    </div>
  );
}
