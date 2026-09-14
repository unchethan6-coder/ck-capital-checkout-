import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { ChallengeComparison } from "@/components/sections/ChallengeComparison";
import { FeatureStrip } from "@/components/sections/FeatureStrip";
import { TradingPlatforms } from "@/components/sections/TradingPlatforms";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProofShowcase } from "@/components/sections/ProofShowcase";
import { TraderStories } from "@/components/sections/TraderStories";
import { TraderReviews } from "@/components/sections/TraderReviews";
import { CustomerSupportSection } from "@/components/sections/CustomerSupportSection";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ClosingCta } from "@/components/sections/ClosingCta";
import {
  getVideoReviews,
  getChallengeConfig,
  getPayouts,
  getRewardsSummary,
  getArticles,
  getFeedbacks,
} from "@/lib/cms";
import type { VideoItem } from "@/components/sections/Testimonials";
import type { ReviewCard } from "@/components/sections/TraderReviews";

export const revalidate = 300;

export default async function Home() {
  const [videos, challengeConfig, payouts, rewardsSummary, articles, feedbacks] =
    await Promise.all([
      getVideoReviews(),
      getChallengeConfig(),
      getPayouts(),
      getRewardsSummary(),
      getArticles(),
      getFeedbacks(),
    ]);

  const reviewCards: ReviewCard[] | undefined = feedbacks.length
    ? feedbacks.map((f) => ({
        text: f.message,
        name: f.username,
        location: f.amount ? `Payout: ${f.amount}` : "Discord Member",
        source: f.source || "Discord",
        rating: f.rating || 5,
        image: f.image?.url ?? null,
        imageWidth: f.image?.width ?? null,
        imageHeight: f.image?.height ?? null,
        date: f.date ?? null,
        amount: f.amount ?? null,
      }))
    : undefined;

  const videoItems: VideoItem[] | undefined = videos.length
    ? videos.map((v) => ({
        id: v.youtubeVideoId,
        title: v.title,
        thumbnail: v.thumbnail?.url,
        reward: v.reward,
        desc: v.description,
      }))
    : undefined;

  return (
    <main className="home-purple-theme min-h-screen">
      {/* S1 — Hero: Light */}
      <Hero />

      {/* S2 — Stats Strip: Light (was Jet Black) */}
      <StatsStrip />

      {/* S3 — Challenge Selector (evals) */}
      <ChallengeComparison config={challengeConfig} />

      {/* S4 — Trade with Peace of Mind (proof): sits below the challenges */}
      <ProofShowcase payouts={payouts} summary={rewardsSummary} />

      {/* S5 — Trading Platforms: Light (was Jet Black) */}
      <TradingPlatforms />

      {/* S6 — Feature Strip: Light (was Jet Black) */}
      <FeatureStrip />

      {/* S7 — Trader Stories: Light */}
      <TraderStories videos={videoItems} />

      {/* S8 — Trader Reviews & Feedbacks: Light */}
      <TraderReviews reviews={reviewCards} />

      {/* S9 — Customer Support: Light */}
      <CustomerSupportSection />

      {/* S10 — How It Works (moved down — traders know this, keep for new users): Light */}
      <HowItWorks />

      {/* S11 — FAQ: Light (was Jet Black) */}
      <FaqAccordion />

      {/* S12 — Closing CTA: Light + warm glow */}
      <ClosingCta />
    </main>
  );
}
