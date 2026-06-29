import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ROW_1 = [
  { name: 'Hyun-jun R.', amount: '$19,482', country: 'South Korea' },
  { name: 'Davide M.', amount: '$30,000', country: 'Italy' },
  { name: 'Vanessa N.', amount: '$24,986', country: 'Portugal' },
  { name: 'Ewelina W.', amount: '$4,430', country: 'Poland' },
  { name: 'Jonas W.', amount: '$20,609', country: 'Germany' },
  { name: 'Javier V.', amount: '$7,961', country: 'Mexico' },
  { name: 'William J.', amount: '$27,518', country: 'Denmark' },
  { name: 'Hervé M.', amount: '$7,647', country: 'France' },
];

const ROW_2 = [
  { name: 'Hanna R.', amount: '$23,673', country: 'Norway' },
  { name: 'William C.', amount: '$21,360', country: 'Australia' },
  { name: 'Henrik S.', amount: '$12,628', country: 'Sweden' },
  { name: 'Viktor K.', amount: '$7,519', country: 'Slovakia' },
  { name: 'Garry S.', amount: '$30,000', country: 'United States' },
  { name: 'Stelios S.', amount: '$9,043', country: 'Greece' },
  { name: 'Catherine L.', amount: '$15,634', country: 'France' },
  { name: 'Jatin V.', amount: '$30,000', country: 'India' },
];

const ROW_3 = [
  { name: 'Tobias R.', amount: '$18,695', country: 'Norway' },
  { name: 'Romain G.', amount: '$9,234', country: 'France' },
  { name: 'Hyeon-seok Y.', amount: '$20,697', country: 'South Korea' },
  { name: 'Juho K.', amount: '$24,703', country: 'Finland' },
  { name: 'Ryusei S.', amount: '$30,000', country: 'Japan' },
  { name: 'Alexander F.', amount: '$19,482', country: 'Austria' },
  { name: 'Radek K.', amount: '$30,000', country: 'Czech Republic' },
  { name: 'Willow M.', amount: '$12,450', country: 'Australia' },
];

function PayoutCard({ name, amount, country }: { name: string; amount: string; country: string }) {
  return (
    <div className="flex-shrink-0 w-[240px] md:w-[280px] p-5 rounded-xl bg-ck-surface border border-white/5 hover:border-ck-gold/30 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-ck-muted uppercase tracking-wider">{country}</span>
        <div className="w-2 h-2 rounded-full bg-ck-teal group-hover:shadow-[0_0_8px_rgba(26,138,122,0.5)] transition-shadow" />
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gradient-gold mb-1">{amount}</p>
      <p className="text-sm text-ck-text font-medium">{name}</p>
    </div>
  );
}

function CardRow({ items, reverse = false }: { items: typeof ROW_1; reverse?: boolean }) {
  return (
    <div className={`flex gap-4 ${reverse ? 'flex-row-reverse' : ''}`}>
      {[...items, ...items].map((item, i) => (
        <PayoutCard key={i} {...item} />
      ))}
    </div>
  );
}

export default function VideoRiver() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(row1Ref.current, { x: -800, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo(row2Ref.current, { x: -400 }, { x: 200, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.to(row3Ref.current, { x: -600, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="payouts" ref={sectionRef} className="relative py-20 md:py-32 overflow-hidden bg-ck-bg">
      <div className="container-main mb-12 md:mb-16">
        <p className="text-xs font-semibold tracking-[0.25em] text-ck-gold uppercase mb-3">Verified Payouts</p>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-ck-text uppercase leading-none">
          Real Traders.<br /><span className="text-gradient-gold">Real Results.</span>
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <div ref={row1Ref} className="overflow-visible"><CardRow items={ROW_1} /></div>
        <div ref={row2Ref} className="overflow-visible"><CardRow items={ROW_2} reverse /></div>
        <div ref={row3Ref} className="overflow-visible"><CardRow items={ROW_3} /></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ck-bg to-transparent pointer-events-none" />
    </section>
  );
}
