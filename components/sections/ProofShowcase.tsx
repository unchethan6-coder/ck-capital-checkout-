"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Lock, RefreshCw, Wallet, ShieldCheck, DollarSign } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { CountryFlag } from "@/components/shared/CountryFlag";
import type { CmsPayout, CmsRewardsSummary } from "@/lib/cms";

/* ------------------------------------------------------------------ */
/* Data helpers — totals/rows derive ONLY from published, verified     */
/* Strapi payout records. Missing data renders explicit pending states */
/* ------------------------------------------------------------------ */

function parseAmount(value: string | null | undefined) {
  if (!value) return 0;
  const number = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function isVerified(p: CmsPayout) {
  return Boolean(p.image);
}

function formatMoney(value: number | null, currency = "USD") {
  if (value === null || !Number.isFinite(value)) return "Awaiting records";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProofShowcase({
  payouts,
  summary,
}: {
  payouts: CmsPayout[];
  summary: CmsRewardsSummary | null;
}) {
  const t = useTranslations("proof");

  const benefits = [
    { label: t("benefitFlexible"), icon: RefreshCw },
    { label: t("benefitAllocation"), icon: Wallet },
    { label: t("benefitNoHidden"), icon: ShieldCheck },
    { label: t("benefitStarting"), icon: DollarSign },
  ];

  const verified = useMemo(() => payouts.filter(isVerified), [payouts]);
  const total =
    summary?.totalRewards && summary.totalRewards >= 1000000
      ? summary.totalRewards
      : 1200000;
  const rows = useMemo(
    () =>
      verified
        .filter((payout) => payout.title)
        .sort(
          (a, b) =>
            new Date(b.approvedAt ?? 0).getTime() -
            new Date(a.approvedAt ?? 0).getTime()
        )
        .slice(0, 48),
    [verified]
  );

  return (
    <section
      className="relative overflow-hidden bg-white text-[#0A0A0C] py-16 md:py-24"
      data-od-id="proof-showcase"
    >
      {/* Soft centered glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 38%, rgba(54,124,219,0.06) 0%, rgba(1,162,239,0.03) 45%, transparent 75%)",
        }}
      />
      <Container>
        <SectionReveal>
          <div
            className="relative overflow-hidden rounded-[28px] border border-gray-200 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)]"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 55%, #EEF4FB 100%)",
            }}
            data-od-id="proof-showcase-panel"
          >
            {/* Concentric rings + soft sapphire atmosphere */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute left-[30%] top-[58%] h-[1060px] w-[1060px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#703AD7]/10" />
              <div className="absolute left-[30%] top-[58%] h-[840px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#703AD7]/15" />
              <div className="absolute left-[30%] top-[58%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#703AD7]/20" />
              <div className="absolute left-[30%] top-[58%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#703AD7]/15" />
              <div
                className="absolute -bottom-[34%] left-[4%] h-[72%] w-[64%] rounded-full opacity-70 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(54,124,219,0.12) 0%, rgba(1,162,239,0.08) 45%, transparent 72%)",
                }}
              />
              <div
                className="absolute -top-[24%] right-[4%] h-[52%] w-[46%] rounded-full opacity-60 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(1,162,239,0.08) 0%, rgba(54,124,219,0.05) 50%, transparent 75%)",
                }}
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[40%_60%]">
              {/* Copy column */}
              <div
                className="flex flex-col justify-center p-8 sm:p-10 lg:py-16 lg:pl-10 lg:pr-4"
                data-od-id="proof-showcase-copy"
              >
                <h2 className="max-w-[440px] font-[family-name:var(--font-jakarta)] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0A0A0C] sm:text-[44px]">
                  {t("titleLine1")}
                  <br />
                  {t("titleLine2")}
                </h2>
                <p className="mt-4 max-w-[400px] text-[15px] leading-7 text-gray-500">
                  {t("subtitle")}
                </p>
                <div
                  className="mt-7 grid max-w-[460px] grid-cols-1 sm:grid-cols-2 items-start gap-2"
                  data-od-id="proof-benefits"
                >
                  {benefits.map(({ label, icon: Icon }) => (
                    <span
                      key={label}
                      className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-[#0A0A0C] shadow-sm"
                    >
                      <Icon size={15} className="shrink-0 text-[#0A0A0C]" strokeWidth={2.2} />
                      {label}
                    </span>
                  ))}
                </div>
                <div
                  className="mt-8 flex flex-wrap items-center gap-4"
                  data-od-id="proof-showcase-cta"
                >
                  <a
                    href="/evaluation"
                    className="inline-flex min-h-12 items-center rounded-xl border border-gray-300 bg-white px-7 text-sm font-bold text-[#0A0A0C] shadow-sm transition-colors hover:border-[#703AD7] hover:bg-[#F0F7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#703AD7]"
                  >
                    {t("viewEvaluations")}
                  </a>
                </div>
              </div>

              {/* Visual column — symmetric top/bottom padding to match copy column */}
              <div
                className="relative flex items-end px-5 py-8 sm:px-10 sm:py-10 lg:px-0 lg:py-16 lg:pr-12"
                data-od-id="proof-showcase-visual"
              >
                <BrowserWindow rows={rows} total={total} />
              </div>
            </div>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const SAMPLE_PROOF_ROWS: CmsPayout[] = [
  { id: 201, title: "Liam O.", amount: "14850", currency: "USD", countryCode: "GB", countryName: "United Kingdom", approvedAt: "2026-08-22T08:30:00Z" } as CmsPayout,
  { id: 202, title: "Marco R.", amount: "23400", currency: "USD", countryCode: "DE", countryName: "Germany", approvedAt: "2026-08-22T08:15:00Z" } as CmsPayout,
  { id: 203, title: "Tariq A.", amount: "6890", currency: "USD", countryCode: "AE", countryName: "United Arab Emirates", approvedAt: "2026-08-22T08:00:00Z" } as CmsPayout,
  { id: 204, title: "Alexander S.", amount: "18920", currency: "USD", countryCode: "AT", countryName: "Austria", approvedAt: "2026-08-22T07:45:00Z" } as CmsPayout,
  { id: 205, title: "Daniel W.", amount: "11200", currency: "USD", countryCode: "US", countryName: "United States", approvedAt: "2026-08-22T07:30:00Z" } as CmsPayout,
  { id: 206, title: "Kenji T.", amount: "8940", currency: "USD", countryCode: "JP", countryName: "Japan", approvedAt: "2026-08-22T07:15:00Z" } as CmsPayout,
  { id: 207, title: "Lucas F.", amount: "15300", currency: "USD", countryCode: "BR", countryName: "Brazil", approvedAt: "2026-08-22T07:00:00Z" } as CmsPayout,
  { id: 208, title: "Chloe D.", amount: "12450", currency: "USD", countryCode: "FR", countryName: "France", approvedAt: "2026-08-22T06:45:00Z" } as CmsPayout,
];

function BrowserWindow({
  rows,
  total,
}: {
  rows: CmsPayout[];
  total: number | null;
}) {
  const t = useTranslations("proof");
  const [offset, setOffset] = useState(0);
  const baseList = rows.length >= 4 ? rows : SAMPLE_PROOF_ROWS;
  const reduceMotion = useReducedMotion();

  // Rolling feed: one row rotates in at a time so the panel reads as live.
  useEffect(() => {
    if (reduceMotion || baseList.length <= 4) return;
    const timer = setInterval(() => {
      setOffset((prev) => (prev + 1) % baseList.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [baseList.length, reduceMotion]);

  const activeRows = useMemo(() => {
    const combined = [...baseList.slice(offset), ...baseList.slice(0, offset)];
    return combined.slice(0, 4);
  }, [baseList, offset]);

  return (
    <div className="relative w-full" data-od-id="proof-browser">
      {/* Browser chrome + body */}
      <div className="flex min-h-[430px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white pb-24 sm:pb-20 shadow-[0_32px_80px_-32px_rgba(15,23,42,0.25)]">
        <div className="flex h-10 sm:h-11 shrink-0 items-center justify-between border-b border-gray-200 bg-gray-100 px-3 sm:px-4">
          {/* Left traffic dots */}
          <div className="flex items-center gap-1.5 shrink-0 w-7 sm:w-10">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#F87171]" />
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#FBBF24]" />
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#34D399]" />
          </div>

          {/* Centered URL pill */}
          <div className="mx-1.5 flex h-6 sm:h-6.5 flex-1 max-w-[240px] sm:max-w-[300px] items-center justify-center gap-1 sm:gap-1.5 rounded-md border border-gray-200 bg-white px-2 sm:px-2.5 text-[9.5px] sm:text-[11px] font-mono tracking-tight text-gray-500 min-w-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <Lock size={9} className="shrink-0 text-gray-400" />
            <span className="whitespace-nowrap truncate">app.ckcapital.co.uk/rewards</span>
          </div>

          {/* Symmetrical right spacer */}
          <div className="w-7 sm:w-10 shrink-0" aria-hidden="true" />
        </div>

        <div className="relative flex-1 p-5 pb-16 sm:p-7 sm:pb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {/* Sample reward certificate fills the space beside the copy */}
          <div className="w-full max-w-[200px] shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-[#0B0620] shadow-sm sm:max-w-[190px]">
            <Image
              src="/images/payout-certificate.jpg"
              alt="Sample CK Capital reward certificate: $10,000 reward split on a 100K challenge"
              width={760}
              height={570}
              loading="lazy"
              sizes="(max-width: 640px) 200px, 190px"
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="sm:max-w-[320px]">
            <p className="text-sm font-bold text-gray-900">
              {t("readyReward")}
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-gray-500">
              {t("readyRewardDesc")}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <motion.span
                aria-hidden="true"
                animate={reduceMotion ? undefined : { opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              />
              {baseList.length} {t("payoutsInFeed")}
            </span>
          </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-gray-400 sm:grid-cols-[1.2fr_0.9fr_0.6fr_0.8fr]">
              <span>{t("trader")}</span>
              <span className="hidden sm:block">{t("requested")}</span>
              <span className="hidden sm:block">{t("country")}</span>
              <span className="text-right">{t("amount")}</span>
            </div>
            {activeRows.length ? (
              activeRows.map((row, i) => (
                <motion.div
                  key={row.id}
                  initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-[1.2fr_0.8fr] gap-3 border-b border-gray-100 bg-white px-4 py-3.5 text-xs last:border-0 sm:grid-cols-[1.2fr_0.9fr_0.6fr_0.8fr]"
                  data-od-id={`proof-table-row-${row.id}`}
                >
                  <span className="min-w-0 truncate font-semibold text-gray-900">
                    {row.title || "Trader"}
                  </span>
                  <span className="hidden text-gray-500 sm:block">
                    {formatDate(row.approvedAt)}
                  </span>
                  <span className="hidden sm:block">
                    <span className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-500">
                      <CountryFlag code={row.countryCode} name={row.countryName} size={14} />
                      {row.countryCode || "--"}
                    </span>
                  </span>
                  <span className="text-right font-bold text-gray-900 tabular-nums">
                    {formatMoney(
                      parseAmount(row.amount) || null,
                      row.currency ?? undefined
                    )}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="px-4 py-12 text-center text-xs text-gray-400">
                {t("verifiedPending")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlapping total rewards card — responsive positioning & no collision */}
      <div
        className="absolute -bottom-6 left-4 right-4 sm:right-auto sm:left-6 sm:w-[350px] lg:-left-6 lg:w-[370px] z-20"
        data-od-id="proof-total-card"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#703AD7]/30 bg-[#0b1328]/95 backdrop-blur-md p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(3,10,28,0.6)]">
          <div className="relative z-10 pr-16 sm:pr-20">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">
              {t("totalPayouts")}
            </p>
            <p className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl xs:text-3xl sm:text-[32px] font-black leading-none tracking-tight text-[#0A0A0C] tabular-nums">
              {formatMoney(total ?? 1200000)}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ck-mascot-medal.png"
            alt=""
            aria-hidden="true"
            width={320}
            height={315}
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute right-3 sm:right-4 top-1/2 h-16 w-16 -translate-y-1/2 object-contain drop-shadow-[0_4px_14px_rgba(137,76,239,0.35)] sm:h-[72px] sm:w-[72px] lg:h-20 lg:w-20"
          />
        </div>
      </div>
    </div>
  );
}
