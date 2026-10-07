import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";
import { SymbolSpecsClient } from "@/components/market/SymbolSpecsClient";
import { getSnapshot, primeWithin } from "@/lib/market/hub";

/**
 * Symbol specifications.
 *
 * Rendered per request so the HTML ships with current prices. Reading the hub
 * is an in-memory lookup once it is warm, and the render never waits longer
 * than the budget below, so a cold or slow upstream cannot hold up the page.
 */
export const dynamic = "force-dynamic";

/** Longest the server will wait for a cold hub before rendering without prices. */
const PRIME_BUDGET_MS = 1_200;

export default async function SymbolsPage() {
  const t = await getTranslations("symbols");

  await primeWithin(PRIME_BUDGET_MS);
  const initialQuotes = getSnapshot();

  return (
    <main className="min-h-screen bg-[var(--ck-surface)] pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--ck-line)] bg-[var(--background)] pt-28 pb-40 sm:pt-32 sm:pb-48">
        {/* Brand glow — purely decorative. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(137, 76, 239, 0.22) 0%, rgba(3, 10, 28, 0) 70%)",
          }}
        />
        <Container className="relative text-center">
          <h1 className="hero-title text-foreground">{t("heroTitle")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
            {t("heroSubtitle")}
          </p>
        </Container>
      </section>

      {/* Table, overlapping the hero like the reference layout */}
      <Container className="relative -mt-28 sm:-mt-32">
        <SymbolSpecsClient initialQuotes={initialQuotes} />
        <p className="mx-auto mt-5 max-w-4xl text-center text-xs leading-relaxed text-muted-foreground">
          {t("disclaimer")}
        </p>
      </Container>
    </main>
  );
}
