"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Play,
  Star,
  ShieldCheck,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { fadeUp } from "@/components/fx/reveal";
import type { VideoItem } from "@/components/sections/Testimonials";

export interface ReviewCard {
  text: string;
  name: string;
  location?: string;
  source?: string;
  rating?: number;
  image?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  date?: string | null;
  amount?: string | null;
}

type SourceKey = "trustpilot" | "x" | "reddit" | "discord";

interface WallCard extends ReviewCard {
  sourceKey: SourceKey;
  sourceLabel: string;
  handle?: string;
  url?: string;
}

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TrustpilotStarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#00B67A" aria-hidden="true">
      <path d="m12 1.75 3.167 6.417 7.083 1.03-5.125 4.995 1.21 7.058L12 17.925l-6.335 3.325 1.21-7.058-5.125-4.995 7.083-1.03z" />
    </svg>
  );
}

const SOURCE_STYLE: Record<
  SourceKey,
  {
    tint: string;
    chip: string;
    avatar: string;
    avatarBg: string;
    border: string;
    cardBg: string;
    glow: string;
    cta: string;
    ctaBg: string;
  }
> = {
  discord: {
    border: "border-[#5865F2]/40 hover:border-[#5865F2]",
    cardBg: "bg-[#0e1329]/90 backdrop-blur-md",
    glow: "hover:shadow-[0_0_30px_rgba(88,101,242,0.35)]",
    tint: "text-[#5865F2]",
    chip: "text-white bg-[#5865F2] border-[#7983F5]/80 shadow-sm shadow-[#5865F2]/30",
    avatar: "border-2 border-[#7983F5] text-white",
    avatarBg: "bg-[#5865F2] shadow-md shadow-[#5865F2]/40",
    cta: "Join Discord",
    ctaBg: "bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-md shadow-[#5865F2]/30 hover:scale-[1.02]",
  },
  trustpilot: {
    border: "border-emerald-500/30 hover:border-[#00B67A]",
    cardBg: "bg-[#091e19]/90 backdrop-blur-md",
    glow: "hover:shadow-[0_0_30px_rgba(0,182,122,0.3)]",
    tint: "text-[#00B67A]",
    chip: "text-white bg-[#00B67A] border-emerald-400/80 shadow-sm shadow-[#00B67A]/30",
    avatar: "border-2 border-emerald-400 text-white",
    avatarBg: "bg-[#00B67A] shadow-md shadow-[#00B67A]/40",
    cta: "View on Trustpilot",
    ctaBg: "bg-[#00B67A] hover:bg-[#009E69] text-white shadow-md shadow-[#00B67A]/30 hover:scale-[1.02]",
  },
  x: {
    border: "border-white/20 hover:border-white/40",
    cardBg: "bg-[#141824]/90 backdrop-blur-md",
    glow: "hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
    tint: "text-white",
    chip: "text-white bg-white/20 border-white/30",
    avatar: "border-2 border-white/40 text-white",
    avatarBg: "bg-white/20",
    cta: "Read on X",
    ctaBg: "bg-white/15 hover:bg-white/25 text-white border border-white/20",
  },
  reddit: {
    border: "border-violet-500/30 hover:border-violet-400",
    cardBg: "bg-[#19112e]/90 backdrop-blur-md",
    glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    tint: "text-[#A98BFF]",
    chip: "text-white bg-[#8B5CF6] border-violet-400/80 shadow-sm shadow-[#8B5CF6]/30",
    avatar: "border-2 border-violet-400 text-white",
    avatarBg: "bg-[#8B5CF6] shadow-md shadow-[#8B5CF6]/40",
    cta: "View on Reddit",
    ctaBg: "bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/30 hover:scale-[1.02]",
  },
};

function normalizeSource(source: string | undefined): { key: SourceKey; label: string } {
  const s = (source || "").toLowerCase();
  if (s.includes("discord")) return { key: "discord", label: "Discord" };
  if (s.includes("trustpilot")) return { key: "trustpilot", label: "Trustpilot" };
  if (s.includes("reddit")) return { key: "reddit", label: "Reddit" };
  if (s === "x" || s.includes("twitter")) return { key: "x", label: "X" };
  return { key: "trustpilot", label: source || "Trustpilot" };
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-1 items-center" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-[#00B67A] text-[#00B67A]" : "fill-transparent text-gray-600"}
        />
      ))}
    </div>
  );
}

/** Real fallback data representing verified trader social proof */
const TRUSTPILOT_FALLBACK: WallCard[] = [
  {
    sourceKey: "discord",
    sourceLabel: "Discord",
    rating: 5,
    text: "I just received my second payout from CK Capital - and I can't even put into words how happy and proud I am to be part of this company! From the very beginning, I had trust and I invested in CK Capital - and let me tell you: it was so worth it.",
    name: "Pedro Perez",
    location: "Funded Trader",
    amount: "$6,578.00",
    imageWidth: 1400,
    imageHeight: 760,
    date: "2025-06-25",
    source: "Discord",
    url: "https://discord.com/invite/hGSVx9CmS2",
  },
  {
    sourceKey: "trustpilot",
    sourceLabel: "Trustpilot",
    rating: 5,
    text: "Best customer support experience especially on discord. Their plan rules also straightforward as all in their faq website.",
    name: "Aiman A.",
    location: "Malaysia",
    source: "Trustpilot",
    url: "https://www.trustpilot.com/review/ckcapital.co.uk",
  },
  {
    sourceKey: "discord",
    sourceLabel: "Discord",
    rating: 5,
    text: "THANK YOU so much CK Capital! Means the world! Thanks for all the support throughout from start to finish! Looking forward to continuing my journey with the CK Fam!",
    name: "Jackie KK",
    location: "Funded Trader",
    amount: "$19,051.00",
    imageWidth: 1400,
    imageHeight: 760,
    date: "2025-06-25",
    source: "Discord",
    url: "https://discord.com/invite/hGSVx9CmS2",
  },
  {
    sourceKey: "discord",
    sourceLabel: "Discord",
    rating: 5,
    text: "Very first payout with CK Capital. Still need to pinch myself that this is actually real. Thank you so so much to my CK family. Appreciate all of you so so much. US vs US!!! Let's go!",
    name: "mausi91",
    location: "Funded Trader",
    amount: "$17,260.00",
    imageWidth: 1388,
    imageHeight: 1084,
    date: "2025-08-01",
    source: "Discord",
    url: "https://discord.com/invite/hGSVx9CmS2",
  },
  {
    sourceKey: "trustpilot",
    sourceLabel: "Trustpilot",
    rating: 5,
    text: "CK cap is my new favorite prop firm. The rules are very trader friendly and almost all pairs are available especially indices.",
    name: "Ghecel V.",
    location: "Philippines",
    source: "Trustpilot",
    url: "https://www.trustpilot.com/review/ckcapital.co.uk",
  },
  {
    sourceKey: "discord",
    sourceLabel: "Discord",
    rating: 5,
    text: "First ever payout. Honestly, an awesome feeling, can't wait for the opportunity for the next one!",
    name: "JohnnyTrades28",
    location: "Funded Trader",
    amount: "$11,405.00",
    imageWidth: 1430,
    imageHeight: 894,
    date: "2025-07-23",
    source: "Discord",
    url: "https://discord.com/invite/hGSVx9CmS2",
  },
  {
    sourceKey: "discord",
    sourceLabel: "Discord",
    rating: 5,
    text: "I want to express my gratitude to CK Capital Prop Firm and its CEO, Dan Cheung, for the prompt payout of my funded account. Delivered the payout on time.",
    name: "Wakeel Ahmed",
    location: "Funded Trader",
    amount: "$14,642.00",
    imageWidth: 1400,
    imageHeight: 760,
    date: "2025-06-25",
    source: "Discord",
    url: "https://discord.com/invite/hGSVx9CmS2",
  },
  {
    sourceKey: "trustpilot",
    sourceLabel: "Trustpilot",
    rating: 5,
    text: "CK PROPFIRM is currently one of my top choices for prop firms — the dashboard is simple, and the support team is quick to respond.",
    name: "Sandi G.",
    location: "Indonesia",
    source: "Trustpilot",
    url: "https://www.trustpilot.com/review/ckcapital.co.uk",
  },
  {
    sourceKey: "discord",
    sourceLabel: "Discord",
    rating: 5,
    text: "Just received my 1st CK payout. The support during the waiting time was always great. I hope this is the starting point of a success story.",
    name: "jensf5650",
    location: "Funded Trader",
    amount: "$7,469.00",
    imageWidth: 1400,
    imageHeight: 760,
    date: "2025-06-25",
    source: "Discord",
    url: "https://discord.com/invite/hGSVx9CmS2",
  },
];

function safeT(t: any, key: string, fallback: string): string {
  try {
    if (typeof t?.has === "function" && t.has(key)) {
      return t(key);
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Dynamic Card Height Calculation based on exact image aspect ratios:
 * For cards with screenshots: exact pixel height = colWidth / (imageWidth / imageHeight)
 * For text-only reviews: proportional height based on text length
 */
export function getCardEstimatedHeight(card: WallCard, colWidth = 380): number {
  if (card.image && card.imageWidth && card.imageHeight && card.imageHeight > 0) {
    return Math.round(colWidth * (card.imageHeight / card.imageWidth));
  }
  if (card.image) {
    return Math.round(colWidth / 1.84); // Standard payout certificate ratio fallback
  }
  const len = (card.text || "").length;
  if (len < 100) return 190;
  if (len < 220) return 230;
  return 280;
}

/**
 * Detect cards with low height (panoramic banners, short screenshots, or cramped aspect ratios).
 * Hides them from display whether they originate from CMS or static fallback.
 */
export function isLowHeightCard(card: ReviewCard | WallCard): boolean {
  // If it has image dimensions specified:
  if (card.imageWidth && card.imageHeight && card.imageHeight > 0 && card.imageWidth > 0) {
    // 1. Raw image height is too small to be a legible payout proof or card
    if (card.imageHeight < 280) return true;
    // 2. Extreme panoramic / low height aspect ratio (e.g. width / height > 2.1)
    // A standard certificate is ~1.84 (1400 / 760) which renders at ~206px height.
    // Anything above 2.1 renders under 180px in desktop columns, squishing review text and actions.
    if (card.imageWidth / card.imageHeight > 2.1) return true;
  }

  // 3. Check estimated rendered height in standard column (minimum 180px required for full card content)
  const estHeight = getCardEstimatedHeight(card as WallCard, 380);
  if (estHeight < 180) return true;

  return false;
}

export function TraderReviews({
  reviews = [],
  video,
}: {
  reviews?: ReviewCard[];
  video?: VideoItem;
}) {
  const t = useTranslations("reviews");
  const tr = (key: string, fallback: string) => safeT(t, key, fallback);

  const [activeTab, setActiveTab] = useState<"all" | "discord" | "trustpilot">("all");
  const [showAll, setShowAll] = useState(false);

  // Use CMS reviews if provided, else fallback — filter out invalid names and low-height cards
  const realReviews = reviews.filter(
    (r) =>
      r.name &&
      r.name.trim().length > 0 &&
      !/^verified trader$/i.test(r.name.trim()) &&
      !isLowHeightCard(r)
  );

  const wallCards: WallCard[] = useMemo(() => {
    const rawList = realReviews.length > 0 ? realReviews : TRUSTPILOT_FALLBACK;
    // Ensure all cards (CMS or fallback) exclude low-height items
    const filteredList = rawList.filter((r) => !isLowHeightCard(r));
    return filteredList.map((r) => {
      const { key, label } = normalizeSource(r.source);
      return {
        ...r,
        sourceKey: key,
        sourceLabel: label,
        url:
          key === "discord"
            ? "https://discord.com/invite/hGSVx9CmS2"
            : "https://www.trustpilot.com/review/ckcapital.co.uk",
      };
    });
  }, [realReviews]);

  // Tab filtering
  const filteredCards = useMemo(() => {
    if (activeTab === "discord") return wallCards.filter((c) => c.sourceKey === "discord");
    if (activeTab === "trustpilot") return wallCards.filter((c) => c.sourceKey === "trustpilot");
    return wallCards;
  }, [wallCards, activeTab]);

  // Display limits: 9 cards on desktop (3 columns x 3 rows), 3 cards initial on mobile
  const visibleCards = showAll ? filteredCards : filteredCards.slice(0, 9);
  const mobileVisibleCards = showAll ? filteredCards : filteredCards.slice(0, 3);

  const discordCount = wallCards.filter((c) => c.sourceKey === "discord").length;
  const trustpilotCount = wallCards.filter((c) => c.sourceKey === "trustpilot").length;

  // Smart Height Balancing: Distribute cards across the 3 columns by cumulative height
  const columns: WallCard[][] = useMemo(() => {
    const cols: WallCard[][] = [[], [], []];
    const heights = [0, 0, 0];

    // If video exists, column 0 starts with video card (~420px)
    if (video && activeTab === "all") {
      heights[0] += 420;
    }

    visibleCards.forEach((card) => {
      // Find column with minimum current cumulative height
      let shortest = 0;
      for (let c = 1; c < 3; c++) {
        if (heights[c] < heights[shortest]) {
          shortest = c;
        }
      }

      cols[shortest].push(card);
      const estimatedPx = getCardEstimatedHeight(card);
      heights[shortest] += estimatedPx + 20; // card height + gap
    });

    return cols;
  }, [visibleCards, video, activeTab]);

  return (
    <section
      className="scroll-mt-28 bg-white text-[#111827] py-14 md:py-24"
      data-od-id="trader-reviews"
    >
      <Container>
        {/* Section Header: Standard design system matching TradingPlatforms & HowItWorks */}
        <SectionReveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="text-xs text-[#A98BFF] uppercase tracking-[0.2em] font-bold mb-3">
            {tr("eyebrow", "The Trusted Choice For Traders")}
          </p>

          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-black text-[#0A0A0C] md:text-4xl">
            {tr("title", "The trusted choice for CK traders")}
          </h2>

          <p className="mt-3 text-[#4B5563] font-medium max-w-xl mx-auto">
            {tr(
              "subtitle",
              "Real feedback, authenticated Discord payout receipts, and stories from funded community members."
            )}
          </p>

          {/* Clean standard filter tabs — only shown when multiple sources exist to filter */}
          {trustpilotCount > 0 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setShowAll(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "all"
                    ? "bg-[#5865F2] text-white shadow-md shadow-[#5865F2]/30 border border-[#7983F5]"
                    : "bg-white/10 text-slate-300 hover:text-white border border-white/15 hover:border-white/30"
                }`}
              >
                <span>{tr("filterAll", "All Reviews")}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                  {wallCards.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("discord");
                  setShowAll(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "discord"
                    ? "bg-[#5865F2] text-white shadow-md shadow-[#5865F2]/40 border border-[#7983F5]"
                    : "bg-white/10 text-slate-300 hover:text-white border border-white/15 hover:border-white/30"
                }`}
              >
                <DiscordIcon className="w-3.5 h-3.5" />
                <span>{tr("filterDiscord", "Discord Payouts & Proof")}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                  {discordCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("trustpilot");
                  setShowAll(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "trustpilot"
                    ? "bg-[#00B67A] text-white shadow-md shadow-[#00B67A]/40 border border-emerald-400"
                    : "bg-white/10 text-slate-300 hover:text-white border border-white/15 hover:border-white/30"
                }`}
              >
                <TrustpilotStarIcon className="w-3.5 h-3.5 text-white" />
                <span>{tr("filterTrustpilot", "Trustpilot Reviews")}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                  {trustpilotCount}
                </span>
              </button>
            </div>
          )}
        </SectionReveal>

        {/* Mobile Vertical Feed (< md): Clean full-width stacked cards with embedded screenshots */}
        <div className="md:hidden flex flex-col gap-4" data-od-id="trader-reviews-mobile-feed">
          {video && activeTab === "all" && (
            <div className="w-full">
              <VideoCard video={video} />
            </div>
          )}
          {mobileVisibleCards.map((card, i) => (
            <MobileReviewCard key={`mobile-${card.name}-${i}`} card={card} index={i} />
          ))}
        </div>

        {/* Desktop / Tablet Multi-Column Masonry (>= md) with Smart Height Balancing */}
        <div
          className="hidden md:grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3"
          data-od-id="trader-reviews-wall"
        >
          {columns.map((columnCards, columnIndex) => (
            <div
              key={columnIndex}
              className="flex min-w-0 flex-col gap-5"
            >
              {columnIndex === 0 && video && activeTab === "all" && (
                <VideoCard video={video} />
              )}
              {columnCards.map((card, cardIndex) => {
                const index = columnIndex + cardIndex * 3;
                return <WallMasonryCard key={`${card.name}-${index}`} card={card} index={index} />;
              })}
            </div>
          ))}
        </div>

        {/* Toggle Show More / Show Less */}
        {filteredCards.length > 3 && (
          <div className="mt-10 md:mt-12 flex justify-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="group inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-[#121833]/90 hover:bg-purple-600 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 shadow-lg hover:shadow-purple-600/30"
            >
              <span>{showAll ? tr("showLess", "Show Less") : `${tr("showMore", "Show More Reviews")} (${filteredCards.length - (showAll ? 0 : 3)} more)`}</span>
              {showAll ? (
                <ChevronUp size={16} className="transition-transform group-hover:-translate-y-0.5" />
              ) : (
                <ChevronDown size={16} className="transition-transform group-hover:translate-y-0.5" />
              )}
            </button>
          </div>
        )}

        {/* Section Disclaimer */}
        <p
          className="mx-auto mt-12 max-w-2xl text-center text-xs leading-6 text-slate-400/80"
          data-od-id="trader-reviews-disclaimer"
        >
          {tr(
            "disclaimer",
            "Reviews reflect individual experiences and do not guarantee future results. CK Propfirm provides simulated trading evaluations only."
          )}
        </p>
      </Container>
    </section>
  );
}

/**
 * MobileReviewCard:
 * - Clean vertical feed card designed for mobile screens
 * - Trader info, authentic review text, and embedded proof screenshot in native aspect ratio
 * - 100% visible, zero cropping, zero cut-off cards, native mobile scrolling
 */
function MobileReviewCard({ card, index }: { card: WallCard; index: number }) {
  const style = SOURCE_STYLE[card.sourceKey] || SOURCE_STYLE.discord;
  const hasScreenshot = Boolean(card.image);
  const ratio =
    card.image && card.imageWidth && card.imageHeight && card.imageHeight > 0
      ? `${card.imageWidth} / ${card.imageHeight}`
      : card.image
      ? "1400 / 760"
      : undefined;

  return (
    <motion.article
      variants={fadeUp}
      className={`w-full rounded-2xl border ${style.border} ${style.cardBg} p-4 sm:p-5 shadow-lg flex flex-col gap-3.5`}
      data-od-id={`mobile-review-${index}`}
    >
      {/* Top Header: Identity & Source */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-black ${style.avatarBg} ${style.avatar}`}
          >
            {card.sourceKey === "discord" ? (
              <DiscordIcon className="w-4 h-4" />
            ) : (
              (card.name || "T").replace(/^u\//, "").charAt(0).toUpperCase()
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white tracking-wide">{card.name}</p>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              {card.date || card.location || "Funded Trader"}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider border shrink-0 ${style.chip}`}
        >
          {card.sourceKey === "discord" && <DiscordIcon className="w-3 h-3" />}
          {card.sourceKey === "trustpilot" && <TrustpilotStarIcon className="w-3 h-3 text-white" />}
          {card.sourceLabel}
        </span>
      </div>

      {/* Payout Tag & Stars */}
      <div className="flex items-center justify-between gap-2">
        {card.amount ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm shadow-emerald-500/10">
            <ShieldCheck size={13} className="text-emerald-300" />
            {card.amount} Payout Proof
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">Community Member</span>
        )}
        <StarRating rating={card.rating || 5} />
      </div>

      {/* Review Quote */}
      <blockquote className="text-[13px] leading-relaxed text-slate-200 font-normal">
        &ldquo;{card.text}&rdquo;
      </blockquote>

      {/* Embedded Proof Screenshot (native aspect ratio, 100% visible, zero crop) */}
      {hasScreenshot && (
        <div className="mt-1 relative w-full overflow-hidden rounded-xl border border-white/15 bg-[#090d1f] shadow-md">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
            <Image
              src={card.image!}
              alt={`${card.name} payout proof`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
              priority={index < 2}
            />
          </div>
          <div className="absolute top-2.5 right-2.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5865F2]/90 text-white border border-[#7983F5]/80 shadow-md backdrop-blur-md">
              <DiscordIcon className="w-3 h-3" />
              Verified Proof
            </span>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="mt-1 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <Sparkles size={12} className="text-emerald-400" />
          Verified Community Trader
        </span>
        <a
          href={
            card.url ||
            (card.sourceKey === "discord"
              ? "https://discord.com/invite/hGSVx9CmS2"
              : "https://www.trustpilot.com/review/ckcapital.co.uk")
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all ${style.ctaBg}`}
          aria-label={`${style.cta} - ${card.name}`}
        >
          {card.sourceKey === "discord" && <DiscordIcon className="w-3.5 h-3.5" />}
          {card.sourceKey === "trustpilot" && <TrustpilotStarIcon className="w-3.5 h-3.5 text-white" />}
          <span>{style.cta}</span>
          <ArrowUpRight size={12} />
        </a>
      </div>
    </motion.article>
  );
}

/**
 * WallMasonryCard:
 * - Dynamically sized to the EXACT aspect ratio of the screenshot (zero cropping, perfectly into ratio)
 * - Text shown by default
 * - On hover (or mobile tap): Authentic proof screenshot reveals 100% visible, edge-to-edge, zero cropping
 * - Unobtrusive top-right Join Discord floating pill
 */
function WallMasonryCard({
  card,
  index,
}: {
  card: WallCard;
  index: number;
}) {
  const style = SOURCE_STYLE[card.sourceKey] || SOURCE_STYLE.discord;
  const hasScreenshot = Boolean(card.image);
  const [mobileToggled, setMobileToggled] = useState(false);

  // Exact Aspect Ratio: card scales to the exact ratio of the screenshot with 0 cropping
  const ratio =
    card.image && card.imageWidth && card.imageHeight && card.imageHeight > 0
      ? `${card.imageWidth} / ${card.imageHeight}`
      : card.image
      ? "1400 / 760"
      : undefined;

  const cardStyle: React.CSSProperties = ratio
    ? { aspectRatio: ratio, minHeight: "180px" }
    : { minHeight: "200px" };

  return (
    <motion.article
      variants={fadeUp}
      onClick={() => {
        if (hasScreenshot) setMobileToggled((prev) => !prev);
      }}
      style={cardStyle}
      className={`group relative overflow-hidden rounded-2xl border ${style.border} ${style.cardBg} ${style.glow} p-4 sm:p-5 shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer`}
      data-od-id={`trader-review-${index}`}
    >
      {/* 
        Proof Screenshot Layer:
        Fits EXACTLY into the card's aspect-ratio container (100% visible, zero cropping, zero letterbox)
      */}
      {hasScreenshot && (
        <div
          className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-300 ease-out ${
            mobileToggled
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
          }`}
        >
          <Image
            src={card.image!}
            alt={`${card.name} proof`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.01]"
            priority={index < 3}
          />

          {/* Floating Discord CTA at bottom-right — matching default view position and preserving header clarity */}
          <div className="absolute bottom-3 right-3 z-10">
            <a
              href={card.url || "https://discord.com/invite/hGSVx9CmS2"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide bg-[#5865F2] hover:bg-[#4752C4] text-white border border-[#7983F5]/80 shadow-lg shadow-[#5865F2]/40 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
              <DiscordIcon className="w-3.5 h-3.5" />
              <span>Join Discord</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      )}

      {/* 
        Default Review Content:
        Fades on hover when screenshot is revealed
        All sections use shrink-0 with line-clamp-2 on quotes so Discord button is guaranteed 100% visible
      */}
      <div
        className={`relative z-10 flex flex-col h-full justify-between min-h-0 transition-opacity duration-300 ${
          hasScreenshot && mobileToggled
            ? "opacity-0 pointer-events-none"
            : hasScreenshot
            ? "group-hover:opacity-0 group-hover:pointer-events-none"
            : ""
        }`}
      >
        <div className="flex flex-col min-h-0 overflow-hidden">
          {/* Top identity row */}
          <div className="flex items-start justify-between gap-2 mb-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${style.avatarBg} ${style.avatar}`}
              >
                {card.sourceKey === "discord" ? (
                  <DiscordIcon className="w-3.5 h-3.5" />
                ) : (
                  (card.name || "T").replace(/^u\//, "").charAt(0).toUpperCase()
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs sm:text-[13px] font-bold text-white tracking-wide leading-tight">
                  {card.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {card.date || card.location || "Funded Trader"}
                </p>
              </div>
            </div>

            {/* Source badge */}
            <div className="shrink-0">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider border ${style.chip}`}
              >
                {card.sourceKey === "discord" && <DiscordIcon className="w-3 h-3" />}
                {card.sourceKey === "trustpilot" && <TrustpilotStarIcon className="w-3 h-3 text-white" />}
                {card.sourceLabel}
              </span>
            </div>
          </div>

          {/* Payout badge & Star rating row */}
          <div className="mb-2 flex items-center justify-between gap-2 shrink-0">
            {card.amount ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm shadow-emerald-500/10">
                <ShieldCheck size={11} className="text-emerald-300" />
                {card.amount} Payout
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">Community Member</span>
            )}
            <StarRating rating={card.rating || 5} />
          </div>

          {/* Review Quote: Clamped to 2 lines with ellipses so it never overflows */}
          <blockquote className="text-xs leading-relaxed text-slate-200 font-normal line-clamp-2 overflow-hidden text-ellipsis">
            &ldquo;{card.text}&rdquo;
          </blockquote>
        </div>

        {/* Card Actions Footer: shrink-0 and mt-auto guarantees button is ALWAYS visible */}
        <div className="mt-auto pt-2 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
          {hasScreenshot ? (
            <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 rounded-md px-1.5 py-0.5">
              <Eye size={10} />
              Hover for Proof
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[9.5px] font-medium text-slate-400">
              <Sparkles size={10} className="text-emerald-400" />
              Verified Review
            </span>
          )}

          <a
            href={
              card.url ||
              (card.sourceKey === "discord"
                ? "https://discord.com/invite/hGSVx9CmS2"
                : "https://www.trustpilot.com/review/ckcapital.co.uk")
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1 rounded-lg transition-all ml-auto shrink-0 ${style.ctaBg}`}
            aria-label={`${style.cta} - ${card.name}`}
          >
            {card.sourceKey === "discord" && <DiscordIcon className="w-3 h-3" />}
            {card.sourceKey === "trustpilot" && <TrustpilotStarIcon className="w-3 h-3 text-white" />}
            <span>{style.cta}</span>
            <ArrowUpRight size={10} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  const t = useTranslations("reviews");
  const tr = (key: string, fallback: string) => safeT(t, key, fallback);
  const [playing, setPlaying] = useState(false);

  return (
    <motion.article
      variants={fadeUp}
      className="overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0c1024]/90 backdrop-blur-md shadow-md min-h-[340px]"
      data-od-id="trader-reviews-video"
    >
      <div
        className="group relative aspect-[4/5] w-full cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Play trader story: ${video.title}`}
        onClick={() => setPlaying((p) => !p)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPlaying((p) => !p);
          }
        }}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            {video.thumbnail && (
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 group-hover:from-black/70 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/40 transition-all group-hover:scale-110 group-hover:border-white">
                <Play size={20} fill="currentColor" className="ml-0.5 text-white" />
              </div>
            </div>
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/80 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5865F2]" />
                {tr("traderStory", "Trader story")}
              </div>
              {video.reward && (
                <div className="rounded-lg border border-emerald-400/50 bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
                  {video.reward}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.article>
  );
}
