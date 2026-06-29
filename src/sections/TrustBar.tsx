import { Star, Users, TrendingUp, Award } from 'lucide-react';

const stats = [
  { icon: Star, value: '4.9', label: 'Trustpilot Rating', detail: '★★★★★' },
  { icon: Users, value: '50,000+', label: 'Active Traders', detail: 'Worldwide' },
  { icon: TrendingUp, value: '$1.2M', label: 'Max Capital', detail: 'Funded Accounts' },
  { icon: Award, value: '100%', label: 'Profit Split', detail: 'Highest in Industry' },
];

export default function TrustBar() {
  return (
    <section className="relative z-10 bg-ck-surface border-y border-white/5">
      <div className="container-main py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ck-gold/10 flex items-center justify-center">
                <stat.icon size={18} className="text-ck-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-bold text-ck-text">{stat.value}</span>
                  {stat.detail && <span className="text-xs text-ck-gold">{stat.detail}</span>}
                </div>
                <p className="text-xs md:text-sm text-ck-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
