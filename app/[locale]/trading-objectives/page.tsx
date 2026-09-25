import { Suspense } from "react";
import { TradingObjectivesPageClient } from "@/components/sections/TradingObjectivesPageClient";
import type { TradingObjectivesInitial } from "@/components/sections/TradingObjectivesPageClient";
import { getChallengeConfig } from "@/lib/cms";

export const revalidate = 300;

export default async function TradingObjectivesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [challengeConfig, params] = await Promise.all([
    getChallengeConfig(),
    searchParams,
  ]);

  const rawPath = typeof params.path === "string" ? params.path : "2step";
  const path = rawPath === "1step" || rawPath === "instant" ? rawPath : "2step";

  const rawEval = typeof params.evalType === "string" ? params.evalType : "standard";
  const evalType = rawEval === "pro" ? rawEval : "standard";

  const rawPlatform = typeof params.platform === "string" ? params.platform : "mt5";
  const platform = rawPlatform === "tradelocker" ? "tradelocker" : "mt5";

  const size = typeof params.size === "string" ? params.size : "$100K";

  const initial: TradingObjectivesInitial = {
    path,
    evalType,
    platform,
    size,
  };

  return (
    <Suspense fallback={null}>
      <TradingObjectivesPageClient config={challengeConfig} initial={initial} />
    </Suspense>
  );
}
