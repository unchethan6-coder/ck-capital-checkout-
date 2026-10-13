"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Home, LifeBuoy,
  Megaphone, Search, X, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ALL_FAQ_KEYS, FAQ_COLLECTIONS, SUGGESTED_FAQ_KEYS } from "@/lib/support/faq";
import type { NewsItem, OffersPayload } from "@/lib/offers/types";
import { OfferDetail } from "@/components/offers/OfferDetail";
import { track } from "@/components/offers/track";

/**
 * Support widget.
 *
 * Spatially enlarged, rating-free support panel with 3 primary tabs:
 * - Home (instant answers + direct Discord support escalation)
 * - Offers & Promos (CMS-backed promotional discounts)
 * - Help Centre (full CMS FAQs with live search)
 */

export const DISCORD_SUPPORT_URL = "https://discord.com/invite/hGSVx9CmS2";

type Tab = "home" | "news" | "help";

const TABS: { id: Tab; icon: typeof Home; labelKey: string }[] = [
  { id: "home", icon: Home, labelKey: "home" },
  { id: "news", icon: Megaphone, labelKey: "news" },
  { id: "help", icon: LifeBuoy, labelKey: "help" },
];

export interface WidgetFaq {
  id: number | string;
  question: string;
  answer: string;
  scope?: string | null;
  sortOrder?: number | null;
}

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function SupportWidget() {
  const t = useTranslations("supportWidget");
  const tFaq = useTranslations("faq");
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | number | null>(null);
  const [offers, setOffers] = useState<OffersPayload | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);
  const [cmsFaqs, setCmsFaqs] = useState<WidgetFaq[]>([]);

  // Fetch CMS promos/offers lazily on open
  useEffect(() => {
    if (!open || offers) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/offers?locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
        if (res.ok && !cancelled) setOffers((await res.json()) as OffersPayload);
      } catch {
        // Fallback handled by server payload
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, offers, locale]);

  // Fetch CMS FAQs lazily on open
  useEffect(() => {
    if (!open || cmsFaqs.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/faqs`, { cache: "no-store" });
        if (res.ok && !cancelled) {
          const json = await res.json();
          if (Array.isArray(json?.data) && json.data.length > 0) {
            setCmsFaqs(json.data);
          }
        }
      } catch {
        // Fallback to local translation keys below
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, cmsFaqs.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Support opening widget from external triggers or top bar search
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: Tab; faqId?: string | number }>;
      setOpen(true);
      if (customEvent.detail?.tab) setTab(customEvent.detail.tab);
      if (customEvent.detail?.faqId !== undefined) {
        setTab("help");
        setOpenFaq(customEvent.detail.faqId);
      }
    };
    window.addEventListener("open-support-widget", handleOpen);
    return () => window.removeEventListener("open-support-widget", handleOpen);
  }, []);

  // Static FAQ fallback helper if CMS hasn't loaded or is offline
  const fallbackFaqText = useCallback(
    (key: string, part: "q" | "a") => tFaq(`items.${key}.${part}` as "items.payoutTime.q"),
    [tFaq]
  );

  // Active FAQ list: prefer CMS FAQs, else fallback to bundled translation items
  const allFaqs: WidgetFaq[] = useMemo(() => {
    if (cmsFaqs.length > 0) return cmsFaqs;
    return ALL_FAQ_KEYS.map((k) => ({
      id: k,
      question: fallbackFaqText(k, "q"),
      answer: fallbackFaqText(k, "a"),
    }));
  }, [cmsFaqs, fallbackFaqText]);

  // Search filtered FAQs with substring and token matching
  const searchResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return allFaqs;
    const tokens = needle.split(/\s+/).filter(Boolean);
    return allFaqs.filter((f) => {
      const q = f.question.toLowerCase();
      const a = f.answer.toLowerCase();
      if (q.includes(needle) || a.includes(needle)) return true;
      if (tokens.length > 1) {
        return tokens.every((t) => q.includes(t) || a.includes(t));
      }
      return false;
    });
  }, [query, allFaqs]);

  const openWidget = () => {
    setOpen(true);
    track("offer_open", { source: "support_widget" });
  };

  const items: NewsItem[] = offers?.items ?? [];
  const liveOffer = items.find((i) => i.coupon) ?? items[0] ?? null;

  return (
    <>
      {!open && (
        <button
          type="button"
          data-od-id="support-launcher"
          onClick={openWidget}
          aria-label={t("launcher")}
          className="fixed right-3 bottom-3 z-40 flex h-[70px] w-[70px] sm:h-[76px] sm:w-[76px] items-center justify-center rounded-2xl transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] sm:right-6 sm:bottom-6 shadow-2xl"
        >
          <Image src="/ck-support-mark.svg" alt="" width={76} height={76} priority className="h-full w-full drop-shadow-xl" />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t("panel")}
          data-od-id="support-panel"
          className="fixed inset-0 z-50 flex flex-col overflow-hidden border-[var(--ck-line)] bg-[var(--ck-surface-2)] sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(48rem,calc(100dvh-3rem))] sm:w-[29rem] md:w-[31rem] sm:rounded-2xl sm:border sm:shadow-[0_35px_90px_-20px_rgba(0,0,0,0.92)] transition-all"
        >
          {tab === "home" ? (
            <HomeHeader t={t} onClose={() => setOpen(false)} />
          ) : (
            <PanelHeader
              title={tab === "news" ? "Offers & Discounts" : "Help & FAQs"}
              onClose={() => setOpen(false)}
              onBack={() => setTab("home")}
              backLabel={t("back")}
              closeLabel={t("close")}
            />
          )}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === "home" && (
              <HomePanel
                t={t}
                faqs={allFaqs}
                openFaq={openFaq}
                setOpenFaq={setOpenFaq}
                liveOffer={liveOffer}
                onSeeOffer={() => setTab("news")}
                onSearch={() => setTab("help")}
              />
            )}

            {tab === "news" && (
              <NewsPanel
                items={items}
                index={newsIndex}
                setIndex={setNewsIndex}
                region={offers?.region ?? "global"}
                emptyLabel={t("noNews")}
              />
            )}

            {tab === "help" && (
              <HelpPanel
                t={t}
                query={query}
                setQuery={setQuery}
                results={searchResults}
                openFaq={openFaq}
                setOpenFaq={setOpenFaq}
              />
            )}
          </div>

          {/* Tab bar (clean 3-tab layout: Home, Offers, Help) */}
          <nav aria-label={t("panel")} className="flex shrink-0 border-t border-[var(--ck-line)] bg-[var(--ck-surface)] px-2 py-1">
            {TABS.map(({ id, icon: Icon, labelKey }) => {
              const active = tab === id;
              const label = id === "news" ? "Offers" : id === "help" ? "Help & FAQs" : t(labelKey as "home");
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1.5 py-3 text-[12px] font-medium transition-colors",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]",
                    active ? "text-[#A98BFF] font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={20} aria-hidden />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

/* ───────────────────────────────────────────────────────────── headers */

function HomeHeader({ t, onClose }: { t: ReturnType<typeof useTranslations<"supportWidget">>; onClose: () => void }) {
  return (
    <div className="relative shrink-0 overflow-hidden px-6 pt-6 pb-9" style={{ background: "var(--ck-brand-gradient)" }}>
      <div className="flex items-start justify-between">
        <Image src="/ck-support-mark.svg" alt="" width={60} height={60} className="-m-1 h-14 w-14 drop-shadow-md" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/15 text-white/90 backdrop-blur-md transition-colors hover:bg-black/30 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <X size={20} aria-hidden />
          </button>
        </div>
      </div>
      <p className="mt-5 text-2xl font-bold tracking-tight text-white/80">{t("greeting")}</p>
      <p className="text-2xl font-extrabold tracking-tight text-white">{t("greetingSub")}</p>
    </div>
  );
}

function PanelHeader({
  title, onClose, onBack, backLabel, closeLabel,
}: { title: string; onClose: () => void; onBack?: () => void; backLabel: string; closeLabel: string }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--ck-line)] px-4 py-3.5 bg-[var(--ck-surface)]">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label={backLabel} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]">
          <ChevronLeft size={20} aria-hidden />
        </button>
      ) : (
        <span className="h-9 w-9" aria-hidden />
      )}
      <p className="truncate text-base font-semibold text-foreground">{title}</p>
      <button type="button" onClick={onClose} aria-label={closeLabel} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]">
        <X size={20} aria-hidden />
      </button>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── panels */

function FaqRow({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--ck-line)] last:border-0 py-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-3 text-left text-[14px] font-medium text-foreground/95 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]"
      >
        <span className="min-w-0 pr-2">{q}</span>
        <ChevronRight size={16} aria-hidden className={cn("shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-90 text-[#A98BFF]")} />
      </button>
      {open && (
        <p className="pb-3 text-[13.5px] leading-relaxed text-slate-300 font-normal border-t border-[var(--ck-line)]/40 pt-2.5 mt-1">
          {a}
        </p>
      )}
    </div>
  );
}

function HomePanel({
  t, faqs, openFaq, setOpenFaq, liveOffer, onSeeOffer, onSearch,
}: {
  t: ReturnType<typeof useTranslations<"supportWidget">>;
  faqs: WidgetFaq[];
  openFaq: string | number | null;
  setOpenFaq: (k: string | number | null) => void;
  liveOffer: NewsItem | null;
  onSeeOffer: () => void;
  onSearch: () => void;
}) {
  const quickFaqs = faqs.slice(0, 4);

  return (
    <div className="-mt-5 space-y-3.5 p-4 sm:p-5">
      {/* Primary Support Action: Redirect to Discord for instant live support */}
      <a
        href={DISCORD_SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-od-id="support-discord-redirect"
        className="group relative flex items-center justify-between gap-3.5 rounded-2xl border border-[#5865F2]/40 bg-[#5865F2]/15 p-4 transition-all hover:bg-[#5865F2]/25 hover:border-[#5865F2] hover:shadow-[0_0_30px_rgba(88,101,242,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#5865F2] text-white shadow-md shadow-[#5865F2]/40 group-hover:scale-105 transition-transform">
            <DiscordIcon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7983F5]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              24/7 Live Support
            </span>
            <span className="block text-[15px] font-bold text-white group-hover:text-[#A98BFF] transition-colors">
              Chat with Support on Discord
            </span>
            <span className="block text-[12px] text-slate-300 truncate">
              Instant responses from official staff & mods
            </span>
          </div>
        </div>
        <ExternalLink size={18} aria-hidden className="shrink-0 text-[#7983F5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>

      {/* Live Offer / Promo discount (driven from CMS) */}
      {liveOffer && (
        <button
          type="button"
          onClick={onSeeOffer}
          data-od-id="support-offer-card"
          className="group w-full rounded-2xl border border-[var(--primary)]/40 bg-[var(--primary)]/10 p-4 text-left transition-all hover:bg-[var(--primary)]/15 hover:border-[var(--primary)]/70 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--primary)]/20 text-[11px] font-bold tracking-wide text-[#A98BFF] uppercase border border-[var(--primary)]/30">
              Live Promo
            </span>
            {liveOffer.coupon && (
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-mono font-bold text-white tracking-wider">
                CODE: {liveOffer.coupon}
              </span>
            )}
          </div>
          <span className="mt-2 block text-[15px] font-bold text-foreground group-hover:text-white transition-colors">{liveOffer.title}</span>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{liveOffer.summary}</p>
          <span className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-bold text-[#A98BFF] group-hover:translate-x-0.5 transition-transform">
            View offer details & redeem <ChevronRight size={14} aria-hidden />
          </span>
        </button>
      )}

      {/* Quick answers (from Strapi CMS) */}
      <div className="rounded-2xl border border-[var(--ck-line)] bg-[var(--ck-surface)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
            Frequently Asked Questions
          </p>
          <button
            type="button"
            onClick={onSearch}
            className="text-[12px] font-semibold text-[#A98BFF] hover:underline"
          >
            View all
          </button>
        </div>

        <button
          type="button"
          onClick={onSearch}
          className="flex w-full items-center gap-2.5 rounded-xl border border-[var(--ck-line)] bg-[var(--ck-surface-2)] px-3.5 py-2.5 text-left text-[13.5px] text-muted-foreground transition-colors hover:text-foreground hover:border-white/20 focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
        >
          <Search size={15} aria-hidden />
          Search FAQs & trading rules...
        </button>

        <div className="mt-2 divide-y divide-[var(--ck-line)]/50">
          {quickFaqs.map((faq) => (
            <FaqRow
              key={faq.id}
              q={faq.question}
              a={faq.answer}
              open={openFaq === faq.id}
              onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsPanel({
  items, index, setIndex, region, emptyLabel,
}: {
  items: NewsItem[];
  index: number;
  setIndex: (i: number) => void;
  region: OffersPayload["region"];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="px-4 py-16 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  const safe = Math.min(index, items.length - 1);
  return (
    <div className="p-1 sm:p-2">
      <OfferDetail
        item={items[safe]}
        region={region}
        index={safe}
        total={items.length}
        onIndexChange={setIndex}
      />
    </div>
  );
}

function HelpPanel({
  t, query, setQuery, results, openFaq, setOpenFaq,
}: {
  t: ReturnType<typeof useTranslations<"supportWidget">>;
  query: string;
  setQuery: (v: string) => void;
  results: WidgetFaq[];
  openFaq: string | number | null;
  setOpenFaq: (k: string | number | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 sm:p-5 space-y-4">
      <div className="relative">
        <Search size={16} aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search CMS help articles, rules, and questions..."
          aria-label={t("searchHelp")}
          className="w-full rounded-xl border border-[var(--ck-line)] bg-[var(--ck-surface)] py-2.5 pr-4 pl-10 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
        />
      </div>

      <div className="rounded-2xl border border-[var(--ck-line)] bg-[var(--ck-surface)] p-4">
        <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {query.trim() ? `Search Results (${results.length})` : `All Questions (${results.length})`}
        </p>

        {results.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No questions found matching &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-xs text-muted-foreground">Try searching for keywords like drawdown, payout, or EA.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--ck-line)]/50">
            {results.map((faq) => (
              <FaqRow
                key={faq.id}
                q={faq.question}
                a={faq.answer}
                open={openFaq === faq.id}
                onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Escalation to Discord */}
      <div className="rounded-2xl border border-[#5865F2]/40 bg-[#5865F2]/10 p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-bold text-white">Still have questions?</p>
          <p className="text-xs text-slate-300">Join our Discord for instant 1-on-1 support.</p>
        </div>
        <a
          href={DISCORD_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5865F2] text-xs font-bold text-white hover:bg-[#4752c4] transition-colors shadow-md shadow-[#5865F2]/30 shrink-0"
        >
          <DiscordIcon className="w-3.5 h-3.5" />
          Join Discord
        </a>
      </div>
    </div>
  );
}
