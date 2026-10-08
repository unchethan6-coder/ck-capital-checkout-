import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";
import { EconomicCalendarClient, NewsPolicyNote } from "@/components/calendar/EconomicCalendarClient";
import { getCalendar, initialPageFor } from "@/lib/calendar/feed";
import { CALENDAR_PAGE_SIZE } from "@/lib/calendar/types";

/**
 * Economic calendar.
 *
 * The week is fetched on the server so the first paint already contains the
 * events — good for the largest contentful paint and for crawlers — and the
 * client then refreshes on a timer. The feed layer caches, so this costs one
 * upstream call per five minutes however many people are reading.
 */
export const revalidate = 300;

export default async function EconomicCalendarPage() {
  const t = await getTranslations("calendar");
  const initial = await getCalendar();
  const initialPage = initialPageFor(initial.events, CALENDAR_PAGE_SIZE);

  return (
    <main className="min-h-screen bg-[var(--ck-surface)] pb-24">
      <section className="relative overflow-hidden border-b border-[var(--ck-line)] bg-[var(--background)] pt-28 pb-40 sm:pt-32 sm:pb-48">
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

      <Container className="relative -mt-28 sm:-mt-32">
        <EconomicCalendarClient initial={initial} initialPage={initialPage} />
        <NewsPolicyNote text={t("newsPolicy")} />

        <div className="mx-auto mt-16 grid max-w-4xl gap-10 sm:grid-cols-2">
          <section>
            <h2 className="text-lg font-bold text-foreground">{t("whatIsTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("whatIsBody")}</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground">{t("whyTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("whyBody")}</p>
          </section>
        </div>
      </Container>
    </main>
  );
}
