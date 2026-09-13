'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, MotionConfig } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  Lightbulb,
  MessageCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { SectionReveal } from '@/components/shared/SectionReveal'
import { GoldButton } from '@/components/shared/GoldButton'
import { Aurora } from '@/components/fx/Aurora'
import { Link } from '@/i18n/navigation'
import { fadeUp, stagger, EASE } from '@/components/fx/reveal'

const heroFadeDown = {
  hidden: { opacity: 0, y: -14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const heroFadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
}

const heroScaleIn = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.15 } },
}

export default function AboutPage() {
  const t = useTranslations('about')
  const tChallenge = useTranslations('challenge')
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const copyY = useTransform(scrollYProgress, [0, 0.55], [0, -60])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.5])

  const aboutStats = [
    { stat: '20K+', label: t('statsTraders'), note: t('statsTradersNote') },
    { stat: '$1.2M', label: t('statsCapital'), note: t('statsCapitalNote') },
    { stat: '100%', label: t('statsSplit'), note: t('statsSplitNote') },
    { stat: '24/7', label: t('statsSupport'), note: t('statsSupportNote') },
  ]

  const missionVision = [
    {
      icon: Compass,
      eyebrow: t('missionEyebrow'),
      title: t('missionTitle'),
      description: t('missionDesc'),
    },
    {
      icon: Target,
      eyebrow: t('visionEyebrow'),
      title: t('visionTitle'),
      description: t('visionDesc'),
    },
  ]

  const values = [
    {
      icon: ShieldCheck,
      title: t('integrityTitle'),
      description: t('integrityDesc'),
    },
    {
      icon: Users,
      title: t('communityTitle'),
      description: t('communityDesc'),
    },
    {
      icon: Star,
      title: t('excellenceTitle'),
      description: t('excellenceDesc'),
    },
    {
      icon: Lightbulb,
      title: t('innovationTitle'),
      description: t('innovationDesc'),
    },
  ]

  const rawPillars = t.raw('pillars') as Array<{ title: string; description: string }>
  const pillarIcons = [ShieldCheck, Zap, Users]
  const pillars = Array.isArray(rawPillars)
    ? rawPillars.map((p, i) => ({
        icon: pillarIcons[i] || ShieldCheck,
        title: p.title,
        description: p.description,
      }))
    : []

  const founderBadges = (t.raw('founderBadges') as string[]) ?? [
    '7-Figure Trader',
    'FX Brokering',
    'Private Capital',
    'UK Founded',
  ]

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white" data-od-id="about-page">

        {/* ─────────────── Hero (Landing Page Parity) ─────────────── */}
        <section
          ref={sectionRef}
          className="relative isolate -mt-[72px] md:-mt-[76px] flex min-h-[calc(100dvh-44px)] flex-col overflow-hidden border-b border-gray-200 bg-white"
          data-od-id="about-hero"
        >
          {/* Parallax Radial Glows */}
          <motion.div
            aria-hidden="true"
            style={{ y: glowY, opacity: glowOpacity }}
            className="pointer-events-none absolute inset-0 z-[1] overflow-hidden transform-gpu"
          >
            <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
            <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
            <div className="absolute top-[20%] -right-[10%] w-[55%] h-[65%] rounded-full opacity-55 fx-hero-glow-3" />
            <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[50%] rounded-full opacity-40 fx-hero-glow-4" />
          </motion.div>

          {/* Aurora Dot Grid Overlay */}
          <div className="pointer-events-none absolute inset-0 z-[2]">
            <Aurora variant="hero" grid className="absolute inset-0" />
          </div>

          {/* Content Container */}
          <motion.div
            style={{ y: copyY, opacity: copyOpacity }}
            className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pb-12 pt-28 sm:px-6 md:pb-16 md:pt-32 lg:px-8"
          >
            <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              {/* Left Column: Hero Text */}
              <div className="max-w-2xl">
                <motion.div
                  variants={heroFadeDown}
                  initial="hidden"
                  animate="show"
                  className="inline-flex items-center gap-2 rounded-full border border-[#7943E0]/30 bg-[#7943E0]/10 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]"
                  data-od-id="about-hero-eyebrow"
                >
                  <Sparkles size={12} className="text-[#A98BFF]" />
                  {t('badge')}
                </motion.div>

                <motion.h1
                  variants={heroFadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0.08}
                  className="mt-6 font-[family-name:var(--font-jakarta)] text-[clamp(36px,6vw,44px)] font-extrabold leading-[1.03] tracking-[-0.02em] text-[#0A0A0C] sm:text-[50px] md:text-[58px] lg:text-[52px] xl:text-[64px]"
                  data-od-id="about-hero-title"
                >
                  {t('heroTitlePrefix')}{' '}
                  <span className="shimmer-text">{t('heroTitleShimmer')}</span>
                </motion.h1>

                <motion.p
                  variants={heroFadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0.18}
                  className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#4B5563] sm:text-base"
                >
                  {t('storyDesc')}
                </motion.p>

                <motion.div
                  variants={heroFadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0.28}
                  className="mt-9 flex flex-wrap items-center gap-4 sm:gap-5"
                >
                  <a
                    href="https://app.ckcapital.co.uk/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-od-id="about-hero-primary"
                  >
                    <GoldButton size="lg">
                      {tChallenge('startNow')} <ArrowRight size={16} />
                    </GoldButton>
                  </a>
                  <Link
                    href="/trading-objectives"
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#4B5563] transition hover:text-[#0A0A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    data-od-id="about-hero-secondary"
                  >
                    {t('exploreObjectives')} <ArrowRight size={15} />
                  </Link>
                </motion.div>

                <motion.div
                  variants={heroFadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0.38}
                  className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#A98BFF]" /> {t('badgeSimulated')}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck size={14} className="text-[#A98BFF]" /> {t('badgeVerifiedUk')}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users size={14} className="text-[#6B7280]" /> {t('badgeGlobalTraders')}
                  </span>
                </motion.div>
              </div>

              {/* Right Column: Founder Spotlight Card */}
              <motion.div
                variants={heroScaleIn}
                initial="hidden"
                animate="show"
                className="relative"
              >
                {/* Background ambient glow */}
                <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />

                <div className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-[#030A1C] bg-gradient-to-br from-[#061B33]/95 via-[#030A1C]/95 to-[#01060F] p-6 shadow-xl backdrop-blur-xl sm:p-8">
                  {/* Cyan accent line */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#894CEF] to-transparent" />

                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#703AD7] to-[#894CEF] opacity-60 blur-sm" />
                        <img
                          src="/images/about/dan.jpg"
                          alt="Daniel Cheung — Founder of CK Capital"
                          className="relative h-20 w-20 shrink-0 rounded-2xl border-2 border-[#703AD7]/60 object-cover shadow-lg sm:h-24 sm:w-24"
                          data-od-id="about-founder-photo"
                        />
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#894CEF]/30 bg-[#894CEF]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A98BFF]">
                          <Star size={10} className="fill-[#894CEF] text-[#A98BFF]" /> {t('founderRoleBadge')}
                        </span>
                        <h3 className="mt-2 font-[family-name:var(--font-jakarta)] text-xl font-extrabold text-white sm:text-2xl">
                          Daniel Cheung
                        </h3>
                        <p className="text-xs font-semibold text-[#A98BFF]">
                          {t('founderRole')}
                        </p>
                      </div>
                    </div>

                    {/* Philosophy Quote */}
                    <div className="relative rounded-2xl border border-white/[0.12] bg-white/[0.04] p-5">
                      <Quote size={20} className="text-[#A98BFF]/60 mb-2" />
                      <p className="text-sm leading-relaxed text-white/90 italic">
                        &ldquo;{t('founderQuote')}&rdquo;
                      </p>
                    </div>

                    {/* Bio details */}
                    <p className="text-xs leading-relaxed text-gray-300">
                      {t('founderBio')}
                    </p>

                    {/* Track record chips */}
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-foreground/[0.06]">
                      {founderBadges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-lg border border-primary/20 bg-primary/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A98BFF]/90"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ─────────────── Four-Pillar Stats Band ─────────────── */}
        <section className="bg-white border-b border-[#E5E7EB] py-12 md:py-16 text-[#0A0A0C]" data-od-id="about-stats-strip">
          <Container>
            <div
              className="grid grid-cols-2 divide-x divide-y divide-[#E5E7EB] border-y border-[#E5E7EB] md:grid-cols-4 md:divide-y-0"
            >
              {aboutStats.map((metric) => (
                <div
                  key={metric.label}
                  className="min-h-36 px-4 py-7 first:pl-0 md:px-7 md:first:pl-0"
                >
                  <p className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.04em] text-[#0A0A0C] md:text-4xl">
                    {metric.stat}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4B5563]">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-[10px] text-[#6B7280]">
                    {metric.note}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ─────────────── Mission & Vision ─────────────── */}
        <section className="bg-white py-20 md:py-28 text-[#0A0A0C]" data-od-id="about-mission-vision">
          <Container>
            <SectionReveal className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
                {t('missionVisionHeadingEyebrow')}
              </p>
              <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0C] md:text-5xl">
                {t('missionVisionHeadingTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#4B5563]">
                {t('missionVisionHeadingSubtitle')}
              </p>
            </SectionReveal>

            <div
              className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {missionVision.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#030A1C] bg-gradient-to-br from-[#061B33] to-[#030A1C] p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#703AD7]/40 sm:p-10"
                    data-od-id={`about-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#894CEF]/10 blur-2xl transition duration-500 group-hover:bg-[#894CEF]/20" />

                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#703AD7]/30 bg-[#703AD7]/10 transition-colors group-hover:bg-[#703AD7]/20">
                      <Icon size={24} className="text-[#A98BFF]" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A98BFF]">
                      {item.eyebrow}
                    </span>
                    <h3 className="mt-2 font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-gray-300">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ─────────────── Philosophy & Culture ─────────────── */}
        <section className="bg-white border-y border-[#E5E7EB] py-20 md:py-28 text-[#0A0A0C]" data-od-id="about-pillars">
          <Container>
            <SectionReveal className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
                {t('cultureEyebrow')}
              </p>
              <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0C] md:text-5xl">
                {t('cultureTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#4B5563]">
                {t('cultureSubtitle')}
              </p>
            </SectionReveal>

            <div
              className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3"
            >
              {pillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.title}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-[#0A0A0C]">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-[#0A0A0C]">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
                      {pillar.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ─────────────── Core Values ─────────────── */}
        <section className="bg-white py-20 md:py-28 text-[#0A0A0C]" data-od-id="about-values">
          <Container>
            <SectionReveal className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
                {t('valuesEyebrow')}
              </p>
              <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0C] md:text-5xl">
                {t('valuesTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#4B5563]">
                {t('valuesSubtitle')}
              </p>
            </SectionReveal>

            <div
              className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {values.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 shadow-sm"
                    data-od-id={`about-value-${item.title.toLowerCase()}`}
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-[#0A0A0C]">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-[family-name:var(--font-jakarta)] text-base font-bold text-[#0A0A0C]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ─────────────── Closing CTA ─────────────── */}
        <section className="relative overflow-hidden bg-white border-t border-[#E5E7EB] py-20 md:py-28 text-[#0A0A0C]" data-od-id="about-cta">
          <Container className="relative text-center">
            <SectionReveal>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#703AD7] bg-[#703AD7] text-white shadow-md">
                <BadgeCheck size={30} />
              </div>
              <h2 className="mx-auto max-w-2xl font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0C] md:text-5xl">
                {t('ctaTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#4B5563] sm:text-base">
                {t('ctaDesc')}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://app.ckcapital.co.uk/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-od-id="about-cta-primary"
                >
                  <GoldButton size="lg">
                    {t('ctaStart')} <ArrowRight size={16} />
                  </GoldButton>
                </a>
                <a
                  href="https://discord.com/invite/hGSVx9CmS2"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-od-id="about-cta-secondary"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-[#0A0A0C] shadow-sm transition-all hover:bg-gray-50"
                >
                  <MessageCircle size={16} className="text-[#0A0A0C]" />
                  {t('ctaDiscord')}
                </a>
              </div>
            </SectionReveal>
          </Container>
        </section>
      </div>
    </MotionConfig>
  )
}

