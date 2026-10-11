'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, MotionConfig } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Compass,
  Lightbulb,
  MessageCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { SectionReveal } from '@/components/shared/SectionReveal'
import { GoldButton } from '@/components/shared/GoldButton'
import { Aurora } from '@/components/fx/Aurora'
import { Link } from '@/i18n/navigation'
import { PORTAL_SIGNUP_URL } from '@/lib/portal'
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
  const [storyOpen, setStoryOpen] = useState(false)

  useEffect(() => {
    if (!storyOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStoryOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [storyOpen])

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
    { stat: '$750K', label: t('statsCapital'), note: t('statsCapitalNote') },
    { stat: '80%', label: t('statsSplit'), note: t('statsSplitNote') },
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
                    href={PORTAL_SIGNUP_URL}
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
                          src="/images/about/monray-linevee.jpg"
                          alt="Monray Linevee — Trader & Market Strategist"
                          className="relative h-20 w-20 shrink-0 rounded-2xl border-2 border-[#703AD7]/60 object-cover shadow-lg sm:h-24 sm:w-24"
                          data-od-id="about-founder-photo"
                        />
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#894CEF]/30 bg-[#894CEF]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A98BFF]">
                          <Star size={10} className="fill-[#894CEF] text-[#A98BFF]" /> {t('founderRoleBadge')}
                        </span>
                        <h3 className="mt-2 font-[family-name:var(--font-jakarta)] text-xl font-extrabold text-white sm:text-2xl">
                          Monray Linevee
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

                    {/* Interactive Read Journey Trigger */}
                    <button
                      type="button"
                      onClick={() => setStoryOpen(true)}
                      className="inline-flex items-center gap-2 self-start rounded-xl border border-[#894CEF]/30 bg-[#894CEF]/10 px-3.5 py-2 text-xs font-bold text-[#A98BFF] transition-all hover:bg-[#894CEF]/25 hover:text-white cursor-pointer"
                      data-od-id="about-read-story-btn"
                    >
                      <BookOpen size={14} className="text-[#A98BFF]" />
                      <span>{t('readFullJourney')}</span>
                      <ArrowRight size={13} />
                    </button>

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
        <section className="border-b border-white/10 bg-[#0B0F24]/60 py-12 text-white md:py-16" data-od-id="about-stats-strip">
          <Container>
            <div
              className="grid grid-cols-2 divide-x divide-y divide-white/10 border-y border-white/10 md:grid-cols-4 md:divide-y-0"
            >
              {aboutStats.map((metric) => (
                <div
                  key={metric.label}
                  className="min-h-36 px-4 py-7 first:pl-0 md:px-7 md:first:pl-0"
                >
                  <p className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.04em] text-white md:text-4xl">
                    {metric.stat}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#A98BFF]">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-[10px] text-white/50">
                    {metric.note}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ─────────────── Mission & Vision ─────────────── */}
        <section className="bg-transparent py-20 text-white md:py-28" data-od-id="about-mission-vision">
          <Container>
            <SectionReveal className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
                {t('missionVisionHeadingEyebrow')}
              </p>
              <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">
                {t('missionVisionHeadingTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
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
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F24]/80 p-8 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#894CEF]/50 sm:p-10"
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
                    <p className="mt-4 text-sm leading-7 text-white/70">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ─────────────── Philosophy & Culture ─────────────── */}
        <section className="border-y border-white/10 bg-transparent py-20 text-white md:py-28" data-od-id="about-pillars">
          <Container>
            <SectionReveal className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
                {t('cultureEyebrow')}
              </p>
              <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">
                {t('cultureTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
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
                    className="rounded-2xl border border-white/10 bg-[#0B0F24]/80 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#894CEF]/40 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#894CEF]/30 bg-[#894CEF]/10 text-[#A98BFF]">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {pillar.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ─────────────── Core Values ─────────────── */}
        <section className="bg-transparent py-20 text-white md:py-28" data-od-id="about-values">
          <Container>
            <SectionReveal className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
                {t('valuesEyebrow')}
              </p>
              <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">
                {t('valuesTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
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
                    className="group rounded-2xl border border-white/10 bg-[#0B0F24]/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#894CEF]/40"
                    data-od-id={`about-value-${item.title.toLowerCase()}`}
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#894CEF]/30 bg-[#894CEF]/10 text-[#A98BFF]">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-[family-name:var(--font-jakarta)] text-base font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ─────────────── Closing CTA ─────────────── */}
        <section className="relative overflow-hidden border-t border-white/10 bg-[#070B1D] py-20 text-white md:py-28" data-od-id="about-cta">
          <Container className="relative text-center">
            <SectionReveal>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#703AD7]/40 bg-[#703AD7]/20 text-[#A98BFF] shadow-lg shadow-[#703AD7]/20">
                <BadgeCheck size={30} />
              </div>
              <h2 className="mx-auto max-w-2xl font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">
                {t('ctaTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                {t('ctaDesc')}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={PORTAL_SIGNUP_URL}
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
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-white/[0.12]"
                >
                  <MessageCircle size={16} className="text-[#A98BFF]" />
                  {t('ctaDiscord')}
                </a>
              </div>
            </SectionReveal>
          </Container>
        </section>

        {/* ─────────────── Monray Linevee Full Journey Modal ─────────────── */}
        {storyOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="monray-story-title"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
              onClick={() => setStoryOpen(false)}
            />

            {/* Modal Box */}
            <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#070B1D] p-6 shadow-2xl text-white sm:p-8">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setStoryOpen(false)}
                className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/15 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 sm:gap-5 pr-8">
                <img
                  src="/images/about/monray-linevee.jpg"
                  alt="Monray Linevee"
                  className="h-16 w-16 shrink-0 rounded-2xl border-2 border-[#703AD7]/60 object-cover shadow-md sm:h-20 sm:w-20"
                />
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#894CEF]/30 bg-[#894CEF]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A98BFF]">
                    <Star size={10} className="fill-[#894CEF] text-[#A98BFF]" /> {t('founderRoleBadge')}
                  </span>
                  <h3 id="monray-story-title" className="mt-1.5 font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-white">
                    Monray Linevee
                  </h3>
                  <p className="text-xs font-semibold text-[#A98BFF]">
                    {t('founderRole')}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-6 rounded-2xl border border-[#703AD7]/30 bg-[#703AD7]/10 p-4">
                <p className="text-sm italic text-white/95 leading-relaxed">
                  &ldquo;{t('founderQuote')}&rdquo;
                </p>
              </div>

              {/* Full Narrative */}
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/80">
                <p>
                  My journey began when I was a full-time student and first discovered the stock market. I was immediately fascinated by the world of investing and the possibilities it offered. I soon realised that investment management was something I genuinely wanted to pursue. However, one of my biggest challenges was figuring out how to build the capital needed to turn that vision into reality. At the time, financial freedom felt like a distant goal.
                </p>
                <p>
                  Determined to find a way forward, I explored cryptocurrency investing. It introduced me to new opportunities, helped me work towards building capital, and strengthened my belief that my long-term goals were achievable. This experience motivated me to explore further and eventually led me to forex trading.
                </p>
                <p>
                  I spent months studying the markets, reading, testing strategies, and learning through experience. Initially, I relied heavily on technical indicators, believing they would help me identify the right trading opportunities. However, as I gained experience, I discovered Price Action trading, which fundamentally changed the way I understood the markets.
                </p>
                <p>
                  I began developing my own trading approach, focusing on price movements and market behaviour rather than relying solely on indicators. This shift helped me make more informed decisions and build a clearer understanding of how I wanted to approach trading.
                </p>
                <p>
                  Beyond technical knowledge, trading taught me some of the most valuable lessons about discipline, patience, and objectivity. I learned the importance of staying calm under pressure, managing risk, accepting losses, and maintaining a long-term perspective. These lessons have shaped not only my trading approach but also the way I handle challenges in everyday life.
                </p>
                <p>
                  Today, I continue to refine my strategy and work towards consistent profitability. My long-term vision remains the same: to build the capital needed to create my own stock portfolio and pursue greater financial independence.
                </p>
                <p>
                  Looking back, this journey has been about much more than financial markets. It has been about learning, adapting, overcoming challenges, and becoming more disciplined with every step.
                </p>
                <p className="font-medium text-white/95">
                  I&apos;m still learning, still improving, and still working towards the vision that started it all. For me, success isn&apos;t just about reaching the destination. It&apos;s about the growth, experience, and discipline built along the way.
                </p>
              </div>

              {/* Close footer button */}
              <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStoryOpen(false)}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 cursor-pointer"
                >
                  {t('closeStory')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MotionConfig>
  )
}

