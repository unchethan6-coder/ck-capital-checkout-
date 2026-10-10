"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, FileText, Search, Sparkles, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ArticleBody } from "@/components/help/ArticleBody";
import { buildIndex, searchHelp, type HelpIndex } from "@/lib/help/search";
import type { HelpData } from "@/lib/help/types";

/**
 * Help-centre search with instant answers.
 *
 * The articles are fetched as their own chunk the first time the box is used,
 * so the page does not carry them. Matching happens in the browser: see
 * lib/help/search.ts for why answers are quoted rather than generated.
 */

/** Asked in English because the articles are. */
const SUGGESTIONS = ["Can I use EAs?", "Can I trade the news?", "Which countries are restricted?", "How do I get paid?"];

export function HelpSearch() {
  const t = useTranslations("helpCenter");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<HelpIndex | null>(null);
  const loading = useRef(false);

  const load = () => {
    if (loading.current) return;
    loading.current = true;
    import("@/lib/help/articles.json")
      .then((mod) => setIndex(buildIndex((mod.default as HelpData).articles)))
      .catch(() => {
        // Let the next keystroke try again.
        loading.current = false;
      });
  };

  // Typing before the first focus (autofill, paste) still needs the articles.
  useEffect(() => {
    if (query) load();
  }, [query]);

  const trimmed = query.trim();
  const result = useMemo(
    () => (index && trimmed.length >= 2 ? searchHelp(trimmed, index) : null),
    [index, trimmed]
  );
  const answer = result?.answer ?? null;
  const others = result?.articles.filter((a) => a.slug !== answer?.article.slug) ?? [];

  return (
    <div data-od-id="help-search">
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          {t("searchLabel")}
        </label>
        <Search size={18} aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-foreground/45" />
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          value={query}
          onFocus={load}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          autoComplete="off"
          enterKeyHint="search"
          data-od-id="help-search-input"
          className="h-14 w-full rounded-2xl border border-foreground/15 bg-foreground/[0.04] pr-12 pl-12 text-base text-foreground placeholder:text-foreground/45 focus-visible:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label={t("clear")}
            className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-foreground/55 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
          >
            <X size={18} aria-hidden />
          </button>
        )}
      </div>

      {trimmed.length < 2 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-foreground/50 uppercase">{t("tryAsking")}</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              dir="ltr"
              onClick={() => {
                load();
                setQuery(s);
              }}
              className="min-h-9 rounded-full border border-foreground/15 bg-foreground/[0.03] px-3 py-1.5 text-[13px] text-foreground/75 transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div aria-live="polite" className="mt-5 space-y-4 empty:hidden">
        {trimmed.length >= 2 && !index && <p className="text-sm text-foreground/60">{t("loading")}</p>}

        {answer && (
          <section
            data-od-id="help-answer"
            className="rounded-2xl border border-primary/35 bg-primary/[0.08] p-5 sm:p-6"
          >
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-[#A98BFF] uppercase">
              <Sparkles size={13} aria-hidden />
              {t("instantAnswer")}
            </p>
            <h2 dir="ltr" className="mt-2 font-[family-name:var(--font-jakarta)] text-lg font-bold text-foreground">
              {answer.article.title}
            </h2>
            <ArticleBody
              compact
              className="mt-3"
              blocks={answer.article.blocks.slice(answer.start, answer.end)}
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-foreground/10 pt-4">
              <p className="text-xs text-foreground/55">{t("answerSource")}</p>
              <Link
                href={`/faq/${answer.article.slug}` as never}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A98BFF] hover:underline"
              >
                {t("readFull")} <ArrowRight size={14} aria-hidden className="rtl:rotate-180" />
              </Link>
            </div>
          </section>
        )}

        {result && !answer && (
          <section data-od-id="help-no-answer" className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-5 sm:p-6">
            <h2 className="text-base font-semibold text-foreground">{t("noAnswerTitle", { query: trimmed })}</h2>
            <p className="mt-1 text-sm text-foreground/65">{t("noAnswerBody")}</p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#A98BFF] hover:underline"
            >
              {t("contactSupport")} <ArrowRight size={14} aria-hidden className="rtl:rotate-180" />
            </Link>
          </section>
        )}

        {others.length > 0 && (
          <section data-od-id="help-results">
            <h2 className="text-xs font-semibold tracking-wide text-foreground/50 uppercase">{t("matchingArticles")}</h2>
            <ul className="mt-2 overflow-hidden rounded-2xl border border-foreground/10">
              {others.map((a) => (
                <li key={a.slug} className="border-b border-foreground/10 last:border-0">
                  <Link
                    href={`/faq/${a.slug}` as never}
                    dir="ltr"
                    className="flex min-h-12 items-center gap-3 bg-foreground/[0.02] px-4 py-3 text-sm text-foreground/85 transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]"
                  >
                    <FileText size={15} aria-hidden className="shrink-0 text-[#A98BFF]" />
                    <span className="min-w-0 flex-1">{a.title}</span>
                    <ArrowRight size={14} aria-hidden className="shrink-0 text-foreground/35" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
