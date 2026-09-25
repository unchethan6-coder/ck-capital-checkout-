"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { ArrowRight, ArrowUpRight, Layers, Rocket, Zap } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    { title: t("steps.step1.title"), description: t("steps.step1.description") },
    { title: t("steps.step2.title"), description: t("steps.step2.description") },
    { title: t("steps.step3.title"), description: t("steps.step3.description") },
    { title: t("steps.step4.title"), description: t("steps.step4.description") },
  ];

  const programs = [
    {
      icon: Layers,
      accent: "#A98BFF",
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
      accent: "#34D399",
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
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
          {/* ───────────── Left: the process ───────────── */}
          <SectionReveal>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#A98BFF]">
              [ // {t("badge")} ]
            </p>
            <h2 className="mt-4 max-w-md font-[family-name:var(--font-jakarta)] text-3xl font-black leading-[1.1] tracking-tight text-[#0A0A0C] sm:text-[40px]">
              {t("title")}
            </h2>

            <ol className="mt-9 space-y-0" data-od-id="how-it-works-steps">
              {steps.map((step, i) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "flex gap-4 py-5 sm:gap-6",
                    i > 0 && "border-t border-gray-200/70"
                  )}
                  data-od-id={`how-step-${i + 1}`}
                >
                  <span className="shrink-0 pt-0.5 font-mono text-sm font-bold tabular-nums text-[#A98BFF]">
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold tracking-tight text-[#0A0A0C]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm font-medium leading-relaxed text-[#4B5563]">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <div className="mt-9 flex flex-col items-start gap-5">
              <Link
                href="/trading-objectives"
                className="inline-flex min-h-11 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0A0A0C] underline-offset-4 hover:text-[#A98BFF] hover:underline"
              >
                {t("compareAll")}
                <ArrowUpRight size={14} />
              </Link>

              <a
                href="/#start-challenge"
                className="group inline-flex items-center justify-center gap-2 rounded-xl brand-gradient-btn px-6 py-3.5 text-sm font-bold text-[#1A1030] shadow-md transition-all duration-200 hover:shadow-cyan-500/25"
                data-od-id="how-it-works-cta"
              >
                <span>{t("ctaFunded")}</span>
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </SectionReveal>

          {/* ───────────── Right: the three programmes ───────────── */}
          <SectionReveal delay={0.1}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#A98BFF]">
              [ // {t("programsBadge")} ]
            </p>

            <div className="mt-4 flex flex-col gap-4" data-od-id="how-it-works-programs">
              {programs.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 transition-colors sm:p-6"
                    data-od-id={`how-program-${i + 1}`}
                  >
                    {/* corner glow in the programme's accent */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full opacity-45 blur-3xl transition-opacity duration-300 group-hover:opacity-70"
                      style={{ background: p.accent }}
                    />

                    <div className="relative">
                      <span
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ background: `${p.accent}1F`, color: p.accent }}
                      >
                        <Icon size={20} strokeWidth={2.2} />
                      </span>

                      <div className="mt-5 flex items-start justify-between gap-4">
                        <h3 className="font-[family-name:var(--font-jakarta)] text-xl font-bold tracking-tight text-[#0A0A0C]">
                          {p.title}
                        </h3>
                        {/* phase rail — decorative, mirrors the programme shape */}
                        <div aria-hidden="true" className="hidden shrink-0 items-center gap-1.5 pt-2 sm:flex">
                          {p.rail.map((label, ri) => (
                            <span key={label} className="flex items-center gap-1.5">
                              {ri > 0 && <span className="h-px w-8 bg-gray-300" />}
                              <span className="flex flex-col items-center gap-1">
                                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-gray-400">
                                  {label}
                                </span>
                                <span
                                  className="h-2 w-2 rounded-full ring-2"
                                  style={{ background: p.accent, boxShadow: `0 0 0 3px ${p.accent}24` }}
                                />
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-[#4B5563]">
                        {p.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#374151]">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.accent }} />
                          {p.tag}
                        </span>
                        <Link
                          href={p.href as never}
                          className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold text-[#0A0A0C] underline-offset-4 hover:text-[#A98BFF] hover:underline"
                        >
                          {t("viewPlans")}
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
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
