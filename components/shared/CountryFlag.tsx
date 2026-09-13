"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Country flag chip.
 *
 * Renders the 3x2 SVG from `public/flags/3x2/<ISO>.svg` (country-flag-icons),
 * not an emoji — emoji flags don't render at all on Windows, which is where
 * most visitors are. Falls back to the plain ISO code if a flag is missing.
 */
export function CountryFlag({
  code,
  name,
  className,
  size = 16,
  withCode = false,
}: {
  code?: string | null;
  /** Accessible label; defaults to the country code. */
  name?: string | null;
  className?: string;
  /** Flag width in px (height follows the 3:2 ratio). */
  size?: number;
  /** Show the ISO code next to the flag. */
  withCode?: boolean;
}) {
  const iso = (code || "").trim().toUpperCase();
  const [failed, setFailed] = useState(false);
  const valid = /^[A-Z]{2}$/.test(iso);

  if (!valid || failed) {
    return (
      <span className={cn("text-[9px] font-bold uppercase tracking-wider", className)}>
        {iso || "--"}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 align-middle", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/flags/3x2/${iso}.svg`}
        alt={name || iso}
        title={name || iso}
        width={size}
        height={Math.round((size * 2) / 3)}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.14)]"
        style={{ width: size, height: Math.round((size * 2) / 3) }}
      />
      {withCode && (
        <span className="text-[9px] font-bold uppercase tracking-wider">{iso}</span>
      )}
    </span>
  );
}
