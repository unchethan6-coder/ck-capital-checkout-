"use client";

import Image from "next/image";
import { CountryFlag } from "@/components/shared/CountryFlag";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  FileCheck2,
  Globe2,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { GoldButton } from "@/components/shared/GoldButton";
import { PayoutDashboardVisual } from "@/components/shared/PayoutDashboardVisual";
import { Aurora } from "@/components/fx/Aurora";
import { TraderStories } from "@/components/sections/TraderStories";
import { GlobalRewardsRadar } from "@/components/sections/GlobalRewardsRadar";
import type {
  CmsFirmReview,
  CmsPayout,
  CmsRewardsSummary,
  CmsVideoReview,
} from "@/lib/cms";

type Filter = "all" | "latest" | "highest" | "country";
type AmountBand = "all" | "5k" | "10k" | "25k" | "50k" | "100k" | "200k" | "300k";

function parseAmount(value: string | null | undefined) {
  if (!value) return 0;
  const number = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value: number | null, currency = "USD") {
  if (value === null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactMoney(value: number | null) {
  if (value === null || !Number.isFinite(value)) return null;
  return `$${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)}+`;
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function initials(name?: string | null) {
  return (name || "CK").slice(0, 2).toUpperCase();
}

function SectionHeading({
  eyebrow,
  title,
  children,
  id,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  id: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center" data-od-id={id}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
        {eyebrow}
      </p>
      <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0C] md:text-5xl">
        {title}
      </h2>
      {children ? <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#4B5563]">{children}</p> : null}
    </div>
  );
}

function Unavailable({ label = "Awaiting verified CMS data" }: { label?: string }) {
  return <span className="inline-block max-w-full whitespace-normal break-words text-sm font-medium leading-5 tracking-normal text-[#6B7280]">{label}</span>;
}

function CertificateCard({
  payout,
  onOpen,
}: {
  payout: CmsPayout;
  onOpen: (payout: CmsPayout) => void;
  index: number;
}) {
  const amount = payout.amount ? payout.amount : null;
  const date = formatDate(payout.approvedAt);
  return (
    <article
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-md shadow-sm"
      data-od-id={`reward-certificate-${payout.id}`}
    >
      <button type="button" onClick={() => onOpen(payout)} className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
        <div className="relative aspect-[1.34] overflow-hidden bg-gray-50">
          {payout.image?.url ? (
            <Image src={payout.image.url} alt={payout.title || "CK Capital reward certificate"} fill className="object-cover object-top transition duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 92vw, 25vw" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-[#6B7280]">
              <FileCheck2 size={28} strokeWidth={1.5} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Certificate file</span>
            </div>
          )}
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--font-jakarta)] text-sm font-bold text-[#0A0A0C]">{payout.title || "Trader"}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-[#6B7280]"><span className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[9px] font-bold text-[#4B5563]"><CountryFlag code={payout.countryCode} name={payout.countryName} size={14} />{payout.countryCode || "--"}</span>{payout.countryName || "Country not published"}</p>
            </div>
            <p className="shrink-0 text-lg font-extrabold tracking-[-0.03em] text-[#0A0A0C]">{amount || "—"}</p>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
            <span>{date || "Date not published"}</span>
            <span className="inline-flex items-center gap-1 font-bold text-[#0A0A0C] group-hover:text-[#A98BFF] transition-colors">View certificate <ArrowRight size={12} /></span>
          </div>
        </div>
      </button>
    </article>
  );
}

function CertificateModal({ payout, onClose }: { payout: CmsPayout | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!payout) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [payout, onClose]);

  if (!payout) return null;
  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Reward certificate">
      <button type="button" aria-label="Close certificate" onClick={onClose} className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      <div className="relative z-10 h-full w-full overflow-hidden bg-background/95">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between bg-gradient-to-b from-background via-background/75 to-transparent px-5 pb-16 pt-5 sm:px-8 sm:pt-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">Reward certificate</p>
            <p className="mt-1 text-sm font-semibold text-[#0A0A0C]">{payout.title || "Trader"}</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-lg border border-foreground/15 bg-background/60 text-foreground/70 backdrop-blur transition hover:bg-foreground/[0.1] hover:text-[#0A0A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Close certificate"><X size={20} /></button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-4 pt-24 pb-16 sm:p-8 sm:pt-28 sm:pb-20">
          {payout.image?.url ? <div className="relative h-full w-full"><Image src={payout.image.url} alt={payout.title || "Reward certificate"} fill sizes="100vw" className="object-contain" priority /></div> : <div className="flex min-h-64 w-full items-center justify-center rounded-lg border border-dashed border-foreground/15 text-center"><Unavailable label="The certificate image is not published yet" /></div>}
        </div>
        {payout.certificateUrl ? <a href={payout.certificateUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-5 left-1/2 z-20 inline-flex min-h-11 -translate-x-1/2 items-center justify-center gap-2 rounded-lg border border-primary/35 bg-background/75 px-4 text-xs font-bold uppercase tracking-[0.14em] text-[#A98BFF] backdrop-blur hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open source certificate <ExternalLink size={14} /></a> : null}
      </div>
    </div>
  );
}

function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return "🏳️";
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );
}

/** Positions for flag dots arranged around the globe in a pleasing arc layout */
const FLAG_POSITIONS = [
  { left: "22%", top: "18%" },
  { left: "52%", top: "12%" },
  { left: "76%", top: "22%" },
  { left: "14%", top: "48%" },
  { left: "82%", top: "45%" },
  { left: "24%", top: "72%" },
  { left: "54%", top: "78%" },
  { left: "74%", top: "68%" },
  { left: "38%", top: "35%" },
  { left: "62%", top: "55%" },
];

export function RewardsPageClient({
  payouts,
  videos,
  reviews,
  summary,
}: {
  payouts: CmsPayout[];
  videos: CmsVideoReview[];
  reviews: CmsFirmReview[];
  summary: CmsRewardsSummary | null;
}) {
  const t = useTranslations("liveRewards");
  const tChallenge = useTranslations("challenge");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [amountBand, setAmountBand] = useState<AmountBand>("all");
  const [certificate, setCertificate] = useState<CmsPayout | null>(null);
  const [reviewCount, setReviewCount] = useState(3);
  const [recentCount, setRecentCount] = useState(4);
  const [certPageSize, setCertPageSize] = useState(10);
  const handleFilterChange = (f: Filter) => { setFilter(f); setSelectedCountryCode(null); setCertPageSize(10); };
  const handleSelectCountryFilter = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setFilter("country");
    setCertPageSize(10);
  };
  const handleAmountBandChange = (a: AmountBand) => { setAmountBand(a); setCertPageSize(10); };
  const testimonialVideos = videos.map((video) => ({
    id: video.youtubeVideoId,
    title: video.title,
    reward: video.reward,
    desc: video.description,
  }));
  const filteredPayouts = useMemo(() => {
    const list = payouts.filter((p) => p.image);
    let withCountry = selectedCountryCode
      ? list.filter((payout) => (payout.countryCode || "").toUpperCase() === selectedCountryCode.toUpperCase())
      : filter === "country"
      ? list.filter((payout) => payout.countryName)
      : list;
    if (filter === "highest") withCountry = withCountry.sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));
    if (filter === "latest") withCountry = withCountry.sort((a, b) => (b.approvedAt || "").localeCompare(a.approvedAt || ""));
    if (amountBand === "all") return withCountry;
    const threshold = Number(amountBand.replace("k", "000"));
    return withCountry.filter((payout) => parseAmount(payout.amount) >= threshold);
  }, [amountBand, filter, payouts, selectedCountryCode]);

  const visiblePayouts = useMemo(() => filteredPayouts.slice(0, certPageSize), [filteredPayouts, certPageSize]);
  const hasMorePayouts = certPageSize < filteredPayouts.length;

  const highlights = useMemo(() => {
    return [
      { value: "$1.2M+", label: "Total Payouts", note: t("verifiedText") },
      { value: "20K+", label: "Active Traders", note: t("verifiedText") },
      { value: "Worldwide Traders", label: "Global Reach", note: t("verifiedText") },
      { value: summary?.maxRewardPercent == null ? "UP TO 100%" : `UP TO ${summary.maxRewardPercent}%`, label: t("simulatedRewards"), note: t("subjectToTerms") },
    ];
  }, [summary, t]);

  return (
    <div data-od-id="rewards-page">
      {/* ─────────────── Hero ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] flex min-h-[calc(100dvh-44px)] flex-col overflow-hidden border-b border-gray-200 bg-white" data-od-id="rewards-hero">
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
              <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full border border-[#7943E0]/30 bg-[#7943E0]/[0.08] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]" data-od-id="rewards-hero-eyebrow"><Sparkles size={12} /> {t("badge")}</motion.div>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }} className="mt-6 max-w-3xl font-[family-name:var(--font-jakarta)] text-[clamp(38px,7vw,44px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0A0A0C] sm:text-[52px] md:text-[60px] lg:text-[54px] xl:text-[68px]" data-od-id="rewards-hero-title">{t("heroTitlePrefix")} <span className="shimmer-text">{t("heroTitleShimmer")}</span></motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.24 }} className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#4B5563] sm:text-[15px]">{t("desc")}</motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }} className="mt-9 flex flex-wrap items-center gap-5">
                <a href="#reward-certificates" data-od-id="rewards-hero-primary"><GoldButton size="lg">{t("viewRewards")} <ArrowRight size={16} /></GoldButton></a>
                <a href="/#start-challenge" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#4B5563] hover:text-[#0A0A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" data-od-id="rewards-hero-secondary">{tChallenge("startNow")} <ArrowRight size={15} /></a>
              </motion.div>
              <div className="mt-14 flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]"><span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-secondary" /> {t("verifiedText")}</span><span className="inline-flex items-center gap-2"><FileCheck2 size={14} className="text-[#A98BFF]" /> {t("certificateProof")}</span></div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 xl:col-span-6 min-w-0"
              data-od-id="rewards-hero-dashboard"
            >
              <PayoutDashboardVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── Highlights ─────────────── */}
      <section className="bg-white border-b border-[#E5E7EB] py-12 md:py-16 text-[#0A0A0C]" data-od-id="reward-highlights">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-y divide-[#E5E7EB] border-y border-[#E5E7EB] md:grid-cols-4 md:divide-y-0">
            {highlights.map((metric) => (
              <div key={metric.label} className="min-h-36 px-4 py-7 first:pl-0 md:px-7 md:first:pl-0">
                <p className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.04em] text-[#0A0A0C] md:text-4xl">{metric.value ?? <Unavailable />}</p>
                <p className="mt-2 max-w-[12rem] text-xs font-semibold uppercase tracking-[0.12em] text-[#4B5563]">{metric.label}</p>
                <p className="mt-3 text-[10px] text-[#6B7280]">{metric.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── Certificates ─────────────── */}
      <section id="reward-certificates" tabIndex={-1} className="scroll-mt-24 bg-white py-20 md:py-28 text-[#0A0A0C]" data-od-id="reward-certificates">
        <Container>
          <SectionHeading id="reward-certificates-heading" eyebrow={t("provenEyebrow")} title={t("provenTitle")} dark>{t("provenSubtitle")}</SectionHeading>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2" role="toolbar" aria-label="Filter rewards" data-od-id="reward-filters">
            {(["all", "latest", "highest", "country"] as Filter[]).map((value) => (
              <button key={value} type="button" onClick={() => handleFilterChange(value)} aria-pressed={filter === value} className={`min-h-11 rounded-lg border px-4 text-[11px] font-bold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${filter === value ? "border-[#894CEF] bg-[#894CEF] text-[#030A1C] font-extrabold shadow-sm" : "border-gray-200 bg-white text-[#4B5563] hover:border-gray-300 hover:text-[#0A0A0C]"}`} data-od-id={`reward-filter-${value}`}>{value.charAt(0).toUpperCase() + value.slice(1)}</button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2" aria-label="Optional reward amount filter">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">{t("amountLabel")}</span>
            {(["all", "5k", "10k", "25k", "50k", "100k", "200k", "300k"] as AmountBand[]).map((value) => (
              <button key={value} type="button" onClick={() => handleAmountBandChange(value)} aria-pressed={amountBand === value} className={`min-h-9 rounded-md border px-3 text-[10px] font-bold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${amountBand === value ? "border-[#0A0A0C] bg-[#0A0A0C] text-white font-extrabold" : "border-gray-200 bg-white text-[#6B7280] hover:text-[#0A0A0C] hover:border-gray-300"}`}>{value === "all" ? "All" : `$${value.toUpperCase()}`}</button>
            ))}
          </div>
          {selectedCountryCode && (
            <div className="mt-4 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#894CEF] bg-violet-50 px-3.5 py-1 text-xs font-bold text-[#A98BFF] shadow-sm">
                <span>Filtering by Country: <strong>{selectedCountryCode}</strong></span>
                <button
                  type="button"
                  onClick={() => setSelectedCountryCode(null)}
                  className="rounded-full hover:bg-violet-200/60 p-0.5 transition-colors"
                  aria-label="Clear country filter"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          )}
          {filteredPayouts.length ? (
            <>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{visiblePayouts.map((payout, index) => <CertificateCard key={payout.id} payout={payout} index={index} onOpen={setCertificate} />)}</div>
              {hasMorePayouts && (
                <div className="mt-8 text-center">
                  <button type="button" onClick={() => setCertPageSize((prev) => prev + 10)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0C] hover:bg-gray-50 hover:border-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Load more rewards <ChevronDown size={15} />
                  </button>
                </div>
              )}
            </>
          ) : <div className="mt-10 rounded-xl border border-dashed border-gray-200 px-6 py-16 text-center"><FileCheck2 className="mx-auto mb-4 text-gray-400" size={32} /><Unavailable label={t("certificatesEmpty")} /></div>}
        </Container>
      </section>

      {/* ─────────────── Testimonials / Trader Stories ─────────────── */}
      <TraderStories videos={testimonialVideos.length ? testimonialVideos : undefined} />

      {/* ─────────────── Benefits ─────────────── */}
      <section className="bg-white py-20 md:py-28 text-[#0A0A0C]" data-od-id="reward-benefits">
        <Container>
          <SectionHeading id="reward-benefits-heading" eyebrow={t("benefitsEyebrow")} title={t("benefitsTitle")} dark>{t("benefitsSubtitle")}</SectionHeading>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[
            ["UP TO 100%", "Simulated Profit Rewards", "Keep up to the applicable percentage of eligible simulated profits according to your CK Capital account terms."],
            ["FLEXIBLE", "Reward Cycles", "Eligible Qualified Analysts can request rewards according to the payout conditions applicable to their selected account."],
            ["UP TO $1.2M", "Total Simulated Account Allocation", "Progress within the CK Capital programme and access larger simulated account allocations subject to applicable programme rules."],
            ["NEWS TRADING", "More Trading Flexibility", "Trade around news events where permitted under the rules of your selected account."],
          ].map(([value, title, copy]) => (
            <div key={title} className="min-h-56 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300 hover:shadow-md transition-all">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A98BFF]">{value}</p>
              <h3 className="mt-10 font-[family-name:var(--font-jakarta)] text-xl font-bold text-[#0A0A0C]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4B5563]">{copy}</p>
            </div>
          ))}</div>
        </Container>
      </section>

      {/* ─────────────── Process ─────────────── */}
      <section className="bg-white border-y border-[#E5E7EB] py-20 md:py-28 text-[#0A0A0C]" data-od-id="reward-process">
        <Container>
          <SectionHeading id="reward-process-heading" eyebrow={t("processEyebrow")} title={t("processTitle")}>{t("processSubtitle")}</SectionHeading>
          <div className="mx-auto mt-12 max-w-4xl">{[
            ["01", "Complete Your Evaluation", "Meet the objectives of your selected CK Capital evaluation while respecting the applicable risk parameters."],
            ["02", "Become a Qualified Analyst", "After successfully completing the required evaluation stages and account review, eligible traders progress to a CK Capital Qualified Analyst Account."],
            ["03", "Demonstrate Your Performance", "Continue trading within the applicable account rules and requirements."],
            ["04", "Request Your Reward", "Once eligible, submit your reward request through your CK Capital dashboard."],
            ["05", "Celebrate Your Achievement", "Approved rewards are processed according to the terms applicable to your account."],
          ].map(([number, title, copy]) => (
            <div key={number} className="group grid grid-cols-[52px_1fr] gap-5 border-b border-[#E5E7EB] py-6 first:border-t md:grid-cols-[80px_0.8fr_1.2fr] md:items-center md:gap-8">
              <span className="font-mono text-sm font-bold text-[#1E293B]">{number}</span>
              <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-[#0A0A0C]">{title}</h3>
              <p className="col-start-2 text-sm leading-6 text-[#4B5563] md:col-start-auto">{copy}</p>
            </div>
          ))}</div>
        </Container>
      </section>

      {/* ─────────────── World Map / Global Rewards Radar ─────────────── */}
      <section className="bg-white py-20 md:py-28 text-[#0A0A0C]" data-od-id="reward-world">
        <Container>
          <SectionHeading id="reward-world-heading" eyebrow={t("worldEyebrow")} title={t("worldTitle")} dark>{t("worldSubtitle")}</SectionHeading>
          <div className="mt-12"><GlobalRewardsRadar payouts={payouts} onSelectCountryFilter={handleSelectCountryFilter} /></div>
        </Container>
      </section>

      {/* ─────────────── Reviews ─────────────── */}
      {(() => {
        const realReviews = reviews.filter((r) => r.authorName && r.authorName.trim().length > 0 && !/^verified trader$/i.test(r.authorName));
        return realReviews.length > 0 ? (
          <section className="bg-white border-y border-[#E5E7EB] py-20 md:py-28 text-[#0A0A0C]" data-od-id="reward-reviews">
            <Container>
              <SectionHeading id="reward-reviews-heading" eyebrow={t("reviewsEyebrow")} title={t("reviewsTitle")}>{t("reviewsSubtitle")}</SectionHeading>
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {realReviews.slice(0, reviewCount).map((review) => (
                  <article key={review.id} className="flex min-h-56 flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-md transition-all" data-od-id={`reward-review-${review.id}`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5" aria-label={`${review.rating || 5} out of 5 stars`}>
                           {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < (review.rating || 5) ? "#00B67A" : "none"} stroke={i < (review.rating || 5) ? "#00B67A" : "currentColor"} />)}
                        </div>
                        {review.source && <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#6B7280]"><span className="h-1.5 w-1.5 rounded-full bg-current" />{review.source}</span>}
                      </div>
                      <blockquote className="mt-4 text-sm leading-7 text-[#374151]">&ldquo;{review.summary}&rdquo;</blockquote>
                    </div>
                    <div className="mt-6 flex items-center gap-3 border-t border-[#E5E7EB] pt-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-[#0A0A0C]">{initials(review.authorName)}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#0A0A0C]">{review.authorName}</p>
                        <p className="text-xs text-[#6B7280]">{review.countryName || ""}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {reviewCount < realReviews.length ? (
                <div className="mt-8 text-center">
                  <button type="button" onClick={() => setReviewCount((count) => Math.min(count + 3, realReviews.length))} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0C] shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Read more reviews <ChevronDown size={15} />
                  </button>
                </div>
              ) : null}
            </Container>
          </section>
        ) : null;
      })()}

      {/* ─────────────── Final CTA ─────────────── */}
      <section className="relative overflow-hidden bg-white border-t border-gray-200 py-20 md:py-28 text-[#0A0A0C]" data-od-id="reward-cta">
        <Container className="relative text-center">
          <Trophy className="mx-auto text-[#A98BFF]" size={30} strokeWidth={1.4} />
          <h2 className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-jakarta)] text-4xl font-extrabold tracking-[-0.04em] text-[#0A0A0C] md:text-6xl">{t("readyTitle")}</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#4B5563]">{t("readySubtitle")}</p>
          <div className="mx-auto mt-9 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            {[["1 STEP", "One-stage evaluation.", "/evaluation?type=one-step&size=$100K#start-challenge"], ["2 STEP", "Evaluation + Verification.", "/evaluation?type=standard&size=$100K#start-challenge"], ["INSTANT", "Alternative account structure subject to its applicable rules.", "/instant"]].map(([label, copy, href]) => (
              <a key={label} href={href} className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <p className="text-xs font-bold tracking-[0.16em] text-[#A98BFF]">{label}</p>
                <p className="mt-2 text-xs leading-5 text-[#4B5563]">{copy}</p>
              </a>
            ))}
          </div>
          <div className="mt-8">
            <a href="/evaluation" data-od-id="rewards-cta-primary"><GoldButton size="lg">{t("exploreEvaluations")} <ArrowRight size={16} /></GoldButton></a>
          </div>
        </Container>
      </section>

      {/* ─────────────── Legal / Disclaimer ─────────────── */}
      <section className="border-t border-gray-200 bg-white py-10 text-[#4B5563]" data-od-id="reward-legal">
        <Container>
          <div className="flex items-start gap-4">
            <ArrowDownRight className="mt-1 shrink-0 text-[#6B7280]" size={18} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4B5563]">{t("importantInfo")}</p>
              <p className="mt-3 max-w-4xl text-xs leading-6 text-[#6B7280]">{t("legalDisclaimer")}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#0A0A0C]">
                <a href="/terms-conditions" className="hover:text-[#A98BFF] underline transition-colors">{t("viewTerms")} <ExternalLink size={12} className="inline" /></a>
                <a href="/risk-disclosure" className="hover:text-[#A98BFF] underline transition-colors">{t("viewRisk")} <ExternalLink size={12} className="inline" /></a>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <CertificateModal payout={certificate} onClose={() => setCertificate(null)} />
    </div>
  );
}
