import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Clock, Percent, DollarSign, Shield } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' });
      gsap.fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' });
      gsap.fromTo('.hero-features', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.1, ease: 'power3.out' });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-end pb-16 md:pb-24 pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" alt="Misty mountain landscape" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.9) 80%, #050505 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center top, transparent 30%, rgba(5,5,5,0.6) 100%)' }} />
      </div>
      <div className="container-main relative z-10 max-w-5xl">
        <div className="hero-badge inline-flex items-center gap-3 border border-ck-gold/40 text-ck-gold px-5 py-2.5 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-ck-gold rounded-full animate-pulse" />
          70% OFF 2026 - Biggest Drop of the Year
        </div>
        <h1 className="hero-title font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-ck-text uppercase leading-[0.9] tracking-tight mb-4">
          Best Prop<br /><span className="text-gradient-gold">Firm 2026</span>
        </h1>
        <p className="hero-subtitle text-lg md:text-xl text-ck-muted max-w-xl mb-8 leading-relaxed">
          Funded accounts up to $1.2M with 100% profit splits. No time limits, news trading allowed, transparent rules. Start your evaluation today.
        </p>
        <div className="hero-cta flex flex-wrap items-center gap-4 mb-12">
          <a href="https://app.ckcapital.co.uk/signup" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ck-gold text-ck-bg font-bold text-base hover:scale-105 transition-transform duration-300 shadow-glow-gold">
            Start Challenge <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#how-it-works" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/15 text-ck-text font-medium text-base hover:bg-white/5 transition-colors duration-300">
            How It Works
          </a>
        </div>
        <div className="hero-features flex flex-wrap gap-3">
          {[{ icon: Clock, label: '12H Payouts' }, { icon: Percent, label: '100% Profit Split' }, { icon: DollarSign, label: '$1.2M Capital' }, { icon: Shield, label: 'No Time Limits' }].map((feature) => (
            <div key={feature.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-ck-muted">
              <feature.icon size={14} className="text-ck-gold" />{feature.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
