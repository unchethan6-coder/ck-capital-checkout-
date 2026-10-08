"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { allTimeZones, zoneLabel } from "./timezones";

/**
 * Searchable timezone picker.
 *
 * There are over 400 IANA zones, so the list is filtered as you type and only
 * a slice is rendered — putting every option in the DOM is what makes a picker
 * like this feel slow. Fully keyboard operable: arrows move, Enter chooses,
 * Escape closes.
 */

/** Rendering more than this at once costs responsiveness for no benefit. */
const MAX_VISIBLE = 50;

interface TimezoneSelectProps {
  value: string;
  onChange: (zone: string) => void;
  label: string;
  searchPlaceholder: string;
}

export function TimezoneSelect({ value, onChange, label, searchPlaceholder }: TimezoneSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Computing offsets for 400+ zones is not free, so do it once.
  const zones = useMemo(() => {
    const at = new Date();
    return allTimeZones().map((zone) => ({ zone, label: zoneLabel(zone, at) }));
  }, []);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return zones.slice(0, MAX_VISIBLE);
    return zones.filter((z) => z.label.toLowerCase().includes(needle)).slice(0, MAX_VISIBLE);
  }, [zones, query]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const choose = (zone: string) => {
    onChange(zone);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && matches[active]) {
      e.preventDefault();
      choose(matches[active].zone);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-[var(--ck-line)] bg-[var(--ck-surface)] px-3 py-2 text-sm text-foreground transition-colors hover:border-[var(--ring)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
      >
        <span className="truncate">{zoneLabel(value)}</span>
        <ChevronDown size={15} aria-hidden className={cn("shrink-0 opacity-60 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-full min-w-[17rem] overflow-hidden rounded-lg border border-[var(--ck-line)] bg-[var(--popover)] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)]">
          <div className="relative border-b border-[var(--ck-line)] p-2">
            <Search size={14} aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              aria-controls={listId}
              className="w-full rounded-md border border-[var(--ck-line)] bg-[var(--ck-surface)] py-1.5 pr-2 pl-7 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
            />
          </div>
          <ul id={listId} role="listbox" aria-label={label} className="max-h-64 overflow-y-auto py-1">
            {matches.map((z, i) => {
              const selected = z.zone === value;
              return (
                <li key={z.zone}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(z.zone)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                      i === active ? "bg-white/[0.06] text-foreground" : "text-muted-foreground",
                      selected && "text-[#A98BFF]"
                    )}
                  >
                    <span className="truncate">{z.label}</span>
                    {selected && <Check size={14} aria-hidden className="shrink-0" />}
                  </button>
                </li>
              );
            })}
            {matches.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">—</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
