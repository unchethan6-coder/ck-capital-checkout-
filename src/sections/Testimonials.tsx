import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  { name: 'CK Trader', country: 'United Kingdom', quote: 'The objectives are clear, support is responsive, and the dashboard makes the evaluation process easy to follow.', rating: 5, tone: 'gold' as const },
  { name: 'Community Trader', country: 'UAE', quote: 'Fast support and a smooth simulated trading experience. The rules are simple to understand before starting.', rating: 5, tone: 'dark' as const },
  { name: 'Discord Member', country: 'India', quote: 'The community is active, friendly, and helpful. CK Capital feels more personal than other evaluation brands.', rating: 5, tone: 'dark' as const },
  { name: 'Evaluation User', country: 'United States', quote: 'The price options are flexible and the account-size choices make it easier to pick the right starting point.', rating: 5, tone: 'gold' as const },
];

function TrustStars({ count = 5 }: { count?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[...Array(count)].map((_, i) => (
        <span key={i} className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-[#00B67A]"><Star size={11} fill="white" stroke="white" /></span>
      ))}
    </span>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.review-card').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-ck-bg">
      <div className="container-main">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.25em] text-ck-gold uppercase mb-3">Trader Reviews</p>
          <h2 className="font-display text-4xl md:text-6xl font-black text-ck-text uppercase leading-none mb-4">Trusted by <span className="text-gradient-gold">Traders</span></h2>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-ck-muted"><span>4.9 based on Trustpilot reviews</span><TrustStars /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <div key={i} className={`review-card flex flex-col justify-between p-6 rounded-2xl border min-h-[220px] ${review.tone === 'gold' ? 'border-ck-gold/20 bg-ck-gold/5' : 'border-white/5 bg-ck-surface'}`}>
              <div><Quote size={20} className="text-ck-gold/40 mb-3" /><TrustStars count={review.rating} />
                <p className={`mt-4 text-sm leading-relaxed ${review.tone === 'gold' ? 'text-ck-text/80' : 'text-ck-muted'}`}>&ldquo;{review.quote}&rdquo;</p>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex w-10 h-10 items-center justify-center rounded-full bg-ck-gold/10 text-sm font-bold text-ck-gold">{review.name[0]}</span>
                  <div><p className="text-sm font-bold text-ck-text">{review.name}</p><p className="text-xs text-ck-muted">{review.country}</p></div>
                </div>
                <span className="rounded-full px-3 py-1 text-[10px] font-bold bg-white/5 text-ck-muted">Trustpilot</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="https://uk.trustpilot.com/review/ckcapital.co.uk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-sm font-semibold text-ck-text hover:bg-white/5 transition-colors">Read All Reviews on Trustpilot</a>
        </div>
      </div>
    </section>
  );
}
