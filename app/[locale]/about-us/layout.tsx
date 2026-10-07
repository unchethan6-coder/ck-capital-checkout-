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
    title: "About Us — Our Story & Mission",
    description: "Learn about CK Capital, our mission, leadership, and commitment to providing fair, transparent simulated funded accounts up to $1.2M with an 80% profit split.",
    path: "/about-us",
    locale: resolved,
  });
}
export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
