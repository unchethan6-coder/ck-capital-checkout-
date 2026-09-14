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
    title: "Affiliate & Partner Program",
    description: "Partner with CK Propfirm and earn up to 25% commission on qualified trader referrals. Built for creators, mentors, and community leaders.",
    path: "/affiliates",
    locale: resolved,
  });
}
export default function AffiliatesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
