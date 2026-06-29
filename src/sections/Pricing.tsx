import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Copy, CheckCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type ChallengeType = 'standard' | 'middleweight' | 'lightweight' | '1step' | 'instant';

const CHALLENGE_TABS: { id: ChallengeType; label: string; note: string }[] = [
  { id: 'standard', label: 'Standard', note: 'Classic 2-step' },
  { id: 'middleweight', label: 'Middleweight', note: 'Balanced rules' },
  { id: 'lightweight', label: 'Lightweight', note: 'Lower targets' },
  { id: '1step', label: '1-Step', note: 'Direct access' },
  { id: 'instant', label: 'Instant', note: 'Instant funding' },
];

const SPLIT: Record<ChallengeType, string> = {
  standard: 'Up to 100%', middleweight: 'Up to 100%', lightweight: 'Up to 100%', '1step': 'Up to 100%', instant: 'Bi-weekly 50%',
};

const BASE_CARDS = [
  { size: '$2.5K', price: '$9', oldPrice: '$30', badge: null },
  { size: '$5K', price: '$13', oldPrice: '$44', badge: null },
  { size: '$10K', price: '$19', oldPrice: '$65', badge: 'MOST POPULAR' },
  { size: '$25K', price: '$68.40', oldPrice: '$228', badge: null },
  { size: '$50K', price: '$98.40', oldPrice: '$328', badge: null },
  { size: '$100K', price: '$176.40', oldPrice: '$588', badge: 'BEST VALUE' },
];

const CHALLENGE_DATA: Record<ChallengeType, Record<string, string[]>> = {
  standard: { '$2.5K': ['$250','$125','$80','$200','Unlimited','1','N/A'], '$5K': ['$500','$250','$200','$400','Unlimited','1','N/A'], '$10K': ['$1,000','$500','$400','$800','Unlimited','1','N/A'], '$25K': ['$2,500','$1,250','$1,000','$2,000','Unlimited','1','N/A'], '$50K': ['$5,000','$2,500','$2,000','$4,000','Unlimited','1','N/A'], '$100K': ['$10,000','$5,000','$4,000','$8,000','Unlimited','1','N/A'] },
  middleweight: { '$2.5K': ['$200','$125','$80','$300','Unlimited','1','30%'], '$5K': ['$400','$250','$200','$600','Unlimited','1','30%'], '$10K': ['$800','$500','$400','$1,200','Unlimited','1','30%'], '$25K': ['$2,000','$1,250','$1,000','$3,000','Unlimited','1','30%'], '$50K': ['$4,000','$2,500','$2,000','$6,000','Unlimited','1','30%'], '$100K': ['$8,000','$5,000','$4,000','$12,000','Unlimited','1','30%'] },
  lightweight: { '$2.5K': ['$150','$150','$80','$200','Unlimited','1','50%'], '$5K': ['$300','$300','$200','$400','Unlimited','1','50%'], '$10K': ['$600','$600','$400','$800','Unlimited','1','50%'], '$25K': ['$1,500','$1,500','$1,000','$2,000','Unlimited','1','50%'], '$50K': ['$3,000','$3,000','$2,000','$4,000','Unlimited','1','50%'], '$100K': ['$6,000','$6,000','$4,000','$8,000','Unlimited','1','50%'] },
  '1step': { '$2.5K': ['$250','$0','$80','$150','Unlimited','1','N/A'], '$5K': ['$500','$0','$200','$300','Unlimited','1','N/A'], '$10K': ['$1,000','$0','$400','$600','Unlimited','1','N/A'], '$25K': ['$2,500','$0','$1,000','$1,500','Unlimited','1','N/A'], '$50K': ['$5,000','$0','$2,000','$3,000','Unlimited','1','N/A'], '$100K': ['$10,000','$0','$4,000','$6,000','Unlimited','1','N/A'] },
  instant: { '$5K': ['$0','$0','$200','$500','Unlimited','1','20%'], '$10K': ['$0','$0','$400','$1,000','Unlimited','1','20%'], '$25K': ['$0','$0','$1,000','$2,500','Unlimited','1','20%'], '$50K': ['$0','$0','$2,000','$5,000','Unlimited','1','20%'] },
};

export default function Pricing() {
  const [selectedType, setSelectedType] = useState<ChallengeType>('standard');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const cards = BASE_CARDS.filter((base) => CHALLENGE_DATA[selectedType][base.size]).map((base) => {
    const f = CHALLENGE_DATA[selectedType][base.size];
    return { ...base, features: { phase1: f[0], phase2: f[1], maxDaily: f[2], maxLoss: f[3], period: f[4], minDays: f[5], consistency: f[6] } };
  });

  const handleCopyCode = (code: string) => { navigator.clipboard.writeText(code); setCopiedCode(code); setTimeout(() => setCopiedCode(null), 2000); };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pricing-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, [selectedType]);

  const featureList = [
    { label: 'Phase 1 Target', key: 'phase1' as const }, { label: 'Phase 2 Target', key: 'phase2' as const },
    { label: 'Max Daily Loss', key: 'maxDaily' as const }, { label: 'Max Loss', key: 'maxLoss' as const },
    { label: 'Trading Period', key: 'period' as const }, { label: 'Min Trading Days', key: 'minDays' as const },
    { label: 'Consistency Rule', key: 'consistency' as const },
  ];

  return (
    <section id="pricing" ref={sectionRef} className="relative py-20 md:py-32 bg-ck-bg">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(26,138,122,0.2) 0%, transparent 70%)' }} />
      <div className="container-main relative z-10">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.25em] text-ck-gold uppercase mb-3">CK Capital Evaluations</p>
          <h2 className="font-display text-4xl md:text-6xl font-black text-ck-text uppercase leading-none mb-4">Choose Your <span className="text-gradient-gold">Challenge</span></h2>
          <p className="text-ck-muted max-w-2xl mx-auto">Select your account size and challenge type. All challenges include our full platform support and 24/7 customer service.</p>
        </div>
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl border border-white/5 bg-ck-surface">
            {CHALLENGE_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setSelectedType(tab.id)} className={`min-w-[100px] md:min-w-[120px] rounded-xl px-4 py-3 text-left transition-all duration-300 ${selectedType === tab.id ? 'bg-ck-gold/10 border border-ck-gold/30 text-ck-gold' : 'text-ck-muted hover:text-ck-text hover:bg-white/5'}`}>
                <span className="block text-sm font-bold">{tab.label}</span><span className="block text-[11px] opacity-60">{tab.note}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div key={card.size} className={`pricing-card relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${card.badge ? 'border-ck-gold/40 bg-ck-gold/5 shadow-glow-gold' : 'border-white/5 bg-ck-surface hover:border-white/10'}`}>
              {card.badge && <div className="absolute right-4 top-4 rounded-full bg-ck-gold px-3 py-1 text-[10px] font-extrabold tracking-wide text-ck-bg">{card.badge}</div>}
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ck-muted mb-2">Account Size</p>
              <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ck-text mb-4">{card.size}</h3>
              <div className="mb-5 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-gradient-gold">{card.price}</span>
                  <span className="text-sm text-ck-muted line-through">{card.oldPrice}</span>
                </div>
                <p className="text-xs text-ck-muted mt-1">70% off promotional pricing</p>
              </div>
              <a href="https://app.ckcapital.co.uk/signup" target="_blank" rel="noopener noreferrer" className={`mb-5 flex h-12 items-center justify-center rounded-xl text-sm font-bold transition-all ${card.badge ? 'bg-ck-gold text-ck-bg hover:bg-ck-gold/90' : 'bg-white/5 text-ck-text border border-white/10 hover:bg-white/10'}`}>
                Start Challenge <ArrowRight size={14} className="ml-2" />
              </a>
              <div className="flex-1 space-y-2.5 text-sm">
                {featureList.map(({ label, key }) => (
                  <div key={label} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0"><span className="text-ck-muted">{label}</span><span className="text-right font-bold text-ck-text">{card.features[key]}</span></div>
                ))}
                <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2"><span className="text-ck-muted">Profit Split</span><span className="text-right font-bold text-ck-gold">{SPLIT[selectedType]}</span></div>
              </div>
              <button onClick={() => handleCopyCode(`CK70-${card.size.replace('$', '').replace('K', '')}`)} className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-ck-gold/30 bg-ck-gold/5 px-3 py-3 text-xs font-bold text-ck-gold hover:bg-ck-gold/10 transition-colors">
                {copiedCode === `CK70-${card.size.replace('$', '').replace('K', '')}` ? <><CheckCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy Code: CK70-{card.size.replace('$', '').replace('K', '')}</>}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ck-muted/60">CK Capital programs use demo accounts with fictitious funds for simulated trading evaluation only. Program terms, rules, and eligibility apply.</p>
      </div>
    </section>
  );
}
