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
    title: "Contact & 24/7 Trader Support",
    description: "Get in touch with the CK Propfirm support team. 24/7 live assistance via chat and Discord for trading, account, and payout inquiries.",
    path: "/contact",
    locale: resolved,
  });
}
export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
