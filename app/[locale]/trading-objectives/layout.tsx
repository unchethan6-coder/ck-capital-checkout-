import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  return pageSeo({
    title: "Trading Objectives & Rules",
    description: "Compare 1-Step, 2-Step, and Instant Funding trading objectives, profit targets, drawdown limits, and rules across account sizes up to $750K.",
    path: "/trading-objectives",
    locale: resolved,
  });
}

export default function TradingObjectivesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
