"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { QuoteStatus } from "@/lib/market/types";

/**
 * Per-row feed badge.
 *
 * A row whose market is closed, or whose feed we have lost, is still showing a
 * price — so it has to say which. Live rows render nothing, keeping the table
 * quiet in the normal case.
 */
export function RowStatus({ status, className }: { status: QuoteStatus | undefined; className?: string }) {
  const t = useTranslations("symbols");
  if (!status || status === "live") return null;

  const closed = status === "stale";
  const label = closed ? t("rowClosed") : t("rowNoFeed");
  const title = closed ? t("rowClosedTitle") : t("rowNoFeedTitle");

  return (
    <span
      title={title}
      className={cn(
        "inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] leading-none font-medium tracking-wide uppercase",
        closed
          ? "bg-white/[0.06] text-muted-foreground"
          : "bg-[#E9BE57]/15 text-[#E9BE57]",
        className
      )}
    >
      {/* The visible label is an abbreviation; screen readers get the full text. */}
      <span aria-hidden>{label}</span>
      <span className="sr-only">{title}</span>
    </span>
  );
}
