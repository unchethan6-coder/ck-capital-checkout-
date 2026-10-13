"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { GoldButton } from "@/components/shared/GoldButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface FaqItem {
  id?: number | string;
  question: string;
  answer: string;
}

export function FaqAccordion({
  cmsFaqs,
  featuredOnly = false,
}: {
  cmsFaqs?: FaqItem[];
  featuredOnly?: boolean;
} = {}) {
  const t = useTranslations("faq");

  const faqKeys = [
    "payoutTime",
    "minProfit",
    "buffer",
    "payoutCaps",
    "consistencyScore",
    "trailingDrawdown",
    "pendingPayout",
    "lotSize",
    "countries",
    "copyTrading",
    "inactivity",
    "topUpReset",
    "maxAllocation",
    "phase2Reset",
    "fundedReset",
    "timeLimit",
    "platforms",
    "profitSplit",
    "drawdown",
    "newsTrading",
    "twoStepPro",
    "consistency",
    "cryptoFunding",
    "refundPolicy",
    "expertAdvisors",
    "instantPayouts",
  ] as const;

  const items = useMemo<FaqItem[]>(() => {
    if (featuredOnly) {
      return [
        {
          id: "newsTrading",
          question: t("items.newsTrading.q" as any) || "News Trading Allowed?",
          answer:
            cmsFaqs?.find((f) =>
              f.question.toLowerCase().includes("news")
            )?.answer ||
            t("items.newsTrading.a" as any) ||
            "News trading is allowed on every programme that carries a consistency score — 1 Step Standard, 2 Step Standard and Instant Funding. It is not permitted on 2 Step Pro, which has no consistency requirement. Positions may be held overnight and over the weekend on all programmes.",
        },
        {
          id: "twoStepPro",
          question: t("items.twoStepPro.q" as any) || "About 2-Step Pro",
          answer:
            cmsFaqs?.find((f) =>
              f.question.toLowerCase().includes("2-step pro")
            )?.answer ||
            t("items.twoStepPro.a" as any) ||
            "The 2-Step Pro Challenge is a two-stage evaluation (10% Phase 1 target, 5% Phase 2 target) featuring no consistency score requirement, a static 8% maximum loss limit (4% daily drawdown), and up to an 80% profit split once funded. Note that news trading is not permitted on this account type.",
        },
        {
          id: "copyTrading",
          question: t("items.copyTrading.q" as any) || "Is Copy Trading Allowed?",
          answer:
            cmsFaqs?.find((f) =>
              f.question.toLowerCase().includes("copy trading")
            )?.answer ||
            t("items.copyTrading.a" as any) ||
            "Yes. Copy trading is permitted across all programmes. Accounts are still assessed individually against their own objectives, risk limits and consistency requirements.",
        },
        {
          id: "phase2Reset",
          question: t("items.phase2Reset.q" as any) || "Can I Reset Phase 2?",
          answer:
            cmsFaqs?.find((f) =>
              f.question.toLowerCase().includes("phase 2")
            )?.answer ||
            t("items.phase2Reset.a" as any) ||
            "Yes. A Phase 2 reset costs 2.5 times the applicable discounted challenge price, and the profit split on the reset account is reduced to 65%.",
        },
      ];
    }

    if (cmsFaqs && cmsFaqs.length > 0) {
      return cmsFaqs;
    }
    return faqKeys.map((key) => ({
      id: key,
      question: t(`items.${key}.q` as any),
      answer: t(`items.${key}.a` as any),
    }));
  }, [cmsFaqs, featuredOnly, t]);

  return (
    <section id="faqs" className="bg-white text-[#0A0A0C] py-16 md:py-24" data-od-id="faq">
      <Container>
        <SectionReveal className="text-center mb-10 md:mb-14">
          <p className="text-xs text-[#A98BFF] uppercase tracking-widest font-bold mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-[#4B5563] font-medium max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </SectionReveal>

        <div className="max-w-3xl mx-auto">
          <SectionReveal delay={0.06}>
            <Accordion multiple={false} className="space-y-3">
              {items.map((item, i) => (
                <AccordionItem
                  key={item.id ?? i}
                  value={String(i)}
                  className="rounded-2xl border border-gray-200 bg-white px-6 shadow-sm transition-all hover:border-gray-300"
                >
                  <AccordionTrigger className="text-left text-sm font-bold text-[#0A0A0C] hover:text-[#A98BFF] hover:no-underline py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-medium text-[#4B5563] pb-4 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {featuredOnly && (
              <div className="mt-7 flex justify-center">
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-[#0A0A0C] shadow-sm transition-all hover:border-[#A98BFF] hover:text-[#7C3AED] hover:shadow-md"
                >
                  <span>{t("exploreAll" as any) || "Explore All FAQs"}</span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </SectionReveal>

          {/* Still have questions CTA */}
          <SectionReveal delay={0.1} className="mt-10 md:mt-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 text-center shadow-[0_20px_50px_-20px_rgba(15,23,42,0.12)]">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <MessageCircle size={20} className="text-[#A98BFF]" />
              </div>
            </div>
            <h3 className="font-[family-name:var(--font-jakarta)] text-xl font-extrabold text-[#0A0A0C] mb-2">
              {t("stillQuestions")}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {t("supportAvailable")}
            </p>
            <a href="https://discord.com/invite/hGSVx9CmS2" target="_blank" rel="noopener noreferrer">
              <GoldButton size="md" data-od-id="faq-support-cta">
                {t("chatSupport")}
              </GoldButton>
            </a>
          </SectionReveal>
        </div>
      </Container>
    </section>
  );
}
