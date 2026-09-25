'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Zap, ArrowRight, Check, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { GoldButton } from '@/components/shared/GoldButton'
import { Aurora } from '@/components/fx/Aurora'
import { SectionReveal } from '@/components/shared/SectionReveal'
import { InstantFundingVisual } from '@/components/shared/InstantFundingVisual'
import { InstantVsChallengeComparison } from '@/components/sections/InstantVsChallengeComparison'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function InstantPage() {
  const t = useTranslations('instant')
  const tFaq = useTranslations('faq')

  const benefits = [
    { title: 'No Evaluation', description: 'Skip the multi-phase challenge. Access your simulated account in minutes.' },
    { title: 'Immediate Access', description: 'Start executing trading strategies right away with zero waiting periods.' },
    { title: 'Flexible Funding', description: 'Choose account sizes from $5K up to $200K with instant account setup.' },
    { title: 'Generous Rules', description: 'Balanced profit parameters and realistic loss limits designed for long-term consistency.' },
    { title: 'Lower Consistency', description: 'Only 20% consistency requirement to build your simulated track record quickly.' },
    { title: 'Up to 100% Profit Split', description: 'Eligible Qualified Analysts keep up to 100% of eligible simulated profits.' },
  ]

  const pricing = [
    { amount: '$5K', price: '$39.20', orig: '$130.67', urlCode: '29' },
    { amount: '$10K', price: '$69.20', orig: '$230.67', urlCode: '30' },
    { amount: '$25K', price: '$139.20', orig: '$464.00', urlCode: '31' },
    { amount: '$50K', price: '$249.20', orig: '$830.67', urlCode: '32' },
    { amount: '$100K', price: '$449.20', orig: '$1,497.33', urlCode: '33' },
    { amount: '$200K', price: '$898.40', orig: '$2,994.67', urlCode: '34' },
  ]

  const instantFaqs = [
    {
      q: tFaq('items.instantPayouts.q'),
      a: tFaq('items.instantPayouts.a'),
    },
    {
      q: tFaq('items.timeLimit.q'),
      a: tFaq('items.timeLimit.a'),
    },
    {
      q: tFaq('items.profitSplit.q'),
      a: tFaq('items.profitSplit.a'),
    },
    {
      q: tFaq('items.platforms.q'),
      a: tFaq('items.platforms.a'),
    },
  ]

  return (
    <div className="min-h-screen bg-background" data-od-id="instant-page">

      {/* ─────────────── Hero (DARK) ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] flex min-h-[calc(100dvh-44px)] flex-col overflow-hidden border-b border-gray-200 bg-white" data-od-id="instant-hero">
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
                data-od-id="instant-hero-title"
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
                <a href="#instant-pricing" data-od-id="instant-hero-primary">
                  <GoldButton size="lg">
                    {t('getStarted')} <ArrowRight size={16} />
                  </GoldButton>
                </a>
                <a
                  href="#instant-comparison"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#4B5563] hover:text-[#0A0A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                >
                  {t('comparisonTitle')} <ArrowRight size={15} />
                </a>
              </motion.div>

              <div className="mt-14 flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                <span className="inline-flex items-center gap-2"><Zap size={14} className="text-[#A98BFF]" /> Instant Activation</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-[#A98BFF]" /> Direct Simulated Funding</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 xl:col-span-6 min-w-0"
              data-od-id="instant-hero-dashboard"
            >
              <InstantFundingVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── Benefits Grid ─────────────── */}
      <section className="bg-white border-b border-[#E5E7EB] py-16 md:py-24 text-[#0A0A0C]" data-od-id="instant-benefits">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
              PROGRAM ADVANTAGES
            </p>
            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-5xl">
              {t('whyTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-gray-300"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-[#0A0A0C]">
                  <Zap size={20} />
                </div>
                <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-[#0A0A0C] mb-2">{item.title}</h3>
                <p className="text-[#4B5563] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── Instant Pricing ─────────────── */}
      <section id="instant-pricing" className="scroll-mt-24 bg-white py-16 md:py-24 text-[#0A0A0C]" data-od-id="instant-pricing">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
              ACCOUNT TIERS
            </p>
            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-5xl">
              {t('pricesTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {pricing.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 text-center shadow-sm hover:border-[#703AD7] hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div>
                  <p className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold text-[#0A0A0C] mb-1">
                    {item.amount}
                  </p>
                  <div className="flex items-baseline justify-center gap-1.5 mb-4">
                    <span className="text-sm sm:text-base font-extrabold text-[#0A0A0C]">{item.price}</span>
                    <span className="text-xs text-gray-400 line-through font-normal">{item.orig}</span>
                  </div>
                </div>
                <a
                  href={`https://app.ckcapital.co.uk/signup?plan=instant&size=${item.amount.replace('$', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0C] hover:bg-violet-50 hover:border-[#703AD7] transition-colors"
                >
                  {t('getStarted')} <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── Comparison Table ─────────────── */}
      <InstantVsChallengeComparison />

      {/* ─────────────── FAQ ─────────────── */}
      <section className="bg-white py-16 md:py-24 text-[#0A0A0C]" data-od-id="instant-faq">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A98BFF]">
              QUESTIONS & ANSWERS
            </p>
            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-[#0A0A0C] md:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion multiple={false} className="space-y-3">
              {instantFaqs.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={String(idx)}
                  className="rounded-2xl border border-gray-200 bg-white px-6 transition-all hover:border-gray-300"
                >
                  <AccordionTrigger className="py-4 text-left text-sm font-semibold text-[#0A0A0C] hover:text-[#A98BFF] hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-[#4B5563]">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>

      {/* ─────────────── Final CTA ─────────────── */}
      <section className="relative overflow-hidden bg-white border-t border-[#E5E7EB] py-20 md:py-28 text-[#0A0A0C]" data-od-id="instant-closing-cta">
        <Container className="relative text-center">
          <SectionReveal>
            <Zap className="mx-auto text-[#A98BFF]" size={32} />
            <h2 className="mx-auto mt-6 max-w-3xl font-[family-name:var(--font-jakarta)] text-4xl font-extrabold tracking-[-0.05em] text-[#0A0A0C] md:text-6xl">
              Ready for Instant Simulated Funding?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#4B5563]">
              Skip the evaluation targets and trade with an active simulated account today.
            </p>
            <div className="mt-8">
              <a href="https://app.ckcapital.co.uk/signup" target="_blank" rel="noopener noreferrer">
                <GoldButton size="lg">
                  Get Instant Account <ArrowRight size={16} />
                </GoldButton>
              </a>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </div>
  )
}
