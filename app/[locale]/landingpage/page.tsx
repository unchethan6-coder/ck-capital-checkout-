import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/lib/seo";
import LandingClient from "./landing-client";

const TITLE = "Simulated Trading Evaluations | CK PropFirm";
const DESCRIPTION =
  "Prove your skills in a simulated environment on MT5 & TradeLocker. 75% OFF evaluations with code NOV75.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/en/landingpage` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  setRequestLocale("en");
  return <LandingClient />;
}
