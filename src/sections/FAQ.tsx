import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { question: 'What is CK Capital?', answer: 'CK Capital is a proprietary trading firm that provides qualified traders with funded trading accounts up to $1.2M in capital with flexible profit splits. We offer a range of evaluation programs designed to suit different trading styles and experience levels.' },
  { question: 'How much is the challenge fee?', answer: 'Challenge fees range from $9 to $176.40 depending on the account size and challenge type selected. All fees are currently discounted by 70% as part of our 2026 promotional offer.' },
  { question: 'What is the profit split percentage?', answer: 'CK Capital traders can receive up to 100% of their profits depending on the challenge type and program selected. There are no commissions or hidden fees.' },
  { question: 'Can I trade the news?', answer: 'Yes, news trading is allowed on CK Capital accounts. We encourage traders to capitalize on market-moving events with proper risk management.' },
  { question: 'How long do I have to complete the challenge?', answer: 'Most of our challenges have no time limits, allowing you to trade at your own pace. The Instant Funding program has specific trading day requirements.' },
  { question: 'What platforms do you support?', answer: 'We support both MT5 and TradeLocker platforms, giving you the flexibility to choose the trading environment that works best for you.' },
  { question: 'How fast are payouts processed?', answer: 'Payouts are processed within 12 hours of request, making us one of the fastest prop firms in the industry.' },
  { question: 'What is the scaling plan?', answer: 'Our scaling plan allows successful traders to increase their account size up to $1.2M based on consistent performance and meeting specific milestones.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 md:py-32 bg-ck-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-semibold tracking-[0.25em] text-ck-gold uppercase mb-3">Got Questions?</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-ck-text uppercase leading-none mb-4">Frequently <span className="text-gradient-gold">Asked</span></h2>
            <p className="text-ck-muted max-w-md">Everything you need to know about CK Capital evaluation programs, payouts, and trading rules.</p>
            <div className="mt-8">
              <a href="https://app.ckcapital.co.uk/signup" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ck-gold text-ck-bg font-bold text-sm hover:scale-105 transition-transform">Get Started Now</a>
            </div>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/5 rounded-xl overflow-hidden bg-ck-surface hover:border-white/10 transition-colors">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-sm md:text-base font-semibold text-ck-text pr-4">{faq.question}</span>
                  <ChevronDown size={18} className={`flex-shrink-0 text-ck-gold transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-60' : 'max-h-0'}`}>
                  <p className="px-5 pb-5 text-sm text-ck-muted leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
