"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Activity,
  BarChart3,
  Bitcoin,
  Building2,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  DollarSign,
  Droplets,
  Search,
  Star,
  TrendingUp,
  WifiOff,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SYMBOL_SPECS } from "@/lib/market/symbols";
import type { AssetCategory, Quote, SymbolSpec } from "@/lib/market/types";
import { QuoteStore, type ConnectionState } from "./quoteStore";
import { MarketContext, useConnection, useQuotesForSorting } from "./useMarket";
import { SymbolRow } from "./SymbolRow";
import { SymbolCard } from "./SymbolCard";

/**
 * Symbol specifications table — category tabs, search, sorting and a live
 * bid/ask feed.
 *
 * Quotes are held in a {@link QuoteStore} outside React state so that an
 * incoming tick re-renders only the affected row. This component re-renders
 * on user interaction (tab, search, sort) and nothing else.
 */

/** Tabs, in display order. "most" and "custom" are views, not categories. */
type TabId = "most" | AssetCategory | "custom";

const TABS: { id: TabId; icon: LucideIcon }[] = [
  { id: "most", icon: TrendingUp },
  { id: "fx", icon: DollarSign },
  { id: "indices", icon: BarChart3 },
  { id: "commodities", icon: Droplets },
  { id: "crypto", icon: Bitcoin },
  { id: "stocks", icon: Building2 },
  { id: "custom", icon: Star },
];

type SortKey = "symbol" | "bid" | "ask" | "spread" | "contractSize";
type SortDir = "asc" | "desc";

/** Price sorts settle on this cadence so rows do not jump on every tick. */
const SORT_REFRESH_MS = 1500;

const WATCHLIST_KEY = "ck:symbols:watchlist";

/* ────────────────────────────────────────────────────────── feed status */

function FeedStatus() {
  const connection = useConnection();
  const t = useTranslations("symbols");

  const presentation: Record<ConnectionState, { label: string; tone: string; icon: LucideIcon }> = {
    connecting: { label: t("statusConnecting"), tone: "text-muted-foreground", icon: Activity },
    live: { label: t("statusLive"), tone: "text-[#34d399]", icon: Activity },
    reconnecting: { label: t("statusReconnecting"), tone: "text-[#E9BE57]", icon: WifiOff },
    polling: { label: t("statusDelayed"), tone: "text-[#E9BE57]", icon: WifiOff },
  };

  const { label, tone, icon: Icon } = presentation[connection];

  return (
    <p role="status" aria-live="polite" className={cn("flex items-center gap-1.5 text-xs font-medium", tone)}>
      <span className="relative flex h-2 w-2" aria-hidden>
        {connection === "live" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      <Icon size={13} aria-hidden className="sr-only" />
      {label}
    </p>
  );
}

/* ────────────────────────────────────────────────────────── sortable header */

interface SortHeaderProps {
  label: string;
  sortKey: SortKey;
  active: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}

function SortHeader({ label, sortKey, active, dir, onSort, className }: SortHeaderProps) {
  const isActive = active === sortKey;
  const Icon = !isActive ? ChevronsUpDown : dir === "asc" ? ChevronUp : ChevronDown;
  return (
    <th
      scope="col"
      aria-sort={isActive ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 rounded transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
      >
        {label}
        <Icon size={13} aria-hidden className={cn(isActive ? "text-[var(--accent)]" : "opacity-50")} />
      </button>
    </th>
  );
}

/* ────────────────────────────────────────────────────────── main component */

interface SymbolSpecsClientProps {
  initialQuotes: Quote[];
}

export function SymbolSpecsClient({ initialQuotes }: SymbolSpecsClientProps) {
  const t = useTranslations("symbols");

  // The store is created once and never replaced, so subscriptions are stable.
  const [store] = useState(() => new QuoteStore(initialQuotes));
  const initial = useMemo(() => new Map(initialQuotes.map((q) => [q.symbol, q])), [initialQuotes]);

  useEffect(() => {
    store.start();
    return () => store.stop();
  }, [store]);

  return (
    <MarketContext.Provider value={{ store, initial }}>
      <SymbolSpecsTable t={t} />
    </MarketContext.Provider>
  );
}

function SymbolSpecsTable({ t }: { t: ReturnType<typeof useTranslations<"symbols">> }) {
  const [tab, setTab] = useState<TabId>("most");
  const [query, setQuery] = useState("");
  // Key and direction live in one state object: updating them separately meant
  // nesting a setState inside another updater, which React re-runs in StrictMode
  // and which flipped the direction twice, so a second click never reversed.
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "symbol", dir: "asc" });
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Restore the custom watchlist after mount — localStorage is client-only and
  // reading it during render would break hydration.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WATCHLIST_KEY);
      if (raw) setWatchlist(JSON.parse(raw) as string[]);
    } catch {
      // Private mode or corrupted entry — an empty watchlist is fine.
    }
  }, []);

  const toggleStar = useCallback((symbol: string) => {
    setWatchlist((current) => {
      const next = current.includes(symbol) ? current.filter((s) => s !== symbol) : [...current, symbol];
      try {
        window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
      } catch {
        // Persistence is a convenience; the session still works without it.
      }
      return next;
    });
  }, []);

  const handleSort = useCallback((key: SortKey) => {
    setSort((current) =>
      current.key === key ? { key, dir: current.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  }, []);

  const quotes = useQuotesForSorting(SORT_REFRESH_MS);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = SYMBOL_SPECS.filter((spec) => {
      const inTab =
        tab === "most" ? spec.mostTraded === true
        : tab === "custom" ? watchlist.includes(spec.symbol)
        : spec.category === tab;
      if (!inTab) return false;
      if (!needle) return true;
      return spec.symbol.toLowerCase().includes(needle) || spec.name.toLowerCase().includes(needle);
    });

    const valueOf = (spec: SymbolSpec): number | string => {
      switch (sort.key) {
        case "symbol": return spec.symbol;
        case "contractSize": return spec.contractSize;
        case "bid": return quotes.get(spec.symbol)?.bid ?? 0;
        case "ask": return quotes.get(spec.symbol)?.ask ?? 0;
        case "spread": return quotes.get(spec.symbol)?.spread ?? 0;
      }
    };

    return [...filtered].sort((a, b) => {
      const left = valueOf(a);
      const right = valueOf(b);
      const order =
        typeof left === "string" && typeof right === "string"
          ? left.localeCompare(right)
          : (left as number) - (right as number);
      return sort.dir === "asc" ? order : -order;
    });
  }, [tab, query, sort, watchlist, quotes]);

  const starLabels = { starLabel: t("addToWatchlist"), unstarLabel: t("removeFromWatchlist") };
  const cardLabels = { bid: t("bid"), ask: t("ask"), spread: t("spread"), contractSize: t("contractSize") };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--ck-line)] bg-[var(--ck-surface-2)]/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm">
      {/* Category tabs */}
      <div className="border-b border-[var(--ck-line)]">
        <div
          role="tablist"
          aria-label={t("categoriesLabel")}
          className="flex gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map(({ id, icon: Icon }) => {
            const selected = tab === id;
            return (
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setTab(id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                  selected
                    ? "bg-[var(--primary)] text-white"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                )}
              >
                <Icon size={15} aria-hidden />
                {t(`tab_${id}` as "tab_most")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ck-line)] px-4 py-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search size={15} aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchLabel")}
            className="w-full rounded-lg border border-[var(--ck-line)] bg-[var(--ck-surface)] py-2 pr-8 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-[var(--ring)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("clearSearch")}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
            >
              <X size={14} aria-hidden />
            </button>
          )}
        </div>
        <FeedStatus />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{t("tableCaption")}</caption>
          <thead>
            <tr className="bg-white/[0.02]">
              <SortHeader label={t("symbol")} sortKey="symbol" active={sort.key} dir={sort.dir} onSort={handleSort} className="text-left" />
              <SortHeader label={t("bidPrice")} sortKey="bid" active={sort.key} dir={sort.dir} onSort={handleSort} className="text-right" />
              <SortHeader label={t("askPrice")} sortKey="ask" active={sort.key} dir={sort.dir} onSort={handleSort} className="text-right" />
              <SortHeader label={t("spread")} sortKey="spread" active={sort.key} dir={sort.dir} onSort={handleSort} className="text-right" />
              <SortHeader label={t("contractSize")} sortKey="contractSize" active={sort.key} dir={sort.dir} onSort={handleSort} className="text-right" />
              <th scope="col" className="hidden px-4 py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase lg:table-cell">
                {t("leverage")}
              </th>
            </tr>
          </thead>
          {/* Price changes must not be announced on every tick. */}
          <tbody aria-live="off">
            {visible.map((spec) => (
              <SymbolRow key={spec.symbol} spec={spec} starred={watchlist.includes(spec.symbol)} onToggleStar={toggleStar} {...starLabels} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone cards */}
      <ul className="space-y-2 p-3 md:hidden" aria-live="off">
        {visible.map((spec) => (
          <SymbolCard key={spec.symbol} spec={spec} starred={watchlist.includes(spec.symbol)} onToggleStar={toggleStar} labels={cardLabels} {...starLabels} />
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="px-4 py-14 text-center text-sm text-muted-foreground">
          {tab === "custom" && !query ? t("emptyWatchlist") : t("noResults", { query })}
        </p>
      )}
    </div>
  );
}
