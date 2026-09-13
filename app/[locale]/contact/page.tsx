'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Clock, MapPin, MessageCircle, Sparkles, ArrowRight, ShieldCheck, Mail } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { GoldButton } from '@/components/shared/GoldButton'
import { Aurora } from '@/components/fx/Aurora'
import { SectionReveal } from '@/components/shared/SectionReveal'
import { ContactHeroVisual } from '@/components/shared/ContactHeroVisual'

export default function ContactPage() {
  const t = useTranslations('contact')

  const contactCards = [
    {
      icon: MessageCircle,
      title: t('discordTitle'),
      description: t('discordDesc'),
      action: { label: t('discordBtn'), href: 'https://discord.com/invite/hGSVx9CmS2' },
    },
    {
      icon: MapPin,
      title: t('officeTitle'),
      description: t('officeDesc'),
    },
    {
      icon: Clock,
      title: t('hoursTitle'),
      description: t('hoursDesc'),
    },
  ]

  return (
    <div className="min-h-screen bg-background" data-od-id="contact-page">

      {/* ─────────────── Hero (DARK) ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] flex min-h-[calc(100dvh-44px)] flex-col overflow-hidden border-b border-gray-200 bg-white" data-od-id="contact-hero">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
          <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
          <div className="absolute top-[20%] -right-[10%] w-[55%] h-[65%] rounded-full opacity-55 fx-hero-glow-3" />
          <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[50%] rounded-full opacity-40 fx-hero-glow-4" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <Aurora variant="hero" grid className="absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pb-10 pt-20 sm:px-6 md:pb-10 md:pt-24 lg:px-8">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-7 xl:col-span-6 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-[#7943E0]/30 bg-[#7943E0]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A98BFF]">
                  <Sparkles size={12} className="text-[#A98BFF]" /> {t('badge')}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-6 max-w-3xl font-[family-name:var(--font-jakarta)] text-[clamp(38px,7vw,44px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0A0A0C] sm:text-[52px] md:text-[60px] lg:text-[54px] xl:text-[68px]"
                data-od-id="contact-hero-title"
              >
                {t('title')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#4B5563] sm:text-[15px]"
              >
                {t('subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.36 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <a href="https://discord.com/invite/hGSVx9CmS2" target="_blank" rel="noopener noreferrer">
                  <GoldButton size="lg">
                    Join Discord Server <ArrowRight size={16} />
                  </GoldButton>
                </a>
                <a
                  href="#contact-cards"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#4B5563] hover:text-[#0A0A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                >
                  View Details <ArrowRight size={15} />
                </a>
              </motion.div>

              <div className="mt-14 flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-[#A98BFF]" /> 24/7 Dedicated Support</span>
                <span className="inline-flex items-center gap-2"><Mail size={14} className="text-[#A98BFF]" /> Fast Response Times</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 xl:col-span-6 min-w-0"
              data-od-id="contact-hero-dashboard"
            >
              <ContactHeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── Contact cards ─────────────── */}
      <section id="contact-cards" className="scroll-mt-24 bg-white border-b border-[#E5E7EB] py-16 md:py-24 text-[#0A0A0C]" data-od-id="contact-cards">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
              CHANNELS & HOURS
            </p>
            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-5xl">
              Get in touch with our team
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {contactCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group flex flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-gray-300"
                  data-od-id={`contact-card-${i + 1}`}
                >
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-[#0A0A0C]">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-[#0A0A0C]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
                      {card.description}
                    </p>
                  </div>
                  {'action' in card && card.action && (
                    <a
                      href={card.action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0C] hover:text-[#A98BFF] underline transition-colors"
                    >
                      {card.action.label} <ArrowRight size={13} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─────────────── Discord Community CTA ─────────────── */}
      <section className="relative overflow-hidden bg-white border-t border-gray-200 py-20 md:py-28 text-[#0A0A0C]" data-od-id="contact-discord-cta">
        <Container className="relative text-center">
          <SectionReveal>
            <MessageCircle className="mx-auto text-[#A98BFF]" size={32} />
            <h2 className="mx-auto mt-6 max-w-3xl font-[family-name:var(--font-jakarta)] text-4xl font-extrabold tracking-[-0.04em] text-[#0A0A0C] md:text-6xl">
              Connect with 20,000+ Traders
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#4B5563]">
              Join our global Discord trader community for market discussions, announcement drops, support ticketing, and weekly giveaways.
            </p>
            <div className="mt-8">
              <a href="https://discord.com/invite/hGSVx9CmS2" target="_blank" rel="noopener noreferrer">
                <GoldButton size="lg">
                  Join Discord Community <ArrowRight size={16} />
                </GoldButton>
              </a>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </div>
  )
}
