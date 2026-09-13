"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Play } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { fadeUp, stagger } from "@/components/fx/reveal";

const SUPPORT_PLACEHOLDER = "/images/support/image-placeholder.svg";
const DISCORD_COMMUNITY_IMG = "/images/support/discord-community.jpg";

export function SupportSection() {
  const t = useTranslations("support");

  return (
    <section className="bg-white text-[#111827] py-16 md:py-24" data-od-id="support">
      <Container>
        <div
          className="grid gap-12 lg:grid-cols-2 lg:gap-8"
        >
          <SupportCard
            id="support-discord"
            visual={<CommunityVisual />}
            eyebrow={t("eyebrow247")}
            eyebrowIcon={<MessageCircle size={14} className="text-secondary" />}
            statLabel={t("memberCount")}
            statValue={t("pending")}
            title={t("discordTitle")}
            description={t("discordDesc")}
            action={t("discordAction")}
            href="https://discord.com/invite/hGSVx9CmS2"
          />

          <SupportCard
            id="support-youtube"
            visual={<VideoVisual />}
            eyebrow={t("youtubeEyebrow")}
            eyebrowIcon={<Play size={14} fill="currentColor" className="text-[#A98BFF]" />}
            statLabel={t("subscriberCount")}
            statValue={t("pending")}
            title={t("youtubeTitle")}
            description={t("youtubeDesc")}
            action={t("youtubeAction")}
            href="https://www.youtube.com/@CKCapital"
          />
        </div>
      </Container>
    </section>
  );
}

function SupportCard({
  id,
  visual,
  eyebrow,
  eyebrowIcon,
  statLabel,
  statValue,
  title,
  description,
  action,
  href,
}: {
  id: string;
  visual: React.ReactNode;
  eyebrow: string;
  eyebrowIcon: React.ReactNode;
  statLabel: string;
  statValue: string;
  title: React.ReactNode;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <article data-od-id={id}>
      <div className="relative mb-7 h-[280px] overflow-hidden rounded-[28px] border border-foreground/10 sm:h-[360px] lg:h-[330px]">
        {visual}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs font-semibold text-foreground/65">
        <div className="flex items-center gap-2">
          {eyebrowIcon}
          <span>{eyebrow}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em]">
          <span className="text-foreground/65">{statLabel}</span>
          <span className="text-[#A98BFF]">{statValue}</span>
        </div>
      </div>

      <h2 className="mt-4 max-w-none font-[family-name:var(--font-jakarta)] text-[clamp(1.75rem,2.8vw,2.75rem)] font-black leading-[1.05] tracking-tight text-[#0A0A0C]">
        {title}
      </h2>
      <p className="mt-5 max-w-xl text-base font-medium leading-7 text-[#4B5563]">{description}</p>

      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-bold text-[#0A0A0C] shadow-sm transition-colors hover:border-[#703AD7] hover:bg-violet-50/50 hover:text-[#A98BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        data-od-id={`${id}-cta`}
      >
        {action}
        <ArrowUpRight size={16} />
      </a>
    </article>
  );
}

function CommunityVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030A1C]">
      <Image
        src={DISCORD_COMMUNITY_IMG}
        alt="CK Capital Discord community"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="z-[1] object-cover object-left-top"
      />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/35 via-transparent to-transparent" />
    </div>
  );
}

function VideoVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface">
      <Image src={SUPPORT_PLACEHOLDER} alt="Image placeholder" fill sizes="(max-width: 1024px) 100vw, 50vw" className="z-[1] object-cover" />
      <div className="absolute inset-0 z-[2] bg-background/10" />
      <div className="absolute inset-0 z-[3] flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background shadow-xl">
          <Play size={26} fill="currentColor" className="ml-1" />
        </div>
      </div>
    </div>
  );
}
