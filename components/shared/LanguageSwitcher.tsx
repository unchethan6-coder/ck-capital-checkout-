"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES } from "@/i18n/locales";
import { cn } from "@/lib/utils";

const LOCAL_STORAGE_KEY = "ck-locale";
const COOKIE_NAME = "NEXT_LOCALE";

/**
 * Reads the durable preference from localStorage (client-only) and promotes it
 * to the server-visible cookie + soft-navigates if the visitor is still on the
 * auto-detected locale. Called once per page load.
 */
function promoteStoredLocale() {
  if (typeof window === "undefined") return;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  } catch {
    return;
  }
  if (!stored) return;

  const cookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
  const cookieValue = cookie?.split("=").slice(1).join("=");

  if (cookieValue !== stored) {
    document.cookie = `${COOKIE_NAME}=${stored}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }
}

export function LanguageSwitcher({
  compact = false,
  dropUp = false,
  className,
}: {
  compact?: boolean;
  dropUp?: boolean;
  className?: string;
}) {
  const locale = useLocale() as keyof typeof LOCALES;
  const t = useTranslations("languageSwitcher");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAbove, setIsAbove] = useState(dropUp);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    promoteStoredLocale();
  }, []);

  useEffect(() => {
    if (dropUp) {
      setIsAbove(true);
      return;
    }
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < 320 && rect.top > spaceBelow) {
      setIsAbove(true);
    } else {
      setIsAbove(false);
    }
  }, [open, dropUp]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function select(nextLocale: string) {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, nextLocale);
    } catch {
      /* localStorage unavailable (private mode) — cookie still works */
    }
    document.cookie = `${COOKIE_NAME}=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setOpen(false);
    if (nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
    }
  }

  const active = LOCALES[locale];

  return (
    <div ref={ref} className="relative shrink-0" data-od-id="language-switcher">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("selectLanguage")}
        className={cn(
          "inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg border border-foreground/15 text-[11.5px] xl:text-[12.5px] font-semibold text-foreground/75 transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0",
          compact ? "min-h-10 h-10 sm:min-h-11 sm:h-11 px-2 sm:px-2.5" : "min-h-11 h-11 px-2.5 xl:px-3",
          className
        )}
      >
        <span className="text-sm leading-none shrink-0" aria-hidden="true">
          {active.flag}
        </span>
        <span className={cn("truncate", compact ? "hidden sm:inline max-w-20" : "max-w-24")}>
          {active.label}
        </span>
        <ChevronDown
          size={14}
          className={cn("shrink-0 text-foreground/65 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("selectLanguage")}
          className={cn(
            "absolute end-0 z-50 w-48 max-h-[320px] overflow-y-auto rounded-xl border border-foreground/12 bg-[color:var(--background-secondary)] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md",
            isAbove ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          {Object.entries(LOCALES).map(([code, meta]) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={code === locale}
              onClick={() => select(code)}
              className={cn(
                "flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors",
                code === locale
                  ? "bg-primary/10 text-[#A98BFF]"
                  : "text-foreground/75 hover:bg-foreground/[0.06] hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <span className="text-base leading-none shrink-0" aria-hidden="true">
                  {meta.flag}
                </span>
                <span className="truncate">{meta.label}</span>
              </span>
              {code === locale && <Check size={14} className="shrink-0 text-[#A98BFF]" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
