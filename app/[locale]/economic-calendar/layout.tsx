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
    title: "Economic Calendar — Live Market-Moving Events",
    description:
      "Track every scheduled economic release that moves forex, indices and commodities. Filter by currency, day and impact, in your own timezone. News trading is allowed at CK Capital.",
    path: "/economic-calendar",
    locale: resolved,
  });
}

export default function EconomicCalendarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
