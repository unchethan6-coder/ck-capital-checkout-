import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { ChallengeComparison } from "@/components/sections/ChallengeComparison";
import { ProofShowcase } from "@/components/sections/ProofShowcase";
import { TradingPlatforms } from "@/components/sections/TradingPlatforms";
import { FeatureStrip } from "@/components/sections/FeatureStrip";
import { TraderStories } from "@/components/sections/TraderStories";
import { CustomerSupportSection } from "@/components/sections/CustomerSupportSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { VipSaleBar } from "@/components/sections/VipSaleBar";
import { pageSeo } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import {
  VIP_CHALLENGE_CONFIG,
  VIP_CHECKOUT_URL,
  VIP_CODE,
  VIP_FAQS,
  VIP_HERO,
  VIP_PROOF,
  VIP_STATS,
  VIP_VIDEOS,
} from "@/lib/vip-offer";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return params.then(({ locale: rawLocale }) => {
    const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;
    const title = "CK Capital — Get Funded Up to $750K | 80% Profit Split";
    return {
      ...pageSeo({
        title,
        description:
          "CK Capital proprietary trading evaluations and simulated funded accounts up to $750K with an 80% profit split. Limited time: 90% off all evaluations with code NEW90.",
        path: "/vip-offer",
        locale,
      }),
      title: { absolute: title },
    };
  });
}

export default async function VipOfferPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHero = await getTranslations({ locale, namespace: "vipHero" });

  const heroContent = {
    ...VIP_HERO,
    badge: tHero("badge"),
    headlineLine1: tHero("headlineLine1"),
    headlineLine2: tHero("headlineLine2"),
    subcopy: tHero("subcopy"),
    startChallenge: tHero("startChallenge"),
    comparePlans: tHero("comparePlans"),
    imageAlt: tHero("imageAlt"),
    pills: [
      { key: "profit", value: "80%", label: tHero("pillProfitLabel") },
      { key: "allocation", value: tHero("pillAllocationValue"), label: tHero("pillAllocationLabel") },
      { key: "payout", value: tHero("pillPayoutValue"), label: tHero("pillPayoutLabel") },
    ],
  };

  return (
    <main className="home-purple-theme min-h-screen">
      <VipSaleBar code={VIP_CODE} />
      <Hero content={heroContent} />
      <StatsStrip stats={VIP_STATS} />
      <ChallengeComparison
        config={VIP_CHALLENGE_CONFIG}
        vip={{
          code: VIP_CODE,
          checkoutUrl: VIP_CHECKOUT_URL,
          discountLabel: "90%",
        }}
      />
      <ProofShowcase
        payouts={[]}
        summary={VIP_PROOF.summary}
        startingAt={VIP_PROOF.startingAt}
        readyRewardDesc={VIP_PROOF.readyRewardDesc}
        totalDisplay={VIP_PROOF.totalDisplay}
        compareHref="#start-challenge"
      />
      <TradingPlatforms subtitle="Both MT5 and TradeLocker are available across all CK Capital challenge types." />
      <FeatureStrip />
      <TraderStories videos={VIP_VIDEOS} brand="CK CAPITAL" useProvidedMeta />
      <CustomerSupportSection supportBrand="CK CAPITAL SUPPORT" />
      <HowItWorks
        variant="vip"
        ctaLabel="Get funded — up to 90% off"
        startHref="#start-challenge"
      />
      <FaqAccordion
        items={VIP_FAQS}
        subtitle="Everything you need to know about CK Capital challenge rules, accounts, and payouts."
      />
      <ClosingCta primaryUrl={VIP_CHECKOUT_URL} />
    </main>
  );
}
