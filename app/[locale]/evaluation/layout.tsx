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
    title: "Evaluation Programs & Challenges",
    description: "Pass our 1-Step or 2-Step trading evaluation to unlock a simulated funded CK Account. Clear objectives, no time limits, and an 80% profit split.",
    path: "/evaluation",
    locale: resolved,
  });
}
export default function EvaluationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
