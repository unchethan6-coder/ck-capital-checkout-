'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Gauge,
  Globe2,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
} from 'lucide-react';
import {
  ADDONS,
  CHALLENGE_META,
  PRICING,
  calculateTotal,
  getAvailableAccountSizes,
  getOriginalPrice,
  getPrice,
  getRules,
  getSavingsPercent,
  type AccountSize,
  type AddOnType,
  type ChallengeType,
  type Platform,
} from '@/lib/configurator';

interface ConfiguratorState {
  challengeType: ChallengeType;
  accountSize: AccountSize;
  platform: Platform;
  selectedAddOns: AddOnType[];
  quantity: number;
  couponDiscount: number;
  currencyCode: (typeof CURRENCIES)[number]['code'];
}

const COUPON = '10KFOR19';
const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', rate: 1 },
  { code: 'EUR', flag: '🇪🇺', rate: 0.92 },
  { code: 'CZK', flag: '🇨🇿', rate: 23.1 },
  { code: 'GBP', flag: '🇬🇧', rate: 0.79 },
  { code: 'AUD', flag: '🇦🇺', rate: 1.52 },
  { code: 'CAD', flag: '🇨🇦', rate: 1.39 },
  { code: 'CHF', flag: '🇨🇭', rate: 0.86 },
] as const;
const ADDON_ICONS: Record<AddOnType, typeof Zap> = {
  lifetime90: WalletCards,
  reward95: Sparkles,
  doubleLeverage: Gauge,
  eaSupport: Zap,
  weekendHolding: Globe2,
  newsTrading: ShieldCheck,
};
const currency = (value: number, code: string, rate: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: code, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value * rate);
const balanceLabel = (size: number, code: string, rate: number) => `${new Intl.NumberFormat('en-US', { style: 'currency', currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((size / 1000) * rate)}K`;

export function ConfiguratorClient() {
  const [state, setState] = useState<ConfiguratorState>({
    challengeType: 'standard',
    accountSize: 100000,
    platform: 'mt5',
    selectedAddOns: [],
    quantity: 1,
    couponDiscount: 0,
    currencyCode: 'USD',
  });
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);

  const selectedCurrency = CURRENCIES.find((item) => item.code === state.currencyCode) ?? CURRENCIES[0];
  const displayCurrency = (value: number) => currency(value, selectedCurrency.code, selectedCurrency.rate);
  const displayBalance = (size: number) => balanceLabel(size, selectedCurrency.code, selectedCurrency.rate);
  const availableSizes = getAvailableAccountSizes(state.challengeType);
  const price = getPrice(state.challengeType, state.accountSize);
  const original = getOriginalPrice(state.challengeType, state.accountSize);
  const rules = useMemo(() => getRules(state.challengeType, state.accountSize), [state.challengeType, state.accountSize]);
  const selectedChallenge = CHALLENGE_META[state.challengeType];
  const addonTotal = state.selectedAddOns.reduce((sum, id) => sum + ADDONS[id].surcharge, 0);
  const totals = calculateTotal(price * state.quantity, state.selectedAddOns, state.couponDiscount);
  const subtotal = totals.subtotal;
  const discount = totals.discount;
  const total = totals.total;

  const chooseChallenge = (challengeType: ChallengeType) => {
    const nextSizes = getAvailableAccountSizes(challengeType);
    const keepsSize = nextSizes.some((item) => item.size === state.accountSize);
    setState((current) => ({ ...current, challengeType, accountSize: keepsSize ? current.accountSize : nextSizes[0].size }));
  };
  const toggleAddon = (id: AddOnType) => setState((current) => ({
    ...current,
    selectedAddOns: current.selectedAddOns.includes(id) ? current.selectedAddOns.filter((item) => item !== id) : [...current.selectedAddOns, id],
  }));
  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === COUPON) {
      setCouponApplied(true);
      setCouponError('');
      setState((current) => ({ ...current, couponDiscount: 0.15 }));
    } else {
      setCouponApplied(false);
      setCouponError('Try the visible code: 10KFOR19');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1024] pb-24 font-geist-sans text-white [font-variant-numeric:tabular-nums] lg:pb-10">
      <header className="sticky top-0 z-40 border-b border-[#292E50] bg-[#11142B]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5" aria-label="CK Propfirm home">
<img
            src="/brand/ck-propfirm-logo-white-text.svg"
            alt="CK Propfirm"
            className="h-9 w-auto max-w-[220px] object-contain sm:h-10"
          />
          </a>
          <nav className="flex items-center gap-5 text-[13px] font-medium text-[#A7ABC3]">
            <a href="https://app.ckcapital.co.uk/login" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">Go to Dashboard</a>
            <a href="/pricing" className="hidden transition-colors hover:text-white sm:block">Pricing Plan</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-7 flex flex-col gap-5 border-b border-[#292E50] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.10em] text-[#756AFF]">CK Propfirm · Challenge builder</p>
            <h1 className="text-[26px] font-bold leading-[1.15] tracking-[-0.025em] text-white sm:text-[30px]">Configure your plan</h1>
            <p className="mt-2 text-sm text-[#A7ABC3]">Build the account that fits your trading style.</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#A7ABC3]">
            {['Challenge', 'Account', 'Platform', 'Extras'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className={`flex size-6 items-center justify-center rounded-full border text-[10px] ${index === 0 ? 'border-[#675BFF] bg-[#5B4CFF] text-white' : 'border-[#3A3F68] text-[#7F84A3]'}`}>{index + 1}</span>
                <span className="hidden sm:inline">{step}</span>
                {index < 3 && <span className="text-[#4A4F73]">/</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-7">
            <section>
              <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-white">Challenge Type</h2><button className="text-xs font-medium text-[#8D84FF] hover:text-white">Compare</button></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.values(CHALLENGE_META) as (typeof CHALLENGE_META)[ChallengeType][]).map((item) => {
                  const selected = state.challengeType === item.id;
                  return <button key={item.id} onClick={() => chooseChallenge(item.id)} className={`relative min-h-[92px] rounded-[15px] border p-4 text-left transition duration-200 ${selected ? 'border-[#675BFF] bg-gradient-to-br from-[#4E46C8]/60 to-[#202443] shadow-[inset_0_0_0_1px_rgba(103,91,255,.25)]' : 'border-[#33385E] bg-[#1A1D38] hover:border-[#575D91]'}`}>
                    {selected && <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#47D597] text-[#11251E]"><Check className="size-3.5" strokeWidth={3} /></span>}
                    <span className="block text-[15px] font-semibold text-white">{item.name}</span><span className="mt-1 block text-xs text-[#A7ABC3]">{item.subtitle}</span><span className="mt-2 block text-[11px] text-[#7E84A7]">{item.description}</span>
                  </button>;
                })}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-white">Account Balance</h2><p className="mt-1 text-xs text-[#7E84A7]">Choose your starting capital</p></div><span className="text-xs text-[#7E84A7]">Trading account currency</span></div>
              <div className="mb-4 flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Trading account currency">
                {CURRENCIES.map((item) => <button key={item.code} type="button" aria-pressed={state.currencyCode === item.code} aria-label={`Use ${item.code} currency`} onClick={() => setState((current) => ({ ...current, currencyCode: item.code }))} className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${state.currencyCode === item.code ? 'border-[#675BFF] bg-[#5B4CFF] text-white' : 'border-[#33385E] bg-[#1A1D38] text-[#A7ABC3] hover:border-[#575D91] hover:text-white'}`}><span aria-hidden="true">{item.flag}</span>{item.code}</button>)}
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
                {availableSizes.map((tier) => { const selected = state.accountSize === tier.size; return <button key={tier.size} disabled={tier.enabled === false} onClick={() => setState((current) => ({ ...current, accountSize: tier.size }))} className={`relative min-h-[92px] rounded-[14px] border px-2 py-3 text-center transition duration-200 disabled:cursor-not-allowed disabled:opacity-35 ${selected ? 'border-[#675BFF] bg-[#4E46C8]/55' : 'border-[#33385E] bg-[#1A1D38] hover:border-[#575D91]'}`}>
                  {tier.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-transparent bg-[linear-gradient(90deg,#D49F3E_0%,#E9BE57_28%,#FFF494_50%,#E9BE57_72%,#D49F3E_100%)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#281522]">Popular</span>}
                  {selected && <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-[#47D597] text-[#11251E]"><Check className="size-3" strokeWidth={3} /></span>}
                  <span className="block text-[15px] font-bold text-white">{displayBalance(tier.size)}</span><span className="mt-2 block text-[15px] font-bold text-[#D7D9E8]">{tier.enabled === false ? 'Unavailable' : displayCurrency(tier.current)}</span><span className="mt-0.5 block text-[10px] text-[#7E84A7] line-through">{tier.enabled === false ? '' : displayCurrency(tier.original)}</span><span className="mt-1 block text-[10px] text-[#47D597]">{tier.enabled === false ? '' : `Save ${getSavingsPercent(state.challengeType, tier.size)}%`}</span>
                </button>; })}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-white">Trading Platform</h2>
              <div className="grid grid-cols-2 gap-3">
                {([['mt5', 'MetaTrader 5', 'Industry-standard execution', '/brand/ck-propfirm-logo.svg', 'MetaTrader 5 official platform logo'], ['tradelocker', 'TradeLocker', 'Modern web-based trading', '/brand/ck-propfirm-group.svg', 'TradeLocker official platform logo']] as [Platform, string, string, string, string][]).map(([id, title, desc, logo, logoAlt]) => { const selected = state.platform === id; return <button key={id} onClick={() => setState((current) => ({ ...current, platform: id }))} className={`relative flex items-center gap-3 rounded-[14px] border p-3.5 text-left transition ${selected ? 'border-[#675BFF] bg-[#4E46C8]/45' : 'border-[#33385E] bg-[#1A1D38] hover:border-[#575D91]'}`}>{selected && <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#47D597] text-[#11251E]"><Check className="size-3.5" strokeWidth={3} /></span>}<span className="flex h-9 w-[86px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#202443] px-1.5"><img src={logo} alt={logoAlt} className="max-h-7 w-full object-contain" /></span><span><span className="block text-sm font-semibold text-white">{title}</span><span className="block text-[11px] text-[#A7ABC3]">{desc}</span></span></button>; })}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-end justify-between"><div><h2 className="text-sm font-semibold text-white">Add-ons</h2><p className="mt-1 text-xs text-[#7E84A7]">Optional upgrades for more flexibility.</p></div><span className="text-xs text-[#7E84A7]">{state.selectedAddOns.length} selected</span></div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(Object.values(ADDONS) as (typeof ADDONS)[AddOnType][]).map((addon) => { const selected = state.selectedAddOns.includes(addon.id); const Icon = ADDON_ICONS[addon.id]; return <div key={addon.id} className={`rounded-[14px] border p-3.5 transition ${selected ? 'border-[#675BFF] bg-[#4E46C8]/35' : 'border-[#33385E] bg-[#1A1D38]'}`}><div className="flex items-start justify-between"><span className="flex size-8 items-center justify-center rounded-lg bg-[#262A4A] text-[#8D84FF]"><Icon className="size-4" /></span>{selected && <Check className="size-4 text-[#47D597]" />}</div><p className="mt-3 text-xs font-semibold text-white">{addon.name}</p><p className="mt-1 min-h-8 text-[11px] leading-4 text-[#A7ABC3]">{addon.description}</p><button onClick={() => toggleAddon(addon.id)} className={`mt-3 flex h-8 w-full items-center justify-center rounded-lg text-xs font-semibold transition ${selected ? 'bg-[#33385E] text-white' : 'bg-[#252A4A] text-[#D4D7E8] hover:bg-[#5B4CFF] hover:text-white'}`}>{selected ? 'Added' : `+ Add · ${displayCurrency(addon.surcharge)}`}</button></div>; })}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-[88px]">
            <div className="rounded-[16px] border border-[#3B4070] bg-[#1A1D38] shadow-[0_18px_60px_rgba(5,7,28,.3)]">
              <div className="border-b border-[#33385E] p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.10em] text-[#8D84FF]">Your challenge</p><h2 className="mt-1 text-lg font-semibold text-white">{selectedChallenge.name} · {displayBalance(state.accountSize)}</h2></div><span className="rounded-lg bg-[#282D4D] px-2 py-1 text-[11px] font-medium text-[#A7ABC3]">{state.platform === 'mt5' ? 'MT5' : 'TradeLocker'}</span></div><div className="mt-4 flex items-end justify-between"><div><span className="text-2xl font-bold text-white">{displayCurrency(price)}</span><span className="ml-2 text-xs text-[#7E84A7] line-through">{displayCurrency(original)}</span></div><span className="text-xs font-semibold text-[#47D597]">Save {getSavingsPercent(state.challengeType, state.accountSize)}%</span></div></div>
              <div className="border-b border-[#33385E] px-5 py-3"><button onClick={() => setDetailsOpen((open) => !open)} className="flex w-full items-center justify-between text-xs font-semibold text-[#D7D9E8]"><span>View Plan Details</span>{detailsOpen ? <ChevronUp className="size-4 text-[#8D84FF]" /> : <ChevronDown className="size-4 text-[#8D84FF]" />}</button>{detailsOpen && <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-[#33385E] pt-3 text-[11px] text-[#A7ABC3]"><span>Phase 1 target <b className="float-right text-white">{rules.phase1Target ? `${rules.phase1Target}%` : '—'}</b></span><span>Phase 2 target <b className="float-right text-white">{rules.phase2Target ? `${rules.phase2Target}%` : '—'}</b></span><span>Daily loss <b className="float-right text-white">{rules.maxDailyLoss}%</b></span><span>Max loss <b className="float-right text-white">{rules.maxTotalLoss}%</b></span><span>Min trading days <b className="float-right text-white">{rules.minTradingDays}</b></span><span>Trading period <b className="float-right text-white">{rules.unlimitedPeriod ? 'Unlimited' : 'Bi-weekly'}</b></span>{rules.consistency && <span>Consistency <b className="float-right text-white">{rules.consistency}%</b></span>}</div>}</div>
              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#A7ABC3]">Number of accounts</span><div className="flex items-center gap-3 rounded-lg border border-[#3B4070] bg-[#202443] p-1"><button onClick={() => setState((current) => ({ ...current, quantity: Math.max(1, current.quantity - 1) }))} className="flex size-6 items-center justify-center rounded text-[#A7ABC3] hover:bg-[#33385E] hover:text-white" aria-label="Decrease quantity"><Minus className="size-3" /></button><span className="w-4 text-center text-sm font-semibold text-white">{state.quantity}</span><button onClick={() => setState((current) => ({ ...current, quantity: Math.min(10, current.quantity + 1) }))} className="flex size-6 items-center justify-center rounded text-[#A7ABC3] hover:bg-[#33385E] hover:text-white" aria-label="Increase quantity"><Plus className="size-3" /></button></div></div>
                {state.quantity > 1 && <div className="rounded-lg border border-[#33385E] bg-[#202443] p-3 text-[11px] text-[#A7ABC3]">Bulk order: {state.quantity} × {displayBalance(state.accountSize)} accounts</div>}
                <div className="flex gap-2"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Promo code" aria-label="Promo code" className="min-w-0 flex-1 rounded-lg border border-[#33385E] bg-[#11142B] px-3 text-xs text-white outline-none placeholder:text-[#6F7598] focus:border-[#675BFF]" /><button onClick={applyCoupon} className="rounded-lg border border-[#575D91] px-3 text-xs font-semibold text-[#D7D9E8] hover:border-[#8D84FF]">{couponApplied ? 'Applied' : 'Apply'}</button></div><p className="-mt-2 text-[10px] text-[#7E84A7]">Use <button onClick={() => setCoupon(COUPON)} className="font-semibold text-[#8D84FF]">10KFOR19</button> for 15% off.</p>{couponError && <p className="-mt-2 text-[10px] text-[#F48B9D]">{couponError}</p>}
                <div className="flex flex-col gap-2 border-t border-[#33385E] pt-4 text-xs"><div className="flex justify-between text-[#A7ABC3]"><span>Subtotal</span><span className="text-white">{displayCurrency(subtotal)}</span></div>{state.couponDiscount > 0 && <div className="flex justify-between text-[#47D597]"><span>Discount (15%)</span><span>-{displayCurrency(discount)}</span></div>}<div className="flex justify-between pt-1 text-[23px] font-bold leading-tight text-white"><span>Total</span><span>{displayCurrency(total)}</span></div></div>
                <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#5B4CFF] text-sm font-bold text-white transition hover:bg-[#6F62FF] focus:outline-none focus:ring-2 focus:ring-[#8D84FF] focus:ring-offset-2 focus:ring-offset-[#1A1D38]">Continue <ArrowRight className="size-4" /></button>
              </div>
            </div>
            <div className="mt-3 rounded-[14px] border border-[#33385E] bg-[#151832] p-4"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7E84A7]">Why traders choose CK</p><div className="grid grid-cols-3 gap-2 text-center"><div><BadgeCheck className="mx-auto size-4 text-[#47D597]" /><p className="mt-1 text-[10px] leading-3 text-[#A7ABC3]">Up to 100%<br />profit split</p></div><div><ShieldCheck className="mx-auto size-4 text-[#8D84FF]" /><p className="mt-1 text-[10px] leading-3 text-[#A7ABC3]">1:100<br />leverage</p></div><div><CreditCard className="mx-auto size-4 text-[#F46C8E]" /><p className="mt-1 text-[10px] leading-3 text-[#A7ABC3]">Payouts in<br />~12 hours</p></div></div><div className="mt-4 border-t border-[#33385E] pt-3 text-center text-[10px] text-[#7E84A7]">Secure checkout · Visa · Mastercard · Crypto</div></div>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-[#3B4070] bg-[#11142B]/95 px-4 py-3 backdrop-blur-xl lg:hidden"><div><p className="text-[10px] text-[#A7ABC3]">Total</p><p className="text-lg font-bold text-white">{displayCurrency(total)}</p></div><button className="flex h-11 items-center gap-2 rounded-xl bg-[#5B4CFF] px-5 text-sm font-bold text-white">Continue <ArrowRight className="size-4" /></button></div>
    </div>
  );
}
