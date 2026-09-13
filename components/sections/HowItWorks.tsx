"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { fadeUp, stagger } from "@/components/fx/reveal";

import { ArrowRight, ShieldCheck, Zap, Infinity, Coins } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      phase: t("steps.step1.phase"),
      title: t("steps.step1.title"),
      description: t("steps.step1.description"),
    },
    {
      phase: t("steps.step2.phase"),
      title: t("steps.step2.title"),
      description: t("steps.step2.description"),
    },
    {
      phase: t("steps.step3.phase"),
      title: t("steps.step3.title"),
      description: t("steps.step3.description"),
    },
    {
      phase: t("steps.step4.phase"),
      title: t("steps.step4.title"),
      description: t("steps.step4.description"),
    },
  ];

  const featureItems = [
    { label: t("noConsistency"), icon: ShieldCheck },
    { label: t("newsAllowed"), icon: Zap },
    { label: t("noTimePressure"), icon: Infinity },
    { label: t("profitSplit"), icon: Coins },
  ];

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 sm:scroll-mt-28 overflow-hidden bg-white text-[#111827] py-16 md:py-24"
      data-od-id="how-it-works"
    >
      <Container>
        <SectionReveal className="text-center mb-12 md:mb-16">
          <p className="text-xs text-[#A98BFF] uppercase tracking-[0.2em] font-bold mb-3">
            {t("badge")}
          </p>
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-black text-[#0A0A0C] md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-[#4B5563] font-medium max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </SectionReveal>

          {/* Steps list with scoped connecting hairline */}
          <div className="relative mx-auto max-w-3xl space-y-10 md:space-y-12">
            {/* Connecting hairline: perfectly connects the 3 node dots */}
            <div
              aria-hidden="true"
              className="absolute left-[68px] top-[34px] bottom-[34px] w-[2px] -translate-x-1/2 bg-[#703AD7]/30 z-0"
            />
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative flex items-start gap-5 sm:gap-8"
                data-od-id={`how-step-${i + 1}`}
              >
                <div className="relative z-10 flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl border border-gray-200/90 bg-white shadow-sm">
                  <span className="font-[family-name:var(--font-jakarta)] text-2xl font-black text-[#0A0A0C] tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#894CEF] ring-4 ring-white" />
                </div>
                <div className="pt-1.5 flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">
                    {step.phase}
                  </span>
                  <h3 className="mt-1 font-[family-name:var(--font-jakarta)] text-xl font-black text-[#0A0A0C] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm font-medium text-[#4B5563] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Simple Centered Symbols & CTA */}
          <div
            className="mx-auto max-w-3xl mt-12 pt-8 border-t border-gray-100/90 text-center"
            data-od-id="how-it-works-features"
          >
            {/* Symbols row: balanced 2-column grid on mobile, single horizontal line on desktop */}
            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3.5 md:flex md:flex-row md:flex-nowrap items-center justify-center max-w-[330px] min-[390px]:max-w-[360px] sm:max-w-none mx-auto">
              {featureItems.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-start md:justify-center gap-1.5 sm:gap-2 text-[9.5px] min-[370px]:text-[10.5px] md:text-xs font-bold uppercase tracking-[0.03em] text-[#374151] whitespace-nowrap"
                >
                  <Icon size={14} className="text-[#A98BFF] shrink-0 stroke-[2.5]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Centered CTA: Prompt text + centered standard Brand Button */}
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <p className="font-[family-name:var(--font-jakarta)] text-base sm:text-lg font-black text-[#0A0A0C]">
                {t("readyFunded")}{" "}
                <span className="text-[#A98BFF]">{t("startJourney")}</span>
              </p>

              <div className="mt-4">
                <a
                  href="/#start-challenge"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl brand-gradient-btn px-6 py-3 text-sm font-bold text-[#1A1030] shadow-md hover:shadow-cyan-500/25 transition-all duration-200"
                  data-od-id="how-it-works-cta"
                >
                  <span>{t("startChallenge")}</span>
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
      </Container>
    </section>
  );
}
