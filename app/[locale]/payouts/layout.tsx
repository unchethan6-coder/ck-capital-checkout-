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
    title: "Trader Payouts & Proof",
    description: "Explore verified CK Propfirm payout certificates, qualified trader achievements, and historical payout records.",
    path: "/payouts",
    locale: resolved,
  });
}
export default function PayoutsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
