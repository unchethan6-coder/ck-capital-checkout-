"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, Copy, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsItem, OfferRegion } from "@/lib/offers/types";
import { track } from "./track";
import { copyText } from "./clipboard";

/**
 * One offer or news item, rendered in full.
 *
 * Kept separate from any particular launcher so the same markup serves the
 * support widget's news tab and anywhere else an offer needs showing.
 */

interface OfferDetailProps {
  item: NewsItem;
  region: OfferRegion;
  index: number;
  total: number;
  onIndexChange: (next: number) => void;
}

export function OfferDetail({ item, region, index, total, onIndexChange }: OfferDetailProps) {
  const t = useTranslations("offersCentre");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const couponRef = useRef<HTMLParagraphElement>(null);

  const rows = item.pricing[region] ?? [];
  const ctaHref =
    item.coupon && !item.ctaHref.includes("#")
      ? `${item.ctaHref}?coupon=${encodeURIComponent(item.coupon)}`
      : item.ctaHref;

  const copyCoupon = useCallback(async () => {
    if (!item.coupon) return;
    const ok = await copyText(item.coupon);
    track("offer_coupon_copy", { id: item.id, coupon: item.coupon, ok });
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      return;
    }
    // Clipboard refused — select the code so it can still be copied by hand.
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
  }, [item]);

  return (
    <article>
      {item.image && (
        <div className="relative aspect-[16/9] w-full bg-[var(--ck-surface)]">
          <Image src={item.image.src} alt={item.image.alt} fill unoptimized className="object-cover" />
        </div>
      )}

      <div className="p-4">
        {total > 1 && (
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onIndexChange(Math.max(0, index - 1))}
              disabled={index === 0}
              aria-label={t("previous")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
            <span className="text-xs text-muted-foreground tabular-nums">{index + 1} / {total}</span>
            <button
              type="button"
              onClick={() => onIndexChange(Math.min(total - 1, index + 1))}
              disabled={index >= total - 1}
              aria-label={t("next")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
            >
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        )}

        {item.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-[var(--primary)]/15 px-2 py-0.5 text-[11px] font-semibold text-[#A98BFF]">{tag}</span>
            ))}
          </div>
        )}

        <h2 className="text-base font-bold text-foreground">{item.title}</h2>

        <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>{t("sharedBy", { author: item.author })}</span>
          {item.rating !== null && (
            <span className="ml-auto inline-flex items-center gap-1 text-[#E9BE57]">
              <Star size={11} className="fill-[#E9BE57]" aria-hidden />
              {item.rating.toFixed(1)}
            </span>
          )}
        </p>

        {item.summary && <p className="mt-3 text-sm leading-relaxed text-foreground/85">{item.summary}</p>}
        {item.body.map((para, i) => (
          <p key={i} className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{para}</p>
        ))}

        {item.endsAt ? (
          <p className="mt-3 text-xs font-medium text-[#E9BE57]">
            {t("endsAt", { date: new Date(item.endsAt).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" }) })}
          </p>
        ) : item.coupon ? (
          <p className="mt-3 text-xs font-medium text-[#E9BE57]">{t("limitedTime")}</p>
        ) : null}

        {item.coupon && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-[var(--primary)]/50 bg-[var(--primary)]/10 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{t("couponLabel")}</p>
              <p ref={couponRef} className="truncate font-mono text-base font-bold text-[#A98BFF]">{item.coupon}</p>
            </div>
            <button
              type="button"
              onClick={copyCoupon}
              data-od-id="offers-copy-coupon"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--primary)] bg-[var(--primary)]/20 px-2.5 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-[var(--primary)]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
              {copied ? t("copied") : copyFailed ? t("copyManual") : t("copy")}
            </button>
          </div>
        )}

        {rows.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-foreground">
              {region === "usa" ? t("pricingUsa") : t("pricingGlobal")}
            </h3>
            <table className="mt-1.5 w-full border-collapse text-[13px]">
              <caption className="sr-only">{t("pricingCaption")}</caption>
              <thead>
                <tr className="text-[10px] tracking-wider text-muted-foreground uppercase">
                  <th scope="col" className="py-1.5 text-left font-semibold">{t("plan")}</th>
                  <th scope="col" className="py-1.5 text-right font-semibold">{t("wasPrice")}</th>
                  <th scope="col" className="py-1.5 text-right font-semibold">{t("nowPrice")}</th>
                  <th scope="col" className="py-1.5 text-right font-semibold">{t("saving")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.plan} className="border-t border-[var(--ck-line)]">
                    <th scope="row" className="py-1.5 text-left font-medium text-foreground">{row.plan}</th>
                    <td className="py-1.5 text-right text-muted-foreground tabular-nums line-through">{row.original}</td>
                    <td className="py-1.5 text-right font-bold text-foreground tabular-nums">{row.discounted}</td>
                    <td className="py-1.5 text-right">
                      <span className="rounded bg-[#34d399]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#34d399] tabular-nums">−{row.savingPct}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {item.rules.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-foreground">{t("importantRules")}</h3>
            <ul className="mt-1.5 space-y-1.5">
              {item.rules.map((rule, i) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--primary)]" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        )}

        <a
          href={ctaHref}
          data-od-id="offers-cta"
          onClick={() => track("offer_cta_click", { id: item.id, href: ctaHref, region })}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
        >
          {item.ctaLabel || t("joinNow")}
        </a>
      </div>
    </article>
  );
}
