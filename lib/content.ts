// All site copy — verbatim from ck-website-2.vercel.app

export const SITE_META = {
  name: "CK Propfirm",
  tagline: "Prop Trading Firm",
  /** The one coupon code. Everything that shows a code reads this. */
  promoCode: "10KFOR18",
  promoDiscount: "75%",
};

export const NAV_LINKS = [
  { label: "Evaluation", href: "/evaluation" },
  { label: "Instant Funding", href: "/instant" },
  { label: "Trading Objectives", href: "/trading-objectives" },
  { label: "Payouts", href: "/payouts" },
  { label: "About Us", href: "/about-us" },
  { label: "Affiliates", href: "/affiliates" },
  { label: "FAQ", href: "https://intercom.help/ck-capital/" },
];

export const PRICING_PLANS = [
  {
    id: "10k",
    label: "LOWEST PRICE",
    accountSize: "$10K",
    type: "2-Step Challenge",
    profitTarget: "$1,000",
    maxDailyLoss: "$400",
    maxLoss: "$800",
    priceUSD: 18.80,
    originalPriceUSD: 75.20,
    discount: "-75%",
    popular: false,
  },
  {
    id: "100k",
    label: "MOST POPULAR",
    accountSize: "$100K",
    type: "2-Step Challenge",
    profitTarget: "$10,000",
    maxDailyLoss: "$4,000",
    maxLoss: "$8,000",
    priceUSD: 178.20,
    originalPriceUSD: 712.80,
    discount: "-75%",
    popular: true,
  },
  {
    id: "300k",
    label: "MAX CAPITAL",
    accountSize: "$300K",
    type: "2-Step Challenge",
    profitTarget: "$30,000",
    maxDailyLoss: "$12,000",
    maxLoss: "$24,000",
    priceUSD: 899.20,
    originalPriceUSD: 3596.80,
    discount: "-75%",
    popular: false,
  },
];

export const TRUST_STATS = [
  { value: "48H",    label: "Guaranteed Payout" },
  { value: "80%",    label: "Profit Split" },
  { value: "$100K",  label: "Max Account Size" },
  { value: "24/7",   label: "Support Available" },
];

export const MARKET_TICKER = [
  { symbol: "S&P 500",  price: "5,428.32",  change: "+0.43%",  up: true },
  { symbol: "NASDAQ",   price: "17,182.40", change: "+0.61%",  up: true },
  { symbol: "DOGE/USD", price: "0.13421",   change: "-1.24%",  up: false },
  { symbol: "GOLD",     price: "2,341.80",  change: "+0.18%",  up: true },
  { symbol: "SILVER",   price: "28.94",     change: "-0.32%",  up: false },
  { symbol: "EUR/USD",  price: "1.0842",    change: "+0.09%",  up: true },
  { symbol: "BTC/USD",  price: "68,210.00", change: "+2.14%",  up: true },
  { symbol: "OIL (WTI)", price: "83.47",   change: "-0.57%",  up: false },
];

/**
 * Rich instrument model for the hero ticker.
 *
 * `icon` is either a path to a downloaded brand SVG (crypto) or a Lucide
 * component name (rendered with a brand tint). `live: true` means the runtime
 * will replace `basePrice` with a real spot price from /api/ticker (CoinGecko).
 * Instruments with `live: false` random-walk around basePrice for animation.
 */
export interface TickerInstrument {
  symbol: string;
  name: string;
  iconSrc?: string;              // path to /public svg (used for brand crypto)
  iconLucide?: string;           // Lucide icon name (fallback for stocks/FX)
  iconColor?: string;            // brand color for Lucide fallback
  basePrice: number;
  decimals: number;
  startChangePct: number;        // opening 24h % move
  live?: boolean;                // if true, price replaced from /api/ticker
}

export const HERO_TICKER: TickerInstrument[] = [
  { symbol: "BTC",    name: "Bitcoin",    iconSrc: "/icons/tickers/bitcoin.svg",  basePrice: 67824.50, decimals: 2, startChangePct: +0.87, live: true },
  { symbol: "ETH",    name: "Ethereum",   iconSrc: "/icons/tickers/ethereum.svg", basePrice: 3512.94,  decimals: 2, startChangePct: +1.24, live: true },
  { symbol: "DOGE",   name: "Dogecoin",   iconSrc: "/icons/tickers/dogecoin.svg", basePrice: 0.07256,  decimals: 5, startChangePct: -1.20, live: true },
  { symbol: "USDT",   name: "Tether",     iconSrc: "/icons/tickers/tether.svg",   basePrice: 1.0002,   decimals: 4, startChangePct: +0.01, live: true },
  { symbol: "SOL",    name: "Solana",     iconSrc: "/icons/tickers/solana.svg",   basePrice: 172.34,   decimals: 2, startChangePct: +2.14, live: true },
  { symbol: "GOLD",   name: "Gold",       iconLucide: "Medal",        iconColor: "#D4AF37", basePrice: 2418.60, decimals: 2, startChangePct: +0.12 },
  { symbol: "SILVER", name: "Silver",     iconLucide: "Circle",       iconColor: "#C0C0C0", basePrice: 30.12,   decimals: 3, startChangePct: +0.79 },
  { symbol: "SPX",    name: "S&P 500",    iconLucide: "TrendingUp",   iconColor: "#DC2626", basePrice: 5488.03, decimals: 2, startChangePct: +0.20 },
  { symbol: "NDX",    name: "Nasdaq 100", iconLucide: "TrendingUp",   iconColor: "#00A0DC", basePrice: 19824.72, decimals: 2, startChangePct: +0.32 },
  { symbol: "EURUSD", name: "EUR/USD",    iconLucide: "Euro",         iconColor: "#3B82F6", basePrice: 1.0842,   decimals: 4, startChangePct: +0.09 },
  { symbol: "GBPUSD", name: "GBP/USD",    iconLucide: "PoundSterling", iconColor: "#8B5CF6", basePrice: 1.2734,  decimals: 4, startChangePct: -0.15 },
  { symbol: "OIL",    name: "Oil (WTI)",  iconLucide: "Droplet",      iconColor: "#A16207", basePrice: 83.47,    decimals: 2, startChangePct: -0.57 },
];

export type ChallengeType = "standard" | "one-step" | "two-step-pro" | "instant";

export const CHALLENGE_TYPES: {
  id: ChallengeType;
  label: string;
  subtitle: string;
}[] = [
  { id: "standard",     label: "2 Step Standard", subtitle: "2-step · 10% / 5%" },
  { id: "one-step",     label: "1 Step Standard", subtitle: "Single 10% target" },
  { id: "two-step-pro", label: "2 Step Pro",      subtitle: "Two phases · no consistency" },
  { id: "instant",      label: "Instant Funding",  subtitle: "Direct funding" },
];

export const ACCOUNT_SIZES = ["$10K", "$25K", "$50K", "$100K", "$200K", "$300K"];

export interface CurrencyOption {
  code: string;
  symbol: string;
  flag: string;
  rate: number;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", symbol: "$", flag: "🇺🇸", rate: 1 },
  { code: "GBP", symbol: "£", flag: "🇬🇧", rate: 0.79 },
  { code: "EUR", symbol: "€", flag: "🇪🇺", rate: 0.92 },
  { code: "CAD", symbol: "C$", flag: "🇨🇦", rate: 1.36 },
  { code: "AUD", symbol: "A$", flag: "🇦🇺", rate: 1.53 },
  { code: "JPY", symbol: "¥", flag: "🇯🇵", rate: 147.5 },
  { code: "CHF", symbol: "CHF", flag: "🇨🇭", rate: 0.88 },
];

export interface PlanDetails {
  orig: string;
  disc: string;
  p1: string;
  p2: string;
  dailyLoss: string;
  maxLoss: string;
  period: string;
  minDays: string;
  split1: string;
  split2: string;
  split3: string;
  consistency: string;
  fundedConsistency: string;
}

export interface FundingChallengeTypeItem {
  id: string;
  name: string;
  desc: string;
}

export const FUNDING_CHALLENGE_TYPES: FundingChallengeTypeItem[] = [
  { id: "standard", name: "2 Step Standard", desc: "Two Phases | 50% Consistency on Payout" },
  { id: "1step", name: "1 Step Standard", desc: "Single Phase | Faster Road to Funding" },
  { id: "pro", name: "2 Step Pro", desc: "Two Phases | No Consistency Score" },
  { id: "instant", name: "Instant Funding", desc: "Skip Evaluation | Direct Simulated Funding" },
];

export const FUNDING_PLAN_RAW_DATA: Record<string, Record<string, PlanDetails | null>> = {
  "10K": {
    standard: { orig: "$75.20", disc: "$18.80", p1: "$1,000.00", p2: "$500.00", dailyLoss: "$400.00", maxLoss: "$800.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "50%" },
    "1step": { orig: "$112.80", disc: "$28.20", p1: "$1,000.00", p2: "$0.00", dailyLoss: "$300.00", maxLoss: "$600.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "30%" },
    pro: { orig: "$150.40", disc: "$37.60", p1: "$1,000.00", p2: "$500.00", dailyLoss: "$400.00", maxLoss: "$800.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "NA" },
    instant: { orig: "$152.80", disc: "$38.20", p1: "$0.00", p2: "$0.00", dailyLoss: "$300.00", maxLoss: "$500.00", period: "Unlimited", minDays: "NA", split1: "Flexible 50%", split2: "-", split3: "-", consistency: "NA", fundedConsistency: "20%" },
  },
  "25K": {
    standard: { orig: "$312.80", disc: "$78.20", p1: "$2,500.00", p2: "$1,250.00", dailyLoss: "$1,000.00", maxLoss: "$2,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "50%" },
    "1step": { orig: "$232.80", disc: "$58.20", p1: "$2,500.00", p2: "$0.00", dailyLoss: "$750.00", maxLoss: "$1,500.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "30%" },
    pro: { orig: "$625.60", disc: "$156.40", p1: "$2,500.00", p2: "$1,250.00", dailyLoss: "$1,000.00", maxLoss: "$2,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "NA" },
    instant: { orig: "$312.80", disc: "$78.20", p1: "$0.00", p2: "$0.00", dailyLoss: "$750.00", maxLoss: "$1,250.00", period: "Unlimited", minDays: "NA", split1: "Flexible 50%", split2: "-", split3: "-", consistency: "NA", fundedConsistency: "20%" },
  },
  "50K": {
    standard: { orig: "$475.20", disc: "$118.80", p1: "$5,000.00", p2: "$2,500.00", dailyLoss: "$2,000.00", maxLoss: "$4,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "50%" },
    "1step": { orig: "$552.80", disc: "$138.20", p1: "$5,000.00", p2: "$0.00", dailyLoss: "$1,500.00", maxLoss: "$3,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "30%" },
    pro: { orig: "$950.40", disc: "$237.60", p1: "$5,000.00", p2: "$2,500.00", dailyLoss: "$2,000.00", maxLoss: "$4,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "NA" },
    instant: { orig: "$792.80", disc: "$198.20", p1: "$0.00", p2: "$0.00", dailyLoss: "$1,500.00", maxLoss: "$2,500.00", period: "Unlimited", minDays: "NA", split1: "Flexible 50%", split2: "-", split3: "-", consistency: "NA", fundedConsistency: "20%" },
  },
  "100K": {
    standard: { orig: "$712.80", disc: "$178.20", p1: "$10,000.00", p2: "$5,000.00", dailyLoss: "$4,000.00", maxLoss: "$8,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "50%" },
    "1step": { orig: "$919.20", disc: "$229.80", p1: "$10,000.00", p2: "$0.00", dailyLoss: "$3,000.00", maxLoss: "$6,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "30%" },
    pro: { orig: "$1,505.60", disc: "$376.40", p1: "$10,000.00", p2: "$5,000.00", dailyLoss: "$4,000.00", maxLoss: "$8,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "NA" },
    instant: { orig: "$1,556.80", disc: "$389.20", p1: "$0.00", p2: "$0.00", dailyLoss: "$3,000.00", maxLoss: "$5,000.00", period: "Unlimited", minDays: "NA", split1: "Flexible 50%", split2: "-", split3: "-", consistency: "NA", fundedConsistency: "20%" },
  },
  "200K": {
    standard: { orig: "$2,796.80", disc: "$699.20", p1: "$20,000.00", p2: "$10,000.00", dailyLoss: "$8,000.00", maxLoss: "$16,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "50%" },
    "1step": { orig: "$2,796.80", disc: "$699.20", p1: "$20,000.00", p2: "$0.00", dailyLoss: "$6,000.00", maxLoss: "$12,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "30%" },
    pro: { orig: "$5,593.60", disc: "$1,398.40", p1: "$20,000.00", p2: "$10,000.00", dailyLoss: "$8,000.00", maxLoss: "$16,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "NA" },
    instant: null,
  },
  "300K": {
    standard: { orig: "$3,596.80", disc: "$899.20", p1: "$30,000.00", p2: "$15,000.00", dailyLoss: "$12,000.00", maxLoss: "$24,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "50%" },
    "1step": { orig: "$3,596.80", disc: "$899.20", p1: "$30,000.00", p2: "$0.00", dailyLoss: "$9,000.00", maxLoss: "$18,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "30%" },
    pro: { orig: "$7,193.60", disc: "$1,798.40", p1: "$30,000.00", p2: "$15,000.00", dailyLoss: "$12,000.00", maxLoss: "$24,000.00", period: "Unlimited", minDays: "NA", split1: "80%", split2: "80%", split3: "80%", consistency: "NA", fundedConsistency: "NA" },
    instant: null,
  },
};

/**
 * Exact challenge data — ported verbatim from ck-website-2.vercel.app
 * (source chunk 0sjzj9maezk44.js). Rules are dollar amounts per account
 * size (not percentages), keyed [phase1, phase2, maxDaily, maxLoss, consistency].
 * Note: the Instant model has NO $300K size, and no evaluation phases.
 */
export interface ChallengeSizeRule {
  phase1: string;      // "$1,000"
  phase2: string;      // "$500" — "$0" means the phase is hidden
  maxDaily: string;    // "$400"
  maxLoss: string;     // "$800"
  consistency: string; // "N/A" | "30%" | "20%"
}

export interface ChallengePrice {
  price: string;    // "$58.00"
  oldPrice: string; // "$193.33"
}

export const CHALLENGE_RULES: Record<ChallengeType, Record<string, ChallengeSizeRule>> = {
  standard: {
    "$10K":   { phase1: "$1,000.00", phase2: "$500.00", maxDaily: "$400.00", maxLoss: "$800.00", consistency: "50%" },
    "$25K":   { phase1: "$2,500.00", phase2: "$1,250.00", maxDaily: "$1,000.00", maxLoss: "$2,000.00", consistency: "50%" },
    "$50K":   { phase1: "$5,000.00", phase2: "$2,500.00", maxDaily: "$2,000.00", maxLoss: "$4,000.00", consistency: "50%" },
    "$100K":  { phase1: "$10,000.00", phase2: "$5,000.00", maxDaily: "$4,000.00", maxLoss: "$8,000.00", consistency: "50%" },
    "$200K":  { phase1: "$20,000.00", phase2: "$10,000.00", maxDaily: "$8,000.00", maxLoss: "$16,000.00", consistency: "50%" },
    "$300K":  { phase1: "$30,000.00", phase2: "$15,000.00", maxDaily: "$12,000.00", maxLoss: "$24,000.00", consistency: "50%" },
  },
  "one-step": {
    "$10K":   { phase1: "$1,000.00", phase2: "$0", maxDaily: "$300.00", maxLoss: "$600.00", consistency: "30%" },
    "$25K":   { phase1: "$2,500.00", phase2: "$0", maxDaily: "$750.00", maxLoss: "$1,500.00", consistency: "30%" },
    "$50K":   { phase1: "$5,000.00", phase2: "$0", maxDaily: "$1,500.00", maxLoss: "$3,000.00", consistency: "30%" },
    "$100K":  { phase1: "$10,000.00", phase2: "$0", maxDaily: "$3,000.00", maxLoss: "$6,000.00", consistency: "30%" },
    "$200K":  { phase1: "$20,000.00", phase2: "$0", maxDaily: "$6,000.00", maxLoss: "$12,000.00", consistency: "30%" },
    "$300K":  { phase1: "$30,000.00", phase2: "$0", maxDaily: "$9,000.00", maxLoss: "$18,000.00", consistency: "30%" },
  },
  "two-step-pro": {
    "$10K":   { phase1: "$1,000.00", phase2: "$500.00", maxDaily: "$400.00", maxLoss: "$800.00", consistency: "N/A" },
    "$25K":   { phase1: "$2,500.00", phase2: "$1,250.00", maxDaily: "$1,000.00", maxLoss: "$2,000.00", consistency: "N/A" },
    "$50K":   { phase1: "$5,000.00", phase2: "$2,500.00", maxDaily: "$2,000.00", maxLoss: "$4,000.00", consistency: "N/A" },
    "$100K":  { phase1: "$10,000.00", phase2: "$5,000.00", maxDaily: "$4,000.00", maxLoss: "$8,000.00", consistency: "N/A" },
    "$200K":  { phase1: "$20,000.00", phase2: "$10,000.00", maxDaily: "$8,000.00", maxLoss: "$16,000.00", consistency: "N/A" },
    "$300K":  { phase1: "$30,000.00", phase2: "$15,000.00", maxDaily: "$12,000.00", maxLoss: "$24,000.00", consistency: "N/A" },
  },
  instant: {
    "$10K":   { phase1: "$0", phase2: "$0", maxDaily: "$300.00", maxLoss: "$500.00", consistency: "20%" },
    "$25K":   { phase1: "$0", phase2: "$0", maxDaily: "$750.00", maxLoss: "$1,250.00", consistency: "20%" },
    "$50K":   { phase1: "$0", phase2: "$0", maxDaily: "$1,500.00", maxLoss: "$2,500.00", consistency: "20%" },
    "$100K":  { phase1: "$0", phase2: "$0", maxDaily: "$3,000.00", maxLoss: "$5,000.00", consistency: "20%" },
  },
};

export const CHALLENGE_PRICES: Record<ChallengeType, Record<string, ChallengePrice>> = {
  standard: {
    "$10K":   { price: "$18.80", oldPrice: "$75.20" },
    "$25K":   { price: "$78.20", oldPrice: "$312.80" },
    "$50K":   { price: "$118.80", oldPrice: "$475.20" },
    "$100K":  { price: "$178.20", oldPrice: "$712.80" },
    "$200K":  { price: "$699.20", oldPrice: "$2,796.80" },
    "$300K":  { price: "$899.20", oldPrice: "$3,596.80" },
  },
  "one-step": {
    "$10K":   { price: "$28.20", oldPrice: "$112.80" },
    "$25K":   { price: "$58.20", oldPrice: "$232.80" },
    "$50K":   { price: "$138.20", oldPrice: "$552.80" },
    "$100K":  { price: "$229.80", oldPrice: "$919.20" },
    "$200K":  { price: "$699.20", oldPrice: "$2,796.80" },
    "$300K":  { price: "$899.20", oldPrice: "$3,596.80" },
  },
  "two-step-pro": {
    "$10K":   { price: "$37.60", oldPrice: "$150.40" },
    "$25K":   { price: "$156.40", oldPrice: "$625.60" },
    "$50K":   { price: "$237.60", oldPrice: "$950.40" },
    "$100K":  { price: "$376.40", oldPrice: "$1,505.60" },
    "$200K":  { price: "$1,398.40", oldPrice: "$5,593.60" },
    "$300K":  { price: "$1,798.40", oldPrice: "$7,193.60" },
  },
  instant: {
    "$10K":   { price: "$38.20", oldPrice: "$152.80" },
    "$25K":   { price: "$78.20", oldPrice: "$312.80" },
    "$50K":   { price: "$198.20", oldPrice: "$792.80" },
    "$100K":  { price: "$389.20", oldPrice: "$1,556.80" },
  },
};

export const CHALLENGE_SPLITS: Record<ChallengeType, string> = {
  standard:     "80%",
  "one-step":   "80%",
  "two-step-pro": "80%",
  instant:      "Flexible 50%",
};

export const CHALLENGE_ACCESS = [
  "Trader Dashboard",
  "MT5 & TradeLocker",
  "Discord Community",
  "24/7 Support",
  "Economic Calendar",
  "Reset & Top-Up Options",
];

export const HOW_IT_WORKS = [
  {
    step: "Step 1",
    phase: "Evaluation Process",
    title: "Prove your skills",
    description:
      "Pass a 1-Step or 2-Step evaluation with clear objectives, no time limits, and news trading allowed.",
  },
  {
    step: "Step 2",
    phase: "CK Account",
    title: "Earn rewards",
    description:
      "Trade a simulated funded account and keep 80% of the simulated profits you generate.",
  },
  {
    step: "Step 3",
    phase: "Get Rewarded",
    title: "Receive regular payouts",
    description:
      "Request simulated profit disbursements on a flexible cycle with fast turnaround via Crypto or Bank Wire.",
  },
];

export const WHY_CHOOSE_US = [
  {
    title: "News Trading Allowed",
    description:
      "Trade around economic events without restrictions. We never penalise you for trading the news.",
    icon: "newspaper",
  },
  {
    title: "Flexible Reward Process",
    description:
      "Request payouts on a flexible cycle. Fast processing directly to your crypto wallet or bank.",
    icon: "clock",
  },
  {
    title: "No Time Limits",
    description:
      "Trade at your own pace. There are no maximum days to complete any challenge phase.",
    icon: "infinity",
  },
  {
    title: "Raw Spreads from 0.0",
    description:
      "Institutional-grade liquidity with ultra-low spreads and fast execution on MT5 & TradeLocker.",
    icon: "activity",
  },
  {
    title: "Zero Hidden Rules",
    description:
      "What you see is what you get. Clear profit targets, straightforward drawdown limits.",
    icon: "eye",
  },
  {
    title: "80% Profit Split",
    description:
      "Keep what you earn. Our profit split starts high and rewards consistent, disciplined traders.",
    icon: "percent",
  },
];

export const TESTIMONIALS = [
  {
    name: "Alex M.",
    location: "United Kingdom",
    avatar: "/avatars/alex.jpg",
    rating: 5,
    text: "Passed my 2-Step challenge in 3 weeks. Received my first payout within 24 hours of requesting it. Outstanding platform.",
  },
  {
    name: "David K.",
    location: "Germany",
    avatar: "/avatars/david.jpg",
    rating: 5,
    text: "News trading allowed? 24/7 support? No time limits? This is the most trader-friendly prop firm I've ever used.",
  },
  {
    name: "Maria G.",
    location: "Spain",
    avatar: "/avatars/maria.jpg",
    rating: 5,
    text: "I tried three other prop firms before CK Propfirm. The difference in execution quality and payout speed is night and day.",
  },
  {
    name: "Thomas B.",
    location: "Germany",
    avatar: "/avatars/thomas.jpg",
    rating: 5,
    text: "The no-time-limit rule completely changed how I trade. No rushing, no revenge trading, just clean setups. Highly recommend.",
  },
];

export const FAQ_ITEMS = [
  {
    q: "What is CK Propfirm?",
    a: "CK Propfirm is a proprietary trading firm that provides qualified traders with funded accounts. We offer a path to becoming a CK Trader through our challenge evaluation process, where you can demonstrate your trading skills and consistency.",
  },
  {
    q: "How do I get started?",
    a: "Choose your preferred challenge type (1-Step, 2-Step, or Instant Funding), select your account size, and complete the evaluation process. Once you pass, you'll be upgraded to a CK Trader account with real trading capital.",
  },
  {
    q: "What platforms do you support?",
    a: "We support both TradeLocker and MT5 platforms. You can choose your preferred platform when setting up your account.",
  },
  {
    q: "What are the profit splits?",
    a: "Once you become a CK Trader, you keep 80% of your profits. There are no commissions or hidden fees - what you earn is yours.",
  },
  {
    q: "How often can I withdraw?",
    a: "Withdrawals are flexible. You can withdraw your profits on your schedule - there are no restrictions on withdrawal frequency.",
  },
  {
    q: "What if I breach the trading rules?",
    a: "If you hit your loss limits during the challenge, you can use our reset or top-up options to get back on track. As a CK Trader, you'll have daily loss limits to manage, but there's no drawdown cap.",
  },
  {
    q: "How long does the evaluation take?",
    a: "The evaluation duration depends on your trading activity and the challenge type you choose. The 1-Step challenge typically moves faster than the 2-Step verification process.",
  },
  {
    q: "Is there customer support?",
    a: "Yes! We offer 24/7 support Mon-Fri. Our team is available via email and our Discord community to answer questions and assist you.",
  },
];

export const PAYMENT_METHODS = [
  "Visa", "Mastercard", "PayPal", "Stripe",
  "Apple Pay", "Google Pay", "USDT", "Bitcoin",
  "Skrill", "Neteller", "Bank Transfer",
];

export const INSTRUMENTS = [
  {
    symbol: "EUR/USD",
    type: "Forex",
    longPL: "+$1,240",
    shortPL: "-$320",
    spread: "0.1 pips",
  },
  {
    symbol: "GOLD",
    type: "Commodity",
    longPL: "+$3,780",
    shortPL: "+$890",
    spread: "0.3 pips",
  },
  {
    symbol: "US30",
    type: "Index",
    longPL: "+$2,150",
    shortPL: "-$540",
    spread: "0.4 pips",
  },
  {
    symbol: "BTC/USD",
    type: "Crypto",
    longPL: "+$8,420",
    shortPL: "+$1,100",
    spread: "5 pips",
  },
];

export const COMMUNITY_CARDS = [
  {
    title: "Join the conversation",
    description: "Connect with 65,000+ traders in our Discord community. Share ideas, strategies, and celebrate payouts.",
    cta: "Join Discord",
    href: "https://discord.com/invite/hGSVx9CmS2",
    external: true,
    icon: "message-circle",
    gradient: "from-[#5865F2]/20 to-transparent",
  },
  {
    title: "Track every metric",
    description: "Your personalised dashboard shows live stats, challenge progress, payout history, and performance milestones.",
    cta: "View Dashboard",
    href: "https://app.ckcapital.co.uk/signin",
    external: true,
    icon: "bar-chart-2",
    gradient: "from-[#d4af37]/20 to-transparent",
  },
  {
    title: "Help when you need it",
    description: "24/7 live support from real traders. Average response time under 2 minutes — day or night.",
    cta: "Get Support",
    href: "/contact",
    external: false,
    icon: "life-buoy",
    gradient: "from-[#14b8a6]/20 to-transparent",
  },
];
