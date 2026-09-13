"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PRICING_PLANS, CURRENCIES } from "@/lib/content";
import { GoldButton } from "@/components/shared/GoldButton";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { Check, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const FX: Record<string, number> = { USD: 1, GBP: 0.79, EUR: 0.92 };

export function PricingGrid() {
  const [currency, setCurrency] = useState("USD");
  const fx = FX[currency];
  const sym = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";

  return (
    <section className="py-16 md:py-24" data-od-id="pricing">
      <Container>
        <SectionReveal className="text-center mb-10">
          <p className="text-xs text-[#A98BFF] uppercase tracking-widest font-semibold mb-3">
            Pricing
          </p>
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-4xl">
            Start your evaluation journey
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Choose your account size and prove your skills. All plans include the same
            transparent rules — no hidden fees.
          </p>
        </SectionReveal>

        {/* Currency toggle */}
        <SectionReveal delay={0.1} className="flex justify-center mb-10">
          <div className="flex gap-1 rounded-xl border border-gray-200 bg-foreground/[0.03] p-1">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
                  currency === c.code
                    ? "bg-foreground/10 text-[#0A0A0C] border border-primary/60"
                    : "text-gray-500 hover:text-foreground/80"
                )}
              >
                {c.flag} {c.code}
              </button>
            ))}
          </div>
        </SectionReveal>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.id}
              data-od-id={`pricing-card-${plan.id}`}
              className={cn(
                "relative flex flex-col rounded-2xl border p-5 card-hover-standard transition-transform duration-200 hover:-translate-y-1",
                plan.popular
                  ? "border-primary bg-white shadow-xl"
                  : "border-gray-200 bg-white/[0.04]"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-extrabold text-primary-foreground tracking-wider shadow-md">
                  MOST POPULAR
                </span>
              )}

              {!plan.popular && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]/70 mb-2">
                  {plan.label}
                </span>
              )}

              <h3 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C]">
                {plan.accountSize}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{plan.type}</p>

              <div className="mt-4 space-y-2 text-sm flex-1">
                {[
                  { label: "Profit Target", value: plan.profitTarget },
                  { label: "Max Daily Loss", value: plan.maxDailyLoss },
                  { label: "Max Loss",       value: plan.maxLoss },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between border-b border-foreground/[0.06] pb-2">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-semibold text-[#0A0A0C]">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 pt-1 text-xs text-[#14b8a6]">
                  <Check size={12} /> News trading allowed
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#14b8a6]">
                  <Check size={12} /> Up to 100% reward split
                </div>
              </div>

              {/* Price */}
              <div className="mt-5 pt-4 border-t border-foreground/[0.06]">
                <div className="flex items-end gap-2">
                  <span className="font-mono text-3xl font-extrabold text-[#0A0A0C]">
                    {sym}{(plan.priceUSD * fx).toFixed(2)}
                  </span>
                  <span className="text-sm text-foreground/65 line-through mb-1">
                    {sym}{(plan.originalPriceUSD * fx).toFixed(2)}
                  </span>
                  <span className="ml-auto text-sm font-bold text-[#A98BFF]">
                    {plan.discount}
                  </span>
                </div>
                <a
                  href="https://app.ckcapital.co.uk/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <GoldButton
                    className="mt-3 w-full justify-center"
                    variant={plan.popular ? "gold" : "outline"}
                    size="md"
                    data-od-id={`pricing-cta-${plan.id}`}
                  >
                    Start Now
                  </GoldButton>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Transparent conditions callout */}
        <SectionReveal delay={0.3} className="mt-8 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
            <TrendingUp size={14} className="text-[#A98BFF]" />
            Trade with transparent drawdown rules and keep up to{" "}
            <span className="text-[#A98BFF] font-bold">100% simulated profit split</span>
          </p>
        </SectionReveal>
      </Container>
    </section>
  );
}
