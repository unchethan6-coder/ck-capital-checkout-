"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
  Check, ChevronDown, ChevronLeft, ChevronRight, Copy, Megaphone, Share2, Star, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsItem, OffersPayload } from "@/lib/offers/types";
import { track } from "./track";
import { copyText } from "./clipboard";

/**
 * Offers and news centre.
 *
 * A launcher sits above the page; opening it shows the current offer with its
 * artwork, regional pricing, coupon and rules. Which items exist, when they
 * start and when they expire are all decided server-side, so an admin can
 * schedule and retire an offer without a deployment.
 */

const SEEN_KEY = "ck:offers:seen";
const LAST_AUTO_KEY = "ck:offers:lastAutoOpen";
/**
 * Frequency cap: the centre opens itself at most once in this window, and
 * never for an item already seen. Anything more is an interruption.
 */
const AUTO_OPEN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
/** Give the page a moment to settle before anything appears over it. */
const AUTO_OPEN_DELAY_MS = 4_000;

function readSeen(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function markSeen(id: string) {
  try {
    const next = Array.from(new Set([...readSeen(), id])).slice(-50);
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(next));
  } catch {
    // Private mode: the cap degrades to per-session, which is acceptable.
  }
}

/** "6d" / "3h" style age, matching how the headline is dated. */
function age(iso: string | null, t: ReturnType<typeof useTranslations<"offersCentre">>): string | null {
  if (!iso) return null;
  const ms = Date.now() - Date.parse(iso);
  if (!Number.isFinite(ms) || ms < 0) return null;
  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) return t("ageDays", { count: days });
  const hours = Math.floor(ms / 3_600_000);
  return hours >= 1 ? t("ageHours", { count: hours }) : t("ageNow");
}

export function OffersCentre() {
  const t = useTranslations("offersCentre");
  const locale = useLocale();

  const [payload, setPayload] = useState<OffersPayload | null>(null);
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const couponRef = useRef<HTMLParagraphElement>(null);

  // Load after mount so the launcher never blocks first paint.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/offers?locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as OffersPayload;
        if (!cancelled) setPayload(data);
      } catch {
        // No offers is a valid state; the launcher simply stays hidden.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const items = useMemo(() => payload?.items ?? [], [payload]);
  const current: NewsItem | undefined = items[index];

  const unseenCount = useMemo(() => {
    if (items.length === 0) return 0;
    const seen = typeof window === "undefined" ? [] : readSeen();
    return items.filter((i) => !seen.includes(i.id)).length;
  }, [items]);

  // Auto-open once per cooldown, and only when something is actually new.
  useEffect(() => {
    if (items.length === 0) return;
    const first = items[0];
    let last = 0;
    try {
      last = Number(window.localStorage.getItem(LAST_AUTO_KEY) ?? 0);
      if (readSeen().includes(first.id)) return;
    } catch {
      return;
    }
    if (Date.now() - last < AUTO_OPEN_COOLDOWN_MS) return;

    const timer = setTimeout(() => {
      setOpen(true);
      setMinimised(false);
      try {
        window.localStorage.setItem(LAST_AUTO_KEY, String(Date.now()));
      } catch {
        // Cap degrades to per-session.
      }
    }, AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [items]);

  // Record the impression and mark seen whenever an item is actually shown.
  useEffect(() => {
    if (!open || minimised || !current) return;
    markSeen(current.id);
    track("offer_impression", { id: current.id, region: payload?.region });
  }, [open, minimised, current, payload?.region]);

  // Escape closes, matching every other dismissible layer on the site.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setMinimised(false);
    if (current) track("offer_dismiss", { id: current.id });
  }, [current]);

  const copyCoupon = useCallback(async () => {
    if (!current?.coupon) return;
    const ok = await copyText(current.coupon);
    track("offer_coupon_copy", { id: current.id, coupon: current.coupon, ok });
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      return;
    }
    // Both clipboard paths refused. Select the code so it can be copied by
    // hand rather than leaving the button looking broken.
    setCopyFailed(true);
    const node = couponRef.current;
    if (node) {
      const range = document.createRange();
      range.selectNodeContents(node);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    setTimeout(() => setCopyFailed(false), 3000);
  }, [current]);

  const share = useCallback(async () => {
    if (!current) return;
    const url = `${window.location.origin}${window.location.pathname}#offer-${current.id}`;
    track("offer_share", { id: current.id });
    try {
      if (navigator.share) await navigator.share({ title: current.title, text: current.summary, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      // Cancelled or unsupported — nothing to recover from.
    }
  }, [current]);

  if (items.length === 0) return null;

  const rows = current ? (current.pricing[payload!.region] ?? []) : [];
  const ctaHref = current
    ? current.coupon && !current.ctaHref.includes("#")
      ? `${current.ctaHref}?coupon=${encodeURIComponent(current.coupon)}`
      : current.ctaHref
    : "#";

  return (
    <>
      {/* Launcher */}
      {(!open || minimised) && (
        <button
          type="button"
          data-od-id="offers-launcher"
          onClick={() => {
            setOpen(true);
            setMinimised(false);
            if (current) track("offer_open", { id: current.id, source: "launcher" });
          }}
          aria-label={t("launcherLabel")}
          className="fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_10px_30px_-8px_rgba(112,58,215,0.8)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] sm:right-6 sm:bottom-6"
        >
          <Megaphone size={20} aria-hidden />
          {unseenCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--background)] bg-[#E9BE57] px-1 text-[10px] font-bold text-[#1A1030]">
              {unseenCount}
            </span>
          )}
        </button>
      )}

      {open && !minimised && current && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
            onClick={close}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-title"
            data-od-id="offers-modal"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-[var(--ck-line)] bg-[var(--ck-surface-2)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:inset-y-auto sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 sm:rounded-2xl"
          >
            {/* Title bar */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--ck-line)] px-3 py-2.5">
              <button
                type="button"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                aria-label={t("previous")}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
              >
                <ChevronLeft size={18} aria-hidden />
              </button>
              <p className="truncate text-sm font-semibold text-foreground">{t("title")}</p>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
                  disabled={index >= items.length - 1}
                  aria-label={t("next")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
                >
                  <ChevronRight size={18} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={share}
                  aria-label={t("share")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
                >
                  <Share2 size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setMinimised(true)}
                  aria-label={t("minimise")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
                >
                  <ChevronDown size={18} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t("close")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* Artwork */}
              {current.image && (
                <div className="relative aspect-[16/9] w-full bg-[var(--ck-surface)]">
                  <Image src={current.image.src} alt={current.image.alt} fill unoptimized className="object-cover" />
                  {current.rating !== null && <RatingBadge rating={current.rating} label={t("rating")} />}
                </div>
              )}

              <div className="p-5">
                {current.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {current.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-[var(--primary)]/15 px-2 py-0.5 text-[11px] font-semibold text-[#A98BFF]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 id="offer-title" className="text-xl font-bold text-foreground">{current.title}</h2>

                <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{t("sharedBy", { author: current.author })}</span>
                  {age(current.startsAt, t) && <><span aria-hidden>·</span><span>{age(current.startsAt, t)}</span></>}
                  {!current.image && current.rating !== null && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[#E9BE57]">
                      <Star size={12} className="fill-[#E9BE57]" aria-hidden />
                      {current.rating.toFixed(1)}
                    </span>
                  )}
                </p>

                {current.summary && <p className="mt-4 text-sm leading-relaxed text-foreground/85">{current.summary}</p>}
                {current.body.map((para, i) => (
                  <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">{para}</p>
                ))}

                {current.endsAt ? (
                  <p className="mt-4 text-xs font-medium text-[#E9BE57]">
                    {t("endsAt", { date: new Date(current.endsAt).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" }) })}
                  </p>
                ) : current.coupon ? (
                  <p className="mt-4 text-xs font-medium text-[#E9BE57]">{t("limitedTime")}</p>
                ) : null}

                {/* Coupon */}
                {current.coupon && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-[var(--primary)]/50 bg-[var(--primary)]/10 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{t("couponLabel")}</p>
                      <p ref={couponRef} className="truncate font-mono text-base font-bold text-[#A98BFF]">{current.coupon}</p>
                    </div>
                    <button
                      type="button"
                      onClick={copyCoupon}
                      data-od-id="offers-copy-coupon"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--primary)] bg-[var(--primary)]/20 px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-[var(--primary)]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                    >
                      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
                      {copied ? t("copied") : copyFailed ? t("copyManual") : t("copy")}
                    </button>
                  </div>
                )}

                {/* Regional pricing */}
                {rows.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-bold text-foreground">
                      {payload!.region === "usa" ? t("pricingUsa") : t("pricingGlobal")}
                    </h3>
                    <table className="mt-2 w-full border-collapse text-sm">
                      <caption className="sr-only">{t("pricingCaption")}</caption>
                      <thead>
                        <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
                          <th scope="col" className="py-1.5 text-left font-semibold">{t("plan")}</th>
                          <th scope="col" className="py-1.5 text-right font-semibold">{t("wasPrice")}</th>
                          <th scope="col" className="py-1.5 text-right font-semibold">{t("nowPrice")}</th>
                          <th scope="col" className="py-1.5 text-right font-semibold">{t("saving")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.plan} className="border-t border-[var(--ck-line)]">
                            <th scope="row" className="py-2 text-left font-medium text-foreground">{row.plan}</th>
                            <td className="py-2 text-right text-muted-foreground tabular-nums line-through">{row.original}</td>
                            <td className="py-2 text-right font-bold text-foreground tabular-nums">{row.discounted}</td>
                            <td className="py-2 text-right">
                              <span className="rounded bg-[#34d399]/15 px-1.5 py-0.5 text-[11px] font-bold text-[#34d399] tabular-nums">
                                −{row.savingPct}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Rules */}
                {current.rules.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-bold text-foreground">{t("importantRules")}</h3>
                    <ul className="mt-2 space-y-1.5">
                      {current.rules.map((rule, i) => (
                        <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                          <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--primary)]" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0 border-t border-[var(--ck-line)] p-4">
              <a
                href={ctaHref}
                data-od-id="offers-cta"
                onClick={() => track("offer_cta_click", { id: current.id, href: ctaHref, region: payload!.region })}
                className="flex w-full items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              >
                {current.ctaLabel || t("joinNow")}
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function RatingBadge({ rating, label }: { rating: number; label: string }) {
  return (
    <span
      aria-label={`${label}: ${rating.toFixed(1)}`}
      className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-[var(--ck-surface)]/90 px-2 py-1 text-xs font-bold text-foreground backdrop-blur-sm"
    >
      <Star size={12} className="fill-[#34d399] text-[#34d399]" aria-hidden />
      {rating.toFixed(1)}
    </span>
  );
}
