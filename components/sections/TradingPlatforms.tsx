"use client";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { GoldButton } from "@/components/shared/GoldButton";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/components/fx/reveal";
import { Check } from "lucide-react";

export function TradingPlatforms() {
  const t = useTranslations("platforms");

  const platforms = [
    {
      id: "mt5",
      name: "MT5",
      fullName: "MetaTrader 5",
      description: t("mt5Desc"),
      features: (t.raw("mt5Features") as string[]) ?? ["Advanced charting", "Expert Advisors (EA)", "One-click trading", "20+ order types"],
      logo: "/images/logos/tradelocker.jpeg",
    },
    {
      id: "tradelocker",
      name: "TradeLocker",
      fullName: "TradeLocker",
      description: t("tradelockerDesc"),
      features: (t.raw("tradelockerFeatures") as string[]) ?? ["Web & mobile native", "Real-time analytics", "Built-in risk tools", "Clean modern UI"],
      logo: "/images/logos/mt5.png",
    },
  ];

  return (
    <section
      id="platforms"
      className="scroll-mt-28 bg-white text-[#0A0A0C] py-14 md:py-24"
      data-od-id="trading-platforms"
    >
      <Container>
        <SectionReveal className="text-center mb-10 md:mb-14">
          <p className="text-xs text-[#A98BFF] uppercase tracking-widest font-bold mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-[#4B5563] max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </SectionReveal>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {platforms.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col gap-5 transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
              data-od-id={`platform-${p.id}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-gray-200">
                  <img
                    src={p.logo}
                    alt={`${p.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-jakarta)] text-xl font-extrabold text-[#0A0A0C]">
                    {p.name}
                  </h3>
                  <p className="text-xs font-medium text-[#6B7280]">{p.fullName}</p>
                </div>
              </div>

              <p className="text-sm text-[#4B5563] leading-relaxed">{p.description}</p>

              <ul className="grid grid-cols-2 gap-1.5 text-xs text-[#4B5563]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <Check size={11} className="text-emerald-600 shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <a
                href="https://app.ckcapital.co.uk/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto self-stretch sm:self-start mt-auto pt-2"
              >
                <GoldButton variant="outline" className="w-full sm:w-auto text-center justify-center" data-od-id={`platform-cta-${p.id}`}>
                  {t("getPlatform", { name: p.name })}
                </GoldButton>
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
