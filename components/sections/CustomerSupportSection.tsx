"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";

export function CustomerSupportSection() {
  const t = useTranslations("support");

  return (
    <section className="bg-white text-[#111827] py-16 md:py-24" data-od-id="customer-support">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionReveal className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A98BFF]">
              <span className="h-2 w-2 rounded-full bg-[#7943E0]" />
              {t("available247")}
            </div>
            <h2
              className="mt-4 max-w-[15ch] font-[family-name:var(--font-jakarta)] text-3xl font-black leading-[1.02] tracking-tight text-[#0A0A0C] sm:text-4xl"
              data-od-id="customer-support-title"
            >
              {t("customerTitle")}
            </h2>
            <p className="mt-5 max-w-xl text-base font-medium leading-7 text-[#4B5563]">
              {t("customerDesc")}
            </p>

            {/* Mobile Image (placed above buttons on mobile view, hidden on lg+) */}
            <div className="relative mt-7 h-[260px] sm:h-[340px] overflow-hidden rounded-[24px] border border-gray-200 bg-[#07070B] lg:hidden" data-od-id="customer-support-image-mobile">
              <Image
                src="/images/support/discord-community.jpg"
                alt="CK Capital Discord community"
                fill
                sizes="100vw"
                className="object-cover object-left-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <p className="rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">{t("supportBrand")}</p>
                <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">
                  24/7
                </span>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a
                href="https://discord.com/invite/hGSVx9CmS2"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-gradient-btn inline-flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 text-sm font-bold text-[#1A1030] shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                data-od-id="customer-support-discord"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={17} />
                  {t("discordBtn")}
                </span>
                <ArrowUpRight size={16} />
              </a>
              <a
                href="mailto:support@ckcapital.co.uk"
                className="inline-flex min-h-12 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-[#0A0A0C] shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                data-od-id="customer-support-email"
              >
                <span className="flex items-center gap-2">
                  <Mail size={17} className="text-[#0A0A0C]" />
                  {t("emailBtn")}
                </span>
                <ArrowUpRight size={16} />
              </a>
            </div>

            <p className="mt-3 text-xs font-medium text-[#6B7280]">
              Typical reply time: under 2 minutes · Pre-purchase and account questions welcome.
            </p>

            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0A0A0C] transition-colors hover:text-[#A98BFF] underline"
              data-od-id="customer-support-contacts"
            >
              {t("showAll")} <ArrowUpRight size={15} />
            </a>
          </SectionReveal>

          {/* Desktop Image (visible on lg+) */}
          <div className="relative hidden h-full min-h-[400px] overflow-hidden rounded-[28px] border border-foreground/10 bg-[#07070B] lg:block" data-od-id="customer-support-image">
            <Image
              src="/images/support/discord-community.jpg"
              alt="CK Capital Discord community"
              fill
              sizes="55vw"
              className="object-cover object-left-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4">
              <div>
                <p className="rounded-full border border-secondary/35 bg-background/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#A98BFF] backdrop-blur-sm">{t("supportBrand")}</p>
              </div>
              <span className="rounded-full border border-secondary/35 bg-background/70 px-3 py-1.5 text-xs font-semibold text-[#A98BFF]">
                24/7
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
