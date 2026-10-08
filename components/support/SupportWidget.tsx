"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Home, LifeBuoy,
  MessageSquare, Megaphone, Search, Send, Star, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CKEmblem } from "@/components/brand/CKLogo";
import { ALL_FAQ_KEYS, FAQ_COLLECTIONS, SUGGESTED_FAQ_KEYS, SUPPORT_URL } from "@/lib/support/faq";
import type { NewsItem, OffersPayload } from "@/lib/offers/types";
import { OfferDetail } from "@/components/offers/OfferDetail";
import { track } from "@/components/offers/track";

/**
 * Support widget.
 *
 * One launcher opens a panel with four tabs: a home screen, a route to a
 * human, the current offers, and the help centre. Answers are rendered from
 * the site's own FAQ translations rather than generated, so the widget cannot
 * state a rule CK has not published.
 */

type Tab = "home" | "messages" | "news" | "help";

const TABS: { id: Tab; icon: typeof Home }[] = [
  { id: "home", icon: Home },
  { id: "messages", icon: MessageSquare },
  { id: "news", icon: Megaphone },
  { id: "help", icon: LifeBuoy },
];

const TRUSTPILOT_RATING = 4.5;

export function SupportWidget() {
  const t = useTranslations("supportWidget");
  const tFaq = useTranslations("faq");
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [collection, setCollection] = useState<string | null>(null);
  const [offers, setOffers] = useState<OffersPayload | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);

  // Offers load lazily: the widget must not delay the page it sits on.
  useEffect(() => {
    if (!open || offers) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/offers?locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
        if (res.ok && !cancelled) setOffers((await res.json()) as OffersPayload);
      } catch {
        // The news tab shows its empty state.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, offers, locale]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const faqText = useCallback(
    (key: string, part: "q" | "a") => tFaq(`items.${key}.${part}` as "items.payoutTime.q"),
    [tFaq]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return ALL_FAQ_KEYS.filter(
      (k) => faqText(k, "q").toLowerCase().includes(needle) || faqText(k, "a").toLowerCase().includes(needle)
    );
  }, [query, faqText]);

  const openWidget = () => {
    setOpen(true);
    track("offer_open", { source: "support_widget" });
  };

  const items: NewsItem[] = offers?.items ?? [];
  const liveOffer = items.find((i) => i.coupon) ?? null;

  return (
    <>
      {!open && (
        <button
          type="button"
          data-od-id="support-launcher"
          onClick={openWidget}
          aria-label={t("launcher")}
          className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ck-surface-2)] ring-1 ring-[var(--ck-line)] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] sm:right-6 sm:bottom-6"
        >
          <CKEmblem className="h-7 w-auto aspect-[524/476]" fill="gradient" />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t("panel")}
          data-od-id="support-panel"
          className="fixed inset-0 z-50 flex flex-col overflow-hidden border-[var(--ck-line)] bg-[var(--ck-surface-2)] sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(42rem,calc(100dvh-6rem))] sm:w-[25rem] sm:rounded-2xl sm:border sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
        >
          {tab === "home" ? (
            <HomeHeader t={t} onClose={() => setOpen(false)} />
          ) : (
            <PanelHeader
              title={t(tab)}
              onClose={() => setOpen(false)}
              onBack={collection ? () => setCollection(null) : undefined}
              backLabel={t("back")}
              closeLabel={t("close")}
            />
          )}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === "home" && (
              <HomePanel
                t={t}
                faqText={faqText}
                openFaq={openFaq}
                setOpenFaq={setOpenFaq}
                liveOffer={liveOffer}
                onSeeOffer={() => setTab("news")}
                onSearch={() => setTab("help")}
              />
            )}

            {tab === "messages" && <MessagesPanel t={t} />}

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
                faqText={faqText}
                query={query}
                setQuery={setQuery}
                results={results}
                openFaq={openFaq}
                setOpenFaq={setOpenFaq}
                collection={collection}
                setCollection={setCollection}
              />
            )}
          </div>

          {/* Tab bar */}
          <nav aria-label={t("panel")} className="flex shrink-0 border-t border-[var(--ck-line)] bg-[var(--ck-surface)]">
            {TABS.map(({ id, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    setTab(id);
                    setCollection(null);
                  }}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]",
                    active ? "text-[#A98BFF]" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={18} aria-hidden />
                  {t(id)}
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
    <div className="relative shrink-0 overflow-hidden px-5 pt-5 pb-8" style={{ background: "var(--ck-brand-gradient)" }}>
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 shadow-sm">
          {/* 28px: below about this size the gaps between the emblem's bars
              fall under a pixel and the mark reads as a solid blob. */}
          <CKEmblem className="h-7 w-auto aspect-[524/476]" fill="gradient" />
        </span>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-bold text-[#1A1030]"
            aria-label={`${t("ratingLabel")}: ${TRUSTPILOT_RATING}`}
          >
            <Star size={11} className="fill-[#00b67a] text-[#00b67a]" aria-hidden />
            {TRUSTPILOT_RATING}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
      </div>
      <p className="mt-6 text-xl font-bold text-white/70">{t("greeting")}</p>
      <p className="text-xl font-bold text-white">{t("greetingSub")}</p>
    </div>
  );
}

function PanelHeader({
  title, onClose, onBack, backLabel, closeLabel,
}: { title: string; onClose: () => void; onBack?: () => void; backLabel: string; closeLabel: string }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--ck-line)] px-3 py-3">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label={backLabel} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]">
          <ChevronLeft size={18} aria-hidden />
        </button>
      ) : (
        <span className="h-8 w-8" aria-hidden />
      )}
      <p className="truncate text-sm font-semibold text-foreground">{title}</p>
      <button type="button" onClick={onClose} aria-label={closeLabel} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]">
        <X size={18} aria-hidden />
      </button>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── panels */

type FaqText = (key: string, part: "q" | "a") => string;

function FaqRow({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--ck-line)] last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm text-foreground/90 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]"
      >
        <span className="min-w-0">{q}</span>
        <ChevronRight size={15} aria-hidden className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-90")} />
      </button>
      {open && <p className="pb-3 text-[13px] leading-relaxed text-muted-foreground">{a}</p>}
    </div>
  );
}

function HomePanel({
  t, faqText, openFaq, setOpenFaq, liveOffer, onSeeOffer, onSearch,
}: {
  t: ReturnType<typeof useTranslations<"supportWidget">>;
  faqText: FaqText;
  openFaq: string | null;
  setOpenFaq: (k: string | null) => void;
  liveOffer: NewsItem | null;
  onSeeOffer: () => void;
  onSearch: () => void;
}) {
  return (
    <div className="-mt-5 space-y-3 p-4">
      {/* Recent message */}
      <div className="rounded-xl border border-[var(--ck-line)] bg-[var(--ck-surface)] p-3">
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{t("recentTitle")}</p>
        <div className="mt-2 flex items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/15">
            <CKEmblem className="h-4 w-auto aspect-[524/476]" fill="gradient" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{t("recentFrom")}</p>
            <p className="truncate text-xs text-muted-foreground">{t("recentPreview")}</p>
          </div>
        </div>
      </div>

      <a
        href={SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-od-id="support-send-message"
        className="flex items-center justify-between gap-3 rounded-xl border border-[var(--ck-line)] bg-[var(--ck-surface)] p-3 transition-colors hover:border-[var(--primary)]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">{t("sendMessage")}</span>
          <span className="block text-xs text-muted-foreground">{t("sendMessageSub")}</span>
        </span>
        <Send size={16} aria-hidden className="shrink-0 text-[#A98BFF]" />
      </a>

      {/* Quick answers */}
      <div className="rounded-xl border border-[var(--ck-line)] bg-[var(--ck-surface)] p-3">
        <button
          type="button"
          onClick={onSearch}
          className="flex w-full items-center gap-2 rounded-lg border border-[var(--ck-line)] bg-[var(--ck-surface-2)] px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
        >
          <Search size={14} aria-hidden />
          {t("searchHelp")}
        </button>
        <div className="mt-1">
          {SUGGESTED_FAQ_KEYS.map((key) => (
            <FaqRow
              key={key}
              q={faqText(key, "q")}
              a={faqText(key, "a")}
              open={openFaq === key}
              onToggle={() => setOpenFaq(openFaq === key ? null : key)}
            />
          ))}
        </div>
      </div>

      {/* Live offer */}
      {liveOffer && (
        <button
          type="button"
          onClick={onSeeOffer}
          data-od-id="support-offer-card"
          className="w-full rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/10 p-3 text-left transition-colors hover:bg-[var(--primary)]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
        >
          <span className="text-[11px] font-semibold tracking-wide text-[#A98BFF] uppercase">{t("liveOffer")}</span>
          <span className="mt-1 block text-sm font-semibold text-foreground">{liveOffer.title}</span>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#A98BFF]">
            {t("viewOffer")} <ChevronRight size={13} aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}

function MessagesPanel({ t }: { t: ReturnType<typeof useTranslations<"supportWidget">> }) {
  return (
    <div className="space-y-3 p-4">
      <a
        href={SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-od-id="support-escalate"
        className="flex items-center justify-between gap-3 rounded-xl border border-[var(--ck-line)] bg-[var(--ck-surface)] p-4 transition-colors hover:border-[var(--primary)]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">{t("talkToHuman")}</span>
          <span className="block text-xs text-muted-foreground">{t("talkToHumanSub")}</span>
        </span>
        <ExternalLink size={16} aria-hidden className="shrink-0 text-[#A98BFF]" />
      </a>
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
    return <p className="px-4 py-14 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  const safe = Math.min(index, items.length - 1);
  return (
    <OfferDetail
      item={items[safe]}
      region={region}
      index={safe}
      total={items.length}
      onIndexChange={setIndex}
    />
  );
}

function HelpPanel({
  t, faqText, query, setQuery, results, openFaq, setOpenFaq, collection, setCollection,
}: {
  t: ReturnType<typeof useTranslations<"supportWidget">>;
  faqText: FaqText;
  query: string;
  setQuery: (v: string) => void;
  results: string[];
  openFaq: string | null;
  setOpenFaq: (k: string | null) => void;
  collection: string | null;
  setCollection: (id: string | null) => void;
}) {
  const active = FAQ_COLLECTIONS.find((c) => c.id === collection);

  return (
    <div className="p-4">
      <div className="relative">
        <Search size={14} aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchHelp")}
          aria-label={t("searchHelp")}
          className="w-full rounded-lg border border-[var(--ck-line)] bg-[var(--ck-surface)] py-2 pr-3 pl-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
        />
      </div>

      {query.trim() ? (
        <div className="mt-3">
          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{t("noResults", { query })}</p>
          ) : (
            results.map((key) => (
              <FaqRow key={key} q={faqText(key, "q")} a={faqText(key, "a")} open={openFaq === key} onToggle={() => setOpenFaq(openFaq === key ? null : key)} />
            ))
          )}
        </div>
      ) : active ? (
        <div className="mt-3">
          {active.entries.map(({ key }) => (
            <FaqRow key={key} q={faqText(key, "q")} a={faqText(key, "a")} open={openFaq === key} onToggle={() => setOpenFaq(openFaq === key ? null : key)} />
          ))}
        </div>
      ) : (
        <>
          <p className="mt-3 text-xs text-muted-foreground">{t("helpIntro")}</p>
          <p className="mt-3 text-sm font-semibold text-foreground">
            {t("collectionsCount", { count: FAQ_COLLECTIONS.length })}
          </p>
          <ul className="mt-1">
            {FAQ_COLLECTIONS.map((c) => (
              <li key={c.id} className="border-b border-[var(--ck-line)] last:border-0">
                <button
                  type="button"
                  onClick={() => setCollection(c.id)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      {t(`collections.${c.id}` as "collections.payouts")}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {t("articlesCount", { count: c.entries.length })}
                    </span>
                  </span>
                  <ChevronRight size={15} aria-hidden className="shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
