"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "ck-cookie-consent";

export type CookieChoice = "all" | "essential";

/** Read the stored choice. Returns null when the visitor has not decided yet. */
export function getCookieConsent(): CookieChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "all" || value === "essential" ? value : null;
  } catch {
    return null;
  }
}

/**
 * Cookie notice. Nothing beyond strictly necessary cookies may run until the
 * visitor accepts, so analytics/marketing scripts should listen for the
 * `ck:cookie-consent` event (or call getCookieConsent) before initialising.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getCookieConsent() === null) setVisible(true);
  }, []);

  const decide = (choice: CookieChoice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* private mode — the notice simply shows again next visit */
    }
    window.dispatchEvent(new CustomEvent("ck:cookie-consent", { detail: choice }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie notice"
      data-od-id="cookie-consent"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#080B18]/97 px-4 py-4 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">
            Cookie notice
          </p>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-white/75">
            We use strictly necessary cookies to run this site and to keep your
            evaluation dashboard session secure. With your permission we also use
            analytics and marketing cookies to measure how traders find our
            programmes. CK Capital provides simulated trading evaluations only — no
            cookie is used to execute, place or record live market trades. Read our{" "}
            <Link
              href="/cookie-policy"
              className="font-semibold text-[#A98BFF] underline underline-offset-2 hover:text-white"
            >
              Cookie Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-[#A98BFF] underline underline-offset-2 hover:text-white"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:ml-auto">
          <button
            type="button"
            onClick={() => decide("essential")}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-5 text-xs font-bold text-white transition-colors hover:border-white/40 hover:bg-white/[0.12]"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => decide("all")}
            className="brand-gradient-btn inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-xs font-bold text-[#1A1030] transition-transform hover:-translate-y-0.5"
          >
            Accept all cookies
          </button>
        </div>
      </div>
    </div>
  );
}
