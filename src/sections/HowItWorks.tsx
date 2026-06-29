import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MousePointerClick, Target, Trophy, Wallet } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', icon: MousePointerClick, title: 'Choose Your Account', description: 'Select from 5 account sizes ranging from $2.5K to $100K. Pick the challenge type that fits your trading style - Standard, Middleweight, Lightweight, 1-Step, or Instant.', color: 'from-ck-gold/20 to-transparent', accent: 'bg-ck-gold' },
  { num: '02', icon: Target, title: 'Pass the Challenge', description: 'Trade in a simulated environment with clear objectives. Meet the profit targets while respecting risk rules. No time limits - trade at your own pace.', color: 'from-ck-teal/20 to-transparent', accent: 'bg-ck-teal' },
  { num: '03', icon: Trophy, title: 'Get Verified', description: 'Complete the verification stage with the same clear rules. Once passed, you become a funded trader eligible for payouts with up to 100% profit split.', color: 'from-ck-gold/20 to-transparent', accent: 'bg-ck-gold' },
  { num: '04', icon: Wallet, title: 'Receive Payouts', description: 'Request your payout and receive it within 12 hours. Keep up to 100% of your profits. Scale your account up to $1.2M with our scaling plan.', color: 'from-ck-teal/20 to-transparent', accent: 'bg-ck-teal' },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.step-card').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
          delay: i * 0.1,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-20 md:py-32 bg-ck-bg">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 70%)' }} />
      <div className="container-main relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <p className="text-xs font-semibold tracking-[0.25em] text-ck-gold uppercase mb-3">Your Path to Success</p>
          <h2 className="font-display text-4xl md:text-6xl font-black text-ck-text uppercase leading-none mb-4">How It <span className="text-gradient-gold">Works</span></h2>
          <p className="text-ck-muted max-w-2xl mx-auto">Four simple steps to become a funded trader. Clear rules, transparent process, no surprises.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className={`step-card relative p-6 md:p-8 rounded-2xl border border-white/5 bg-gradient-to-b ${step.color} hover:border-white/10 transition-all duration-500 group`}>
              <div className="absolute -top-4 -right-2 font-display text-7xl font-black text-white/[0.03] select-none">{step.num}</div>
              <div className={`w-12 h-12 rounded-xl ${step.accent}/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon size={22} className={step.accent === 'bg-ck-gold' ? 'text-ck-gold' : 'text-ck-teal'} />
              </div>
              <h3 className="text-lg font-bold text-ck-text mb-3">{step.title}</h3>
              <p className="text-sm text-ck-muted leading-relaxed">{step.description}</p>
              {step.num !== '04' && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-white/10 to-transparent" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
