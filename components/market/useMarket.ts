"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Quote } from "@/lib/market/types";
import type { ConnectionState, QuoteStore } from "./quoteStore";

/**
 * React bindings for {@link QuoteStore}.
 *
 * `useQuote` subscribes a component to one symbol only — this is what keeps a
 * sixty-row table responsive while prices stream in.
 */

interface MarketContextValue {
  store: QuoteStore;
  /** Server-rendered quotes, used as the SSR snapshot during hydration. */
  initial: ReadonlyMap<string, Quote>;
}

export const MarketContext = createContext<MarketContextValue | null>(null);

function useMarketContext(): MarketContextValue {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket must be used inside <MarketProvider>");
  return ctx;
}

/** Subscribe to a single instrument. Re-renders only when that symbol moves. */
export function useQuote(symbol: string): Quote | undefined {
  const { store, initial } = useMarketContext();
  return useSyncExternalStore(
    (listener) => store.subscribeSymbol(symbol, listener),
    () => store.getQuote(symbol),
    () => initial.get(symbol)
  );
}

/** Subscribe to connection health for the status badge. */
export function useConnection(): ConnectionState {
  const { store } = useMarketContext();
  return useSyncExternalStore(
    store.subscribeMeta,
    () => store.getMeta().connection,
    () => "connecting" as const
  );
}

/**
 * A snapshot of every quote, refreshed at most every `intervalMs`.
 *
 * Used purely for ordering. Sorting on every tick would make rows jump around
 * several times a second, so price-based sorts settle on a slower cadence
 * while the prices themselves keep updating in place.
 */
export function useQuotesForSorting(intervalMs: number): ReadonlyMap<string, Quote> {
  const { store, initial } = useMarketContext();
  const [snapshot, setSnapshot] = useState<ReadonlyMap<string, Quote>>(initial);
  const storeRef = useRef(store);
  storeRef.current = store;

  useEffect(() => {
    const tick = () => setSnapshot(new Map(storeRef.current.getAll()));
    tick();
    const timer = setInterval(tick, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return snapshot;
}
