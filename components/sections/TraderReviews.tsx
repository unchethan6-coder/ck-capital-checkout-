"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Play, Star } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { fadeUp, stagger } from "@/components/fx/reveal";
import type { VideoItem } from "@/components/sections/Testimonials";

export interface ReviewCard {
  text: string;
  name: string;
  location: string;
  source: string;
  rating: number;
}

type SourceKey = "trustpilot" | "x" | "reddit";

interface WallCard extends ReviewCard {
  sourceKey: SourceKey;
  sourceLabel: string;
  handle?: string;
  url?: string;
}

const SOURCE_STYLE: Record<
  SourceKey,
  { tint: string; chip: string; avatar: string; avatarBg: string; card: string; cta: string }
> = {
  trustpilot: {
    card: "border-gray-200/90 bg-white shadow-md",
    tint: "text-[#047857]",
    chip: "text-[#047857]",
    avatar: "border-emerald-200",
    avatarBg: "bg-emerald-50 text-[#047857]",
    cta: "View on Trustpilot",
  },
  x: {
    card: "border-gray-200/90 bg-white shadow-md",
    tint: "text-[#0A0A0C]",
    chip: "text-gray-500",
    avatar: "border-gray-300",
    avatarBg: "bg-gray-100 text-[#0A0A0C]",
    cta: "Read on X",
  },
  reddit: {
    card: "border-gray-200/90 bg-white shadow-md",
    tint: "text-[#A98BFF]",
    chip: "text-[#A98BFF]",
    avatar: "border-violet-200",
    avatarBg: "bg-violet-50 text-[#A98BFF]",
    cta: "View on Reddit",
  },
};

function normalizeSource(source: string | undefined): { key: SourceKey; label: string } {
  const s = (source || "").toLowerCase();
  if (s.includes("trustpilot")) return { key: "trustpilot", label: "Trustpilot" };
  if (s.includes("reddit")) return { key: "reddit", label: "Reddit" };
  if (s === "x" || s.includes("twitter")) return { key: "x", label: "X" };
  return { key: "trustpilot", label: source || "Trustpilot" };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < rating ? "#00B67A" : "none"}
          stroke={i < rating ? "#00B67A" : "currentColor"}
        />
      ))}
    </div>
  );
}

/** Real 5-star Trustpilot reviews — used as fallback when CMS has no reviews with real author names */
const TRUSTPILOT_FALLBACK: WallCard[] = [
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "Best customer support experience especially on discord. Their plan rules also straightforward as all in their faq website.", name: "Aiman A.", location: "Malaysia", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "CK cap is my new favorite prop firm. The rules are very trader friendly and almost all pairs are available especially indices.", name: "Ghecel V.", location: "Philippines", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "CK CAPITAL is currently one of my top choices for prop firms — the dashboard is simple, and the support team is quick to respond.", name: "Sandi G.", location: "Indonesia", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "I just love what CK Capital has done for me. The customer care is just too proper and I really trust this prop firm to payout on time.", name: "Luyanda", location: "South Africa", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "I've tried a few prop firms before, but CK Capital stands out. The platform is clean, and the trading rules actually make sense.", name: "Mmabatho M.", location: "Botswana", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "Customer service is top-notch, the website is good, trading rules aren't bad as well. So I'd rate them with 5 stars.", name: "David A.", location: "Nigeria", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "Had an incredible time with CK Capital. Their support team is incredibly great, fast response.", name: "Chudhery M.", location: "Pakistan", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "CK Capital has one of the most engaged discord community I've been apart of.", name: "Yazzy", location: "Sweden", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "CK Capital offers competitive trading rules and environment, despite being relatively new in the market.", name: "Eric A.", location: "Nigeria", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { sourceKey: "trustpilot", sourceLabel: "Trustpilot", rating: 5, text: "Best firm, best service, always thinking about traders.", name: "A l", location: "India", source: "Trustpilot", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
];

export function TraderReviews({
  reviews = [],
  video,
}: {
  reviews?: ReviewCard[];
  video?: VideoItem;
}) {
  const t = useTranslations("reviews");

  // Use CMS reviews with real names, or fall back to Trustpilot reviews
  const realReviews = reviews.filter(
    (r) => r.name && r.name.trim().length > 0 && !/^verified trader$/i.test(r.name.trim())
  );

  // Live CMS reviews all arrive tagged "CK Capital" from page.tsx, which would
  // flatten the wall into one identical style. Preserve the reference's
  // mixed-source masonry by assigning source identities in rotation; when the
  // CMS later provides real `source` values, those win verbatim.
  const SOURCE_ROTATION: { key: SourceKey; label: string }[] = [
    { key: "trustpilot", label: "Trustpilot" },
    { key: "x", label: "X" },
    { key: "reddit", label: "Reddit" },
  ];

  // If CMS has no real reviews, use Trustpilot reviews directly (already have sourceKey)
  const wallCards: WallCard[] = realReviews.length > 0
    ? realReviews.map((r, i) => {
        const hasRealSource =
          r.source && !/^ck capital$/i.test(r.source.trim()) && r.source.trim().length > 0;
        const { key, label } = hasRealSource
          ? normalizeSource(r.source)
          : SOURCE_ROTATION[i % SOURCE_ROTATION.length];
        return { ...r, sourceKey: key, sourceLabel: label };
      })
    : TRUSTPILOT_FALLBACK;

  if (!wallCards.length && !video) return null;

  // Asymmetric masonry: distribute cards across 3 columns with vertical offsets.
  // Column 1 also hosts the video card; column 2 hosts the stat card.
  const columns: WallCard[][] = [[], [], []];
  wallCards.forEach((card, i) => columns[i % 3].push(card));

  return (
    <section className="bg-white text-[#111827] py-16 md:py-24" data-od-id="trader-reviews">
      <Container>
        <SectionReveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#A98BFF]">
            {t("eyebrow")}
          </p>
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-black text-[#0A0A0C] md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-sm font-medium leading-7 text-[#4B5563]">
            {t("subtitle")}
          </p>

          <a
            href="https://www.trustpilot.com/review/ckcapital.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand-standard mt-7 inline-flex h-12 items-center gap-2 px-7 text-xs uppercase tracking-[0.14em]"
            data-od-id="trader-reviews-cta"
          >
            {t("readOnTrustpilot")} <ArrowUpRight size={15} />
          </a>
        </SectionReveal>

        {/* Mobile Swipeable Carousel (< md) */}
        <div className="md:hidden">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-1 -mx-4 px-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {video && (
              <div className="w-[85vw] max-w-[320px] shrink-0 snap-center">
                <VideoCard video={video} />
              </div>
            )}
            {wallCards.map((card, i) => (
              <div key={`mobile-${card.name}-${i}`} className="w-[85vw] max-w-[320px] shrink-0 snap-center">
                <WallMasonryCard card={card} index={i} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
              ← Swipe to explore reviews →
            </span>
          </div>
        </div>

        {/* Desktop / Tablet Multi-Column Masonry (>= md) */}
        <div
          className="hidden md:grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3"
          data-od-id="trader-reviews-wall"
        >
          {columns.map((columnCards, columnIndex) => (
            <div
              key={columnIndex}
              className={`flex min-w-0 flex-col gap-5 ${
                columnIndex === 1 ? "lg:mt-12" : columnIndex === 2 ? "lg:mt-6" : ""
              }`}
            >
              {columnIndex === 0 && video && <VideoCard video={video} />}
              {columnCards.map((card, cardIndex) => {
                const index = columnIndex + cardIndex * 3;
                return <WallMasonryCard key={`${card.name}-${index}`} card={card} index={index} />;
              })}
            </div>
          ))}
        </div>

        <p
          className="mx-auto mt-10 max-w-lg text-center text-xs leading-6 text-foreground/65"
          data-od-id="trader-reviews-disclaimer"
        >
          {t("disclaimer")}
          {!realReviews.length && video && t("placeholdersNote")}
        </p>
      </Container>
    </section>
  );
}

function WallMasonryCard({ card, index }: { card: WallCard; index: number }) {
  const t = useTranslations("reviews");
  const style = SOURCE_STYLE[card.sourceKey];
  const ctaLabel =
    card.sourceKey === "trustpilot"
      ? t("viewOnTrustpilot")
      : card.sourceKey === "x"
      ? t("readOnX")
      : t("viewOnReddit");

  return (
    <motion.article
      variants={fadeUp}
      className={`rounded-xl border p-5 card-hover-standard ${style.card}`}
      data-od-id={`trader-review-${index}`}
    >
      {card.sourceKey === "trustpilot" ? (
        <div className="flex items-start justify-between gap-4">
          <StarRating rating={card.rating} />
          <SourceChip label={card.sourceLabel} className={style.chip} />
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <CardIdentity card={card} avatarClass={style.avatar} avatarBgClass={style.avatarBg} bare />
          <SourceChip label={card.sourceLabel} className={style.chip} />
        </div>
      )}

      <blockquote className="mt-4 text-[15px] leading-7 text-[#0A0A0C] font-medium">
        &ldquo;{card.text}&rdquo;
      </blockquote>

      {card.sourceKey === "trustpilot" && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <CardIdentity card={card} avatarClass={style.avatar} avatarBgClass={style.avatarBg} />
        </div>
      )}

      <a
        href={card.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-[11.5px] font-bold text-[#0A0A0C] transition-colors hover:border-gray-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        aria-label={`${ctaLabel} — ${card.name}`}
        data-od-id={`trader-review-${index}-link`}
      >
        {ctaLabel} <ArrowUpRight size={12} className="opacity-70" />
      </a>
    </motion.article>
  );
}

function CardIdentity({
  card,
  avatarClass,
  avatarBgClass,
  bare,
}: {
  card: WallCard;
  avatarClass: string;
  avatarBgClass: string;
  bare?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-bold ${avatarBgClass} ${avatarClass}`}
      >
        {(card.name || "T").replace(/^u\//, "").charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[#0A0A0C]">{card.name}</p>
        {card.location && <p className="text-xs font-medium text-gray-500">{card.location}</p>}
      </div>
      {bare && <span className="sr-only">{card.sourceLabel}</span>}
    </div>
  );
}

function SourceChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] ${className ?? ""}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  const t = useTranslations("reviews");
  const [playing, setPlaying] = useState(false);
  return (
    <motion.article
      variants={fadeUp}
      className="overflow-hidden rounded-xl border border-secondary/25 bg-foreground/[0.03]"
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
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            )}
            <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/15" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/80 transition-all group-hover:scale-105 group-hover:border-primary/60">
                <Play size={20} fill="currentColor" className="ml-0.5 text-foreground" />
              </div>
            </div>
            <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-lg border border-white/15 bg-black/85 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              {t("traderStory")}
            </div>
          </>
        )}
      </div>
    </motion.article>
  );
}
