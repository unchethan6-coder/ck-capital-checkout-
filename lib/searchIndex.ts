export type SearchCategory =
  | "pages"
  | "challenges"
  | "rules"
  | "platforms"
  | "faq"
  | "actions";

export interface SearchItem {
  id: string;
  category: SearchCategory;
  title: string;
  description: string;
  keywords: string[];
  href: string;
  external?: boolean;
  badge?: string;
  iconName:
    | "Compass"
    | "Target"
    | "ShieldCheck"
    | "Layers"
    | "Zap"
    | "Gauge"
    | "HelpCircle"
    | "ExternalLink"
    | "DollarSign"
    | "Activity"
    | "TrendingUp"
    | "Users"
    | "Mail"
    | "LogIn"
    | "RefreshCw"
    | "FileText"
    | "BookOpen"
    | "Globe2"
    | "CandlestickChart";
}

export const SEARCH_INDEX: SearchItem[] = [
  // ── Pages & Navigation ───────────────────────────────────────────
  {
    id: "page-trading-objectives",
    category: "pages",
    title: "Trading Objectives",
    description: "Detailed evaluation rules, phase targets, loss limits, and progression matrix.",
    keywords: ["objectives", "rules", "targets", "phases", "drawdown", "parameters", "compare"],
    href: "/trading-objectives",
    iconName: "Target",
    badge: "Rules",
  },
  {
    id: "page-symbols",
    category: "pages",
    title: "Symbol Specifications",
    description: "Live bid/ask prices, spreads, contract sizes and leverage for every tradable instrument.",
    keywords: ["symbols", "instruments", "spreads", "bid", "ask", "contract size", "leverage", "forex", "indices", "commodities", "crypto", "stocks", "pairs"],
    href: "/symbols",
    iconName: "CandlestickChart",
    badge: "Live",
  },
  {
    id: "page-payouts",
    category: "pages",
    title: "Live Rewards & Payouts",
    description: "Verified certificates, reward proofs, global payouts, and analyst achievements.",
    keywords: ["payouts", "rewards", "certificates", "proof", "analysts", "money", "withdraw"],
    href: "/payouts",
    iconName: "DollarSign",
    badge: "Verified",
  },
  {
    id: "page-about-us",
    category: "pages",
    title: "About Us",
    description: "Our mission, founder Daniel Cheung, trader-first philosophy, and culture.",
    keywords: ["about", "company", "founder", "daniel", "cheung", "mission", "values", "story"],
    href: "/about-us",
    iconName: "Compass",
  },
  {
    id: "page-affiliates",
    category: "pages",
    title: "Affiliate Program",
    description: "Earn up to 25% commission on qualified referrals with tiered performance rewards.",
    keywords: ["affiliate", "partner", "commission", "referral", "tiers", "earnings", "calculator"],
    href: "/affiliates",
    iconName: "Users",
    badge: "Up to 25%",
  },
  {
    id: "page-blog",
    category: "pages",
    title: "Blog & Market Insights",
    description: "Educational articles, trading strategies, platform guides, and firm announcements.",
    keywords: ["blog", "news", "articles", "education", "strategies", "guides", "insights"],
    href: "/blog",
    iconName: "BookOpen",
  },
  {
    id: "page-contact",
    category: "pages",
    title: "Contact & Support",
    description: "24/7 customer support, live chat assistance, Discord community, and email help.",
    keywords: ["contact", "support", "help", "email", "ticket", "customer service"],
    href: "/contact",
    iconName: "Mail",
    badge: "24/7",
  },
  {
    id: "page-terms",
    category: "pages",
    title: "Terms & Conditions",
    description: "Official evaluation terms, programme conditions, account rules, and guidelines.",
    keywords: ["terms", "conditions", "legal", "agreement", "rules", "policy"],
    href: "/terms-conditions",
    iconName: "FileText",
  },
  {
    id: "page-risk",
    category: "pages",
    title: "Risk Disclosure",
    description: "Simulated trading disclosure, proprietary trading risk parameters, and notices.",
    keywords: ["risk", "disclosure", "warning", "simulated", "disclaimer"],
    href: "/risk-disclosure",
    iconName: "ShieldCheck",
  },

  // ── Challenge Models & Account Sizes ─────────────────────────────
  {
    id: "challenge-1step",
    category: "challenges",
    title: "1-Step Evaluation",
    description: "Single-phase evaluation with a 10% profit target and unlimited trading days.",
    keywords: ["1 step", "one step", "single phase", "fast", "evaluation", "10%"],
    href: "/#start-challenge?type=one-step",
    iconName: "Zap",
    badge: "10% Target",
  },
  {
    id: "challenge-2step-standard",
    category: "challenges",
    title: "2-Step Standard Challenge",
    description: "Two-stage evaluation with 10% Phase 1 and 5% Phase 2 profit targets.",
    keywords: ["2 step", "two step", "standard", "classic", "10%", "5%", "phases"],
    href: "/#start-challenge?type=standard",
    iconName: "Layers",
    badge: "Popular",
  },
  {
    id: "challenge-instant",
    category: "challenges",
    title: "Instant Funding",
    description: "Direct simulated account access with no evaluation phases required.",
    keywords: ["instant", "direct", "no eval", "immediate", "funding"],
    href: "/#start-challenge?type=instant",
    iconName: "TrendingUp",
    badge: "No Eval",
  },
  {
    id: "size-5k",
    category: "challenges",
    title: "$5,000 Account",
    description: "Accessible starter account size from $9 with full platform capabilities.",
    keywords: ["5k", "$5,000", "5000", "starter", "small account", "size"],
    href: "/#start-challenge?type=standard&size=$5K",
    iconName: "DollarSign",
    badge: "From $9",
  },
  {
    id: "size-10k",
    category: "challenges",
    title: "$10,000 Account",
    description: "Popular evaluation account size with generous drawdown buffers.",
    keywords: ["10k", "$10,000", "10000", "size"],
    href: "/#start-challenge?type=standard&size=$10K",
    iconName: "DollarSign",
  },
  {
    id: "size-25k",
    category: "challenges",
    title: "$25,000 Account",
    description: "Intermediate account size for developing consistent strategy.",
    keywords: ["25k", "$25,000", "25000", "size"],
    href: "/#start-challenge?type=standard&size=$25K",
    iconName: "DollarSign",
  },
  {
    id: "size-50k",
    category: "challenges",
    title: "$50,000 Account",
    description: "Core professional evaluation tier with full profit split potential.",
    keywords: ["50k", "$50,000", "50000", "size"],
    href: "/#start-challenge?type=standard&size=$50K",
    iconName: "DollarSign",
  },
  {
    id: "size-100k",
    category: "challenges",
    title: "$100,000 Account",
    description: "Our most popular institutional-scale evaluation account size.",
    keywords: ["100k", "$100,000", "100000", "most popular", "flagship", "size"],
    href: "/#start-challenge?type=standard&size=$100K",
    iconName: "DollarSign",
    badge: "Most Popular",
  },
  {
    id: "size-200k",
    category: "challenges",
    title: "$200,000 Account",
    description: "High-capital allocation account for verified high-volume analysts.",
    keywords: ["200k", "$200,000", "200000", "large account", "size"],
    href: "/#start-challenge?type=standard&size=$200K",
    iconName: "DollarSign",
  },
  {
    id: "size-300k",
    category: "challenges",
    title: "$300,000 Account",
    description: "Maximum single-account initial simulated capital allocation.",
    keywords: ["300k", "$300,000", "300000", "max allocation", "size"],
    href: "/#start-challenge?type=standard&size=$300K",
    iconName: "DollarSign",
    badge: "Max Size",
  },

  // ── Trading Rules & Objectives ───────────────────────────────────
  {
    id: "rule-max-daily-loss",
    category: "rules",
    title: "Max Daily Loss (4%)",
    description: "Daily drawdown limit calculated from initial balance or daily equity snapshot.",
    keywords: ["drawdown", "daily loss", "max daily", "4%", "risk", "rule", "limit"],
    href: "/trading-objectives#understand-objectives",
    iconName: "ShieldCheck",
    badge: "4% Limit",
  },
  {
    id: "rule-max-loss",
    category: "rules",
    title: "Max Overall Loss (8%)",
    description: "Static maximum loss limit providing a safe and transparent risk buffer.",
    keywords: ["max loss", "total loss", "overall drawdown", "8%", "static buffer"],
    href: "/trading-objectives#understand-objectives",
    iconName: "ShieldCheck",
    badge: "8% Limit",
  },
  {
    id: "rule-profit-targets",
    category: "rules",
    title: "Profit Targets (10% / 5% / 8%)",
    description: "Clear milestone objectives required to pass each evaluation phase.",
    keywords: ["profit target", "milestone", "10%", "5%", "8%", "pass target"],
    href: "/trading-objectives#understand-objectives",
    iconName: "Target",
  },
  {
    id: "rule-unlimited-time",
    category: "rules",
    title: "Unlimited Trading Period",
    description: "Trade patiently at your own pace without arbitrary time deadlines.",
    keywords: ["unlimited", "no time limit", "no expiration", "duration", "timeline"],
    href: "/trading-objectives#unlimited-trading-period",
    iconName: "RefreshCw",
    badge: "No Rush",
  },
  {
    id: "rule-news-trading",
    category: "rules",
    title: "News Trading Allowed",
    description: "Trade major economic releases and market volatility without hidden restrictions.",
    keywords: ["news trading", "cpi", "fomc", "nfp", "volatility", "releases"],
    href: "/#why-choose-us",
    iconName: "Activity",
  },
  {
    id: "rule-ea-algos",
    category: "rules",
    title: "Expert Advisors (EA) & Algos",
    description: "Bring your own algorithmic systems, automated EAs, and trading bots.",
    keywords: ["ea", "expert advisor", "algos", "bots", "python", "automation", "mql5"],
    href: "/#instruments",
    iconName: "CandlestickChart",
  },
  {
    id: "rule-reset-topup",
    category: "rules",
    title: "Reset & Top-Up Discount",
    description: "Breached a rule? Reset your evaluation account at a discounted rate.",
    keywords: ["reset", "topup", "retry", "discount", "breach", "restart"],
    href: "/trading-objectives#reset-topup",
    iconName: "RefreshCw",
  },

  // ── Platforms & Instruments ──────────────────────────────────────
  {
    id: "platform-mt5",
    category: "platforms",
    title: "MetaTrader 5 (MT5)",
    description: "Industry-standard platform with EA automation, depth of market, and 20+ order types.",
    keywords: ["mt5", "metatrader", "metatrader 5", "desktop", "mobile", "terminal"],
    href: "/#platforms",
    iconName: "CandlestickChart",
    badge: "MT5",
  },
  {
    id: "platform-tradelocker",
    category: "platforms",
    title: "TradeLocker",
    description: "Modern TradingView-powered charting with on-chart one-click risk execution.",
    keywords: ["tradelocker", "tradingview", "charts", "modern", "web trading", "mobile"],
    href: "/#platforms",
    iconName: "Activity",
    badge: "TradeLocker",
  },
  {
    id: "instrument-forex",
    category: "platforms",
    title: "Forex CFDs",
    description: "Major, minor, and exotic FX pairs with raw spreads and fast execution.",
    keywords: ["forex", "fx", "eurusd", "gbpusd", "usdjpy", "currencies", "pairs"],
    href: "/#instruments",
    iconName: "Globe2",
  },
  {
    id: "instrument-indices",
    category: "platforms",
    title: "Indices & Futures",
    description: "Nasdaq (NQ), Dow Jones (US30), S&P 500, and DAX with tight spreads.",
    keywords: ["indices", "nasdaq", "nq", "us30", "sp500", "dow", "dax", "futures"],
    href: "/#instruments",
    iconName: "TrendingUp",
  },
  {
    id: "instrument-crypto",
    category: "platforms",
    title: "Crypto CFDs",
    description: "Trade Bitcoin (BTC), Ethereum (ETH), and top altcoins 24/7.",
    keywords: ["crypto", "bitcoin", "btc", "ethereum", "eth", "solana", "altcoins"],
    href: "/#instruments",
    iconName: "Zap",
  },
  {
    id: "instrument-commodities",
    category: "platforms",
    title: "Commodities & Metals",
    description: "Gold (XAU/USD), Silver (XAG/USD), and Crude Oil (WTI).",
    keywords: ["commodities", "gold", "xauusd", "silver", "oil", "wti", "metals"],
    href: "/#instruments",
    iconName: "DollarSign",
  },

  // ── FAQs & Help ──────────────────────────────────────────────────
  {
    id: "faq-payout-speed",
    category: "faq",
    title: "How fast are payouts processed?",
    description: "Industry-leading ~12-hour payout processing for qualified traders via crypto or bank transfer.",
    keywords: ["payout time", "fast withdrawal", "how fast", "processing", "hours"],
    href: "https://intercom.help/ck-capital/",
    external: true,
    iconName: "HelpCircle",
    badge: "~12 Hours",
  },
  {
    id: "faq-profit-split",
    category: "faq",
    title: "What is the profit split?",
    description: "Qualified Analysts keep 80% of applicable simulated profits.",
    keywords: ["profit split", "percentage", "keep", "80%", "share"],
    href: "/#why-choose-us",
    iconName: "HelpCircle",
    badge: "80%",
  },
  {
    id: "faq-trading-rules",
    category: "faq",
    title: "How do evaluation rules work?",
    description: "Learn about drawdown parameters, minimum trading days, and verification stages.",
    keywords: ["rules", "drawdown", "evaluation", "targets", "guidelines", "parameters"],
    href: "/trading-objectives#evaluation-selector",
    iconName: "HelpCircle",
    badge: "Rules",
  },
  {
    id: "faq-help-center",
    category: "faq",
    title: "Intercom Help Center",
    description: "Browse 50+ knowledgebase articles, setup guides, and rule explanations.",
    keywords: ["help", "intercom", "faq", "knowledgebase", "documentation", "support articles"],
    href: "https://intercom.help/ck-capital/",
    external: true,
    iconName: "ExternalLink",
    badge: "Official FAQ",
  },

  // ── Quick Actions ────────────────────────────────────────────────
  {
    id: "action-start-challenge",
    category: "actions",
    title: "Start Challenge / Checkout",
    description: "Configure and launch your CK Capital evaluation account.",
    keywords: ["start challenge", "buy", "checkout", "signup", "register", "join", "get funded"],
    href: "/#start-challenge",
    iconName: "Zap",
    badge: "Action",
  },
  {
    id: "action-signin",
    category: "actions",
    title: "Sign In to Client Portal",
    description: "Access your active trading dashboard, metrics, and reward requests.",
    keywords: ["sign in", "login", "portal", "dashboard", "account", "access"],
    href: "https://app.ckcapital.co.uk/signin",
    external: true,
    iconName: "LogIn",
    badge: "Portal",
  },
  {
    id: "action-discord",
    category: "actions",
    title: "Join Official Discord",
    description: "Connect with 20,000+ traders, live announcements, and community support.",
    keywords: ["discord", "community", "chat", "traders", "group", "social"],
    href: "https://discord.com/invite/hGSVx9CmS2",
    external: true,
    iconName: "Users",
    badge: "20K+ Traders",
  },
  {
    id: "action-email-support",
    category: "actions",
    title: "Email Customer Support",
    description: "Send a direct message to our support team at support@ckcapital.co.uk.",
    keywords: ["email", "support email", "ticket", "contact support", "help desk"],
    href: "mailto:support@ckcapital.co.uk",
    external: true,
    iconName: "Mail",
  },
];
