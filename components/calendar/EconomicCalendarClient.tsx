"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, Info, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountryFlag } from "@/components/shared/CountryFlag";
import { CALENDAR_PAGE_SIZE } from "@/lib/calendar/types";
import type { CalendarPayload, EventImpact } from "@/lib/calendar/types";
import { CURRENCIES, CURRENCY_FLAG, IMPACTS, IMPACT_STYLE, WEEKDAYS } from "./calendarMeta";
import { detectTimeZone, formatEventTime, weekdayIn } from "./timezones";
import { TimezoneSelect } from "./TimezoneSelect";

/**
 * Economic calendar.
 *
 * Filters, timezone and paging are all client state, so nothing here reloads
 * the page. The event list itself is refreshed on a timer because releases
 * land throughout the day.
 */

/** Events are published gradually, so a slow poll is enough. */
const REFRESH_MS = 60_000;
const PAGE_SIZE = CALENDAR_PAGE_SIZE;
const TZ_KEY = "ck:calendar:timezone";

interface Props {
  initial: CalendarPayload;
  /** Page the server already rendered, so hydration does not jump. */
  initialPage: number;
}

export function EconomicCalendarClient({ initial, initialPage }: Props) {
  const t = useTranslations("calendar");
  const locale = useLocale();

  const [payload, setPayload] = useState<CalendarPayload>(initial);
  const [refreshing, setRefreshing] = useState(false);
  const [zone, setZone] = useState("UTC");
  const [currency, setCurrency] = useState("All");
  const [days, setDays] = useState<number[]>([]);
  const [impacts, setImpacts] = useState<EventImpact[]>([]);
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [page, setPage] = useState(initialPage);
  /**
   * True once the reader has chosen a page themselves. Until then the calendar
   * follows the clock: the week runs from Sunday, so by midweek the first page
   * is several days in the past, which is the opposite of what someone
   * checking what is coming needs.
   */
  const [pagePinned, setPagePinned] = useState(false);

  // Resolve the viewer's zone after mount: reading it during render would
  // produce different markup on server and client.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(TZ_KEY);
    } catch {
      // Private mode — fall back to the detected zone.
    }
    setZone(stored || detectTimeZone());
  }, []);

  const changeZone = useCallback((next: string) => {
    setZone(next);
    setPage(1);
    try {
      window.localStorage.setItem(TZ_KEY, next);
    } catch {
      // Persistence is a convenience, not a requirement.
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/calendar", { cache: "no-store" });
      if (res.ok) setPayload((await res.json()) as CalendarPayload);
    } catch {
      // Keep showing what we have; the freshness line reports the age.
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => void refresh(), REFRESH_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const filtered = useMemo(() => {
    const now = Date.now();
    return payload.events.filter((e) => {
      if (currency !== "All" && e.currency !== currency) return false;
      if (impacts.length > 0 && !impacts.includes(e.impact)) return false;
      if (days.length > 0 && !days.includes(weekdayIn(e.date, zone))) return false;
      if (upcomingOnly && Date.parse(e.date) < now) return false;
      return true;
    });
  }, [payload.events, currency, impacts, days, zone, upcomingOnly]);

  useEffect(() => {
    if (pagePinned) return;
    const now = Date.now();
    const next = filtered.findIndex((e) => Date.parse(e.date) >= now);
    setPage(next === -1 ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)) : Math.floor(next / PAGE_SIZE) + 1);
  }, [filtered, pagePinned]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  // Only the current page is rendered — a whole week of rows would be wasted work.
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => {
    setPage(1);
    setPagePinned(false);
  };

  const goToPage = (next: number) => {
    setPage(next);
    setPagePinned(true);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--ck-line)] bg-[var(--ck-surface-2)]/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm">
      {/* Currency chips + timezone */}
      <div className="flex flex-col gap-3 border-b border-[var(--ck-line)] p-4 lg:flex-row lg:items-start lg:justify-between">
        <div role="group" aria-label={t("currencyFilter")} className="flex flex-wrap gap-2">
          {CURRENCIES.map((code) => {
            const selected = currency === code;
            const iso = CURRENCY_FLAG[code];
            return (
              <button
                key={code}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setCurrency(code);
                  resetPage();
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                  selected
                    ? "border-[var(--primary)] bg-[var(--primary)]/20 text-foreground"
                    : "border-[var(--ck-line)] text-muted-foreground hover:border-white/20 hover:text-foreground"
                )}
              >
                {iso && <CountryFlag code={iso} size={14} className="shrink-0" />}
                {code === "All" ? t("all") : code}
              </button>
            );
          })}
        </div>
        <div className="w-full shrink-0 lg:w-72">
          <TimezoneSelect
            value={zone}
            onChange={changeZone}
            label={t("timezoneLabel")}
            searchPlaceholder={t("timezoneSearch")}
          />
        </div>
      </div>

      {/* Day + impact filters */}
      <div className="flex flex-col gap-4 border-b border-[var(--ck-line)] p-4 md:flex-row md:items-start md:gap-8">
        <fieldset className="min-w-0">
          <legend className="mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            {t("days")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day, index) => {
              const selected = days.includes(index);
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setDays((d) => toggle(d, index));
                    resetPage();
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                    selected
                      ? "border-[var(--primary)] bg-[var(--primary)]/20 text-foreground"
                      : "border-[var(--ck-line)] text-muted-foreground hover:border-white/20 hover:text-foreground"
                  )}
                >
                  {t(`weekday.${day.toLowerCase()}` as "weekday.sunday")}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            {t("impact")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {IMPACTS.map((level) => {
              const selected = impacts.includes(level);
              const style = IMPACT_STYLE[level];
              return (
                <label
                  key={level}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--ring)]",
                    selected ? cn(style.border, style.bg, style.text) : "border-[var(--ck-line)] text-muted-foreground hover:border-white/20"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => {
                      setImpacts((i) => toggle(i, level));
                      resetPage();
                    }}
                    className="h-3.5 w-3.5 accent-[var(--primary)]"
                  />
                  {t(`impactLevel.${level.toLowerCase()}` as "impactLevel.high")}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            {t("show")}
          </legend>
          <button
            type="button"
            aria-pressed={upcomingOnly}
            onClick={() => {
              setUpcomingOnly((v) => !v);
              resetPage();
            }}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              upcomingOnly
                ? "border-[var(--primary)] bg-[var(--primary)]/20 text-foreground"
                : "border-[var(--ck-line)] text-muted-foreground hover:border-white/20 hover:text-foreground"
            )}
          >
            {t("upcomingOnly")}
          </button>
        </fieldset>
      </div>

      {/* Source + freshness */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ck-line)] px-4 py-2.5 text-xs text-muted-foreground">
        <p>
          {t("source")}{" "}
          <span className="font-medium text-foreground/80">{payload.source}</span>
        </p>
        <p role="status" aria-live="polite" className="flex items-center gap-1.5">
          <RefreshCw size={12} aria-hidden className={cn(refreshing && "animate-spin")} />
          {payload.live
            ? t("updatedAt", { time: new Date(payload.updatedAt).toLocaleTimeString(locale, { timeZone: zone, hour: "2-digit", minute: "2-digit" }) })
            : t("feedStale")}
        </p>
      </div>

      <CalendarTable events={visible} zone={zone} locale={locale} t={t} />

      {filtered.length === 0 && (
        <p className="px-4 py-14 text-center text-sm text-muted-foreground">{t("noEvents")}</p>
      )}

      {pageCount > 1 && (
        <nav aria-label={t("pagination")} className="flex items-center justify-center gap-1.5 border-t border-[var(--ck-line)] p-4">
          <PageButton onClick={() => goToPage(Math.max(1, safePage - 1))} disabled={safePage === 1} label={t("previousPage")}>
            <ChevronLeft size={15} aria-hidden />
          </PageButton>
          {pageWindow(safePage, pageCount).map((n, i) =>
            n === "gap" ? (
              // Index-keyed: a random key would remount the node every render.
              <span key={`gap-${i}`} className="px-1 text-muted-foreground">…</span>
            ) : (
              <button
                key={n}
                type="button"
                aria-current={n === safePage ? "page" : undefined}
                onClick={() => goToPage(n)}
                className={cn(
                  "h-8 min-w-8 rounded-lg border px-2 text-xs font-semibold transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                  n === safePage
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--ck-line)] text-muted-foreground hover:text-foreground"
                )}
              >
                {n}
              </button>
            )
          )}
          <PageButton onClick={() => goToPage(Math.min(pageCount, safePage + 1))} disabled={safePage === pageCount} label={t("nextPage")}>
            <ChevronRight size={15} aria-hidden />
          </PageButton>
        </nav>
      )}
    </div>
  );
}

function PageButton({
  onClick, disabled, label, children,
}: { onClick: () => void; disabled: boolean; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--ck-line)] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-35 disabled:hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
    >
      {children}
    </button>
  );
}

/** Page numbers with ellipses, so a long week does not produce 20 buttons. */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "gap")[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  if (from > 2) out.push("gap");
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 1) out.push("gap");
  out.push(total);
  return out;
}

function CalendarTable({
  events, zone, locale, t,
}: {
  events: CalendarPayload["events"];
  zone: string;
  locale: string;
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{t("tableCaption")}</caption>
          <thead>
            <tr className="bg-white/[0.02] text-[11px] tracking-wider text-muted-foreground uppercase">
              <th scope="col" className="px-4 py-3 text-left font-semibold">{t("impact")}</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">{t("event")}</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">{t("currency")}</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">{t("date")}</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">{t("forecast")}</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">{t("previous")}</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              const style = IMPACT_STYLE[e.impact];
              const { day, time } = formatEventTime(e.date, zone, locale);
              const iso = CURRENCY_FLAG[e.currency];
              return (
                <tr key={e.id} className="border-t border-[var(--ck-line)] transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold", style.border, style.bg, style.text)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} aria-hidden />
                      {t(`impactLevel.${e.impact.toLowerCase()}` as "impactLevel.high")}
                    </span>
                  </td>
                  <th scope="row" className="px-4 py-3 text-left text-[0.9375rem] font-medium text-foreground">{e.title}</th>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      {iso && <CountryFlag code={iso} size={15} />}
                      {e.currency}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground tabular-nums">{day}, {time}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground/90">{e.forecast || "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground/90">{e.previous || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phone cards */}
      <ul className="space-y-2 p-3 md:hidden">
        {events.map((e) => {
          const style = IMPACT_STYLE[e.impact];
          const { day, time } = formatEventTime(e.date, zone, locale);
          const iso = CURRENCY_FLAG[e.currency];
          return (
            <li key={e.id} className="rounded-xl border border-[var(--ck-line)] bg-[var(--ck-surface-2)] p-4">
              <div className="flex items-start justify-between gap-3">
                <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold", style.border, style.bg, style.text)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} aria-hidden />
                  {t(`impactLevel.${e.impact.toLowerCase()}` as "impactLevel.high")}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{day}, {time}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{e.title}</p>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  {iso && <CountryFlag code={iso} size={14} />}
                  {e.currency}
                </span>
                <span className="flex gap-4 text-muted-foreground">
                  <span>{t("forecast")}: <span className="text-foreground/90 tabular-nums">{e.forecast || "—"}</span></span>
                  <span>{t("previous")}: <span className="text-foreground/90 tabular-nums">{e.previous || "—"}</span></span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** Small note explaining that CK does not restrict trading around releases. */
export function NewsPolicyNote({ text }: { text: string }) {
  return (
    <p className="mx-auto mt-5 flex max-w-3xl items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground">
      <Info size={14} aria-hidden className="mt-0.5 shrink-0 text-[#A98BFF]" />
      <span>{text}</span>
    </p>
  );
}
