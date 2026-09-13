"use client";
import { useTranslations } from "next-intl";
import { FAQ_ITEMS } from "@/lib/content";
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

export function FaqAccordion() {
  const t = useTranslations("faq");

  const faqKeys = [
    "payoutTime",
    "timeLimit",
    "platforms",
    "profitSplit",
    "drawdown",
    "newsTrading",
    "consistency",
    "cryptoFunding",
    "refundPolicy",
    "expertAdvisors",
  ] as const;

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
              {faqKeys.map((key, i) => (
                <AccordionItem
                  key={key}
                  value={String(i)}
                  className="rounded-2xl border border-gray-200 bg-white px-6 shadow-sm transition-all hover:border-gray-300"
                >
                  <AccordionTrigger className="text-left text-sm font-bold text-[#0A0A0C] hover:text-[#A98BFF] hover:no-underline py-4">
                    {t(`items.${key}.q` as any)}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-medium text-[#4B5563] pb-4 leading-relaxed">
                    {t(`items.${key}.a` as any)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
