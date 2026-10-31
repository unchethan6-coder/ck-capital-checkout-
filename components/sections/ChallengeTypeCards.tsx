"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronRight } from "lucide-react";
import { FUNDING_CHALLENGE_TYPES, FUNDING_PLAN_RAW_DATA, type PlanDetails } from "@/lib/content";

/**
 * "Explore Your Options": one card per funding model, each with its ship, in
 * the style of FundedNext's plan row — a small "CFDs Plan" label, then cards
 * with a one-line summary and three key points. No prices: the table below
 * has those. On phones the row scrolls sideways, a card at a time.
 *
 * Every figure comes from the plans the pricing table uses, so the cards
 * cannot disagree with it. Choosing a card selects that model in the table.
 */

/** Which ship flies which model. */
const SHIPS: Record<string, { src: string; w: number; h: number; alt: string }> = {
  // Twin engines for two phases.
  standard: { src: "/images/challenges/two-step-standard.webp", w: 1536, h: 1024, alt: "Twin-engine ckpropfirm fighter" },
  // One engine, one phase: the straight-line rocket.
  "1step": { src: "/images/challenges/one-step-standard.webp", w: 1254, h: 1254, alt: "Single-engine ckpropfirm rocket" },
  // The heaviest ship, for the model without a consistency rule.
  pro: { src: "/images/challenges/two-step-pro.webp", w: 1536, h: 1024, alt: "Heavy twin-hull ckpropfirm gunship" },
  // A jump drive at its core: straight to funded.
  instant: { src: "/images/challenges/instant-funding.webp", w: 1254, h: 1254, alt: "Jump-drive ckpropfirm pod" },
};

/** Fired at the pricing table, which selects the model (see ChallengeComparison). */
export const SELECT_CHALLENGE_EVENT = "ck:select-challenge";

const num = (v?: string) => Number((v ?? "").replace(/[$,]/g, ""));
const pctOf = (amount: string, size: string) => `${+((num(amount) / (parseInt(size, 10) * 1000)) * 100).toFixed(1)}%`;
const isPct = (v: string) => /^\d+(\.\d+)?%$/.test(v.trim());

export function ChallengeTypeCards({
  plans = FUNDING_PLAN_RAW_DATA,
}: {
  plans?: Record<string, Record<string, PlanDetails | null>>;
}) {
  const t = useTranslations("challengeTypes");

  const cards = FUNDING_CHALLENGE_TYPES.flatMap((type) => {
    // Rules are proportional to account size, so the smallest account speaks for all.
    const size = Object.keys(plans).find((s) => plans[s]?.[type.id]);
    const plan = size ? plans[size]?.[type.id] : null;
    if (!size || !plan) return [];

    const p1 = num(plan.p1) > 0 ? pctOf(plan.p1, size) : null;
    const p2 = num(plan.p2) > 0 ? pctOf(plan.p2, size) : null;
    const summary = p1 && p2 ? t("summaryTwo", { p1, p2 }) : p1 ? t("summaryOne", { p1 }) : t("summaryInstant");

    const points: string[] = [];
    if (!p1) points.push(t("pointSkip"));
    else if (!p2) points.push(t("pointFastest"));
    points.push(t("pointSplit", { split: plan.split1 }));
    points.push(isPct(plan.fundedConsistency) ? t("pointConsistency", { pct: plan.fundedConsistency }) : t("pointNoConsistency"));
    if (points.length < 3 && /unlimited/i.test(plan.period)) points.push(t("pointNoTimeLimit"));

    return [{ type, summary, points: points.slice(0, 3) }];
  });

  const choose = (typeId: string) => {
    window.dispatchEvent(new CustomEvent(SELECT_CHALLENGE_EVENT, { detail: typeId }));
  };

  return (
    <section className="relative overflow-hidden bg-[#030A1C] py-16 sm:py-20" data-od-id="challenge-types">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">{t("subtitle")}</p>
        </div>

        <div className="mt-10 xl:flex xl:items-start xl:gap-5">
          {/* Market label, as FundedNext marks its CFD row */}
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold text-white/60 xl:mt-5 xl:mb-0 xl:w-28 xl:shrink-0">
            {t("market")}
            <span aria-hidden className="h-px w-8 bg-white/25 xl:flex-1" />
          </p>

          {/* Sideways scroller on phones and tablets, a grid from desktop up */}
          <ul
            className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
            aria-label={t("title")}
          >
            {cards.map(({ type, summary, points }) => {
              const ship = SHIPS[type.id];
              return (
                <li key={type.id} className="w-[82%] max-w-[320px] shrink-0 snap-start sm:w-[46%] lg:w-auto lg:max-w-none">
                  <article
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#16171D] to-[#0D0E12] p-5 transition-colors duration-300 hover:border-[#894CEF]/50"
                    data-od-id={`challenge-type-${type.id}`}
                  >
                    {/* Ship, as the card's icon */}
                    <div className="relative flex h-24 w-32 items-center justify-start">
                      <div aria-hidden className="absolute inset-y-4 left-2 w-24 rounded-full bg-[#8B3DFF]/25 blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                      <Image
                        src={ship.src}
                        alt={ship.alt}
                        width={ship.w}
                        height={ship.h}
                        sizes="128px"
                        loading="eager"
                        className="relative h-full w-auto max-w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </div>

                    <h3 className="mt-3 font-[family-name:var(--font-jakarta)] text-xl font-extrabold tracking-tight text-white">{type.name}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">{summary}</p>

                    <ul className="mt-4 space-y-2">
                      {points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-[13px] leading-snug text-white/75">
                          <ChevronRight size={15} aria-hidden className="mt-px shrink-0 text-emerald-400 rtl:rotate-180" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6">
                      <a
                        href="#start-challenge"
                        onClick={() => choose(type.id)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3.5 text-[13px] font-semibold text-white transition-colors hover:border-[#894CEF] hover:bg-[#703AD7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                      >
                        {t("choose", { name: type.name })} <ArrowRight size={14} aria-hidden className="rtl:rotate-180" />
                      </a>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
