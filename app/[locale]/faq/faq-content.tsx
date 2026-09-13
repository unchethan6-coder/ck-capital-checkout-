'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { SectionReveal } from '@/components/shared/SectionReveal'
import { GoldButton } from '@/components/shared/GoldButton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const LIST_ITEM_CLASSES = 'ml-5 list-disc space-y-2 text-sm leading-relaxed text-foreground/65'
const ORDERED_LIST_CLASSES = 'ml-5 list-decimal space-y-2 text-sm leading-relaxed text-foreground/65'

export function FaqContent() {
  const t = useTranslations('faq')
  const tChallenge = useTranslations('challenge')

  const faqItems = [
    {
      q: t('items.payoutTime.q'),
      a: <p>{t('items.payoutTime.a')}</p>,
    },
    {
      q: t('items.timeLimit.q'),
      a: <p>{t('items.timeLimit.a')}</p>,
    },
    {
      q: t('items.platforms.q'),
      a: <p>{t('items.platforms.a')}</p>,
    },
    {
      q: t('items.profitSplit.q'),
      a: <p>{t('items.profitSplit.a')}</p>,
    },
    {
      q: t('items.drawdown.q'),
      a: <p>{t('items.drawdown.a')}</p>,
    },
    {
      q: t('items.newsTrading.q'),
      a: <p>{t('items.newsTrading.a')}</p>,
    },
    {
      q: t('items.consistency.q'),
      a: <p>{t('items.consistency.a')}</p>,
    },
    {
      q: t('items.cryptoFunding.q'),
      a: <p>{t('items.cryptoFunding.a')}</p>,
    },
    {
      q: t('items.refundPolicy.q'),
      a: <p>{t('items.refundPolicy.a')}</p>,
    },
    {
      q: t('items.expertAdvisors.q'),
      a: <p>{t('items.expertAdvisors.a')}</p>,
    },
  ]

  return (
    <div className="min-h-screen bg-background" data-od-id="faq-page">

      {/* ─────────────── Hero ─────────────── */}
      <section className="relative bg-background" data-od-id="faq-hero">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 70% 0%, rgba(212,175,55,0.20), transparent 45%), radial-gradient(circle at 5% 100%, rgba(212,175,55,0.08), transparent 40%)',
          }}
        />
        <Container className="relative py-16 md:py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A98BFF]">
                <Sparkles size={11} className="text-[#A98BFF]" />
                {t('eyebrow')}
                <span className="text-[#A98BFF]/40">·</span>
                {t('subtitle')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-5 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-foreground md:text-5xl lg:text-[52px]"
              data-od-id="faq-hero-title"
            >
              {t('title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-foreground/65"
            >
              {t('subtitle')}
            </motion.p>
          </div>
        </Container>
      </section>

      {/* ─────────────── Accordion ─────────────── */}
      <section className="bg-muted py-16 md:py-24" data-od-id="faq-accordion">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionReveal>
              <Accordion multiple={false} className="space-y-2">
                {faqItems.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={String(i)}
                    className="rounded-xl border border-foreground/10 bg-foreground/[0.03] px-5 transition-all data-[open]:border-primary/30 data-[open]:bg-foreground/[0.05]"
                  >
                    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-foreground hover:text-[#A98BFF] hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-foreground/65">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SectionReveal>
          </div>
        </Container>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="bg-background py-16 md:py-24" data-od-id="faq-cta">
        <Container>
          <SectionReveal className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r dark-panel from-[#1a1508] to-[#0d0b06] p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.10),_transparent_60%)]" />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                <MessageCircle size={28} className="text-[#A98BFF]" />
              </div>
              <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-foreground md:text-3xl">
                {t('stillQuestions')}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-foreground/65">
                {t('supportAvailable')}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://app.ckcapital.co.uk/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GoldButton size="lg" data-od-id="faq-cta-primary">
                    {tChallenge('startNow')} <ArrowRight size={16} />
                  </GoldButton>
                </a>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </div>
  )
}
