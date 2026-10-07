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
    title: "Symbol Specifications — Live Spreads & Contract Sizes",
    description:
      "Live bid and ask prices, spreads, contract sizes and leverage for every forex pair, index, commodity, crypto and stock you can trade at CK Capital.",
    path: "/symbols",
    locale: resolved,
  });
}

export default function SymbolsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
