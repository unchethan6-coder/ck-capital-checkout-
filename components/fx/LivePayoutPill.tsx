"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Live payout pill — pulsing gold dot + label.
 *
 * With `baseAmount` provided this becomes a DISPLAY TICKER: the figure ticks
 * upward every 4–7s for a "live" feel. It is intentionally NOT a verified
 * metric — keep it plausible and only enable it once a base number is
 * approved. Default (no `baseAmount`) renders the honest static label.
 */
export function LivePayoutPill({
  baseAmount,
  prefix = "Payouts processed in",
  suffix = "~12 hours",
  className,
}: {
  baseAmount?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (baseAmount == null) return;
    setAmount(baseAmount);
    let id: ReturnType<typeof setInterval>;
    const schedule = () => {
      id = setInterval(() => {
        setAmount((a) => (a == null ? baseAmount : a + Math.random() * 45));
      }, 4000 + Math.random() * 3000);
    };
    schedule();
    return () => clearInterval(id);
  }, [baseAmount]);

  const label =
    amount != null
      ? `${prefix} $${Math.round(amount).toLocaleString("en-US")} ${suffix}`
      : `${prefix} ${suffix}`;

  return (
    <span
      key={amount ?? "static"}
      className="inline-flex fx-pill-bump"
      aria-hidden="true"
    >
      <span
        className={cn(
          "inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-[color-mix(in_oklab,var(--background)_80%,transparent)] px-4 py-2 text-[12.5px] font-semibold text-[#A98BFF] backdrop-blur-md",
          className
        )}
      >
        <span className="pulse-gold h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        {label}
      </span>
    </span>
  );
}
