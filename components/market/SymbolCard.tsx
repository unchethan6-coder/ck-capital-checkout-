"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatChangePct, formatContractSize, formatPrice, formatSpread } from "@/lib/market/format";
import type { SymbolSpec } from "@/lib/market/types";
import { useQuote } from "./useMarket";
import { RowStatus } from "./RowStatus";

/**
 * Phone layout for a single instrument.
 *
 * A six-column table cannot be read at 375px without horizontal scrolling, so
 * narrow viewports get a stacked card with the same data instead.
 */

const FLASH_MS = 600;

function useFlash(value: number | undefined): "up" | "down" | null {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const previous = useRef(value);

  useEffect(() => {
    const before = previous.current;
    previous.current = value;
    if (before === undefined || value === undefined || before === value) return;
    setFlash(value > before ? "up" : "down");
    const timer = setTimeout(() => setFlash(null), FLASH_MS);
    return () => clearTimeout(timer);
  }, [value]);

  return flash;
}

interface SymbolCardProps {
  spec: SymbolSpec;
  starred: boolean;
  onToggleStar: (symbol: string) => void;
  starLabel: string;
  unstarLabel: string;
  labels: { bid: string; ask: string; spread: string; contractSize: string };
}

function SymbolCardInner({ spec, starred, onToggleStar, starLabel, unstarLabel, labels }: SymbolCardProps) {
  const quote = useQuote(spec.symbol);
  const up = (quote?.changePct ?? 0) >= 0;
  const bidFlash = useFlash(quote?.bid);
  const askFlash = useFlash(quote?.ask);
  const notLive = quote !== undefined && quote.status !== "live";
  // Neutral rather than dimmed for closed markets: opacity on the green/red
  // falls below AA contrast, and a stale direction colour is misleading.
  const priceTone = notLive ? "text-muted-foreground" : up ? "text-[#34d399]" : "text-[#f87171]";

  return (
    <li className="rounded-xl border border-[var(--ck-line)] bg-[var(--ck-surface-2)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => onToggleStar(spec.symbol)}
            aria-pressed={starred}
            aria-label={starred ? unstarLabel : starLabel}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-[#E9BE57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
          >
            <Star size={16} className={cn(starred && "fill-[#E9BE57] text-[#E9BE57]")} aria-hidden />
          </button>
          <span className="flex min-w-0 flex-col">
            <span className="flex items-center gap-1.5">
              <span className="truncate font-medium text-foreground">{spec.symbol}</span>
              <RowStatus status={quote?.status} />
            </span>
            <span className="truncate text-xs text-muted-foreground">{spec.name}</span>
          </span>
        </div>
        <span className={cn("shrink-0 text-sm font-medium tabular-nums", priceTone)}>
          {quote ? formatChangePct(quote.changePct) : "—"}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{labels.bid}</dt>
          <dd className={cn("tabular-nums", priceTone, bidFlash === "up" && "ck-tick-up", bidFlash === "down" && "ck-tick-down")}>
            {quote ? formatPrice(quote.bid, spec.digits) : "—"}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{labels.ask}</dt>
          <dd className={cn("tabular-nums", priceTone, askFlash === "up" && "ck-tick-up", askFlash === "down" && "ck-tick-down")}>
            {quote ? formatPrice(quote.ask, spec.digits) : "—"}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{labels.spread}</dt>
          <dd className="tabular-nums text-foreground/90">{quote ? formatSpread(quote.spread, spec.digits) : "—"}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{labels.contractSize}</dt>
          <dd className="tabular-nums text-foreground/90">{formatContractSize(spec.contractSize)}</dd>
        </div>
      </dl>
    </li>
  );
}

export const SymbolCard = memo(SymbolCardInner);
