"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

interface ChallengePlan {
  id: string;
  name: string;
  profitTarget: string;
  maxLoss: string;
  profitSplit: string;
  originalPrice: string;
  discountedPrice: string;
  discountBadge: string;
  popular?: boolean;
}

export function EvaluationPrograms() {
  const t = useTranslations("evaluationPrograms");

  const CHALLENGES: ChallengePlan[] = [
    {
      id: "10k",
      name: "$10K Challenge",
      profitTarget: "$1,000",
      maxLoss: "$1,000",
      profitSplit: t("profitSplitValue"),
      originalPrice: "$87",
      discountedPrice: "$21.75",
      discountBadge: "75% OFF",
    },
    {
      id: "50k",
      name: "$50K Challenge",
      profitTarget: "$5,000",
      maxLoss: "$2,500",
      profitSplit: t("profitSplitValue"),
      originalPrice: "$247",
      discountedPrice: "$61.75",
      discountBadge: "75% OFF",
      popular: true,
    },
    {
      id: "100k",
      name: "$100K Challenge",
      profitTarget: "$10,000",
      maxLoss: "$5,000",
      profitSplit: t("profitSplitValue"),
      originalPrice: "$347",
      discountedPrice: "$86.75",
      discountBadge: "75% OFF",
    },
    {
      id: "200k",
      name: "$200K Challenge",
      profitTarget: "$20,000",
      maxLoss: "$10,000",
      profitSplit: t("profitSplitValue"),
      originalPrice: "$547",
      discountedPrice: "$136.75",
      discountBadge: "75% OFF",
    },
  ];

  return (
    <section
      id="evaluation-programs"
      className="relative z-10 bg-[#F8F9FA] py-16 sm:py-20 md:py-24 text-[#111827] scroll-mt-24 sm:scroll-mt-28"
      data-od-id="evaluation-programs"
    >
      <div id="start-challenge" className="absolute -top-24 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Column: Heading, Info, and CTA */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-[#894CEF]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A98BFF]">
                {t("eyebrow")}
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl sm:text-4xl font-black tracking-tight text-[#0A0A0C] leading-tight">
              {t("title")}
            </h2>

            <p className="mt-3 text-sm font-medium text-[#4B5563] leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="mt-6 sm:mt-8">
              <Link
                href="/trading-objectives"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#030A1C] px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:bg-[#071328] hover:text-[#A98BFF] hover:border-[#703AD7]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
              >
                <span>{t("compareBtn")}</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Pricing Cards with Standardized Hover Lift & Glow */}
          <div className="lg:col-span-9">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CHALLENGES.map((challenge) => (
                <a
                  key={challenge.id}
                  href="https://app.ckcapital.co.uk/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-od-id={`challenge-card-${challenge.id}`}
                  className={`group relative flex flex-col rounded-2xl bg-white p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
                    challenge.popular
                      ? "border-2 border-[#703AD7] shadow-md shadow-[#703AD7]/15 hover:shadow-[0_16px_32px_-8px_rgba(54,124,219,0.28)] hover:border-[#703AD7]"
                      : "border border-gray-200/90 shadow-sm hover:border-[#703AD7]/60 hover:shadow-[0_14px_28px_-8px_rgba(0,0,0,0.08),0_0_18px_rgba(54,124,219,0.15)]"
                  }`}
                >
                  {/* Floating Most Popular Badge */}
                  {challenge.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#703AD7] to-[#894CEF] px-3.5 py-1 text-[9.5px] font-black uppercase tracking-wider text-white shadow-sm whitespace-nowrap">
                      {t("mostPopular")}
                    </div>
                  )}

                  {/* Card Header */}
                  <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-black tracking-tight text-[#0A0A0C] mb-5 group-hover:text-[#A98BFF] transition-colors">
                    {challenge.name}
                  </h3>

                  {/* Specs Table */}
                  <div className="space-y-3 text-xs flex-1 mb-6">
                    <div className="flex items-center justify-between text-[#4B5563]">
                      <span>{t("profitTarget")}</span>
                      <span className="font-extrabold text-[#0A0A0C]">
                        {challenge.profitTarget}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#4B5563]">
                      <span>{t("maxLoss")}</span>
                      <span className="font-extrabold text-[#0A0A0C]">
                        {challenge.maxLoss}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#4B5563]">
                      <span>{t("profitSplit")}</span>
                      <span className="font-extrabold text-[#0A0A0C]">
                        {challenge.profitSplit}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Footer */}
                  <div className="mt-auto border-t border-gray-100 pt-3.5 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-gray-400 line-through whitespace-nowrap">
                          {challenge.originalPrice}
                        </span>
                        <span className="font-[family-name:var(--font-jakarta)] text-xl sm:text-2xl font-black text-[#0A0A0C]">
                          {challenge.discountedPrice}
                        </span>
                      </div>
                      <span className="rounded bg-violet-50 border border-violet-200 px-2 py-0.5 text-[10px] font-black text-[#A98BFF] shadow-sm">
                        {challenge.discountBadge}
                      </span>
                    </div>

                    <div className="brand-gradient-btn mt-3 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#1A1030] transition-colors">
                      <span>Start Challenge</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
