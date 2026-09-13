"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { CountryFlag } from "@/components/shared/CountryFlag";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe2,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  ArrowRight,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { feature } from "topojson-client";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { Topology } from "topojson-specification";
import worldLand from "world-atlas/land-110m.json";
import worldCountries from "world-atlas/countries-110m.json";
import type { CmsPayout } from "@/lib/cms";

function formatMoney(value: number | null, currency = "USD") {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export interface CountryHub {
  code: string;
  name: string;
  shortName: string;
  flag: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  region: string;
  topAsset: string;
  avgSla: string;
  rank: number;
  totalVolume: number;
  certCount: number;
}

// Exact Natural Earth projection coordinate mappings (viewBox="0 0 1000 500")
export const GLOBAL_HUBS: CountryHub[] = [
  {
    code: "AE",
    name: "United Arab Emirates",
    shortName: "UAE",
    flag: "🇦🇪",
    lat: 25.2048,
    lon: 55.2708,
    x: 645.4,
    y: 166.8,
    region: "Middle East & GCC Primary Hub",
    topAsset: "XAU/USD & US100",
    avgSla: "11.2 Hours",
    rank: 1,
    totalVolume: 180000,
    certCount: 38,
  },
  {
    code: "GB",
    name: "United Kingdom",
    shortName: "UK",
    flag: "🇬🇧",
    lat: 51.5074,
    lon: -0.1278,
    x: 499.7,
    y: 84.6,
    region: "European Liquidity & Clearing Core",
    topAsset: "GBP/USD & FTSE100",
    avgSla: "9.8 Hours",
    rank: 2,
    totalVolume: 245000,
    certCount: 58,
  },
  {
    code: "US",
    name: "United States",
    shortName: "USA",
    flag: "🇺🇸",
    lat: 40.7128,
    lon: -74.006,
    x: 315.4,
    y: 117.9,
    region: "North American Equities & FX Hub",
    topAsset: "US30, NAS100 & BTC",
    avgSla: "12.1 Hours",
    rank: 3,
    totalVolume: 160000,
    certCount: 34,
  },
  {
    code: "DE",
    name: "Germany",
    shortName: "Germany",
    flag: "🇩🇪",
    lat: 50.1109,
    lon: 8.6821,
    x: 520.6,
    y: 88.9,
    region: "Western Europe Financial Engine",
    topAsset: "DAX40 & EUR/USD",
    avgSla: "10.4 Hours",
    rank: 4,
    totalVolume: 220000,
    certCount: 52,
  },
  {
    code: "SG",
    name: "Singapore",
    shortName: "Singapore",
    flag: "🇸🇬",
    lat: 1.3521,
    lon: 103.8198,
    x: 781.6,
    y: 241.9,
    region: "Southeast Asia Financial Gateway",
    topAsset: "XAU/USD & USD/JPY",
    avgSla: "11.5 Hours",
    rank: 5,
    totalVolume: 120000,
    certCount: 26,
  },
  {
    code: "JP",
    name: "Japan",
    shortName: "Japan",
    flag: "🇯🇵",
    lat: 35.6762,
    lon: 139.6503,
    x: 855.7,
    y: 133.7,
    region: "East Asia Currency & Index Center",
    topAsset: "USD/JPY & NIKKEI 225",
    avgSla: "11.8 Hours",
    rank: 6,
    totalVolume: 85000,
    certCount: 15,
  },
  {
    code: "AU",
    name: "Australia",
    shortName: "Australia",
    flag: "🇦🇺",
    lat: -33.8688,
    lon: 151.2093,
    x: 887.7,
    y: 352.8,
    region: "Oceania Commodities & Capital Core",
    topAsset: "AUD/USD & Gold (XAU)",
    avgSla: "10.9 Hours",
    rank: 7,
    totalVolume: 95000,
    certCount: 18,
  },
  {
    code: "ZA",
    name: "South Africa",
    shortName: "S. Africa",
    flag: "🇿🇦",
    lat: -26.2041,
    lon: 28.0473,
    x: 573.6,
    y: 328.6,
    region: "African Emerging Markets Gateway",
    topAsset: "US30 & XAU/USD",
    avgSla: "12.4 Hours",
    rank: 8,
    totalVolume: 45000,
    certCount: 9,
  },
  {
    code: "NL",
    name: "Netherlands",
    shortName: "Netherlands",
    flag: "🇳🇱",
    lat: 52.3676,
    lon: 4.9041,
    x: 511.5,
    y: 82.1,
    region: "Eurozone Algo & High-Frequency Hub",
    topAsset: "EUR/USD & AEX",
    avgSla: "10.1 Hours",
    rank: 9,
    totalVolume: 65000,
    certCount: 12,
  },
  {
    code: "IE",
    name: "Ireland",
    shortName: "Ireland",
    flag: "🇮🇪",
    lat: 53.3498,
    lon: -6.2603,
    x: 485.4,
    y: 79.1,
    region: "Northwest European FinTech Node",
    topAsset: "EUR/USD & S&P500",
    avgSla: "9.9 Hours",
    rank: 10,
    totalVolume: 55000,
    certCount: 10,
  },
  {
    code: "BR",
    name: "Brazil",
    shortName: "Brazil",
    flag: "🇧🇷",
    lat: -23.5505,
    lon: -46.6333,
    x: 376.8,
    y: 320.2,
    region: "Latin America Premier Trading Hub",
    topAsset: "Crypto & US30",
    avgSla: "12.6 Hours",
    rank: 11,
    totalVolume: 25000,
    certCount: 5,
  },
  {
    code: "CA",
    name: "Canada",
    shortName: "Canada",
    flag: "🇨🇦",
    lat: 43.6532,
    lon: -79.3832,
    x: 304.7,
    y: 108.7,
    region: "North American Resource & FX Center",
    topAsset: "USD/CAD & Crude Oil",
    avgSla: "11.7 Hours",
    rank: 12,
    totalVolume: 25000,
    certCount: 5,
  },
];

// Passive interconnected flow arcs linking major trading centers
const FLOW_ARCS = [
  { id: "lon-nyc", from: { x: 499.7, y: 84.6 }, to: { x: 315.4, y: 117.9 }, curveness: 0.28 },
  { id: "lon-dxb", from: { x: 499.7, y: 84.6 }, to: { x: 645.4, y: 166.8 }, curveness: -0.22 },
  { id: "dxb-sin", from: { x: 645.4, y: 166.8 }, to: { x: 781.6, y: 241.9 }, curveness: 0.18 },
  { id: "sin-tyo", from: { x: 781.6, y: 241.9 }, to: { x: 855.7, y: 133.7 }, curveness: -0.24 },
  { id: "fra-dxb", from: { x: 520.6, y: 88.9 }, to: { x: 645.4, y: 166.8 }, curveness: 0.16 },
  { id: "sin-syd", from: { x: 781.6, y: 241.9 }, to: { x: 887.7, y: 352.8 }, curveness: 0.2 },
  { id: "nyc-sao", from: { x: 315.4, y: 117.9 }, to: { x: 376.8, y: 320.2 }, curveness: 0.24 },
  { id: "lon-jnb", from: { x: 499.7, y: 84.6 }, to: { x: 573.6, y: 328.6 }, curveness: -0.15 },
];

function generateArcPath(from: { x: number; y: number }, to: { x: number; y: number }, curveness: number) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ctrlX = midX - (dy / dist) * dist * curveness;
  const ctrlY = midY + (dx / dist) * dist * curveness;
  return `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`;
}

export function GlobalRewardsRadar({
  payouts = [],
  onSelectCountryFilter,
}: {
  payouts?: CmsPayout[];
  onSelectCountryFilter?: (countryCode: string) => void;
}) {
  // Precompute exact Natural Earth world map SVG path from world-atlas
  const { landPath, countryBordersPath } = useMemo(() => {
    try {
      const landGeo = feature(worldLand as unknown as Topology, (worldLand as any).objects.land);
      const countriesGeo = feature(worldCountries as unknown as Topology, (worldCountries as any).objects.countries);
      const projection = geoNaturalEarth1().fitSize([1000, 500], landGeo as any);
      const pathGen = geoPath(projection);
      return {
        landPath: pathGen(landGeo as any) || "",
        countryBordersPath: pathGen(countriesGeo as any) || "",
      };
    } catch {
      return { landPath: "", countryBordersPath: "" };
    }
  }, []);

  const hubs = useMemo(() => {
    const hubMap = new Map<string, CountryHub>();
    GLOBAL_HUBS.forEach((h) => hubMap.set(h.code, { ...h }));

    payouts.forEach((p) => {
      const code = (p.countryCode || "").toUpperCase();
      if (code && hubMap.has(code)) {
        const existing = hubMap.get(code)!;
        existing.certCount = Math.max(existing.certCount, (existing.certCount || 0) + 1);
      }
    });

    return Array.from(hubMap.values());
  }, [payouts]);

  const [activeCode, setActiveCode] = useState<string>("AE");
  const [isPaused, setIsPaused] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeHub = useMemo(() => {
    return hubs.find((h) => h.code === activeCode) || hubs[0];
  }, [hubs, activeCode]);

  // Auto-cycle through top hubs
  useEffect(() => {
    if (isPaused || userInteracted || hubs.length <= 1) return;
    const interval = setInterval(() => {
      setActiveCode((prev) => {
        const idx = hubs.findIndex((h) => h.code === prev);
        const nextIdx = (idx + 1) % Math.min(hubs.length, 8);
        return hubs[nextIdx]?.code || "AE";
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, userInteracted, hubs]);

  const handleSelectCountry = (code: string) => {
    setActiveCode(code);
    setUserInteracted(true);
  };

  const handleFilterClick = () => {
    if (onSelectCountryFilter) {
      onSelectCountryFilter(activeHub.code);
    }
    const certSection = document.getElementById("reward-certificates");
    if (certSection) {
      certSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─────────────────── LEFT: NATURAL EARTH WORLD TERMINAL (col-span-7 / 8) ─────────────────── */}
      <div className="lg:col-span-7 xl:col-span-8 relative flex flex-col justify-between rounded-3xl border border-gray-200 bg-[#030A1C] text-white p-5 sm:p-7 shadow-[0_24px_50px_-15px_rgba(10,10,12,0.4)] overflow-hidden min-h-[480px] sm:min-h-[540px]">
        {/* Subtle Background Radial Radar Rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#703AD7]/20 animate-[spin_120s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-[#894CEF]/20" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Radar Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-[0.18em] text-white/90 uppercase">
              LIVE GLOBAL NETWORK
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-white/60">
            <span className="hidden sm:inline">DATASET: NATURAL EARTH 110M</span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[#A98BFF] font-bold">
              140+ COUNTRIES
            </span>
          </div>
        </div>

        {/* ─── Vector SVG World Map Canvas ─── */}
        <div className="relative z-10 my-auto py-2 w-full flex items-center justify-center">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-auto max-h-[380px] select-none"
            aria-label="Natural Earth Global Trading Network Map"
          >
            <defs>
              {/* Micro dot matrix for continental fill */}
              <pattern id="dotMatrix" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.1" fill="rgba(255,255,255,0.3)" />
              </pattern>
              {/* Flow arc gradient */}
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#894CEF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="100%" stopColor="#703AD7" stopOpacity="0.4" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Latitude & Longitude Coordinate Lines */}
            <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray="3 3">
              <line x1="0" y1="125" x2="1000" y2="125" />
              <line x1="0" y1="250" x2="1000" y2="250" />
              <line x1="0" y1="375" x2="1000" y2="375" />
              <line x1="250" y1="0" x2="250" y2="500" />
              <line x1="500" y1="0" x2="500" y2="500" />
              <line x1="750" y1="0" x2="750" y2="500" />
            </g>

            {/* Natural Earth Accurate Landmass Polygons */}
            {landPath && (
              <g>
                {/* Land silhouette base */}
                <path
                  d={landPath}
                  fill="rgba(255,255,255,0.07)"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="0.75"
                />
                {/* Micro-dot overlay inside real landmass boundaries */}
                <path
                  d={landPath}
                  fill="url(#dotMatrix)"
                  stroke="none"
                />
              </g>
            )}

            {/* Country Borders from World-Atlas */}
            {countryBordersPath && (
              <path
                d={countryBordersPath}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />
            )}

            {/* Passive Global Financial Flow Arcs with Subtle Luminescence */}
            <g className="animate-[pulse_5s_ease-in-out_infinite]">
              {FLOW_ARCS.map((arc) => {
                const pathStr = generateArcPath(arc.from, arc.to, arc.curveness);
                return (
                  <g key={arc.id}>
                    {/* Outer soft glow arc */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke="rgba(54, 124, 219, 0.3)"
                      strokeWidth="2"
                    />
                    {/* Inner crisp connection line */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke="rgba(1, 162, 239, 0.7)"
                      strokeWidth="0.9"
                      strokeDasharray="4 4"
                    />
                  </g>
                );
              })}
            </g>

            {/* Geographic Radar Country Hub Nodes */}
            {hubs.map((hub) => {
              const isSelected = hub.code === activeCode;
              return (
                <g
                  key={hub.code}
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => handleSelectCountry(hub.code)}
                >
                  {/* Ping Waves (Active / Selected Hub) */}
                  {isSelected && (
                    <>
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="18"
                        fill="none"
                        stroke="#894CEF"
                        strokeWidth="1.5"
                        opacity="0.9"
                        className="animate-[radar-ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
                      />
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="30"
                        fill="none"
                        stroke="#703AD7"
                        strokeWidth="0.8"
                        opacity="0.4"
                        className="animate-[radar-ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.6s]"
                      />
                    </>
                  )}

                  {/* Outer Target Node */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected ? 9.5 : 4.5}
                    fill={isSelected ? "#894CEF" : "rgba(255,255,255,0.18)"}
                    stroke={isSelected ? "#FFFFFF" : "#703AD7"}
                    strokeWidth={isSelected ? "2" : "0.8"}
                    filter={isSelected ? "url(#glow)" : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Core Node Center */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected ? 4 : 2}
                    fill={isSelected ? "#030A1C" : "#FFFFFF"}
                    className="transition-all duration-300"
                  />

                  {/* Floating Tag over Active Hub */}
                  {isSelected && (
                    <g transform={`translate(${hub.x}, ${hub.y - 14})`}>
                      <rect
                        x="-36"
                        y="-16"
                        width="72"
                        height="18"
                        rx="9"
                        fill="rgba(3,12,27,0.94)"
                        stroke="#894CEF"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="var(--font-jakarta), sans-serif"
                      >
                        {hub.flag} {hub.shortName}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Radar Footer Telemetry Bar */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-white/70 font-mono">
          <span className="flex items-center gap-2">
            <Activity size={13} className="text-[#A98BFF]" />
            REAL-TIME PROP CLEARING NETWORK
          </span>
          <span className="text-white/50 hidden sm:inline">
            CLICK ANY BEACON TO INSPECT REGIONAL DATA
          </span>
        </div>
      </div>

      {/* ─────────────────── RIGHT: TELEMETRY COCKPIT & STRUCTURED HUB GRID (col-span-5 / 4) ─────────────────── */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm gap-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHub.code}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Top Identity Header */}
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A98BFF]">
                  <Sparkles size={13} />
                  <span>REGIONAL HUB #{activeHub.rank}</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Region
                </span>
              </div>

              {/* Country Name & Flag */}
              <div className="mt-3 flex items-center gap-3">
                <CountryFlag code={activeHub.code} name={activeHub.name} size={46} className="drop-shadow-sm" />
                <div>
                  <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-[#0A0A0C] leading-tight">
                    {activeHub.name}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    {activeHub.region}
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <TrendingUp size={11} className="text-[#A98BFF]" />
                  Total Volume
                </span>
                <p className="mt-1 text-lg sm:text-xl font-extrabold text-[#0A0A0C]">
                  {formatMoney(activeHub.totalVolume)}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-600" />
                  Certificates
                </span>
                <p className="mt-1 text-lg sm:text-xl font-extrabold text-[#0A0A0C]">
                  {activeHub.certCount}+ Approved
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Clock size={11} className="text-violet-600" />
                  Direct SLA
                </span>
                <p className="mt-1 text-base sm:text-lg font-bold text-[#0A0A0C]">
                  {activeHub.avgSla}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Activity size={11} className="text-[#A98BFF]" />
                  Top Asset
                </span>
                <p className="mt-1 text-xs font-extrabold text-[#0A0A0C] line-clamp-1">
                  {activeHub.topAsset}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ─── Structured Country Selector Matrix (No Horizontal Scroll!) ─── */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Select Regional Hub
            </span>
            <span className="text-[10px] font-semibold text-[#A98BFF]">
              12 Published Hubs
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {hubs.slice(0, 12).map((h) => {
              const isSelected = h.code === activeCode;
              return (
                <button
                  key={h.code}
                  type="button"
                  onClick={() => handleSelectCountry(h.code)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-[#894CEF] bg-violet-50/80 shadow-sm ring-1 ring-[#894CEF] text-[#0A0A0C]"
                      : "border-gray-100 bg-gray-50/60 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <CountryFlag code={h.code} name={h.name} size={22} className="leading-none" />
                  <span className="text-[11px] font-extrabold mt-1 truncate max-w-full">
                    {h.shortName}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">
                    {formatMoney(h.totalVolume)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct 1-Click Action to Filter Certificates Below */}
        <div>
          <button
            type="button"
            onClick={handleFilterClick}
            className="brand-pill-btn w-full justify-center gap-2 font-bold py-3 text-xs sm:text-sm text-[#1A1030]"
          >
            <span>Filter {activeHub.name} Records</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes flow-dash {
          to {
            stroke-dashoffset: -200;
          }
        }
        @keyframes radar-ping {
          0% {
            r: 8px;
            opacity: 0.9;
          }
          100% {
            r: 36px;
            opacity: 0;
          }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          20%, 80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
