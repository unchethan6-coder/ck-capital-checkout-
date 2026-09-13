"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Medal, Circle, TrendingUp, Euro, PoundSterling, Droplet,
  type LucideIcon,
} from "lucide-react";
import { HERO_TICKER, type TickerInstrument } from "@/lib/content";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────── icon renderer */

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  Medal, Circle, TrendingUp, Euro, PoundSterling, Droplet,
};

function InstrumentIcon({ inst }: { inst: TickerInstrument }) {
  if (inst.iconSrc) {
    return (
      <Image
        src={inst.iconSrc}
        alt=""
        width={16}
        height={16}
        className="w-4 h-4 shrink-0 object-contain"
        unoptimized
      />
    );
  }
  const Comp = inst.iconLucide ? LUCIDE_ICONS[inst.iconLucide] : null;
  if (!Comp) return null;
  return (
    <Comp
      size={14}
      strokeWidth={2.4}
      className="shrink-0"
      style={{ color: inst.iconColor ?? "currentColor" }}
      aria-hidden
    />
  );
}

/* ─────────────────────────────────────────────────────────── live prices */

interface Live {
  price: number;
  changePct: number; // 24h % move (real for live, opening+drift for simulated)
}

interface LiveApiRow {
  symbol: string;
  price: number;
  changePct24h: number;
}

function useTickerPrices(base: TickerInstrument[]) {
  // Initial deterministic state — SSR/hydration safe (no Math.random on first paint)
  const [state, setState] = useState<Live[]>(() =>
    base.map((r) => ({ price: r.basePrice, changePct: r.startChangePct }))
  );
  const [liveOk, setLiveOk] = useState(false);
  const liveMapRef = useRef<Record<string, LiveApiRow>>({});

  // Fetch real crypto spot prices from /api/ticker (CoinGecko proxy) every 30s
  useEffect(() => {
    let cancelled = false;
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/ticker", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { ok: boolean; prices: LiveApiRow[] };
        if (cancelled || !json.ok || !json.prices?.length) return;
        liveMapRef.current = Object.fromEntries(json.prices.map((p) => [p.symbol, p]));
        setLiveOk(true);
        setState((prev) =>
          prev.map((s, i) => {
            const inst = base[i];
            if (!inst.live) return s;
            const feed = liveMapRef.current[inst.symbol];
            if (!feed) return s;
            return { price: feed.price, changePct: feed.changePct24h };
          })
        );
      } catch {
        // Silently keep simulated data
      }
    };
    fetchLive();
    const id = setInterval(fetchLive, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [base]);

  // Every 2s: micro-drift ALL prices to keep the tape feeling alive between polls
  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) =>
        prev.map((s, i) => {
          const inst = base[i];
          const drift = (Math.random() - 0.5) * 0.0008; // ±0.04%
          const newPrice = Math.max(0.00001, s.price * (1 + drift));
          // For non-live, extend the % change from opening; for live, adjust from
          // the most recent CoinGecko baseline so real 24h % stays roughly correct.
          const anchor = inst.live
            ? liveMapRef.current[inst.symbol]?.price ?? inst.basePrice
            : inst.basePrice / (1 + inst.startChangePct / 100);
          const anchorPct = inst.live
            ? liveMapRef.current[inst.symbol]?.changePct24h ?? inst.startChangePct
            : 0;
          const changePct = inst.live
            ? anchorPct + ((newPrice - anchor) / anchor) * 100
            : ((newPrice - anchor) / anchor) * 100;
          return { price: newPrice, changePct };
        })
      );
    }, 2000);
    return () => clearInterval(id);
  }, [base]);

  return { prices: state, liveOk };
}

/* ─────────────────────────────────────────────────────────── formatting */

function formatNumber(n: number, decimals: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function TickerCell({ inst, live }: { inst: TickerInstrument; live: Live }) {
  const isUp = live.changePct >= 0;
  const deltaAbs = Math.abs(live.price * (live.changePct / 100));
  const deltaDecimals = Math.min(inst.decimals, 2);

  return (
    <span className="inline-flex items-center gap-2 px-5 shrink-0 whitespace-nowrap">
      <InstrumentIcon inst={inst} />
      <span className="text-[13px] font-semibold text-foreground/90">{inst.name}</span>
      <span className="font-mono text-[13px] text-foreground/85 tabular-nums">
        {formatNumber(live.price, inst.decimals)}
      </span>
      <span
        className={cn(
          "font-mono text-[13px] tabular-nums",
          isUp ? "text-emerald-400" : "text-red-400"
        )}
      >
        {isUp ? "+" : "−"}
        {formatNumber(deltaAbs, deltaDecimals)}
      </span>
      <span
        className={cn(
          "font-mono text-[13px] tabular-nums",
          isUp ? "text-emerald-400/75" : "text-red-400/75"
        )}
      >
        ({isUp ? "+" : ""}
        {live.changePct.toFixed(2)}%)
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────── component */

export function MarketTicker({
  className,
  revealDelay,
}: {
  className?: string;
  revealDelay?: number;
}) {
  const t = useTranslations("ticker");
  const { prices, liveOk } = useTickerPrices(HERO_TICKER);
  // Double the stream so the marquee loops seamlessly
  const stream = useMemo(() => [...HERO_TICKER, ...HERO_TICKER], []);
  const liveStream = useMemo(() => [...prices, ...prices], [prices]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: revealDelay ?? 0, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={cn(
        "relative overflow-hidden border-y border-white/[0.08] bg-[#0D0C08] h-12 flex items-center",
        className
      )}
      data-od-id="market-ticker"
    >
      {/* MARKET label — pinned, doesn't scroll. Includes live status dot. */}
      <div className="relative z-20 flex items-center gap-2 h-full pl-4 pr-4 sm:pl-6 sm:pr-5 border-r border-white/[0.08] bg-[#14120D]">
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors",
            liveOk ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" : "bg-foreground/25"
          )}
          aria-label={liveOk ? t("live") : t("reconnecting")}
        />
        <span className="font-mono text-[11px] font-bold tracking-[0.22em] text-foreground/65 uppercase">
          {t("market")}
        </span>
      </div>

      {/* Left/right fades so items ease into/out of view */}
      <div className="pointer-events-none absolute left-[108px] sm:left-[128px] top-0 h-full w-10 z-10 bg-gradient-to-r from-[color:var(--background-secondary)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-14 z-10 bg-gradient-to-l from-[color:var(--background-secondary)] to-transparent" />

      {/* Scrolling stream */}
      <div className="flex-1 overflow-hidden">
        <div className="flex animate-marquee will-change-transform">
          {stream.map((inst, i) => (
            <TickerCell key={i} inst={inst} live={liveStream[i]} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
