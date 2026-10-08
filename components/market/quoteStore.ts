"use client";

import type { Quote, StreamMessage } from "@/lib/market/types";

/**
 * Client-side quote store.
 *
 * Components subscribe to a single symbol rather than the whole table, so a
 * tick on EURUSD re-renders one row instead of sixty. Connection state is a
 * separate subscription for the same reason.
 */

export type ConnectionState =
  /** Opening the stream, no data yet. */
  | "connecting"
  /** Stream is open and delivering. */
  | "live"
  /** Stream dropped; retrying with backoff. */
  | "reconnecting"
  /** Stream gave up; falling back to periodic polling. */
  | "polling";

export interface Meta {
  connection: ConnectionState;
  /** Timestamp of the last message of any kind. */
  lastMessageAt: number | null;
}

/** Give up on SSE after this many consecutive failures and poll instead. */
const SSE_FAILURE_LIMIT = 3;
const POLL_INTERVAL_MS = 5_000;
const MAX_BACKOFF_MS = 15_000;

export class QuoteStore {
  private quotes = new Map<string, Quote>();
  private symbolListeners = new Map<string, Set<() => void>>();
  private metaListeners = new Set<() => void>();
  private meta: Meta = { connection: "connecting", lastMessageAt: null };

  private source: EventSource | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private failures = 0;
  private started = false;

  constructor(initial: Quote[] = []) {
    for (const quote of initial) this.quotes.set(quote.symbol, quote);
  }

  /* ───────────────────────────────────────────────── reads */

  getQuote = (symbol: string): Quote | undefined => this.quotes.get(symbol);

  getMeta = (): Meta => this.meta;

  /** Snapshot of every known quote — used for sorting, never for rendering. */
  getAll = (): ReadonlyMap<string, Quote> => this.quotes;

  /* ───────────────────────────────────────────────── subscriptions */

  subscribeSymbol = (symbol: string, listener: () => void): (() => void) => {
    let set = this.symbolListeners.get(symbol);
    if (!set) {
      set = new Set();
      this.symbolListeners.set(symbol, set);
    }
    set.add(listener);
    return () => {
      set!.delete(listener);
      if (set!.size === 0) this.symbolListeners.delete(symbol);
    };
  };

  subscribeMeta = (listener: () => void): (() => void) => {
    this.metaListeners.add(listener);
    return () => this.metaListeners.delete(listener);
  };

  /* ───────────────────────────────────────────────── transport */

  /** Open the stream. Safe to call repeatedly; only the first call connects. */
  start() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;
    this.openStream();
  }

  stop() {
    this.started = false;
    this.closeStream();
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.pollTimer = null;
    this.retryTimer = null;
  }

  private closeStream() {
    this.source?.close();
    this.source = null;
  }

  private openStream() {
    if (typeof EventSource === "undefined") {
      this.startPolling();
      return;
    }

    this.closeStream();
    const source = new EventSource("/api/market/stream");
    this.source = source;

    source.onopen = () => {
      this.failures = 0;
      this.setMeta({ connection: "live" });
    };

    source.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as StreamMessage;
        this.applyQuotes(message.quotes);
        this.setMeta({ connection: "live", lastMessageAt: Date.now() });
      } catch {
        // A malformed frame is not worth tearing the connection down for.
      }
    };

    source.onerror = () => {
      this.closeStream();
      this.failures += 1;
      if (this.failures >= SSE_FAILURE_LIMIT) {
        this.startPolling();
        return;
      }
      this.setMeta({ connection: "reconnecting" });
      // Exponential backoff so a cold server is not hammered while restarting.
      const delay = Math.min(1000 * 2 ** (this.failures - 1), MAX_BACKOFF_MS);
      this.retryTimer = setTimeout(() => this.openStream(), delay);
    };
  }

  /** Last-resort transport when SSE cannot be held open. */
  private startPolling() {
    if (this.pollTimer) return;
    this.setMeta({ connection: "polling" });

    const tick = async () => {
      try {
        const res = await fetch("/api/market/quotes", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { quotes: Quote[] };
        this.applyQuotes(data.quotes);
        this.setMeta({ lastMessageAt: Date.now() });
      } catch {
        // Keep polling; the status badge already shows the degraded state.
      }
    };

    void tick();
    this.pollTimer = setInterval(() => void tick(), POLL_INTERVAL_MS);
  }

  /* ───────────────────────────────────────────────── writes */

  private applyQuotes(quotes: Quote[]) {
    for (const quote of quotes) {
      const previous = this.quotes.get(quote.symbol);
      if (
        previous &&
        previous.bid === quote.bid &&
        previous.ask === quote.ask &&
        previous.status === quote.status &&
        previous.changePct === quote.changePct
      ) {
        continue;
      }
      this.quotes.set(quote.symbol, quote);
      const listeners = this.symbolListeners.get(quote.symbol);
      if (listeners) for (const listener of listeners) listener();
    }
  }

  private setMeta(patch: Partial<Meta>) {
    const next = { ...this.meta, ...patch };
    if (next.connection === this.meta.connection && next.lastMessageAt === this.meta.lastMessageAt) return;
    this.meta = next;
    for (const listener of this.metaListeners) listener();
  }
}
