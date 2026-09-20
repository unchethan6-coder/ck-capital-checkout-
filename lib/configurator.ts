/**
 * CK Propfirm Challenge Configurator Data Types & Pricing
 * All prices in USD. Current pricing from ckpropfirm.com (9/2026)
 */

export type ChallengeType = 'standard' | 'oneStep' | 'instant' | 'middleweight';
export type AccountSize = 5000 | 10000 | 25000 | 50000 | 100000 | 200000 | 300000;
export type Platform = 'mt5' | 'tradelocker';
export type AddOnType = 'lifetime90' | 'reward95' | 'doubleLeverage' | 'eaSupport' | 'weekendHolding' | 'newsTrading';

export interface ChallengeMeta {
  id: ChallengeType;
  name: string;
  subtitle: string;
  description: string;
  badge?: string;
}

export interface PricingTier {
  size: AccountSize;
  current: number;
  original: number;
  popular?: boolean;
  enabled?: boolean;
}

export interface ChallengeRules {
  phase1Target?: number; // as percentage, e.g. 10 for 10%
  phase2Target?: number;
  maxDailyLoss: number;
  maxTotalLoss: number;
  minTradingDays: number;
  unlimitedPeriod: boolean;
  consistency?: number; // as percentage
  biWeeklySplit?: number; // as percentage
  fundedConsistency?: number;
  profitSplitLadder?: Array<{ day: number; split: number }>;
}

export interface AddOnConfig {
  id: AddOnType;
  name: string;
  description: string;
  surcharge: number; // in USD
  popular?: boolean;
}

// ─────────────────────────────────────────────────────────────
// CHALLENGE METADATA
// ─────────────────────────────────────────────────────────────

export const CHALLENGE_META: Record<ChallengeType, ChallengeMeta> = {
  standard: {
    id: 'standard',
    name: 'Standard',
    subtitle: 'Two-Phase Evaluation',
    description: 'Classic Growth',
    badge: undefined,
  },
  oneStep: {
    id: 'oneStep',
    name: '1 Step Standard',
    subtitle: 'Single Phase',
    description: 'Faster Road to Funding',
    badge: undefined,
  },
  instant: {
    id: 'instant',
    name: 'Instant Funding',
    subtitle: 'Skip Evaluation',
    description: 'Direct Live Payouts',
    badge: undefined,
  },
  middleweight: {
    id: 'middleweight',
    name: 'Middleweight',
    subtitle: 'High Drawdown Buffer',
    description: 'Max Leverage',
    badge: undefined,
  },
};

// ─────────────────────────────────────────────────────────────
// PRICING DATA (USD)
// ─────────────────────────────────────────────────────────────

export const PRICING: Record<ChallengeType, PricingTier[]> = {
  standard: [
    { size: 5000, current: 19.20, original: 64.0, enabled: true },
    { size: 10000, current: 58.0, original: 193.33, enabled: true },
    { size: 25000, current: 68.4, original: 228.0, enabled: true },
    { size: 50000, current: 108.24, original: 360.8, enabled: true },
    { size: 100000, current: 229.0, original: 763.33, popular: true, enabled: true },
    { size: 200000, current: 634.5, original: 2115.0, enabled: true },
    { size: 300000, current: 984.5, original: 3281.67, enabled: true },
  ],
  oneStep: [
    { size: 5000, current: 19.20, original: 64.0, enabled: true },
    { size: 10000, current: 58.0, original: 193.33, enabled: true },
    { size: 25000, current: 68.4, original: 228.0, enabled: true },
    { size: 50000, current: 108.24, original: 360.8, enabled: true },
    { size: 100000, current: 229.0, original: 763.33, popular: true, enabled: true },
    { size: 200000, current: 634.5, original: 2115.0, enabled: true },
    { size: 300000, current: 984.5, original: 3281.67, enabled: true },
  ],
  instant: [
    { size: 5000, current: 48.0, original: 160.0, enabled: true },
    { size: 10000, current: 78.0, original: 260.0, enabled: true },
    { size: 25000, current: 139.0, original: 463.33, enabled: true },
    { size: 50000, current: 274.5, original: 915.0, enabled: true },
    { size: 100000, current: 549.0, original: 1830.0, popular: true, enabled: true },
    { size: 200000, current: 1098.0, original: 3660.0, enabled: true },
    { size: 300000, current: 0, original: 0, enabled: false },
  ],
  middleweight: [
    { size: 5000, current: 19.20, original: 64.0, enabled: true },
    { size: 10000, current: 58.0, original: 193.33, enabled: true },
    { size: 25000, current: 68.4, original: 228.0, enabled: true },
    { size: 50000, current: 108.24, original: 360.8, enabled: true },
    { size: 100000, current: 229.0, original: 763.33, popular: true, enabled: true },
    { size: 200000, current: 634.5, original: 2115.0, enabled: true },
    { size: 300000, current: 984.5, original: 3281.67, enabled: true },
  ],
};

// ─────────────────────────────────────────────────────────────
// CHALLENGE RULES
// ─────────────────────────────────────────────────────────────

function getProfitSplitLadder(): Array<{ day: number; split: number }> {
  return [
    { day: 1, split: 50 },
    { day: 14, split: 75 },
    { day: 31, split: 100 },
  ];
}

export const CHALLENGE_RULES: Record<ChallengeType, Record<AccountSize | 'default', ChallengeRules>> = {
  standard: {
    default: {
      phase1Target: 10,
      phase2Target: 5,
      maxDailyLoss: 4,
      maxTotalLoss: 8,
      minTradingDays: 1,
      unlimitedPeriod: true,
      profitSplitLadder: getProfitSplitLadder(),
    },
    // Same rules for all sizes
    5000: { phase1Target: 10, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 8, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    10000: { phase1Target: 10, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 8, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    25000: { phase1Target: 10, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 8, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    50000: { phase1Target: 10, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 8, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    100000: { phase1Target: 10, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 8, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    200000: { phase1Target: 10, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 8, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    300000: { phase1Target: 10, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 8, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
  },
  oneStep: {
    default: {
      phase1Target: 10,
      maxDailyLoss: 4,
      maxTotalLoss: 6,
      minTradingDays: 1,
      unlimitedPeriod: true,
      profitSplitLadder: getProfitSplitLadder(),
    },
    5000: { phase1Target: 10, maxDailyLoss: 4, maxTotalLoss: 6, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    10000: { phase1Target: 10, maxDailyLoss: 4, maxTotalLoss: 6, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    25000: { phase1Target: 10, maxDailyLoss: 4, maxTotalLoss: 6, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    50000: { phase1Target: 10, maxDailyLoss: 4, maxTotalLoss: 6, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    100000: { phase1Target: 10, maxDailyLoss: 4, maxTotalLoss: 6, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    200000: { phase1Target: 10, maxDailyLoss: 4, maxTotalLoss: 6, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
    300000: { phase1Target: 10, maxDailyLoss: 4, maxTotalLoss: 6, minTradingDays: 1, unlimitedPeriod: true, profitSplitLadder: getProfitSplitLadder() },
  },
  instant: {
    default: {
      maxDailyLoss: 3,
      maxTotalLoss: 5,
      minTradingDays: 1,
      unlimitedPeriod: false,
      consistency: 20,
      biWeeklySplit: 50,
    },
    5000: { maxDailyLoss: 3, maxTotalLoss: 5, minTradingDays: 1, unlimitedPeriod: false, consistency: 20, biWeeklySplit: 50 },
    10000: { maxDailyLoss: 3, maxTotalLoss: 5, minTradingDays: 1, unlimitedPeriod: false, consistency: 20, biWeeklySplit: 50 },
    25000: { maxDailyLoss: 3, maxTotalLoss: 5, minTradingDays: 1, unlimitedPeriod: false, consistency: 20, biWeeklySplit: 50 },
    50000: { maxDailyLoss: 3, maxTotalLoss: 5, minTradingDays: 1, unlimitedPeriod: false, consistency: 20, biWeeklySplit: 50 },
    100000: { maxDailyLoss: 3, maxTotalLoss: 5, minTradingDays: 1, unlimitedPeriod: false, consistency: 20, biWeeklySplit: 50 },
    200000: { maxDailyLoss: 3, maxTotalLoss: 5, minTradingDays: 1, unlimitedPeriod: false, consistency: 20, biWeeklySplit: 50 },
    300000: { maxDailyLoss: 3, maxTotalLoss: 5, minTradingDays: 1, unlimitedPeriod: false, consistency: 20, biWeeklySplit: 50 },
  },
  middleweight: {
    default: {
      phase1Target: 8,
      phase2Target: 5,
      maxDailyLoss: 4,
      maxTotalLoss: 12,
      minTradingDays: 1,
      unlimitedPeriod: true,
      consistency: 30,
      fundedConsistency: 25,
      profitSplitLadder: getProfitSplitLadder(),
    },
    5000: { phase1Target: 8, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 12, minTradingDays: 1, unlimitedPeriod: true, consistency: 30, fundedConsistency: 25, profitSplitLadder: getProfitSplitLadder() },
    10000: { phase1Target: 8, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 12, minTradingDays: 1, unlimitedPeriod: true, consistency: 30, fundedConsistency: 25, profitSplitLadder: getProfitSplitLadder() },
    25000: { phase1Target: 8, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 12, minTradingDays: 1, unlimitedPeriod: true, consistency: 30, fundedConsistency: 25, profitSplitLadder: getProfitSplitLadder() },
    50000: { phase1Target: 8, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 12, minTradingDays: 1, unlimitedPeriod: true, consistency: 30, fundedConsistency: 25, profitSplitLadder: getProfitSplitLadder() },
    100000: { phase1Target: 8, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 12, minTradingDays: 1, unlimitedPeriod: true, consistency: 30, fundedConsistency: 25, profitSplitLadder: getProfitSplitLadder() },
    200000: { phase1Target: 8, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 12, minTradingDays: 1, unlimitedPeriod: true, consistency: 30, fundedConsistency: 25, profitSplitLadder: getProfitSplitLadder() },
    300000: { phase1Target: 8, phase2Target: 5, maxDailyLoss: 4, maxTotalLoss: 12, minTradingDays: 1, unlimitedPeriod: true, consistency: 30, fundedConsistency: 25, profitSplitLadder: getProfitSplitLadder() },
  },
};

// ─────────────────────────────────────────────────────────────
// ADD-ONS CONFIGURATION
// ─────────────────────────────────────────────────────────────

export const ADDONS: Record<AddOnType, AddOnConfig> = {
  lifetime90: {
    id: 'lifetime90',
    name: 'Lifetime Reward 90%',
    description: 'Earn 90% profit split forever',
    surcharge: 99.99,
  },
  reward95: {
    id: 'reward95',
    name: 'Reward 95%',
    description: 'Get 95% profit split on payouts',
    surcharge: 149.99,
  },
  doubleLeverage: {
    id: 'doubleLeverage',
    name: 'Double Leverage',
    description: 'Trade with 2:100 leverage instead of 1:100',
    surcharge: 79.99,
  },
  eaSupport: {
    id: 'eaSupport',
    name: 'EA Support',
    description: 'Expert Advisor support for automated trading',
    surcharge: 49.99,
  },
  weekendHolding: {
    id: 'weekendHolding',
    name: 'Weekend Holding',
    description: 'Hold trades over weekends without risk',
    surcharge: 39.99,
  },
  newsTrading: {
    id: 'newsTrading',
    name: 'News Trading',
    description: 'Trade during news events and earnings',
    surcharge: 34.99,
  },
};

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

export function getPrice(challengeType: ChallengeType, accountSize: AccountSize): number {
  const tier = PRICING[challengeType].find((t) => t.size === accountSize);
  return tier?.current || 0;
}

export function getOriginalPrice(challengeType: ChallengeType, accountSize: AccountSize): number {
  const tier = PRICING[challengeType].find((t) => t.size === accountSize);
  return tier?.original || 0;
}

export function getSavingsPercent(challengeType: ChallengeType, accountSize: AccountSize): number {
  const original = getOriginalPrice(challengeType, accountSize);
  if (!original) return 0;
  const current = getPrice(challengeType, accountSize);
  return Math.round(((original - current) / original) * 100);
}

export function getRules(challengeType: ChallengeType, accountSize: AccountSize): ChallengeRules {
  const sizeRules = CHALLENGE_RULES[challengeType][accountSize];
  if (sizeRules) return sizeRules;
  return CHALLENGE_RULES[challengeType].default;
}

export function getAvailableAccountSizes(challengeType: ChallengeType): PricingTier[] {
  return PRICING[challengeType].filter((t) => t.enabled !== false);
}

export function calculateTotal(
  challengePrice: number,
  selectedAddOns: AddOnType[],
  couponDiscount: number = 0
): { subtotal: number; discount: number; total: number } {
  const addOnTotal = selectedAddOns.reduce((sum, id) => sum + (ADDONS[id]?.surcharge || 0), 0);
  const subtotal = challengePrice + addOnTotal;
  const discount = Math.max(0, subtotal * couponDiscount);
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total: Math.max(0, total),
  };
}
