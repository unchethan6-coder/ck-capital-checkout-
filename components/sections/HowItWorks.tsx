"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight, Layers, Rocket, Zap } from "lucide-react";

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

  const programs = [
    {
      icon: Layers,
      accent: "#894CEF",
      title: t("programs.oneStep.title"),
      description: t("programs.oneStep.description"),
      tag: t("programs.oneStep.tag"),
      href: "/evaluation?type=one-step#start-challenge",
      rail: [t("programs.oneStep.railStart"), t("railFunded")],
    },
    {
      icon: Rocket,
      accent: "#E7C66B",
      title: t("programs.twoStep.title"),
      description: t("programs.twoStep.description"),
      tag: t("programs.twoStep.tag"),
      href: "/evaluation?type=standard#start-challenge",
      rail: [t("programs.twoStep.railStart"), t("programs.twoStep.railMid"), t("railFunded")],
    },
    {
      icon: Zap,
      accent: "#703AD7",
      title: t("programs.instant.title"),
      description: t("programs.instant.description"),
      tag: t("programs.instant.tag"),
      href: "/instant",
      rail: [t("programs.instant.railStart")],
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 sm:scroll-mt-28 overflow-hidden bg-white text-[#111827] py-16 md:py-24"
      data-od-id="how-it-works"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* ───────────── Left: The Process Timeline ───────────── */}
          <SectionReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#894CEF]/25 bg-[#894CEF]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#703AD7] dark:text-[#A98BFF]">
              <span className="h-2 w-2 rounded-full bg-[#894CEF] shadow-[0_0_8px_#894CEF]" />
              {t("badge")}
            </div>

            <h2 className="mt-4 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-tight text-[#0A0A0C] sm:text-4xl lg:text-[42px] leading-[1.12]">
              {t("title")}
            </h2>

            <p className="mt-3.5 max-w-lg text-base font-medium leading-relaxed text-[#4B5563]">
              {t("subtitle")}
            </p>

            {/* Steps Timeline with connected vertical rail */}
            <div className="relative mt-9" data-od-id="how-it-works-steps">
              {/* Vertical connector line */}
              <div
                aria-hidden="true"
                className="absolute left-[19px] top-6 bottom-8 w-px bg-gradient-to-b from-[#894CEF]/35 via-gray-200 to-gray-200 hidden sm:block"
              />

              <div className="space-y-6 sm:space-y-7">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex items-start gap-4 sm:gap-5 group"
                    data-od-id={`how-step-${i + 1}`}
                  >
                    {/* Step number node */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#894CEF]/25 bg-white font-mono text-xs font-extrabold text-[#703AD7] shadow-sm transition-all duration-200 group-hover:border-[#894CEF] group-hover:bg-[#894CEF]/10 group-hover:scale-105">
                      0{i + 1}
                    </div>

                    <div className="min-w-0 pt-0.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#894CEF]">
                        {step.phase}
                      </span>
                      <h3 className="font-[family-name:var(--font-jakarta)] text-base sm:text-lg font-bold tracking-tight text-[#0A0A0C] group-hover:text-[#703AD7] transition-colors">
                        {step.title}
                      </h3>
                      <p className="mt-1 max-w-md text-sm font-medium leading-relaxed text-[#4B5563]">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/#start-challenge"
                onClick={(e) => {
                  const el = document.getElementById("start-challenge");
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.replaceState(null, "", `${window.location.pathname}#start-challenge`);
                  }
                }}
                className="group inline-flex items-center justify-center gap-2 rounded-xl brand-gradient-btn px-6 py-3.5 text-sm font-bold text-[#1A1030] shadow-[0_4px_20px_rgba(231,198,107,0.35)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(231,198,107,0.5)] hover:brightness-105"
                data-od-id="how-it-works-cta"
              >
                <span>{t("ctaFunded")}</span>
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/trading-objectives"
                className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#703AD7] hover:text-[#5B21B6] transition-colors py-2 px-1"
              >
                <span>{t("compareAll")}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </SectionReveal>

          {/* ───────────── Right: The Three Programmes (Bug-free hover cards) ───────────── */}
          <SectionReveal delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#4B5563]">
              <span className="h-2 w-2 rounded-full bg-[#E7C66B]" />
              {t("programsBadge")}
            </div>

            <h3 className="mt-3.5 font-[family-name:var(--font-jakarta)] text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#0A0A0C]">
              {t("readyFunded")}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#4B5563] mb-6">
              {t("startJourney")}
            </p>

            <div className="flex flex-col gap-4" data-od-id="how-it-works-programs">
              {programs.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={p.href as never}
                      className="group relative block overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#894CEF]/50 hover:shadow-[0_14px_36px_rgba(112,58,215,0.12)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#894CEF]"
                      data-od-id={`how-program-${i + 1}`}
                    >
                      {/* Subtle corner aura — GPU isolated, no layer thrashing */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-45 transform-gpu"
                        style={{ background: p.accent }}
                      />

                      <div className="relative z-10">
                        {/* Icon */}
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                          style={{ background: `${p.accent}16`, color: p.accent }}
                        >
                          <Icon size={20} strokeWidth={2.2} />
                        </div>

                        {/* Title and Phase Rail */}
                        <div className="mt-4 flex items-start justify-between gap-4">
                          <h4 className="font-[family-name:var(--font-jakarta)] text-lg sm:text-xl font-bold tracking-tight text-[#0A0A0C] group-hover:text-[#703AD7] transition-colors duration-200">
                            {p.title}
                          </h4>

                          {/* Phase rail badge */}
                          <div aria-hidden="true" className="hidden shrink-0 items-center gap-1.5 pt-1 sm:flex">
                            {p.rail.map((label, ri) => (
                              <span key={label} className="flex items-center gap-1.5">
                                {ri > 0 && (
                                  <span className="h-px w-6 sm:w-8 bg-gray-200 group-hover:bg-gray-300 transition-colors" />
                                )}
                                <span className="flex flex-col items-center gap-0.5">
                                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-gray-400 group-hover:text-gray-600 transition-colors">
                                    {label}
                                  </span>
                                  <span
                                    className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                                    style={{ background: p.accent, boxShadow: `0 0 0 3px ${p.accent}24` }}
                                  />
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-2 text-sm font-medium leading-relaxed text-[#4B5563]">
                          {p.description}
                        </p>

                        {/* Footer / Meta info */}
                        <div className="mt-5 flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#374151] group-hover:bg-[#894CEF]/10 group-hover:text-[#703AD7] transition-colors">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.accent }} />
                            {p.tag}
                          </span>

                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#703AD7] group-hover:text-[#5B21B6] transition-colors">
                            <span>{t("viewPlans")}</span>
                            <ArrowUpRight
                              size={14}
                              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </SectionReveal>
        </div>
      </Container>
    </section>
  );
}
