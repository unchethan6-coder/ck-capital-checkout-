import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { GoldButton } from "@/components/shared/GoldButton";
import { ChallengeComparison } from "@/components/sections/ChallengeComparison";
import { StatsStrip } from "@/components/sections/StatsStrip";
import EvaluationIntro from "@/components/evaluation/EvaluationIntro";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getChallengeConfig } from "@/lib/cms";

export const revalidate = 300;

export default async function EvaluationPage() {
  const [challengeConfig, t, tFaq] = await Promise.all([
    getChallengeConfig(),
    getTranslations("evaluation"),
    getTranslations("faq"),
  ]);

  const evaluationFaqs = [
    {
      q: tFaq("items.timeLimit.q"),
      a: tFaq("items.timeLimit.a"),
    },
    {
      q: tFaq("items.platforms.q"),
      a: tFaq("items.platforms.a"),
    },
    {
      q: tFaq("items.profitSplit.q"),
      a: tFaq("items.profitSplit.a"),
    },
    {
      q: tFaq("items.newsTrading.q"),
      a: tFaq("items.newsTrading.a"),
    },
  ];

  return (
    <div className="min-h-screen bg-background" data-od-id="evaluation-page">
      <EvaluationIntro />

      {/* ─────────────── Trust stats (DARK) ─────────────── */}
      <StatsStrip />

      {/* ─────────────── Interactive pricing table (LIGHT) ─────────────── */}
      <ChallengeComparison config={challengeConfig} />

      {/* ─────────────── Reset & Top-Up ─────────────── */}
      <section className="bg-white py-16 md:py-24 text-[#0A0A0C]" data-od-id="evaluation-reset">
        <Container>
          <SectionReveal delay={0.05} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center md:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-[#0A0A0C]">
                  <RefreshCw size={24} />
                </div>
                <div className="max-w-md">
                  <h3 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-[#0A0A0C] md:text-2xl">
                    {t("resetTitle")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                    {t("resetDesc")}
                  </p>
                </div>
              </div>
              <a
                href="https://app.ckcapital.co.uk/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <GoldButton size="lg" data-od-id="evaluation-reset-cta">
                  {t("resetBtn")} <ArrowRight size={16} />
                </GoldButton>
              </a>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ─────────────── FAQ ─────────────── */}
      <section className="bg-white border-t border-[#E5E7EB] py-16 md:py-24 text-[#0A0A0C]" data-od-id="evaluation-faq">
        <Container>
          <SectionReveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
              {t("faqEyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-5xl">
              {t("faqTitle")}
            </h2>
          </SectionReveal>

          <div className="mx-auto max-w-3xl">
            <SectionReveal delay={0.1}>
              <Accordion multiple={false} className="space-y-3">
                {evaluationFaqs.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={String(i)}
                    className="rounded-2xl border border-[#E5E7EB] bg-white px-6 shadow-sm transition-all hover:border-gray-300"
                  >
                    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-[#0A0A0C] hover:text-[#A98BFF] hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm leading-relaxed text-[#4B5563]">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SectionReveal>
          </div>
        </Container>
      </section>

      {/* ─────────────── Closing CTA ─────────────── */}
      <section className="relative overflow-hidden bg-white border-t border-gray-200 py-20 md:py-28 text-[#0A0A0C]" data-od-id="evaluation-closing-cta">
        <Container className="relative text-center">
          <SectionReveal>
            <h2 className="mx-auto max-w-3xl font-[family-name:var(--font-jakarta)] text-4xl font-extrabold tracking-[-0.04em] text-[#0A0A0C] md:text-6xl">
              Ready to begin your evaluation?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#4B5563]">
              Select your simulated account size, pass the evaluation targets, and trade with up to $1,200,000 in simulated capital.
            </p>
            <div className="mt-8">
              <a href="#start-challenge">
                <GoldButton size="lg">
                  Choose Your Account <ArrowRight size={16} />
                </GoldButton>
              </a>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </div>
  );
}
