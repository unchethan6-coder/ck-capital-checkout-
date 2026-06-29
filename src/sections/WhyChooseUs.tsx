import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Newspaper, RefreshCw, Percent, Headphones, Zap, TrendingUp, BarChart3, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Newspaper, title: 'News Trading Allowed', description: 'Trade around high-impact market events. No restrictions on trading during news releases.' },
  { icon: RefreshCw, title: 'Reset & Top-Up', description: 'Flexible reset and top-up options to help you continue your evaluation journey.' },
  { icon: Percent, title: 'Up to 100% Profit Split', description: 'Eligible traders can receive up to 100% reward split in supported evaluation models.' },
  { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock support access for account, rules, and evaluation questions.' },
  { icon: Zap, title: '12-Hour Payouts', description: 'Industry-leading payout processing within 12 hours of your request.' },
  { icon: TrendingUp, title: 'No Time Limits', description: 'Most challenges have unlimited trading periods. Trade at your own pace.' },
  { icon: BarChart3, title: 'Competitive Conditions', description: 'Access supported trading platforms and market instruments with tight spreads.' },
  { icon: Globe, title: 'Global Access', description: 'Trade from anywhere in the world with our cloud-based platform solutions.' },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.feature-item').forEach((item, i) => {
        gsap.fromTo(item, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%' },
          delay: (i % 4) * 0.08,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-ck-bg">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none -translate-y-1/2" style={{ background: 'radial-gradient(circle, rgba(26,138,122,0.15) 0%, transparent 70%)' }} />
      <div className="container-main relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-ck-gold uppercase mb-3">Why Traders Choose Us</p>
          <h2 className="font-display text-4xl md:text-6xl font-black text-ck-text uppercase leading-none mb-4">The CK <span className="text-gradient-gold">Advantage</span></h2>
          <p className="text-ck-muted max-w-2xl mx-auto">Industry-leading conditions designed to help you succeed as a funded trader.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div key={feature.title} className="feature-item group p-6 rounded-2xl border border-white/5 bg-ck-surface hover:border-ck-gold/20 transition-all duration-300 hover:-translate-y-1">
              <div className="w-11 h-11 rounded-xl bg-ck-gold/10 flex items-center justify-center mb-4 group-hover:bg-ck-gold/20 transition-colors">
                <feature.icon size={20} className="text-ck-gold" />
              </div>
              <h3 className="text-base font-bold text-ck-text mb-2">{feature.title}</h3>
              <p className="text-sm text-ck-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
