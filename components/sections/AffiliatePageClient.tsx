"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  HandCoins,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { GoldButton } from "@/components/shared/GoldButton";
import { AffiliateNetworkVisual } from "@/components/shared/AffiliateNetworkVisual";
import { Aurora } from "@/components/fx/Aurora";
import { SectionReveal } from "@/components/shared/SectionReveal";

const TIERS = [
  { name: "STARTER", rate: null, requirement: "Current starter requirements pending publication." },
  { name: "GROWTH", rate: null, requirement: "Current growth requirements pending publication." },
  { name: "PRO", rate: null, requirement: "Current pro requirements pending publication." },
  { name: "ELITE", rate: 0.25, requirement: "Current elite requirements pending publication." },
];

function SectionHeading({ eyebrow, title, children, id, dark = false }: { eyebrow: string; title: string; children?: React.ReactNode; id: string; dark?: boolean }) {
  return (
    <SectionReveal className="mx-auto max-w-3xl text-center" data-od-id={id}>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">{eyebrow}</p>
      <h2 className={`font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.04em] md:text-5xl ${dark ? "text-[#0A0A0C]" : "text-[#0A0A0C]"}`}>{title}</h2>
      {children ? <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#4B5563]">{children}</p> : null}
    </SectionReveal>
  );
}

function PendingValue() {
  return <span className="text-sm font-medium tracking-normal text-[#6B7280]">Current data pending</span>;
}

function CommissionCalculator() {
  const t = useTranslations("affiliates");
  const [referrals, setReferrals] = useState(20);
  const [orderValue, setOrderValue] = useState(100);
  const [tier, setTier] = useState("example");
  const rate = tier === "example" ? 0.2 : TIERS.find((item) => item.name === tier)?.rate ?? null;
  const monthly = useMemo(() => (rate === null ? null : referrals * orderValue * rate), [orderValue, rate, referrals]);
  const yearly = monthly === null ? null : monthly * 12;
  const money = (value: number | null) => value === null ? "—" : `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  return (
    <SectionReveal className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm" data-od-id="affiliate-calculator">
      <div className="grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">{t("yourNumbers")}</p>
          <div className="mt-7 space-y-7">
            <label className="block" data-od-id="affiliate-referrals-control">
              <span className="flex items-center justify-between gap-4 text-sm font-semibold text-[#0A0A0C]"><span>{t("referralsLabel")}</span><output className="text-[#0A0A0C] font-extrabold">{referrals}</output></span>
              <input type="range" min="1" max="100" value={referrals} onChange={(event) => setReferrals(Number(event.target.value))} className="mt-4 w-full accent-[#703AD7]" aria-label="New Qualified Referrals per Month" />
              <span className="mt-2 flex justify-between text-[10px] text-[#6B7280]"><span>1</span><span>100</span></span>
            </label>
            <label className="block" data-od-id="affiliate-order-control">
              <span className="flex items-center justify-between gap-4 text-sm font-semibold text-[#0A0A0C]"><span>{t("orderValueLabel")}</span><output className="text-[#0A0A0C] font-extrabold">${orderValue}</output></span>
              <input type="range" min="10" max="1000" step="10" value={orderValue} onChange={(event) => setOrderValue(Number(event.target.value))} className="mt-4 w-full accent-[#703AD7]" aria-label="Average Order Value" />
              <span className="mt-2 flex justify-between text-[10px] text-[#6B7280]"><span>$10</span><span>$1,000+</span></span>
            </label>
            <label className="block" data-od-id="affiliate-tier-control"><span className="text-sm font-semibold text-[#0A0A0C]">{t("tierLabel")}</span><select value={tier} onChange={(event) => setTier(event.target.value)} className="mt-3 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#0A0A0C] focus:border-[#703AD7] focus:outline-none focus:ring-2 focus:ring-[#703AD7]/30"><option value="example">Illustrative example — 20%</option>{TIERS.map((item) => <option key={item.name} value={item.name} disabled={item.rate === null}>{item.name} — {item.rate === null ? "Current rate pending" : `${item.rate * 100}%`}</option>)}</select></label>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-6 md:p-8">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">{t("estimatedMonthly")}</p><p className="mt-3 font-[family-name:var(--font-jakarta)] text-4xl sm:text-5xl font-extrabold tracking-[-0.05em] text-[#0A0A0C] md:text-6xl">{money(monthly)}</p><p className="mt-2 text-xs text-[#6B7280]">Estimated based on the selected inputs.</p><div className="mt-6 border-t border-[#E5E7EB] pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">{t("estimatedAnnual")}</p><p className="mt-1.5 text-xl sm:text-2xl font-extrabold text-[#0A0A0C]">{money(yearly)}</p></div></div>
          <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-4 text-sm text-[#4B5563] shadow-sm"><p className="font-semibold text-[#0A0A0C]">Example</p><p className="mt-2 text-xs sm:text-sm leading-6">{referrals} qualified referrals<br />× ${orderValue} average qualifying purchase<br />× {rate === null ? "current tier rate" : `${rate * 100}% affiliate commission`}<br />= <strong className="text-[#0A0A0C] font-bold">{money(monthly)} Estimated Commission</strong></p></div>
        </div>
      </div>
      <p className="border-t border-[#E5E7EB] bg-white/[0.04] px-6 py-4 text-xs leading-6 text-[#6B7280] md:px-8">{t("calculatorDisclaimer")}</p>
    </SectionReveal>
  );
}

export function AffiliatePageClient() {
  const t = useTranslations("affiliates");

  const benefits = (t.raw("benefits") as Array<{ value: string; title: string; desc: string }>) ?? [];
  const contentTopics = (t.raw("contentTopics") as Array<{ title: string; desc: string }>) ?? [];
  const communityList = (t.raw("communityList") as string[]) ?? [];
  const ctaStats = (t.raw("ctaStats") as Array<{ value: string; label: string }>) ?? [];

  return (
    <div data-od-id="affiliates-page">
      {/* ─────────────── Hero ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] flex min-h-[calc(100dvh-44px)] flex-col overflow-hidden border-b border-gray-200 bg-white" data-od-id="affiliates-hero">
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
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7943E0]/30 bg-[#7943E0]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]"><Sparkles size={12} /> {t("badge")}</div>
              <h1 className="mt-6 font-[family-name:var(--font-jakarta)] text-[clamp(38px,7vw,44px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0A0A0C] sm:text-[52px] md:text-[60px] lg:text-[54px] xl:text-[68px]" data-od-id="affiliates-hero-title">{t("title")}</h1>
              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#4B5563] sm:text-[15px]">{t("subtitle")}</p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a href="/contact" data-od-id="affiliates-hero-cta"><GoldButton size="lg">{t("becomeAffiliate")} <ArrowRight size={16} /></GoldButton></a>
                <a href="#affiliate-how-it-works" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#4B5563] hover:text-[#0A0A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t("seeHowItWorks")} <ArrowRight size={15} /></a>
              </div>
            </div>
            <div className="lg:col-span-5 xl:col-span-6 min-w-0" data-od-id="affiliates-hero-dashboard">
              <AffiliateNetworkVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── Highlights ─────────────── */}
      <section className="bg-white border-b border-[#E5E7EB] py-12 md:py-16 text-[#0A0A0C]" data-od-id="affiliate-highlights">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-y divide-[#E5E7EB] border-y border-[#E5E7EB] md:grid-cols-4 md:divide-y-0">
            {[["UP TO 25%", t("commissionHighlight")], ["$250", t("minPayoutHighlight")], ["GLOBAL", t("globalHighlight")], ["PERFORMANCE-BASED", t("tiersHighlight")]].map(([value, label]) => (
              <div key={label} className="min-h-32 px-4 py-7 first:pl-0 md:px-7">
                <p className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold tracking-[-0.04em] text-[#0A0A0C] md:text-3xl">{value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4B5563]">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── How it Works ─────────────── */}
      <section id="affiliate-how-it-works" className="bg-white py-20 md:py-28 text-[#0A0A0C]" data-od-id="affiliate-how-it-works">
        <Container>
          <SectionHeading id="affiliate-how-heading" eyebrow={t("howEyebrow")} title={t("howTitle")} dark>{t("howSubtitle")}</SectionHeading>
          <div className="mx-auto mt-12 max-w-5xl divide-y divide-gray-100 border-y border-gray-200">
            {[["01", t("step1Title"), t("step1Desc")], ["02", t("step2Title"), t("step2Desc")], ["03", t("step3Title"), t("step3Desc")], ["04", t("step4Title"), t("step4Desc")]].map(([number, title, copy]) => (
              <div key={number} className="grid gap-4 py-7 md:grid-cols-[72px_0.65fr_1.35fr] md:items-center md:gap-8">
                <span className="font-mono text-sm font-bold text-[#1E293B]">{number}</span>
                <h3 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-[#0A0A0C]">{title}</h3>
                <p className="text-sm leading-6 text-[#4B5563]">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="/contact"><GoldButton size="lg">{t("applyNow")} <ArrowRight size={16} /></GoldButton></a>
          </div>
        </Container>
      </section>

      {/* ─────────────── Commission Calculator & Benefits ─────────────── */}
      <section className="bg-white border-y border-[#E5E7EB] py-20 md:py-28 text-[#0A0A0C]" data-od-id="affiliate-benefits">
        <Container>
          <SectionHeading id="affiliate-benefits-heading" eyebrow={t("benefitsEyebrow")} title={t("benefitsTitle")} />
          <CommissionCalculator />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A98BFF]">{item.value}</p>
                <h3 className="mt-8 font-[family-name:var(--font-jakarta)] text-xl font-bold text-[#0A0A0C]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">{item.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── Content Topics & Channels ─────────────── */}
      <section className="bg-white py-20 md:py-28 text-[#0A0A0C]" data-od-id="affiliate-content">
        <Container>
          <SectionHeading id="affiliate-content-heading" eyebrow={t("contentEyebrow")} title={t("contentTitle")} dark>{t("contentSubtitle")}</SectionHeading>
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contentTopics.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 shadow-sm">
                <p className="font-semibold text-[#0A0A0C]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">{item.desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-14 rounded-2xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
            <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A98BFF]">{t("channelsEyebrow")}</p>
                <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-2xl md:text-3xl font-extrabold text-[#0A0A0C]">{t("channelsTitle")}</h2>
              </div>
              <div>
                <p className="text-sm leading-7 text-[#4B5563]">{t("channelsDesc")}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["YouTube", "Instagram", "TikTok", "X", "Facebook", "Websites", "Blogs", "Trading Communities", "Email Audiences"].map((channel) => (
                    <span key={channel} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#4B5563] shadow-sm">{channel}</span>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-6 text-[#6B7280]">{t("channelsDisclaimer")}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────── Compliance & Terms ─────────────── */}
      <section className="bg-white border-y border-[#E5E7EB] py-16 md:py-24 text-[#0A0A0C]" data-od-id="affiliate-compliance">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
            <div className="flex items-start gap-5">
              <ShieldCheck className="mt-1 shrink-0 text-[#A98BFF]" size={26} />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">{t("complianceEyebrow")}</p>
                <h2 className="mt-2 font-[family-name:var(--font-jakarta)] text-2xl font-bold text-[#0A0A0C]">{t("complianceTitle")}</h2>
                <p className="mt-3 text-sm leading-7 text-[#4B5563]">{t("complianceDesc")}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E7EB] pt-5">
                  <p className="text-xs text-[#6B7280]">{t("payoutsDesc")}</p>
                  <a href="/terms-conditions" className="inline-flex min-h-10 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0C] hover:text-[#A98BFF] underline transition-colors">{t("viewAffiliateTerms")} <ArrowRight size={14} /></a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────── Community ─────────────── */}
      <section className="bg-white py-20 md:py-28 text-[#0A0A0C]" data-od-id="affiliate-community">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A98BFF]">{t("communityEyebrow")}</p>
              <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-5xl">{t("communityTitle")}</h2>
              <p className="mt-5 text-sm leading-7 text-[#4B5563]">{t("communityDesc")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {communityList.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm text-[#4B5563] shadow-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────── Final CTA ─────────────── */}
      <section className="relative overflow-hidden bg-white border-t border-[#E5E7EB] py-20 md:py-28 text-[#0A0A0C]" data-od-id="affiliate-final-cta">
        <Container className="relative text-center">
          <SectionReveal>
            <HandCoins className="mx-auto text-[#A98BFF]" size={32} />
            <h2 className="mx-auto mt-6 max-w-3xl font-[family-name:var(--font-jakarta)] text-4xl font-extrabold tracking-[-0.05em] text-[#0A0A0C] md:text-6xl">{t("readyTitle")}</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#4B5563]">{t("readySubtitle")}</p>
            <div className="mx-auto mt-9 grid max-w-3xl gap-3 sm:grid-cols-4">
              {ctaStats.map((item) => (
                <div key={item.label} className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold tracking-[0.14em] text-[#0A0A0C]">{item.value}</p>
                  <p className="mt-2 text-xs text-[#4B5563]">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
              <a href="/contact"><GoldButton size="lg">{t("becomeAffiliate")} <ArrowRight size={16} /></GoldButton></a>
              <a href="https://app.ckcapital.co.uk/signin" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-[#0A0A0C] shadow-sm transition-all hover:bg-gray-50">{t("login")} <ArrowRight size={14} /></a>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ─────────────── Legal / Disclaimer ─────────────── */}
      <section className="border-t border-gray-200 bg-white py-10 text-[#4B5563]" data-od-id="affiliate-disclaimer">
        <Container>
          <div className="flex items-start gap-4">
            <Mail className="mt-1 shrink-0 text-[#6B7280]" size={18} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4B5563]">{t("disclaimerTitle")}</p>
              <p className="mt-3 max-w-4xl text-xs leading-6 text-[#6B7280]">{t("disclaimerDesc")}</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#0A0A0C]">
                <a href="/terms-conditions" className="hover:text-[#A98BFF] underline transition-colors">{t("linkTerms")}</a>
                <a href="/terms-conditions" className="hover:text-[#A98BFF] underline transition-colors">{t("linkGeneralTerms")}</a>
                <a href="/risk-disclosure" className="hover:text-[#A98BFF] underline transition-colors">{t("linkDisclaimer")}</a>
                <a href="/privacy-policy" className="hover:text-[#A98BFF] underline transition-colors">{t("linkPrivacy")}</a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
