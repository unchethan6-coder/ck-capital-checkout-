import { useState } from 'react';
import { ArrowRight, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  resources: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Trading Rules', href: '#' },
  ],
  legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Risk Disclosure', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
  support: [
    { label: 'Help Center', href: '#' },
    { label: 'Live Chat', href: '#' },
    { label: 'Discord Community', href: 'https://discord.gg/ckcapital' },
    { label: 'Trustpilot Reviews', href: 'https://uk.trustpilot.com/review/ckcapital.co.uk' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="relative bg-ck-surface border-t border-white/5">
      <div className="container-main py-12 border-b border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ck-text mb-2">
              Get Exclusive <span className="text-gradient-gold">Updates</span>
            </h3>
            <p className="text-sm text-ck-muted">Expert trading insights, latest updates, and special offers delivered to your inbox.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ck-muted" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3.5 rounded-l-full bg-ck-bg border border-white/10 text-ck-text text-sm placeholder:text-ck-muted/50 focus:outline-none focus:border-ck-gold/50" />
            </div>
            <button type="submit" className="px-6 py-3.5 rounded-r-full bg-ck-gold text-ck-bg font-bold text-sm hover:bg-ck-gold/90 transition-colors flex items-center gap-2">
              {subscribed ? 'Subscribed!' : 'Subscribe'} <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="inline-block mb-4">
              <span className="font-display text-xl font-bold text-ck-text tracking-wide">CK <span className="text-ck-gold">CAPITAL</span></span>
            </a>
            <p className="text-sm text-ck-muted mb-4 leading-relaxed">The propeller of a new era in proprietary trading.</p>
            <div className="space-y-2">
              <a href="mailto:support@ckcapital.co.uk" className="flex items-center gap-2 text-sm text-ck-muted hover:text-ck-gold transition-colors"><Mail size={14} /> support@ckcapital.co.uk</a>
              <div className="flex items-center gap-2 text-sm text-ck-muted"><MapPin size={14} /> London, United Kingdom</div>
            </div>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-ck-text uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}><a href={link.href} className="text-sm text-ck-muted hover:text-ck-gold transition-colors duration-200">{link.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container-main py-6 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ck-muted/60">&copy; {new Date().getFullYear()} CK Capital Group Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-ck-muted/60 hover:text-ck-muted transition-colors">Terms</a>
            <a href="#" className="text-xs text-ck-muted/60 hover:text-ck-muted transition-colors">Privacy</a>
            <a href="#" className="text-xs text-ck-muted/60 hover:text-ck-muted transition-colors">Cookies</a>
            <a href="#" className="text-xs text-ck-muted/60 hover:text-ck-muted transition-colors">Imprint</a>
          </div>
        </div>
      </div>
      <div className="container-main pb-8">
        <p className="text-[11px] text-ck-muted/40 leading-relaxed max-w-4xl">
          All information provided on this site is intended solely for educational purposes related to trading on financial markets and does not serve in any way as a specific investment recommendation. CK Capital only provides services of simulated trading and educational tools for traders. The information on this site is not directed at residents in any country or jurisdiction where such distribution or use would be contrary to local laws or regulations. CK Capital companies do not act as a broker and do not accept any deposits.
        </p>
      </div>
    </footer>
  );
}
