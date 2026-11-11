"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type PlanId = "standard" | "1step" | "pro" | "instant";

interface PlanDatum {
  disc: number;
  orig: number;
  p1: string;
  p2: string;
  daily: string;
  max: string;
  consistency: string;
  fundedConsistency: string;
}

const PLAN_TABS: Array<{ id: PlanId; name: string; desc: string }> = [
  { id: "standard", name: "2 Step Standard", desc: "Two Phases | 50% Consistency on Payout" },
  { id: "1step", name: "1 Step Standard", desc: "Single Phase | Faster Road to Funding" },
  { id: "pro", name: "2 Step Pro", desc: "Two Phases | No Consistency Score" },
  { id: "instant", name: "Instant Funding", desc: "Skip Evaluation | Direct Simulated Funding" },
];

const ALL_SIZES = ["10K", "25K", "50K", "100K", "200K", "300K"] as const;

const PLANS: Record<PlanId, Record<string, PlanDatum>> = {
  standard: {
    "10K": { disc: 18.8, orig: 75.2, p1: "$1,000", p2: "$500", daily: "$400", max: "$800", consistency: "50%", fundedConsistency: "50%" },
    "25K": { disc: 78.2, orig: 312.8, p1: "$2,500", p2: "$1,250", daily: "$1,000", max: "$2,000", consistency: "50%", fundedConsistency: "50%" },
    "50K": { disc: 118.8, orig: 475.2, p1: "$5,000", p2: "$2,500", daily: "$2,000", max: "$4,000", consistency: "50%", fundedConsistency: "50%" },
    "100K": { disc: 178.2, orig: 712.8, p1: "$10,000", p2: "$5,000", daily: "$4,000", max: "$8,000", consistency: "50%", fundedConsistency: "50%" },
    "200K": { disc: 699.2, orig: 2796.8, p1: "$20,000", p2: "$10,000", daily: "$8,000", max: "$16,000", consistency: "50%", fundedConsistency: "50%" },
    "300K": { disc: 899.2, orig: 3596.8, p1: "$30,000", p2: "$15,000", daily: "$12,000", max: "$24,000", consistency: "50%", fundedConsistency: "50%" },
  },
  "1step": {
    "10K": { disc: 28.2, orig: 112.8, p1: "$1,000", p2: "$0", daily: "$300", max: "$600", consistency: "30%", fundedConsistency: "30%" },
    "25K": { disc: 58.2, orig: 232.8, p1: "$2,500", p2: "$0", daily: "$750", max: "$1,500", consistency: "30%", fundedConsistency: "30%" },
    "50K": { disc: 138.2, orig: 552.8, p1: "$5,000", p2: "$0", daily: "$1,500", max: "$3,000", consistency: "30%", fundedConsistency: "30%" },
    "100K": { disc: 229.8, orig: 919.2, p1: "$10,000", p2: "$0", daily: "$3,000", max: "$6,000", consistency: "30%", fundedConsistency: "30%" },
    "200K": { disc: 699.2, orig: 2796.8, p1: "$20,000", p2: "$0", daily: "$6,000", max: "$12,000", consistency: "30%", fundedConsistency: "30%" },
    "300K": { disc: 899.2, orig: 3596.8, p1: "$30,000", p2: "$0", daily: "$9,000", max: "$18,000", consistency: "30%", fundedConsistency: "30%" },
  },
  pro: {
    "10K": { disc: 37.6, orig: 150.4, p1: "$1,000", p2: "$500", daily: "$400", max: "$800", consistency: "NA", fundedConsistency: "NA" },
    "25K": { disc: 156.4, orig: 625.6, p1: "$2,500", p2: "$1,250", daily: "$1,000", max: "$2,000", consistency: "NA", fundedConsistency: "NA" },
    "50K": { disc: 237.6, orig: 950.4, p1: "$5,000", p2: "$2,500", daily: "$2,000", max: "$4,000", consistency: "NA", fundedConsistency: "NA" },
    "100K": { disc: 376.4, orig: 1505.6, p1: "$10,000", p2: "$5,000", daily: "$4,000", max: "$8,000", consistency: "NA", fundedConsistency: "NA" },
    "200K": { disc: 1398.4, orig: 5593.6, p1: "$20,000", p2: "$10,000", daily: "$8,000", max: "$16,000", consistency: "NA", fundedConsistency: "NA" },
    "300K": { disc: 1798.4, orig: 7193.6, p1: "$30,000", p2: "$15,000", daily: "$12,000", max: "$24,000", consistency: "NA", fundedConsistency: "NA" },
  },
  instant: {
    "10K": { disc: 38.2, orig: 152.8, p1: "$0", p2: "$0", daily: "$300", max: "$500", consistency: "NA", fundedConsistency: "20%" },
    "25K": { disc: 78.2, orig: 312.8, p1: "$0", p2: "$0", daily: "$750", max: "$1,250", consistency: "NA", fundedConsistency: "20%" },
    "50K": { disc: 198.2, orig: 792.8, p1: "$0", p2: "$0", daily: "$1,500", max: "$2,500", consistency: "NA", fundedConsistency: "20%" },
    "100K": { disc: 389.2, orig: 1556.8, p1: "$0", p2: "$0", daily: "$3,000", max: "$5,000", consistency: "NA", fundedConsistency: "20%" },
  },
};

const QUANTITY_TIERS = [
  { n: 1, off: 0, label: "1st account" },
  { n: 2, off: 5, label: "2nd account" },
  { n: 3, off: 5, label: "3rd account" },
] as const;

const PAYMENT_METHODS = [
  { name: "Visa", src: "/payments/visa.svg" },
  { name: "Mastercard", src: "/payments/mastercard.svg" },
  { name: "Apple Pay", src: "/payments/apple-pay.svg" },
  { name: "Google Pay", src: "/payments/google-pay.svg" },
  { name: "PayPal", src: "/payments/paypal.svg" },
  { name: "Crypto", src: "/payments/crypto.svg" },
] as const;

const CONDITION_CHIPS = [
  "Simulated trading environment",
  "One-time evaluation fee",
];

const fmt = (v: number) =>
  "$" +
  v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8.5l3.2 3.2L13 5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 9h11M10 4.5L14.5 9 10 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function checkoutUrl(plan: PlanId, size: string, qty: number) {
  return `https://my.ckpropfirm.com/auth/signup?plan=${plan}&size=${size}&currency=USD&qty=${qty}`;
}

export default function LandingClient() {
  const [selectedType, setSelectedType] = useState<PlanId>("standard");
  const [selectedSize, setSelectedSize] = useState<string>("100K");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [quantity, setQuantity] = useState<number>(1);

  const visibleSizes = useMemo(
    () =>
      (selectedType === "instant"
        ? ALL_SIZES.filter((s) => s !== "200K" && s !== "300K")
        : [...ALL_SIZES]) as string[],
    [selectedType]
  );

  const activePlan: PlanDatum | null = PLANS[selectedType][selectedSize] ?? null;
  const activeTypeName = PLAN_TABS.find((t) => t.id === selectedType)?.name ?? "";

  const tierPrice = (tier: number) => {
    const base = activePlan?.disc ?? 0;
    const off = QUANTITY_TIERS.find((q) => q.n === tier)?.off ?? 0;
    return base * (1 - off / 100);
  };
  const orderTotal = (qty: number) =>
    QUANTITY_TIERS.filter((q) => q.n <= qty).reduce((sum, q) => sum + tierPrice(q.n), 0);
  const checkoutTotal = orderTotal(quantity);

  const handleTypeSelect = (typeId: PlanId) => {
    setSelectedType(typeId);
    if (typeId === "instant" && (selectedSize === "200K" || selectedSize === "300K")) {
      setSelectedSize("100K");
    } else if (!PLANS[typeId][selectedSize]) {
      setSelectedSize("100K");
    }
  };

  const signupUrl = checkoutUrl(selectedType, selectedSize, quantity);
  const signupUrlForSize = (size: string) => checkoutUrl(selectedType, size, 1);

  const comparisonRows: Array<{ label: string; value: (plan: PlanDatum) => string }> = [
    { label: "Phase 1 Target", value: (plan) => plan.p1 },
    { label: "Phase 2 Target", value: (plan) => plan.p2 },
    { label: "Max Daily Loss", value: (plan) => plan.daily },
    { label: "Max Loss", value: (plan) => plan.max },
    { label: "Min. Trading Days", value: () => "NA" },
    { label: "Consistency", value: (plan) => plan.consistency },
    { label: "Trading Period", value: () => "Unlimited" },
    { label: "Profit Split", value: () => "80%" },
    { label: "Funded Consistency", value: (plan) => plan.fundedConsistency },
  ];

  return (
    <main className="min-h-screen">
      {/* ============ A. HERO ============ */}
      <section
        className="relative isolate overflow-hidden bg-[#030A1C] text-[#F8FAFC] pt-12 sm:pt-16 md:pt-20 pb-14 sm:pb-16 md:pb-20"
        data-od-id="hero"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="fx-aurora-a absolute inset-0" />
          <div className="fx-aurora-b absolute inset-0" />
          <div className="fx-aurora-core absolute inset-0" />
          <div className="fx-aurora-dots absolute inset-0 opacity-40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="relative z-10 lg:col-span-5 xl:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full mb-3 sm:mb-4 px-3 py-1 bg-white/[0.04] border border-white/10">
                <span className="h-2 w-2 rounded-full bg-[#894CEF] shadow-[0_0_8px_#894CEF]" />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#999BA3]">
                  Simulated trading evaluations
                </span>
              </div>

              <h1 className="font-[family-name:var(--font-jakarta)] text-3xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-black uppercase leading-[1.08] tracking-tight text-white">
                Prove your trading skills
                <br />
                <span className="text-white">in a simulated evaluation.</span>
              </h1>

              <p className="mt-3.5 sm:mt-4 text-sm sm:text-base font-medium leading-relaxed text-[#999BA3] max-w-lg">
                No time limits, transparent rules, no hidden fees.
              </p>

              <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
                {[
                  { value: "One-time fee", label: "No subscription" },
                  { value: "No time limits", label: "Trade at your pace" },
                  { value: "News trading", label: "Allowed" },
                ].map((pill) => (
                  <div
                    key={pill.value}
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-[#080E24]/80 pl-1.5 pr-3 sm:pr-4 py-1 sm:py-1.5 shadow-sm transition-all duration-200 cursor-default"
                  >
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#894CEF]/15 text-[#A98BFF]">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left leading-tight">
                      <span className="block text-[11px] sm:text-[12px] font-extrabold text-white">
                        {pill.value}
                      </span>
                      <span className="text-[9.5px] sm:text-[10px] font-medium text-[#999BA3]">
                        {pill.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a
                  href="#start-challenge"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl brand-gradient-btn px-6 py-3.5 text-sm sm:text-base font-bold text-[#1A1030] transition-all duration-200 text-center shadow-lg hover:shadow-cyan-500/25"
                >
                  <span>Start Challenge</span>
                  <ArrowIcon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <a
                  href="#start-challenge"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-3 text-sm sm:text-base font-extrabold text-white transition-all duration-200 shadow-sm text-center"
                >
                  <span>Compare Plans</span>
                </a>
              </div>
            </div>

            <div className="relative isolate z-0 mt-6 -mb-14 flex min-h-[340px] w-full max-w-full items-end justify-center overflow-visible sm:-mb-16 sm:mt-8 sm:min-h-[470px] md:-mb-20 lg:col-span-7 lg:mt-0 lg:min-h-[610px] lg:justify-end xl:col-span-7">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -z-10 h-[72%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B3DFF]/20 blur-[70px] sm:blur-[95px] lg:left-[58%] lg:h-[68%] lg:w-[72%] lg:blur-[120px]"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-[8%] left-1/2 -z-10 h-[18%] w-[64%] -translate-x-1/2 rounded-full bg-[#B35CFF]/18 blur-[55px] lg:left-[58%]"
              />
              <div className="flex w-full justify-center lg:justify-end">
                <Image
                  src="/images/ck-purple-raccoon-v2.webp"
                  alt="CK Propfirm futuristic raccoon mascot holding the CK emblem"
                  width={1930}
                  height={1930}
                  priority
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 560px, (max-width: 1280px) 720px, 790px"
                  className="hero-mascot relative ml-auto h-auto w-full max-w-[390px] object-contain sm:max-w-[560px] lg:max-w-[720px] xl:max-w-[790px]"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-[8%] bottom-0 z-10 h-[10%] bg-gradient-to-t from-[#030A1C] via-[#030A1C]/70 to-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ B. CHALLENGE SELECTOR ============ */}
      <section
        id="start-challenge"
        className="relative scroll-mt-24 bg-[#05060A] py-16 text-white md:py-24"
        data-od-id="challenge-comparison"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 sm:gap-14 md:gap-16">
            <div className="text-center">
              <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-bold not-italic tracking-tight text-white sm:text-4xl md:text-[46px] md:leading-[1.15] lg:text-[48px]">
                Choose your next challenge
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm font-normal text-white/70 md:text-base">
                Complete the Trading Objectives to become eligible for your CK Account.
              </p>

              <div className="mt-4 sm:mt-5 flex flex-wrap justify-center items-center gap-2.5">
                <div
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/10 p-1 shadow-sm backdrop-blur-md"
                  role="group"
                  aria-label="Challenge display view"
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    aria-pressed={viewMode === "cards"}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-colors ${
                      viewMode === "cards" ? "bg-[#703AD7] text-white" : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    aria-pressed={viewMode === "table"}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-colors ${
                      viewMode === "table" ? "bg-[#703AD7] text-white" : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
                {PLAN_TABS.map((tItem) => {
                  const isSelected = selectedType === tItem.id;
                  return (
                    <div
                      key={tItem.id}
                      onClick={() => handleTypeSelect(tItem.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") handleTypeSelect(tItem.id);
                      }}
                      className={`rounded-xl border px-4 py-3 text-left sm:p-4 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 sm:min-w-0 ${
                        isSelected ? "scale-[1.015]" : ""
                      } ${
                        isSelected
                          ? "border-[#894CEF] bg-[#21184F] shadow-[0_0_18px_rgba(137,76,239,0.3)] ring-1 ring-[#894CEF]"
                          : "border-white/10 bg-[#171820] hover:border-[#703AD7]/60 hover:bg-[#1D1E29]"
                      }`}
                    >
                      <h3 className="mb-1 text-sm font-bold text-white">{tItem.name}</h3>
                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected ? "text-white/85" : "text-white/70"
                        }`}
                      >
                        {tItem.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div
                className={`grid grid-cols-2 gap-2.5 pb-16 sm:gap-3 sm:pb-0 ${
                    selectedType === "instant"
                      ? "sm:grid-cols-4 lg:grid-cols-4"
                      : "sm:grid-cols-3 lg:grid-cols-6"
                  } ${viewMode === "cards" ? "" : "hidden"}`}
                >
                  {visibleSizes.map((size) => {
                    const data = PLANS[selectedType][size];
                    const isSelected = size === selectedSize;
                    return (
                      <div
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") setSelectedSize(size);
                        }}
                        data-od-id={`challenge-card-${size}`}
                        className={`relative rounded-2xl border bg-[#171820] p-3.5 pt-7 text-left transition-all duration-200 sm:min-h-28 sm:rounded-xl sm:pt-3.5 cursor-pointer hover:bg-[#1D1E29] ${
                          isSelected
                            ? "border-[#894CEF] bg-[#21184F] ring-2 ring-[#894CEF] shadow-[0_0_20px_rgba(137,76,239,0.2)]"
                            : "border-white/10"
                        }`}
                      >
                        {size === "100K" && (
                          <span className="absolute right-2 top-2 z-10 rounded-full bg-[#894CEF] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-sm sm:-top-2 sm:text-[9px]">
                            Popular
                          </span>
                        )}
                        <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                          Account
                        </div>
                        <div className="mb-1.5 text-xl font-extrabold text-white sm:text-lg sm:font-bold">
                          ${size}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">
                            Today
                          </span>
                          <span className="text-sm font-extrabold text-emerald-400 sm:text-xs">
                            {fmt(data.disc)}
                          </span>
                          <span className="text-[10px] font-normal text-white/60">
                            was <span className="line-through">{fmt(data.orig)}</span>
                            <span className="ml-1.5 font-bold text-amber-300">Save 80%</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {viewMode === "cards" && activePlan && (
              <div
                data-od-id="mobile-checkout-bar"
                className="sticky bottom-3 z-40 -mt-14 mb-2 flex items-center justify-between gap-3 rounded-2xl sm:mx-1 sm:mt-0 sm:mb-0 border border-white/15 bg-[#080B18]/95 p-3 shadow-[0_14px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:hidden"
              >
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold uppercase tracking-wider text-white/80">
                    Selected plan
                  </p>
                  <p className="truncate text-sm font-extrabold text-white">
                    Selected plan {activeTypeName} {selectedSize} · {quantity} account
                    {quantity > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm font-black text-emerald-400">{fmt(checkoutTotal)}</p>
                </div>
                <a
                  href={signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-gradient-btn inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl px-4 text-xs font-bold text-[#1A1030]"
                >
                  Start <ArrowIcon className="ml-1.5 h-4 w-4" />
                </a>
              </div>
            )}

            {viewMode === "cards" && activePlan && (
              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#894CEF]/35 bg-gradient-to-br from-[#17113D] via-[#0B1024] to-[#080B18] p-3 shadow-[0_20px_60px_rgba(3,10,28,0.28)] lg:grid-cols-12">
                <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-white shadow-inner md:p-5 lg:col-span-8">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                      <h3 className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-white/65">
                        Evaluation Rules
                      </h3>
                      <ul className="flex flex-col gap-3 text-xs">
                        <li className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70 font-normal">Phase 1 Target</span>
                          <span className="font-bold text-white">{activePlan.p1}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70 font-normal">Phase 2 Target</span>
                          <span className="font-bold text-white">{activePlan.p2}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70 font-normal">Max Daily Loss</span>
                          <span className="font-bold text-white">{activePlan.daily}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70 font-normal">Max Loss</span>
                          <span className="font-bold text-white">{activePlan.max}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70 font-normal">Min. Trading Days</span>
                          <span className="font-bold text-white">NA</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-white/70 font-normal">Consistency</span>
                          <span className="font-bold text-white">{activePlan.consistency}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                      <h3 className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-white/65">
                        Funded Account Rules
                      </h3>
                      <ul className="flex flex-col gap-3 text-xs">
                        <li className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70 font-normal">Trading Period</span>
                          <span className="font-bold text-white">Unlimited</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/70 font-normal">Profit Split</span>
                          <span className="font-bold text-white">80%</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-white/70 font-normal">Funded Consistency</span>
                          <span className="font-bold text-white">
                            {activePlan.fundedConsistency}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-[#0B0F22]/70 p-5 text-white shadow-xl backdrop-blur-md lg:col-span-4">
                  <div>
                    <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                          Selected Plan
                        </span>
                        <div className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
                          {activeTypeName} ${selectedSize}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">
                          {fmt(checkoutTotal)}
                        </div>
                        <div className="text-xs text-white/45 font-normal">
                          <span className="line-through">{fmt(activePlan.orig * quantity)}</span>
                          {quantity > 1 && (
                            <span className="ml-1.5 font-bold text-white/80">
                              {quantity} accounts
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-white/10 py-1 text-xs text-white/70">
                        <span>Access Level</span>
                        <span className="font-bold text-white">Direct Evaluation Access</span>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-white/10 pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/65">
                        Quantity
                      </span>
                      <div className="mt-1.5 flex flex-col gap-0.5" aria-label="Number of accounts">
                        {QUANTITY_TIERS.map((tier) => {
                          const isActive = tier.n <= quantity;
                          return (
                            <button
                              key={tier.n}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => setQuantity(tier.n)}
                              className={`flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 py-1 text-left transition-colors ${
                                isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                              }`}
                            >
                              <CheckIcon
                                className={`h-3 w-3 shrink-0 ${
                                  isActive ? "text-emerald-400" : "text-white/30"
                                }`}
                              />
                              <span
                                className={`text-xs font-bold ${
                                  isActive ? "text-white" : "text-white/55"
                                }`}
                              >
                                {tier.label}
                              </span>
                              <span className="ml-auto flex items-center gap-2">
                                {tier.off > 0 && (
                                  <span className="rounded bg-amber-400/15 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-amber-300">
                                    {tier.off}% off
                                  </span>
                                )}
                                <span
                                  className={`text-xs font-bold tabular-nums ${
                                    isActive ? "text-white" : "text-white/55"
                                  }`}
                                >
                                  {fmt(tierPrice(tier.n))}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-1.5 text-[9px] leading-[1.4] text-white/55">
                        Discount applies per account when you buy more than one in the same
                        order.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-stretch gap-2.5">
                      <div className="flex shrink-0 items-center rounded-full border border-[#E7C66B]/60 bg-white/[0.04]">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1}
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="grid h-11 w-9 place-items-center rounded-l-full text-lg font-bold text-white/80 transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-white/25"
                        >
                          −
                        </button>
                        <span
                          aria-live="polite"
                          className="w-6 text-center text-sm font-extrabold tabular-nums text-white"
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={quantity >= QUANTITY_TIERS.length}
                          onClick={() =>
                            setQuantity((q) => Math.min(QUANTITY_TIERS.length, q + 1))
                          }
                          className="grid h-11 w-9 place-items-center rounded-r-full text-lg font-bold text-white/80 transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-white/25"
                        >
                          +
                        </button>
                      </div>
                      <a
                        href={signupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brand-pill-btn flex min-w-0 flex-1 items-center justify-center gap-2 font-bold text-[#1A1030] shadow-[0_4px_22px_rgba(231,198,107,0.4)] transition-all hover:shadow-amber-400/50 hover:brightness-105"
                      >
                        <span>Start Challenge</span>
                        <ArrowIcon className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/65">
                        Add-Ons Available
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/70">
                          24 Hour Payout +25%
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[11px] text-white/65">
                      {PAYMENT_METHODS.map((pm) => (
                        <span
                          key={pm.name}
                          title={pm.name}
                          className="grid h-6 w-9 shrink-0 place-items-center overflow-hidden rounded border border-white/10 bg-white/[0.06]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={pm.src}
                            alt={pm.name}
                            width={30}
                            height={20}
                            loading="lazy"
                            decoding="async"
                            className="h-5 w-auto object-contain"
                          />
                        </span>
                      ))}
                      <span className="text-xs font-medium">+10 more</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F22] shadow-sm ${
                viewMode === "table" ? "" : "hidden"
              }`}
            >
                <div className="overflow-x-auto overscroll-x-contain">
                  <table
                    data-od-id="challenge-table"
                    className={`w-full border-collapse text-left ${
                      selectedType === "instant" ? "min-w-[800px]" : "min-w-[1000px]"
                    }`}
                  >
                    <thead>
                      <tr className="bg-[#F2F0F8]">
                        <th className="px-4 py-4 text-[11px] font-semibold text-gray-600">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
                            Account
                          </span>
                          <span className="mt-1 block text-sm font-extrabold text-[#0A0A0C]">
                            Key features
                          </span>
                        </th>
                        {visibleSizes.map((size) => {
                          const plan = PLANS[selectedType][size];
                          return (
                            <th key={size} className="relative bg-white px-3.5 py-3.5">
                              {size === "100K" && (
                                <span className="absolute right-2 top-2 rounded-full bg-[#894CEF] px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                                  Popular
                                </span>
                              )}
                              <span className="block text-[9px] font-bold uppercase tracking-wider text-gray-500">
                                Account
                              </span>
                              <strong className="mt-0.5 block text-lg text-[#0A0A0C]">
                                ${size}
                              </strong>
                              <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-wider text-gray-400">
                                Today
                              </span>
                              <span className="block text-xs font-extrabold text-[#0A0A0C]">
                                {fmt(plan.disc)}
                              </span>
                              <span className="block text-[9px] font-normal text-gray-400">
                                was <span className="line-through">{fmt(plan.orig)}</span>
                                <span className="ml-1 font-bold text-amber-600">Save 80%</span>
                              </span>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row, rowIndex) => (
                        <tr key={row.label} className={rowIndex % 2 ? "bg-white" : "bg-[#F8F8FA]"}>
                          <td className="px-4 py-3 text-[11px] font-semibold text-gray-600">
                            {row.label}
                          </td>
                          {visibleSizes.map((size) => (
                            <td
                              key={`${row.label}-${size}`}
                              className="px-3 py-3 text-[11px] font-bold text-[#0A0A0C]"
                            >
                              {row.value(PLANS[selectedType][size])}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-white">
                        <td className="px-4 py-4 text-[11px] font-bold text-gray-600">
                          Choose account
                        </td>
                        {visibleSizes.map((size) => (
                          <td key={`cta-${size}`} className="p-2.5">
                            <a
                              href={signupUrlForSize(size)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="brand-gradient-btn flex min-h-9 items-center justify-center rounded-lg px-2 text-[10px] font-bold text-[#1A1030] shadow-sm transition-transform hover:-translate-y-0.5"
                            >
                              Start Challenge
                            </a>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            <p
              className={`mt-2 text-center text-[11px] text-white/50 sm:hidden ${
                viewMode === "table" ? "" : "hidden"
              }`}
            >
                Swipe left and right to view the complete comparison table.
            </p>

            <div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {CONDITION_CHIPS.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[12px] font-bold text-white/70 shadow-sm"
                  >
                    <CheckIcon className="h-3 w-3 shrink-0 text-[#A98BFF]" />
                    {c}
                  </span>
                ))}
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-center text-[13px] font-semibold leading-5 text-white/70">
                Every evaluation fee is a one-time payment — no subscriptions, no recurring
                charges, no hidden fees.
              </p>
              <p className="mx-auto mt-2 max-w-2xl text-center text-xs leading-5 text-white/55">
                All trading involves simulated capital in demo environments. Performance in
                simulated trading does not guarantee real-market results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ C. SUPPORT ============ */}
      <section className="bg-white text-[#111827] py-16 md:py-24" data-od-id="customer-support">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A98BFF]">
                <span className="h-2 w-2 rounded-full bg-[#7943E0]" />
                Available 24/7
              </div>
              <h2 className="mt-4 max-w-[15ch] font-[family-name:var(--font-jakarta)] text-3xl font-black leading-[1.02] tracking-tight text-[#0A0A0C] sm:text-4xl">
                Customer support built around traders.
              </h2>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-[#4B5563]">
                Our dedicated team is here to help with evaluations, platforms, account
                questions, and payout guidance. Get a clear answer whenever you need it.
              </p>

              <div className="relative mt-7 h-[260px] sm:h-[340px] overflow-hidden rounded-[24px] border border-gray-200 bg-[#07070B] lg:hidden">
                <Image
                  src="/images/support/discord-community-v2.jpg"
                  alt="CK Propfirm Discord community"
                  fill
                  sizes="100vw"
                  className="object-cover object-left-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <p className="rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    CK Propfirm support
                  </p>
                  <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">
                    24/7
                  </span>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  href="https://discord.com/invite/hGSVx9CmS2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-gradient-btn inline-flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 text-sm font-bold text-[#1A1030] shadow-md transition-all"
                  data-od-id="customer-support-discord"
                >
                  <span className="flex items-center gap-2">Discord support</span>
                  <ArrowIcon className="h-4 w-4" />
                </a>
                <a
                  href="mailto:admin@ckpropfirm.com"
                  className="inline-flex min-h-12 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-[#0A0A0C] shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
                  data-od-id="customer-support-email"
                >
                  <span className="flex items-center gap-2">Support email</span>
                  <ArrowIcon className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-3 text-xs font-medium text-[#6B7280]">
                Typical reply time: under 2 minutes · Pre-purchase and account questions
                welcome.
              </p>

              <a
                href="/en/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0A0A0C] transition-colors hover:text-[#A98BFF] underline"
                data-od-id="customer-support-contacts"
              >
                Show all contacts <ArrowIcon className="h-[15px] w-[15px]" />
              </a>
            </div>

            <div className="relative hidden h-full min-h-[400px] overflow-hidden rounded-[28px] border border-foreground/10 bg-[#07070B] lg:block">
              <Image
                src="/images/support/discord-community-v2.jpg"
                alt="CK Propfirm Discord community"
                fill
                sizes="55vw"
                className="object-cover object-left-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4">
                <div>
                  <p className="rounded-full border border-secondary/35 bg-background/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#A98BFF] backdrop-blur-sm">
                    CK Propfirm support
                  </p>
                </div>
                <span className="rounded-full border border-secondary/35 bg-background/70 px-3 py-1.5 text-xs font-semibold text-[#A98BFF]">
                  24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ D. RISK BLOCK ============ */}
      <section className="bg-[#05060A] text-white py-14 md:py-20" data-od-id="ad-landing-risk">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Important risk information
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-white/70">
            <p>
              All CK PropFirm accounts, including funded accounts, are simulated. No real funds
              are traded and no client money is invested in the markets.
            </p>
            <p>
              Trading involves substantial risk. Performance in a simulated environment is not
              indicative of future results, and most people who take an evaluation do not pass
              it.
            </p>
            <p>
              Rewards are paid only on eligible simulated performance, in line with our Terms
              and Conditions. Nothing on this page is investment advice.
            </p>
          </div>
          <a
            href="/en/risk-disclosure"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white underline transition-colors hover:text-[#A98BFF]"
          >
            Read the full risk disclosure <ArrowIcon className="h-4 w-4" />
          </a>

          <div className="mt-12 border-t border-white/10 pt-10 text-center">
            <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              See the rules before you start
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70">
              Compare the evaluation models and their objectives, then pick the one that fits
              how you trade.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <a
                href="#start-challenge"
                className="brand-gradient-btn inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-[#1A1030] transition-all"
              >
                Start Challenge <ArrowIcon className="h-4 w-4" />
              </a>
              <a
                href="/en/trading-objectives"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-6 py-3 text-sm font-extrabold text-white transition-all hover:border-[#894CEF]"
              >
                Trading objectives
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
