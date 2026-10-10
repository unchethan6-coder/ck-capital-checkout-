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
    title: "FAQ — Frequently Asked Questions & Trading Rules",
    description: "Explore official answers, trading rules, payout policies, and account options for CK Propfirm.",
    path: "/faq",
    locale: resolved,
  });
}

export default function FAQLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
