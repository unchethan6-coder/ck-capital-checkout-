import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tNav = await getTranslations("nav");

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-background">
      {/* Gold radial glows */}
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-2/3 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-[100px]" />

      <Container className="relative z-10 text-center">
        <div className="mb-8">
          <span className="gradient-text-gold font-[family-name:var(--font-jakarta)] text-[10rem] font-extrabold leading-none tracking-tighter sm:text-[12rem]">
            404
          </span>
        </div>

        <h1 className="hero-title text-foreground mb-4 text-balance">{t("title")}</h1>
        <p className="mx-auto mb-10 max-w-md text-lg text-foreground/60">{t("description")}</p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:brightness-110"
          style={{
            background: "var(--ck-gold-gradient)",
            boxShadow: "0 0 20px rgba(212,175,55,0.3)",
          }}
        >
          {t("backHome")}
        </Link>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/65">
          <Link href="/trading-objectives" className="transition-colors hover:text-[#A98BFF]">
            {tNav("tradingObjectives")}
          </Link>
          <span className="text-foreground/20">·</span>
          <Link href="/payouts" className="transition-colors hover:text-[#A98BFF]">
            {tNav("payouts")}
          </Link>
          <span className="text-foreground/20">·</span>
          <a
            href="https://intercom.help/ck-capital/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#A98BFF]"
          >
            {tNav("faq")}
          </a>
          <span className="text-foreground/20">·</span>
          <Link href="/contact" className="transition-colors hover:text-[#A98BFF]">
            {tNav("contact")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
