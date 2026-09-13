"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Check, LayoutGrid, Percent, Table2 } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import {
  CURRENCIES,
  FUNDING_CHALLENGE_TYPES,
  FUNDING_PLAN_RAW_DATA,
  type CurrencyOption,
  type FundingChallengeTypeItem,
  type PlanDetails,
} from "@/lib/content";
import type { ChallengeConfig } from "@/lib/cms";
import { cn } from "@/lib/utils";

const accountSizes = ["5K", "10K", "25K", "50K", "100K", "200K", "300K"];

/** Stagger variant for the horizontal card rows. The parent row drives the
 *  timing: per-item whileInView would leave every card that starts outside
 *  the viewport horizontally stuck at opacity 0 on phones. */
const CAROUSEL_ITEM = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
} as const;

/** Payment marks shown under the selected plan (assets: public/payments). */
const PAYMENT_METHODS = [
  { name: "Visa", src: "/payments/visa.svg" },
  { name: "Mastercard", src: "/payments/mastercard.svg" },
  { name: "Apple Pay", src: "/payments/apple-pay.svg" },
  { name: "Google Pay", src: "/payments/google-pay.svg" },
  { name: "PayPal", src: "/payments/paypal.svg" },
  { name: "Crypto", src: "/payments/crypto.svg" },
] as const;

export function ChallengeComparison({
  config,
}: {
  config?: ChallengeConfig | null;
}) {
  const t = useTranslations("challenge");

  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("standard");
  const [selectedSize, setSelectedSize] = useState<string>("100K");
  const [isPercentage, setIsPercentage] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const currencyDropdownRef = useRef<HTMLDivElement>(null);



  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCurrencyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync URL search params on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const rawType = searchParams.get("type") || searchParams.get("plan");
    if (rawType) {
      const normalizedType = rawType === "one-step" ? "1step" : rawType;
      if (["standard", "1step", "instant", "middleweight"].includes(normalizedType)) {
        setSelectedType(normalizedType);
      }
    }

    const rawSize = searchParams.get("size");
    if (rawSize) {
      const cleanSize = rawSize.replace("$", "").toUpperCase();
      if (accountSizes.includes(cleanSize)) {
        setSelectedSize(cleanSize);
      }
    }

    const rawCurrency = searchParams.get("currency");
    if (rawCurrency) {
      const upperCur = rawCurrency.toUpperCase();
      if (CURRENCIES.some((c) => c.code === upperCur)) {
        setSelectedCurrency(upperCur);
      }
    }
  }, []);

  // Data matrix from CMS or static fallback
  const rawData: Record<string, Record<string, PlanDetails | null>> = useMemo(() => {
    return config?.fundingPlans ?? FUNDING_PLAN_RAW_DATA;
  }, [config]);

  const currencies: CurrencyOption[] = useMemo(() => {
    return config?.currencies ?? CURRENCIES;
  }, [config]);

  const challengeTypes: FundingChallengeTypeItem[] = FUNDING_CHALLENGE_TYPES;

  const activePlan = useMemo(() => {
    return rawData[selectedSize]?.[selectedType] || null;
  }, [rawData, selectedSize, selectedType]);

  const activeTypeName = useMemo(() => {
    return challengeTypes.find((tItem) => tItem.id === selectedType)?.name || "";
  }, [challengeTypes, selectedType]);

  const currency = useMemo(() => {
    return currencies.find((item) => item.code === selectedCurrency) ?? currencies[0];
  }, [currencies, selectedCurrency]);

  const formatMoney = (valStr?: string) => {
    if (!valStr || !valStr.startsWith("$")) return valStr || "-";
    const amount = parseFloat(valStr.replace(/[$,]/g, "")) * currency.rate;
    return `${currency.symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const discountPercent = (plan?: PlanDetails | null) => {
    if (!plan) return 0;
    const original = Number(plan.orig.replace(/[$,]/g, ""));
    const current = Number(plan.disc.replace(/[$,]/g, ""));
    if (!original || current >= original) return 0;
    return Math.round((1 - current / original) * 100);
  };

  const formatValue = (valStr?: string, accountSize = selectedSize) => {
    if (!valStr) return "-";
    if (!isPercentage || !valStr.startsWith("$")) return valStr;
    const numericVal = parseFloat(valStr.replace(/[$,]/g, ""));
    if (numericVal === 0) return "0%";
    const total = parseInt(accountSize.replace("K", ""), 10) * 1000;
    const pct = ((numericVal / total) * 100).toFixed(1).replace(/\.0$/, "");
    return `${pct}%`;
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    if (!rawData[selectedSize]?.[typeId]) {
      setSelectedSize("100K");
    }
  };

  const signupUrl = useMemo(() => {
    const params = new URLSearchParams({
      plan: selectedType,
      size: selectedSize,
      currency: selectedCurrency,
    });
    return `https://app.ckcapital.co.uk/signup?${params.toString()}`;
  }, [selectedType, selectedSize, selectedCurrency]);

  const signupUrlForSize = (size: string) => {
    const params = new URLSearchParams({
      plan: selectedType,
      size,
      currency: selectedCurrency,
    });
    return `https://app.ckcapital.co.uk/signup?${params.toString()}`;
  };

  const comparisonRows: Array<{
    label: string;
    value: (plan: PlanDetails, size: string) => string;
  }> = [
    { label: t("phase1Target") || "Phase 1 Target", value: (plan, size) => formatValue(plan.p1, size) },
    { label: t("phase2Target") || "Phase 2 Target", value: (plan, size) => formatValue(plan.p2, size) },
    { label: t("maxDailyLoss") || "Max Daily Loss", value: (plan, size) => formatValue(plan.dailyLoss, size) },
    { label: t("maxLoss") || "Max Loss", value: (plan, size) => formatValue(plan.maxLoss, size) },
    { label: t("minTradingDays") || "Min. Trading Days", value: (plan) => `${plan.minDays} ${t("day") || "Day"}` },
    { label: t("consistencyRule") || "Consistency", value: (plan) => plan.consistency || "-" },
    { label: t("tradingPeriod") || "Trading Period", value: (plan) => plan.period || "-" },
    { label: t("profitSplit1") || "Profit Split (1–13 Days)", value: (plan) => plan.split1 || "-" },
    { label: t("profitSplit2") || "Profit Split (14–30 Days)", value: (plan) => plan.split2 || "-" },
    { label: t("profitSplit3") || "Profit Split (31+ Days)", value: (plan) => plan.split3 || "-" },
    { label: t("fundedConsistency") || "Funded Consistency", value: (plan) => plan.fundedConsistency || "-" },
  ];

  return (
    <section
      id="start-challenge"
      className={cn(
        "relative scroll-mt-28 py-16 transition-colors duration-300 md:py-24",
        viewMode === "cards" ? "bg-[#05060A] text-white" : "bg-white text-[#0A0A0C]"
      )}
      data-od-id="challenge-comparison"
    >
      <Container>
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
          {/* Header */}
          <SectionReveal className="text-center">
            <h2
              data-od-id="challenge-title"
              className={cn(
                "font-[family-name:var(--font-jakarta)] text-3xl font-bold not-italic tracking-tight sm:text-4xl md:text-[46px] md:leading-[1.15] lg:text-[48px]",
                viewMode === "cards" ? "text-white" : "text-[#0A0A0C]"
              )}
            >
              {t("title") || "Choose your next challenge"}
            </h2>
            <p className={cn("mx-auto mt-2 max-w-xl text-sm font-normal md:text-base", viewMode === "cards" ? "text-white/70" : "text-gray-500")}>
              {t("subtitle") || "Select your preferred account size and evaluation model to begin."}
            </p>
          </SectionReveal>

          {/* Currency Toolbar */}
          <SectionReveal delay={0.06}>
            <div className="flex flex-wrap justify-end items-center gap-2.5">
              <div
                className="inline-flex items-center rounded-full border border-[#D9D9D9] bg-white p-1 shadow-sm"
                role="group"
                aria-label="Challenge display view"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  aria-pressed={viewMode === "cards"}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-1.5 sm:min-h-0 text-xs font-bold transition-colors",
                    viewMode === "cards" ? "bg-[#703AD7] text-white" : "text-gray-600 hover:bg-violet-50"
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Cards
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  aria-pressed={viewMode === "table"}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-1.5 sm:min-h-0 text-xs font-bold transition-colors",
                    viewMode === "table" ? "bg-[#703AD7] text-white" : "text-gray-600 hover:bg-violet-50"
                  )}
                >
                  <Table2 className="h-3.5 w-3.5" /> Table
                </button>
              </div>

              {/* Currency Dropdown */}
              <div className="relative z-30" ref={currencyDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCurrencyOpen((open) => !open)}
                  aria-expanded={isCurrencyOpen}
                  aria-haspopup="listbox"
                  className="flex items-center gap-2 rounded-full border border-[#D9D9D9] bg-white px-4 py-2 text-sm font-bold text-[#0A0A0C] shadow-sm transition-all hover:border-[#703AD7]"
                >
                  <span aria-hidden="true" className="text-base leading-none">{currency.flag}</span>
                  <span>{currency.code}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-gray-500 transition-transform duration-200",
                      isCurrencyOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {isCurrencyOpen && (
                  <div
                    role="listbox"
                    aria-label="Choose currency"
                    className="absolute right-0 top-full mt-2 min-w-40 overflow-hidden rounded-xl border border-[#D9D9D9] bg-white p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.16)] animate-in fade-in zoom-in-95 duration-150"
                  >
                    {currencies.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        role="option"
                        aria-selected={selectedCurrency === item.code}
                        onClick={() => {
                          setSelectedCurrency(item.code);
                          setIsCurrencyOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-bold text-[#0A0A0C] transition-colors hover:bg-[#F5F5F5]",
                          selectedCurrency === item.code ? "bg-[#EBF5FF] text-[#A98BFF]" : ""
                        )}
                      >
                        <span aria-hidden="true">{item.flag}</span>
                        <span>{item.code}</span>
                        <span className="text-xs text-gray-400 font-normal">({item.symbol})</span>
                        {selectedCurrency === item.code && (
                          <Check className="ml-auto h-4 w-4 text-[#A98BFF]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionReveal>

          {/* Challenge Types Row */}
          <SectionReveal delay={0.1}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
              {challengeTypes.map((tItem) => {
                const isSelected = selectedType === tItem.id;
                return (
                  <motion.div
                    key={tItem.id}
                    variants={CAROUSEL_ITEM}
                    onClick={() => handleTypeSelect(tItem.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleTypeSelect(tItem.id);
                      }
                    }}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left sm:p-4 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5 sm:min-w-0",
                      isSelected && "scale-[1.015]",
                      viewMode === "cards"
                        ? isSelected
                          ? "border-[#894CEF] bg-[#21184F] shadow-[0_0_18px_rgba(137,76,239,0.22)] ring-1 ring-[#894CEF]"
                          : "border-white/10 bg-[#171820] hover:border-[#703AD7]/60 hover:bg-[#1D1E29]"
                        : isSelected
                          ? "border-[#703AD7] bg-[#EBF5FF]/60 shadow-[0_0_16px_rgba(112,58,215,0.2)] ring-1 ring-[#703AD7]"
                          : "border-[#D9D9D9] bg-white hover:bg-[#F9FAFB] hover:border-gray-300"
                    )}
                  >
                    <h3 className={cn("mb-1 text-sm font-bold", viewMode === "cards" ? "text-white" : "text-[#0A0A0C]")}>
                      {tItem.name}
                    </h3>
                    <p className={cn("text-xs leading-relaxed", viewMode === "cards" ? (isSelected ? "text-white/85" : "text-white/70") : "text-gray-600")}>
                      {tItem.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </SectionReveal>

          {/* Account Sizes Row */}
          <SectionReveal delay={0.14} className={viewMode === "cards" ? "" : "hidden"}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-2 gap-2.5 pb-16 sm:grid-cols-4 sm:gap-3 sm:pb-0 lg:grid-cols-7">
              {accountSizes.map((size) => {
                const data = rawData[size]?.[selectedType];
                const isSelected = size === selectedSize;
                const isDisabled = !data;

                return (
                  <motion.div
                    key={size}
                    variants={CAROUSEL_ITEM}
                    onClick={() => !isDisabled && setSelectedSize(size)}
                    role="button"
                    aria-disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                    onKeyDown={(e) => {
                      if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
                        setSelectedSize(size);
                      }
                    }}
                    data-od-id={`challenge-card-${size}`}
                    className={cn(
                      "relative rounded-2xl border bg-[#171820] p-3.5 pt-7 text-left transition-all duration-200 sm:min-h-28 sm:rounded-xl sm:pt-3.5",
                      isDisabled
                        ? "opacity-30 cursor-not-allowed pointer-events-none border-white/10"
                        : "cursor-pointer hover:bg-[#1D1E29]",
                      isSelected
                        ? "border-[#894CEF] bg-[#21184F] ring-2 ring-[#894CEF] shadow-[0_0_20px_rgba(137,76,239,0.2)]"
                        : "border-white/10"
                    )}
                  >
                    {size === "100K" && (
                      <span className="absolute right-2 top-2 z-10 rounded-full bg-[#894CEF] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-sm sm:-top-2 sm:text-[9px]">
                        {t("popular") || "Popular"}
                      </span>
                    )}
                    <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                      {t("account") || "Account"}
                    </div>
                    <div className="mb-1.5 text-xl font-extrabold text-white sm:text-lg sm:font-bold">
                      ${size}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">Today</span>
                      <span className="text-sm font-extrabold text-emerald-400 sm:text-xs">
                        {data ? formatMoney(data.disc) : "N/A"}
                      </span>
                      {data && (
                        <span className="text-[10px] font-normal text-white/60">
                          was <span className="line-through">{formatMoney(data.orig)}</span>
                          {discountPercent(data) > 0 && <span className="ml-1.5 font-bold text-amber-300">Save {discountPercent(data)}%</span>}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </SectionReveal>

          {viewMode === "cards" && activePlan && (
            <div className="sticky bottom-3 z-40 -mt-14 mb-2 flex items-center justify-between gap-3 rounded-2xl sm:mx-1 sm:mt-0 sm:mb-0 border border-white/15 bg-[#080B18]/95 p-3 shadow-[0_14px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:hidden">
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold uppercase tracking-wider text-white/80">Selected plan</p>
                <p className="truncate text-sm font-extrabold text-white">{activeTypeName} ${selectedSize}</p>
                <p className="text-sm font-black text-emerald-400">{formatMoney(activePlan.disc)}</p>
              </div>
              <a href={signupUrl} target="_blank" rel="noopener noreferrer" className="brand-gradient-btn inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl px-4 text-xs font-bold text-[#1A1030]">
                Start challenge <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </div>
          )}

          {/* Details & Checkout Grid */}
          <SectionReveal delay={0.18} className={viewMode === "cards" ? "" : "hidden"}>
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#894CEF]/35 bg-gradient-to-br from-[#17113D] via-[#0B1024] to-[#080B18] p-3 shadow-[0_20px_60px_rgba(3,10,28,0.28)] lg:grid-cols-12">
              {/* Rules Panel */}
              <div
                className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-white shadow-inner md:p-5 lg:col-span-8 [&_li]:!border-white/10 [&_li_span:first-child]:!text-white/70 [&_li_span:last-child]:!text-white"
                data-od-id="challenge-table"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                    <Percent className="w-4 h-4 text-[#A98BFF]" />
                    <span>{t("showPercentage") || "Show Percentage"}</span>
                    <label className="relative inline-block w-9 h-5 cursor-pointer ml-1">
                      <input
                        type="checkbox"
                        checked={isPercentage}
                        onChange={(e) => setIsPercentage(e.target.checked)}
                        className="sr-only peer"
                      />
                      <span className="absolute inset-0 bg-[#E5E5E5] peer-checked:bg-[#703AD7] rounded-full transition-all duration-300"></span>
                      <span className="absolute bottom-[3px] left-[3px] bg-white w-3.5 h-3.5 rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow-sm"></span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Column 1: Evaluation Rules */}
                  <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                    <h3 className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-white/65">
                      {t("evaluationRules") || "Evaluation Rules"}
                    </h3>
                    <ul className="flex flex-col gap-3 text-xs">
                      <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 font-normal">{t("phase1Target") || "Phase 1 Target"}</span>
                        <span className="font-bold text-[#0A0A0C]">{formatValue(activePlan?.p1)}</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 font-normal">{t("phase2Target") || "Phase 2 Target"}</span>
                        <span className="font-bold text-[#0A0A0C]">{formatValue(activePlan?.p2)}</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 font-normal">{t("maxDailyLoss") || "Max Daily Loss"}</span>
                        <span className="font-bold text-[#0A0A0C]">{formatValue(activePlan?.dailyLoss)}</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 font-normal">{t("maxLoss") || "Max Loss"}</span>
                        <span className="font-bold text-[#0A0A0C]">{formatValue(activePlan?.maxLoss)}</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 font-normal">{t("minTradingDays") || "Min. Trading Days"}</span>
                        <span className="font-bold text-[#0A0A0C]">
                          {activePlan?.minDays ? `${activePlan.minDays} ${t("day") || "Day"}` : "-"}
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600 font-normal">{t("consistencyRule") || "Consistency"}</span>
                        <span className="font-bold text-[#0A0A0C]">{activePlan?.consistency || "-"}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Column 2: Funded Account Rules */}
                  <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                    <h3 className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-white/65">
                      {t("fundedAccountRules") || "Funded Account Rules"}
                    </h3>
                    <ul className="flex flex-col gap-3 text-xs">
                      <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 font-normal">{t("tradingPeriod") || "Trading Period"}</span>
                        <span className="font-bold text-[#0A0A0C]">{activePlan?.period || "-"}</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 font-normal">{t("profitSplit1") || "Profit Split (1–13 Days)"}</span>
                        <span className="font-bold text-[#0A0A0C]">{activePlan?.split1 || "-"}</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 font-normal">{t("profitSplit2") || "Profit Split (14–30 Days)"}</span>
                        <span className="font-bold text-[#0A0A0C]">{activePlan?.split2 || "-"}</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 font-normal">{t("profitSplit3") || "Profit Split (31+ Days)"}</span>
                        <span className="font-bold text-[#0A0A0C]">{activePlan?.split3 || "-"}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600 font-normal">{t("fundedConsistency") || "Funded Consistency"}</span>
                        <span className="font-bold text-[#0A0A0C]">{activePlan?.fundedConsistency || "-"}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Checkout Panel */}
              <div className="flex flex-col justify-between gap-5 rounded-xl border border-white/10 bg-black/10 p-5 text-white shadow-inner lg:col-span-4">
                <div>
                  <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-white/65">
                        Selected Plan
                      </span>
                      <div className="mt-0.5 text-lg font-extrabold text-white">
                        {activeTypeName} ${selectedSize}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-emerald-400 sm:text-3xl">
                        {formatMoney(activePlan?.disc || "$0.00")}
                      </div>
                      <div className="text-xs text-white/55 line-through font-normal">
                        {formatMoney(activePlan?.orig)}
                      </div>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 py-1 text-xs text-white/70">
                      <span>Access Level</span>
                      <span className="font-bold text-white">Direct Evaluation Access</span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-xs text-white/70">
                      <span>Scaling Ceiling</span>
                      <span className="font-bold text-white">Up to $1,200,000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* CTA Button */}
                  <a
                    href={signupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button type="button" className="brand-pill-btn w-full gap-2 font-bold text-[#1A1030] shadow-lg hover:shadow-cyan-500/25">
                      <span>{t("startChallenge") || "Start Challenge"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </a>

                  {/* Add-ons */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/65">
                      {t("addOnsAvailable") || "Add-Ons Available"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Lifetime Reward 90%", "Reward 95%", "Double Lev", "+4 more"].map(
                        (addon) => (
                          <span
                            key={addon}
                            className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/70"
                          >
                            {addon}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[11px] text-white/65">
                    {PAYMENT_METHODS.map((pm) => (
                      <span
                        key={pm.name}
                        title={pm.name}
                        className="grid h-6 w-9 shrink-0 place-items-center overflow-hidden rounded border border-white/10 bg-white/[0.06]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pm.src} alt={pm.name} width={30} height={20} loading="lazy" decoding="async" className="h-5 w-auto object-contain" />
                      </span>
                    ))}
                    <span className="text-xs font-medium">+10 more</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>

          {viewMode === "table" && (
            <SectionReveal delay={0.14}>
              <div className="overflow-hidden rounded-2xl border border-[#D9D9D9] bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D9D9] px-4 py-3.5 sm:px-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">{activeTypeName} comparison</p>
                    <p className="mt-0.5 text-sm font-bold text-[#0A0A0C]">Compare every available account size</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#0A0A0C]">
                    <Percent className="h-4 w-4 text-[#A98BFF]" />
                    <span>{t("showPercentage") || "Show Percentage"}</span>
                    <input type="checkbox" checked={isPercentage} onChange={(event) => setIsPercentage(event.target.checked)} className="peer sr-only" />
                    <span className="relative h-5 w-9 rounded-full bg-[#E5E5E5] transition-colors peer-checked:bg-[#703AD7] after:absolute after:bottom-[3px] after:left-[3px] after:h-3.5 after:w-3.5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4" />
                  </label>
                </div>

                <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin] [scrollbar-color:#894CEF_#F2F0F8]">
                  <div className="grid min-w-[1120px] grid-cols-[190px_repeat(7,minmax(124px,1fr))] gap-x-2 bg-[#F8F8FA] p-3">
                    <div className="rounded-t-xl border-x border-t border-[#D9D9D9] bg-[#F2F0F8] p-4 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Account</span>
                      <p className="mt-1 text-sm font-extrabold text-[#0A0A0C]">Key features</p>
                    </div>
                    {accountSizes.map((size) => {
                      const plan = rawData[size]?.[selectedType];
                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={!plan}
                          onClick={() => plan && setSelectedSize(size)}
                          className={cn(
                            "relative rounded-t-xl border-x border-t border-[#D9D9D9] bg-white p-3.5 text-left shadow-sm transition-colors hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-35",
                            selectedSize === size && "bg-violet-50 ring-2 ring-inset ring-[#894CEF]"
                          )}
                        >
                          {size === "100K" && <span className="absolute right-2 top-2 rounded-full bg-[#894CEF] px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">Popular</span>}
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Account</span>
                          <strong className="mt-0.5 block text-lg text-[#0A0A0C]">${size}</strong>
                          <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-wider text-gray-400">Today</span>
                          <span className="block text-xs font-extrabold text-[#A98BFF]">{plan ? formatMoney(plan.disc) : "N/A"}</span>
                          {plan && (
                            <span className="block text-[9px] text-gray-400">
                              was <span className="line-through">{formatMoney(plan.orig)}</span>
                              {discountPercent(plan) > 0 && <span className="ml-1 font-bold text-[#9A6B14]">Save {discountPercent(plan)}%</span>}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {comparisonRows.map((row, rowIndex) => (
                      <React.Fragment key={row.label}>
                        <div className={cn("border-x border-b border-[#D9D9D9] px-4 py-3 text-[11px] font-semibold text-gray-600", rowIndex % 2 ? "bg-white" : "bg-[#F8F8FA]")}>{row.label}</div>
                        {accountSizes.map((size) => {
                          const plan = rawData[size]?.[selectedType];
                          return (
                            <div
                              key={`${row.label}-${size}`}
                              className={cn(
                                "border-x border-b border-[#D9D9D9] px-3 py-3 text-[11px] font-bold text-[#0A0A0C]",
                                rowIndex % 2 ? "bg-white" : "bg-[#F8F8FA]",
                                selectedSize === size && "bg-violet-50/80"
                              )}
                            >
                              {plan ? row.value(plan, size) : "—"}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}

                    <div className="rounded-b-xl border-x border-b border-[#D9D9D9] bg-[#F2F0F8] px-4 py-4 text-[11px] font-bold text-gray-600 shadow-sm">Choose account</div>
                    {accountSizes.map((size) => {
                      const plan = rawData[size]?.[selectedType];
                      return (
                        <div key={`cta-${size}`} className={cn("rounded-b-xl border-x border-b border-[#D9D9D9] bg-white p-2.5 shadow-sm", selectedSize === size && "bg-violet-50")}>
                          {plan ? (
                            <a href={signupUrlForSize(size)} target="_blank" rel="noopener noreferrer" className="brand-gradient-btn flex min-h-9 items-center justify-center rounded-lg px-2 text-[10px] font-bold text-[#1A1030] shadow-sm transition-transform hover:-translate-y-0.5">
                              {t("startChallenge") || "Get plan"}
                            </a>
                          ) : (
                            <span className="flex min-h-9 items-center justify-center text-[10px] text-gray-400">Unavailable</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-gray-400 sm:hidden">Swipe left and right to view the complete comparison table.</p>
            </SectionReveal>
          )}

          {/* Universal Conditions / Disclaimer */}
          <SectionReveal delay={0.22}>
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {((t.raw("conditions") as string[]) || [
                "Profit split up to 100%",
                "Leverage 1:100",
                "Payouts in ~12 hours",
              ]).map((c: string) => (
                <span
                  key={c}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-bold shadow-sm",
                    viewMode === "cards" ? "border-white/10 bg-white/[0.05] text-white/70" : "border-gray-200 bg-gray-50 text-gray-700"
                  )}
                >
                  <Check size={13} strokeWidth={3} className="shrink-0 text-[#A98BFF]" />
                  {c}
                </span>
              ))}
            </div>
            <p className={cn(
              "mx-auto mt-4 max-w-2xl text-center text-[13px] font-semibold leading-5",
              viewMode === "cards" ? "text-white/70" : "text-gray-600"
            )}>
              {t("oneTimePaymentNotice")}
            </p>
            <p className={cn("mx-auto mt-2 max-w-2xl text-center text-xs leading-5", viewMode === "cards" ? "text-white/55" : "text-gray-500")}>
              {t("disclaimer")}
            </p>
          </SectionReveal>
        </div>
      </Container>
    </section>
  );
}
