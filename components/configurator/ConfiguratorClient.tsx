'use client';

import { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Check,
  ArrowRight,
  Volume2,
  Zap,
  Shield,
  Gauge,
} from 'lucide-react';
import {
  ChallengeType,
  AccountSize,
  Platform,
  AddOnType,
  CHALLENGE_META,
  PRICING,
  ADDONS,
  getPrice,
  getOriginalPrice,
  getSavingsPercent,
  getRules,
  calculateTotal,
  getAvailableAccountSizes,
} from '@/lib/configurator';

interface ConfiguratorState {
  challengeType: ChallengeType;
  accountSize: AccountSize;
  platform: Platform;
  selectedAddOns: AddOnType[];
  quantity: number;
  couponCode: string;
  couponApplied: boolean;
  couponDiscount: number;
}

const DEMO_COUPON = '10KFOR19';
const DEMO_COUPON_DISCOUNT = 0.15; // 15% off

export function ConfiguratorClient() {
  const [state, setState] = useState<ConfiguratorState>({
    challengeType: 'standard',
    accountSize: 100000,
    platform: 'mt5',
    selectedAddOns: [],
    quantity: 1,
    couponCode: '',
    couponApplied: false,
    couponDiscount: 0,
  });

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Memoized calculations
  const rules = useMemo(() => getRules(state.challengeType, state.accountSize), [
    state.challengeType,
    state.accountSize,
  ]);

  const challengePrice = useMemo(
    () => getPrice(state.challengeType, state.accountSize),
    [state.challengeType, state.accountSize]
  );

  const originalPrice = useMemo(
    () => getOriginalPrice(state.challengeType, state.accountSize),
    [state.challengeType, state.accountSize]
  );

  const savingsPercent = useMemo(
    () => getSavingsPercent(state.challengeType, state.accountSize),
    [state.challengeType, state.accountSize]
  );

  const totals = useMemo(
    () =>
      calculateTotal(
        challengePrice * state.quantity,
        state.selectedAddOns,
        state.couponDiscount
      ),
    [challengePrice, state.quantity, state.selectedAddOns, state.couponDiscount]
  );

  const handleChallengeChange = (type: ChallengeType) => {
    setState((prev) => ({ ...prev, challengeType: type }));
  };

  const handleAccountSizeChange = (size: AccountSize) => {
    setState((prev) => ({ ...prev, accountSize: size }));
  };

  const handlePlatformChange = (platform: Platform) => {
    setState((prev) => ({ ...prev, platform }));
  };

  const toggleAddOn = (addOnId: AddOnType) => {
    setState((prev) => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(addOnId)
        ? prev.selectedAddOns.filter((id) => id !== addOnId)
        : [...prev.selectedAddOns, addOnId],
    }));
  };

  const handleQuantityChange = (delta: number) => {
    setState((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponInput.trim()) {
      setCouponError('Enter a coupon code');
      return;
    }
    if (couponInput.toUpperCase() === DEMO_COUPON) {
      setState((prev) => ({
        ...prev,
        couponCode: DEMO_COUPON,
        couponApplied: true,
        couponDiscount: DEMO_COUPON_DISCOUNT,
      }));
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const clearCoupon = () => {
    setState((prev) => ({
      ...prev,
      couponCode: '',
      couponApplied: false,
      couponDiscount: 0,
    }));
    setCouponInput('');
    setCouponError('');
  };

  const availableSizes = getAvailableAccountSizes(state.challengeType);
  const selectedChallengeMeta = CHALLENGE_META[state.challengeType];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050914] via-[#080B17] to-[#050914]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#25283F] bg-[#050914]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#D946EF]">
                <Zap size={20} className="text-white" />
              </div>
              <span className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-white">
                CK PROPFIRM
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#999BA3] transition-colors hover:text-white"
                onClick={() => (window.location.href = '/')}
              >
                ← Back to website
              </button>
              <a
                href="https://app.ckcapital.co.uk/login"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#999BA3] transition-colors hover:text-white"
              >
                Sign in
              </a>
              <button className="flex items-center gap-2 rounded-lg bg-[#F6C94C] px-4 py-2 font-medium text-[#050914] transition-all hover:shadow-lg hover:shadow-[#F6C94C]/20">
                Start Challenge <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Page Title & Step Indicator */}
        <div className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-jakarta)] text-4xl font-bold text-white md:text-5xl">
            Configure your challenge
          </h1>
          <p className="mt-2 text-[#999BA3]">4 simple steps to get funded</p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <span className="rounded-full bg-[#7C3AED] px-3 py-1 text-white">1. Challenge</span>
            <span className="text-[#525867]">→</span>
            <span className="rounded-full border border-[#25283F] px-3 py-1 text-[#999BA3]">
              2. Account
            </span>
            <span className="text-[#525867]">→</span>
            <span className="rounded-full border border-[#25283F] px-3 py-1 text-[#999BA3]">
              3. Platform
            </span>
            <span className="text-[#525867]">→</span>
            <span className="rounded-full border border-[#25283F] px-3 py-1 text-[#999BA3]">
              4. Extras
            </span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Configuration Controls (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Challenge Type Selection */}
            <section className="space-y-4">
              <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-white">
                Select Your Challenge
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.values(CHALLENGE_META) as Array<typeof CHALLENGE_META.standard>).map(
                  (meta) => (
                    <button
                      key={meta.id}
                      onClick={() => handleChallengeChange(meta.id)}
                      className={`group rounded-xl border p-4 transition-all ${
                        state.challengeType === meta.id
                          ? 'border-[#7C3AED] bg-[#15182A]/80 shadow-lg shadow-[#7C3AED]/20'
                          : 'border-[#25283F] bg-[#101425]/40 hover:border-[#7C3AED]/50 hover:bg-[#101425]/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-left">
                          <h3 className="font-semibold text-white group-hover:text-[#D946EF]">
                            {meta.name}
                          </h3>
                          <p className="text-xs text-[#999BA3]">{meta.subtitle}</p>
                          <p className="mt-1 text-xs text-[#7C3AED]">{meta.description}</p>
                        </div>
                        {state.challengeType === meta.id && (
                          <Check size={18} className="text-[#7C3AED]" />
                        )}
                      </div>
                    </button>
                  )
                )}
              </div>
            </section>

            {/* Account Size Selection */}
            <section className="space-y-4">
              <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-white">
                Account Size
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {availableSizes.map((tier) => (
                  <button
                    key={tier.size}
                    onClick={() => handleAccountSizeChange(tier.size)}
                    className={`group relative rounded-xl border p-4 transition-all ${
                      state.accountSize === tier.size
                        ? 'border-[#7C3AED] bg-[#15182A]/80 shadow-lg shadow-[#7C3AED]/20'
                        : 'border-[#25283F] bg-[#101425]/40 hover:border-[#7C3AED]/50 hover:bg-[#101425]/60'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#D946EF] px-2 py-0.5 text-xs font-medium text-white">
                        Popular
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-[#D946EF]">
                          ${tier.size.toLocaleString()}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-base font-bold text-[#F6C94C]">
                          ${tier.current.toFixed(2)}
                        </span>
                        <span className="text-[#999BA3] line-through">
                          ${tier.original.toFixed(2)}
                        </span>
                        <span className="text-[#7C3AED]">Save {getSavingsPercent(state.challengeType, tier.size)}%</span>
                      </div>
                    </div>
                    {state.accountSize === tier.size && (
                      <div className="absolute top-2 right-2">
                        <Check size={18} className="text-[#7C3AED]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Platform Selection */}
            <section className="space-y-4">
              <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-white">
                Trading Platform
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['mt5', 'tradelocker'] as const).map((plat) => (
                  <button
                    key={plat}
                    onClick={() => handlePlatformChange(plat)}
                    className={`group rounded-xl border p-4 transition-all ${
                      state.platform === plat
                        ? 'border-[#7C3AED] bg-[#15182A]/80 shadow-lg shadow-[#7C3AED]/20'
                        : 'border-[#25283F] bg-[#101425]/40 hover:border-[#7C3AED]/50 hover:bg-[#101425]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-left">
                        <h3 className="font-semibold text-white group-hover:text-[#D946EF]">
                          {plat === 'mt5' ? 'MetaTrader 5' : 'TradeLocker'}
                        </h3>
                        <p className="text-xs text-[#999BA3]">
                          {plat === 'mt5'
                            ? 'Industry standard platform'
                            : 'Modern web-based trading'}
                        </p>
                      </div>
                      {state.platform === plat && (
                        <Check size={18} className="text-[#7C3AED]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Add-Ons Selection */}
            <section className="space-y-4">
              <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-white">
                Optional Add-Ons
              </h2>
              <div className="space-y-3">
                {Object.values(ADDONS).map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`group flex w-full rounded-lg border p-4 transition-all ${
                      state.selectedAddOns.includes(addon.id)
                        ? 'border-[#7C3AED] bg-[#15182A]/60 shadow-lg shadow-[#7C3AED]/10'
                        : 'border-[#25283F] bg-[#101425]/40 hover:border-[#7C3AED]/30 hover:bg-[#101425]/60'
                    }`}
                  >
                    <div
                      className={`mr-3 flex h-5 w-5 items-center justify-center rounded border transition-all ${
                        state.selectedAddOns.includes(addon.id)
                          ? 'border-[#7C3AED] bg-[#7C3AED]'
                          : 'border-[#525867] bg-transparent group-hover:border-[#7C3AED]/50'
                      }`}
                    >
                      {state.selectedAddOns.includes(addon.id) && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-white group-hover:text-[#D946EF]">
                        {addon.name}
                      </h3>
                      <p className="text-xs text-[#999BA3]">{addon.description}</p>
                    </div>
                    <span className="ml-2 whitespace-nowrap font-semibold text-[#F6C94C]">
                      +${addon.surcharge.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Coupon Input */}
            <section className="space-y-4">
              <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-white">
                Promo Code
              </h2>
              {state.couponApplied ? (
                <div className="flex items-center justify-between rounded-lg border border-[#7C3AED] bg-[#15182A]/60 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#7C3AED]">
                      ✓ Coupon Applied: {state.couponCode}
                    </p>
                    <p className="text-xs text-[#999BA3]">15% discount active</p>
                  </div>
                  <button
                    onClick={clearCoupon}
                    className="text-xs font-medium text-[#D946EF] hover:text-[#F6C94C]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                        handleApplyCoupon();
                      }
                    }}
                    placeholder={`Try: ${DEMO_COUPON}`}
                    className="flex-1 rounded-lg border border-[#25283F] bg-[#101425]/40 px-3 py-2.5 text-sm text-white placeholder-[#525867] transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]/20"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="rounded-lg bg-[#F6C94C] px-4 py-2 font-medium text-[#050914] transition-all hover:shadow-lg hover:shadow-[#F6C94C]/20"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500">{couponError}</p>}
            </section>
          </div>

          {/* Right Column - Sticky Summary (lg:col-span-1) */}
          <div className="lg:sticky lg:top-20 lg:h-fit">
            <div className="space-y-4 rounded-2xl border border-[#25283F] bg-gradient-to-b from-[#15182A]/80 to-[#101425]/60 p-6 backdrop-blur-sm lg:col-span-1">
              {/* Summary Header */}
              <div className="pb-4 border-b border-[#25283F]">
                <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-white">
                  Order Summary
                </h3>
              </div>

              {/* Challenge & Account Display */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#999BA3]">Challenge</span>
                  <span className="font-semibold text-white">
                    {selectedChallengeMeta.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#999BA3]">Account Size</span>
                  <span className="font-semibold text-white">
                    ${state.accountSize.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#999BA3]">Platform</span>
                  <span className="font-semibold text-white">
                    {state.platform === 'mt5' ? 'MetaTrader 5' : 'TradeLocker'}
                  </span>
                </div>
              </div>

              {/* Key Rules */}
              <div className="space-y-2 rounded-lg border border-[#25283F] bg-[#0B1122]/50 p-3">
                <p className="text-xs font-semibold text-[#D946EF]">Key Rules</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {rules.phase1Target && (
                    <div className="flex items-center gap-1 text-[#999BA3]">
                      <span className="text-[#7C3AED]">✓</span>
                      <span>Phase 1: {rules.phase1Target}%</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-[#999BA3]">
                    <span className="text-[#7C3AED]">✓</span>
                    <span>Daily Loss: {rules.maxDailyLoss}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#999BA3]">
                    <span className="text-[#7C3AED]">✓</span>
                    <span>Max Loss: {rules.maxTotalLoss}%</span>
                  </div>
                  {rules.consistency && (
                    <div className="flex items-center gap-1 text-[#999BA3]">
                      <span className="text-[#7C3AED]">✓</span>
                      <span>Consistency: {rules.consistency}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between rounded-lg border border-[#25283F] bg-[#0B1122]/50 px-3 py-2">
                <span className="text-xs font-medium text-[#999BA3]">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={state.quantity <= 1}
                    className="p-1 disabled:opacity-50 disabled:cursor-not-allowed text-[#999BA3] hover:text-[#7C3AED] transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <span className="w-6 text-center font-semibold text-white">
                    {state.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-1 text-[#999BA3] hover:text-[#7C3AED] transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                </div>
              </div>

              {/* Selected Add-Ons Display */}
              {state.selectedAddOns.length > 0 && (
                <div className="space-y-1 text-xs">
                  <p className="font-medium text-[#999BA3]">Add-Ons:</p>
                  {state.selectedAddOns.map((id) => (
                    <p key={id} className="text-[#D946EF]">
                      • {ADDONS[id].name}
                    </p>
                  ))}
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-2 border-t border-[#25283F] pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#999BA3]">Subtotal</span>
                  <span className="font-semibold text-white">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>
                {state.couponApplied && totals.discount > 0 && (
                  <div className="flex justify-between text-[#7C3AED]">
                    <span>Discount ({Math.round(state.couponDiscount * 100)}%)</span>
                    <span className="font-semibold">-${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#25283F] pt-2">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-[#F6C94C]">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Main CTA */}
              <button className="w-full rounded-lg bg-gradient-to-r from-[#D4A03E] to-[#F6C94C] py-3 font-bold text-[#050914] transition-all hover:shadow-lg hover:shadow-[#F6C94C]/30 flex items-center justify-center gap-2">
                Continue to Checkout <ArrowRight size={16} />
              </button>

              {/* Trust Chips */}
              <div className="space-y-2 rounded-lg border border-[#25283F] bg-[#0B1122]/50 p-3">
                <div className="grid gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#999BA3]">
                    <Shield size={14} className="text-[#7C3AED]" />
                    <span>Up to 100% profit split</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#999BA3]">
                    <Gauge size={14} className="text-[#7C3AED]" />
                    <span>1:100 leverage</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#999BA3]">
                    <Volume2 size={14} className="text-[#7C3AED]" />
                    <span>Payouts in ~12 hours</span>
                  </div>
                </div>
                <p className="text-xs text-[#525867] pt-2 border-t border-[#25283F]">
                  We accept VISA, Mastercard, Stripe &amp; Crypto
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Summary */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-[#25283F] bg-gradient-to-t from-[#050914] to-[#080B17] p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#999BA3]">Total:</span>
            <span className="text-xl font-bold text-[#F6C94C]">
              ${totals.total.toFixed(2)}
            </span>
          </div>
          <button className="w-full rounded-lg bg-gradient-to-r from-[#D4A03E] to-[#F6C94C] py-3 font-bold text-[#050914] transition-all hover:shadow-lg hover:shadow-[#F6C94C]/30 flex items-center justify-center gap-2">
            Continue to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}
