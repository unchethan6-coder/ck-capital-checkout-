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
    title: "Instant Funding Accounts",
    description: "Start trading simulated funded accounts immediately without an evaluation process. Account sizes from $10K to $100K with a flexible 50% profit split.",
    path: "/instant",
    locale: resolved,
  });
}
export default function InstantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
