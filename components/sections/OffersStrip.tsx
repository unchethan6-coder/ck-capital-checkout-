"use client";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { ArrowRight } from "lucide-react";
import { SITE_META } from "@/lib/content";

export interface PromoData {
  code: string;
  title?: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  discountLabel?: string | null;
}

export function OffersStrip({ promo }: { promo?: PromoData | null }) {
  const t = useTranslations("offers");
  const code = promo?.code ?? SITE_META.promoCode;
  const discount = promo?.discountLabel ?? SITE_META.promoDiscount;
  const headline = promo?.title ?? t("defaultHeadline", { discount });
  const subcopy = promo?.subtitle ?? t("defaultSubcopy");

  return (
    <section className="py-12 md:py-16" data-od-id="offers">
      <Container>
        <SectionReveal>
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl md:text-4xl font-extrabold text-[#0A0A0C] mb-3">
            {t("title")}
          </h2>
        </SectionReveal>

        {/* Subtitle chip — sits below the H2, outside the card */}
        <SectionReveal delay={0.05}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-[11px] font-semibold text-[#A98BFF] mb-6">
            <span className="w-1 h-1 rounded-full bg-primary" />
            {t("badge")}
          </span>
        </SectionReveal>

        {/* Offer card — flat solid panel */}
        <SectionReveal delay={0.1}>
          <div
            data-od-id="offers-card"
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-white p-6 sm:p-8 md:p-10 shadow-xl"
          >
            <div className="relative flex flex-col md:flex-row md:items-center gap-8 md:gap-6">
              {/* Content column */}
              <div className="flex-1 min-w-0">
                {/* "hot offer" pill */}
                <span className="inline-flex items-center rounded-full bg-primary/20 border border-primary/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#A98BFF]">
                  {t("hotOffer")}
                </span>

                {/* Headline — white + gold split */}
                <h3 className="mt-4 font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl md:text-[34px] font-extrabold leading-tight tracking-tight text-[#0A0A0C]">
                  {promo?.title ? (
                    headline
                  ) : (
                    <>
                      Your First Challenge,{" "}
                      <span className="text-[#A98BFF]">{discount} Off</span>
                    </>
                  )}
                </h3>

                {/* Thin divider under headline */}
                <div className="mt-4 h-px w-full bg-primary/25" />

                {/* Subcopy */}
                <p className="mt-4 max-w-xl text-sm sm:text-[15px] text-gray-500 leading-relaxed">
                  {subcopy}
                </p>
              </div>

              {/* CTA — vertically centered on md+ */}
              <a
                href="#start-challenge"
                data-od-id="offers-cta"
                className="btn-brand-standard group shrink-0 self-stretch sm:self-start md:self-center inline-flex items-center justify-center gap-2 rounded-xl text-[13px] tracking-[0.12em] uppercase px-6 py-3 w-full sm:w-auto text-center"
              >
                {promo?.ctaLabel ?? t("useCode", { code })}
                <ArrowRight
                  size={15}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
