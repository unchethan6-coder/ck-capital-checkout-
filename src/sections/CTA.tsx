import { ArrowRight, MessageCircle } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ck-bg via-ck-surface to-ck-bg" />
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.15) 0%, transparent 60%)' }} />
      <div className="container-main relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-ck-gold uppercase mb-4">Start Your Journey</p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-ck-text uppercase leading-none mb-6">Ready to <span className="text-gradient-gold">Trade?</span></h2>
          <p className="text-lg text-ck-muted max-w-2xl mx-auto mb-10">Join 50,000+ traders who have chosen CK Capital as their prop firm. Get funded, trade with confidence, and keep up to 100% of your profits.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://app.ckcapital.co.uk/signup" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ck-gold text-ck-bg font-bold text-base hover:scale-105 transition-transform duration-300 shadow-glow-gold">
              Start Your Challenge <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://discord.gg/ckcapital" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/15 text-ck-text font-medium hover:bg-white/5 transition-colors">
              <MessageCircle size={18} /> Join Discord
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-ck-muted">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ck-teal" />No hidden fees</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ck-teal" />12h payouts</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ck-teal" />24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
