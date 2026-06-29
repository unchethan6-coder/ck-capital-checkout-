import { Monitor, Smartphone, TrendingUp, Shield, Clock, Globe } from 'lucide-react';

const platforms = [
  { name: 'MT5', description: 'MetaTrader 5 - Industry Standard', icon: Monitor },
  { name: 'TradeLocker', description: 'Modern Web-Based Platform', icon: Smartphone },
];

const benefits = [
  { icon: TrendingUp, label: 'Real-Time Charts' },
  { icon: Shield, label: 'Secure Execution' },
  { icon: Clock, label: 'Low Latency' },
  { icon: Globe, label: 'Global Servers' },
];

export default function Platforms() {
  return (
    <section className="relative py-20 md:py-32 bg-ck-surface border-y border-white/5">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-ck-gold uppercase mb-3">Trading Platforms</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-ck-text uppercase leading-none mb-6">Trade on <span className="text-gradient-gold">Any Device</span></h2>
            <p className="text-ck-muted mb-8 leading-relaxed">Access your funded account from desktop, web, or mobile. Our supported platforms give you the flexibility to trade wherever you are, whenever you want.</p>
            <div className="space-y-4 mb-8">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-ck-bg hover:border-ck-gold/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-ck-gold/10 flex items-center justify-center"><platform.icon size={22} className="text-ck-gold" /></div>
                  <div><h4 className="text-base font-bold text-ck-text">{platform.name}</h4><p className="text-sm text-ck-muted">{platform.description}</p></div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {benefits.map((benefit) => (
                <div key={benefit.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-ck-muted"><benefit.icon size={14} className="text-ck-gold" />{benefit.label}</div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-ck-gold/10 via-ck-teal/5 to-transparent border border-white/5" />
              <div className="absolute top-8 left-8 right-8 p-5 rounded-xl bg-ck-bg/80 border border-white/5 backdrop-blur">
                <div className="flex items-center justify-between mb-3"><span className="text-xs text-ck-muted">EUR/USD</span><span className="text-xs text-ck-teal font-bold">+1.24%</span></div>
                <div className="h-16 flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 70, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i > 8 ? 'linear-gradient(to top, #C5A059, #E8C97A)' : 'rgba(197,160,89,0.2)' }} />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 p-5 rounded-xl bg-ck-bg/80 border border-white/5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-ck-muted">Account Balance</p><p className="text-2xl font-bold text-gradient-gold">$104,230.50</p></div>
                  <div className="w-10 h-10 rounded-full bg-ck-teal/20 flex items-center justify-center"><TrendingUp size={18} className="text-ck-teal" /></div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-full bg-ck-gold/10 border border-ck-gold/20 backdrop-blur"><span className="text-sm font-bold text-ck-gold">Live Trading</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
