"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Award, ShieldCheck, Target } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { GoldButton } from "@/components/shared/GoldButton";
import { Aurora } from "@/components/fx/Aurora";
import { EvaluationPathVisual } from "@/components/shared/EvaluationPathVisual";

export interface EvaluationStep {
  step: string;
  icon: "target" | "shield" | "award";
  title: string;
  description: string;
}

const ICONS = { target: Target, shield: ShieldCheck, award: Award } as const;

export default function EvaluationIntro({
  features,
  steps,
}: {
  features?: string[];
  steps?: EvaluationStep[];
}) {
  const t = useTranslations("evaluation");
  const tHero = useTranslations("hero");
  const tHow = useTranslations("howItWorks");

  const defaultFeatures = [
    tHero("features.0"),
    tHero("features.1"),
    tHero("features.3"),
    tHero("features.2"),
  ];

  const defaultSteps: EvaluationStep[] = [
    {
      step: "01",
      icon: "target",
      title: tHow("steps.step1.title"),
      description: tHow("steps.step1.description"),
    },
    {
      step: "02",
      icon: "shield",
      title: tHow("steps.step2.title"),
      description: tHow("steps.step2.description"),
    },
    {
      step: "03",
      icon: "award",
      title: tHow("steps.step3.title"),
      description: tHow("steps.step3.description"),
    },
  ];

  const featList = features ?? defaultFeatures;
  const stepList = steps ?? defaultSteps;

  return (
    <>
      {/* ─────────────── Hero (DARK) ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] flex min-h-[calc(100dvh-44px)] flex-col overflow-hidden border-b border-gray-200 bg-white" data-od-id="evaluation-hero">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
          <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
          <div className="absolute top-[20%] -right-[10%] w-[55%] h-[65%] rounded-full opacity-55 fx-hero-glow-3" />
          <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[50%] rounded-full opacity-40 fx-hero-glow-4" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <Aurora variant="hero" grid className="absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pb-10 pt-20 sm:px-6 md:pb-10 md:pt-24 lg:px-8">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-7 xl:col-span-6 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">
                  <Sparkles size={12} className="text-[#A98BFF]" />
                  {t("badge")}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 max-w-3xl font-[family-name:var(--font-jakarta)] text-[clamp(38px,7vw,44px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0A0A0C] sm:text-[52px] md:text-[60px] lg:text-[54px] xl:text-[68px]"
                data-od-id="evaluation-hero-title"
              >
                {t("title")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#4B5563] sm:text-[15px]"
              >
                {t("subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <a
                  href="https://app.ckcapital.co.uk/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GoldButton size="lg" data-od-id="evaluation-hero-cta-primary">
                    {t("claimOffer")} <ArrowRight size={16} />
                  </GoldButton>
                </a>
                <a
                  href="#start-challenge"
                  data-od-id="evaluation-hero-cta-secondary"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#4B5563] hover:text-[#A98BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                >
                  {t("compareBtn")} <ArrowRight size={15} />
                </a>
              </motion.div>

              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
              >
                {featList.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-[12px] font-medium text-[#4B5563]"
                  >
                    <Check size={13} className="shrink-0 text-emerald-600" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </motion.ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 xl:col-span-6 min-w-0"
              data-od-id="evaluation-hero-dashboard"
            >
              <EvaluationPathVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── Your Path to Success ─────────────── */}
      <section className="bg-white border-b border-[#E5E7EB] py-16 md:py-24 text-[#0A0A0C]" data-od-id="evaluation-steps">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
              {t("pathEyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-5xl">
              {t("pathTitle")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#4B5563]">
              {t("pathSubtitle")}
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stepList.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <div
                  key={item.step}
                  className="group relative rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-gray-300"
                  data-od-id={`evaluation-step-${i + 1}`}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-[#0A0A0C]">
                      <Icon size={20} />
                    </div>
                    <span className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-gray-300">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-[#0A0A0C]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
