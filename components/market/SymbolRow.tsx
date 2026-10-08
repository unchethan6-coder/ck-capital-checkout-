"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatContractSize, formatLeverage, formatPrice, formatSpread } from "@/lib/market/format";
import type { SymbolSpec } from "@/lib/market/types";
import { useQuote } from "./useMarket";
import { RowStatus } from "./RowStatus";

/**
 * One instrument row. Subscribes to its own symbol so a tick elsewhere in the
 * table costs nothing here.
 */

/** How long the green/red tick highlight stays on screen. */
const FLASH_MS = 600;

/** Adds a short-lived flash class whenever `value` changes. */
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

interface PriceCellProps {
  value: number | undefined;
  digits: number;
  /** Day direction, used for the resting colour. */
  up: boolean;
  /** Renders the price neutrally when the row is not receiving live updates. */
  muted?: boolean;
  className?: string;
}

function PriceCell({ value, digits, up, muted, className }: PriceCellProps) {
  const flash = useFlash(value);
  return (
    <span
      className={cn(
        "tabular-nums transition-colors duration-200",
        // A closed market's direction colour is stale information, so those rows
        // render neutral — which also keeps contrast above AA, unlike dimming
        // the green/red with opacity.
        value === undefined || muted
          ? "text-muted-foreground"
          : up
            ? "text-[#34d399]"
            : "text-[#f87171]",
        flash === "up" && "ck-tick-up",
        flash === "down" && "ck-tick-down",
        className
      )}
    >
      {value === undefined ? "—" : formatPrice(value, digits)}
    </span>
  );
}

interface SymbolRowProps {
  spec: SymbolSpec;
  starred: boolean;
  onToggleStar: (symbol: string) => void;
  /** Label for the star control, localised by the parent. */
  starLabel: string;
  unstarLabel: string;
}

function SymbolRowInner({ spec, starred, onToggleStar, starLabel, unstarLabel }: SymbolRowProps) {
  const quote = useQuote(spec.symbol);
  const up = (quote?.changePct ?? 0) >= 0;
  const notLive = quote !== undefined && quote.status !== "live";

  return (
    <tr className="border-t border-[var(--ck-line)] transition-colors hover:bg-white/[0.03]">
      <th scope="row" className="px-4 py-3 text-left font-medium">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onToggleStar(spec.symbol)}
            aria-pressed={starred}
            aria-label={starred ? unstarLabel : starLabel}
            className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-[#E9BE57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
          >
            <Star size={14} className={cn(starred && "fill-[#E9BE57] text-[#E9BE57]")} aria-hidden />
          </button>
          <span className="flex min-w-0 flex-col">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-[0.9375rem] text-foreground">{spec.symbol}</span>
              <RowStatus status={quote?.status} />
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">{spec.name}</span>
          </span>
        </div>
      </th>
      <td className="px-4 py-3 text-right">
        <PriceCell value={quote?.bid} digits={spec.digits} up={up} muted={notLive} />
      </td>
      <td className="px-4 py-3 text-right">
        <PriceCell value={quote?.ask} digits={spec.digits} up={up} muted={notLive} />
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-foreground/90">
        {quote ? formatSpread(quote.spread, spec.digits) : "—"}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-foreground/90">
        {formatContractSize(spec.contractSize)}
      </td>
      <td className="hidden px-4 py-3 text-right tabular-nums text-muted-foreground lg:table-cell">
        {formatLeverage(spec.leverage)}
      </td>
    </tr>
  );
}

export const SymbolRow = memo(SymbolRowInner);
