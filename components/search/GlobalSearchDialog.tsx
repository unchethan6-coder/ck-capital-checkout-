"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Compass,
  Target,
  ShieldCheck,
  Layers,
  Zap,
  Gauge,
  HelpCircle,
  ExternalLink,
  DollarSign,
  Activity,
  TrendingUp,
  Users,
  Mail,
  LogIn,
  RefreshCw,
  FileText,
  BookOpen,
  Globe2,
  CandlestickChart,
  CornerDownLeft,
  Sparkles,
} from "lucide-react";
import { SEARCH_INDEX, SearchItem, SearchCategory } from "@/lib/searchIndex";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  Compass,
  Target,
  ShieldCheck,
  Layers,
  Zap,
  Gauge,
  HelpCircle,
  ExternalLink,
  DollarSign,
  Activity,
  TrendingUp,
  Users,
  Mail,
  LogIn,
  RefreshCw,
  FileText,
  BookOpen,
  Globe2,
  CandlestickChart,
};

interface GlobalSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchDialog({ isOpen, onClose }: GlobalSearchDialogProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Global escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default suggested items
      return SEARCH_INDEX.filter((item) =>
        [
          "challenge-1step",
          "challenge-2step-standard",
          "size-100k",
          "page-trading-objectives",
          "page-payouts",
          "rule-max-daily-loss",
          "platform-mt5",
          "action-signin",
          "action-discord",
        ].includes(item.id)
      );
    }

    return SEARCH_INDEX.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const badgeMatch = item.badge?.toLowerCase().includes(q);
      const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(q));
      return titleMatch || descMatch || badgeMatch || keywordMatch;
    });
  }, [query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.external || item.href.startsWith("http") || item.href.startsWith("mailto:")) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.href);
    }
  };

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: { [key in SearchCategory]?: { item: SearchItem; globalIndex: number }[] } = {};
    filteredItems.forEach((item, index) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category]!.push({ item, globalIndex: index });
    });
    return groups;
  }, [filteredItems]);

  const categoryOrder: SearchCategory[] = [
    "pages",
    "challenges",
    "rules",
    "platforms",
    "faq",
    "actions",
  ];

  const getCategoryLabel = (cat: SearchCategory): string => {
    try {
      return t(`categories.${cat}`);
    } catch {
      return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-0 sm:pt-20 px-0 sm:px-4 pb-0 sm:pb-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[560px] flex flex-col overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border border-primary/30 bg-[#0B0C10] sm:bg-[#0B0C10]/95 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.12)] backdrop-blur-xl"
            data-od-id="global-search-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("searchAria")}
          >
            {/* Input Header */}
            <div className="relative flex items-center border-b border-foreground/10 px-4 py-3.5 sm:px-5 sm:py-3.5 shrink-0 bg-[#121216] sm:bg-transparent">
              <Search size={19} className="text-[#A98BFF] shrink-0 mr-3 opacity-90" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("placeholder")}
                className="w-full bg-transparent text-[15px] sm:text-[15.5px] font-medium text-foreground placeholder:text-foreground/65 focus:outline-none focus:ring-0"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="p-1.5 rounded-md text-foreground/65 hover:text-foreground hover:bg-foreground/10 transition-colors mr-1 sm:mr-2 min-h-[36px] min-w-[36px] flex items-center justify-center"
                  aria-label={t("clear")}
                >
                  <X size={17} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="sm:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground bg-white/5 active:bg-white/10 min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0 ml-1"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-foreground/15 bg-foreground/[0.06] px-2 py-0.5 font-mono text-[10.5px] font-semibold text-foreground/65">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-3 sm:p-3 scrollbar-thin scrollbar-thumb-foreground/10"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <Search size={32} className="mx-auto mb-3 text-foreground/20" />
                  <p className="text-sm font-semibold text-foreground/80">
                    {t("noResults")} &ldquo;<span className="text-[#A98BFF]">{query}</span>&rdquo;
                  </p>
                  <p className="mt-1.5 text-xs text-foreground/65 max-w-sm mx-auto">
                    {t("tryAnother")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {!query && (
                    <div className="px-3 pt-1 pb-0 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A98BFF]/80">
                      <Sparkles size={11} /> {t("popularSearches")}
                    </div>
                  )}

                  {categoryOrder.map((category) => {
                    const group = groupedItems[category];
                    if (!group || group.length === 0) return null;

                    return (
                      <div key={category} className="space-y-1">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/65">
                          {getCategoryLabel(category)}
                        </div>

                        {group.map(({ item, globalIndex }) => {
                          const Icon = ICONS[item.iconName] || Target;
                          const isSelected = selectedIndex === globalIndex;

                          return (
                            <div
                              key={item.id}
                              data-index={globalIndex}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={cn(
                                "group relative flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 cursor-pointer transition-all duration-150",
                                isSelected
                                  ? "bg-primary/[0.12] border border-primary/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                                  : "hover:bg-foreground/[0.04] border border-transparent"
                              )}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                                    isSelected
                                      ? "border-primary/50 bg-primary/20 text-[#A98BFF]"
                                      : "border-foreground/10 bg-foreground/[0.03] text-foreground/60 group-hover:text-foreground"
                                  )}
                                >
                                  <Icon size={16} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "text-sm font-semibold truncate",
                                        isSelected ? "text-[#A98BFF]" : "text-foreground"
                                      )}
                                    >
                                      {item.title}
                                    </span>
                                    {item.badge && (
                                      <span
                                        className={cn(
                                          "px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider",
                                          isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-foreground/[0.08] text-foreground/70"
                                        )}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-foreground/65 truncate max-w-md mt-0.5">
                                    {item.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.external ? (
                                  <ExternalLink size={14} className="text-foreground/65" />
                                ) : (
                                  <CornerDownLeft
                                    size={14}
                                    className={cn(
                                      isSelected ? "text-[#A98BFF] opacity-100" : "text-foreground/65"
                                    )}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="hidden sm:flex items-center justify-between border-t border-foreground/10 bg-foreground/[0.02] px-4 py-2.5 text-[11px] text-foreground/65">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-foreground/15 bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold">
                    ↑
                  </kbd>
                  <kbd className="rounded border border-foreground/15 bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold">
                    ↓
                  </kbd>
                  <span>{t("footer.navigate")}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-foreground/15 bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold">
                    ↵
                  </kbd>
                  <span>{t("footer.select")}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-foreground/15 bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold">
                    ESC
                  </kbd>
                  <span>{t("footer.close")}</span>
                </span>
              </div>
              <span className="font-semibold text-[#A98BFF]/80">CK Capital</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
