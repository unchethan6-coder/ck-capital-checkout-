import type { ChallengeConfig } from "@/lib/cms";

export interface VipFaq {
  question: string;
  answer: string;
}

/**
 * Hardcoded VIP offer content. This page deliberately does not read or write
 * the shared Strapi campaign, pricing, banner, or FAQ records.
 */

export const VIP_CODE = "NEW90";
export const VIP_DISCOUNT_LABEL = "90%";
export const VIP_CHECKOUT_URL = "https://my.ckpropfirm.com/challenges/new";

export const VIP_SALE_BAR = {
  headline: "LIMITED TIME SALE:",
  copy: "90% OFF ALL EVALUATIONS!",
  codeLabel: "USE CODE:",
  code: VIP_CODE,
  cta: "CLAIM 90% OFF",
  href: "#start-challenge",
};

export const VIP_HERO = {
  badge: "CK CAPITAL PROP FIRM",
  headlineLine1: "Transforming Traders",
  headlineLine2: "into Winners globally.",
  subcopy:
    "Prove your skills in a simulated environment on MT5 & TradeLocker. No time limits, news trading allowed, transparent rules, and no hidden fees.",
  startChallenge: "Start Challenge",
  comparePlans: "Compare Plans",
  imageSrc: "/images/vip/raccoon-90-off.webp",
  imageAlt: "CK Capital raccoon in electric armour holding a glowing 90% OFF sign",
  imageWidth: 1125,
  imageHeight: 1125,
  pills: [
    { key: "profit", value: "80%", label: "Profit Split" },
    { key: "allocation", value: "Scale to $750K", label: "Simulated Allocation" },
    { key: "payout", value: "Flexible", label: "Payouts" },
  ],
};

export const VIP_STATS = [
  { art: "/images/stats/traders.png", value: "20,000+", label: "Active Traders" },
  { art: "/images/stats/worldwide.png", value: "Worldwide", label: "Global Reach" },
  { art: "/images/stats/payouts.png", value: "$750K+", label: "Payouts Total" },
  { art: "/images/stats/secure.png", value: "100%", label: "Secure & Transparent" },
  { art: "/images/stats/support.png", value: "24/7", label: "Trader Support" },
];

export const VIP_VIDEOS = [
  {
    id: "bZq8jtD9acY",
    title: "I DROPPED OUT OF COLLEGE FOR TRADING",
    thumbnail: "/images/testimonials/hqdefault-88f16d731b.jpg",
    reward: "$38,200",
    desc: "He Quit College to Trade… Here's What Happened • Sander Blaas",
  },
  {
    id: "8NQAWtlh_ws",
    title: "BEST PROP? I TRUST CK CAPITAL",
    thumbnail: "/images/testimonials/hqdefault-308afdd2f9.jpg",
    reward: "$84,120",
    desc: "CK Capital 1 Year Review • Dan Cheung",
  },
  {
    id: "5RjtGHPcuMM",
    title: "MY PERCEPTION ABOUT TRADING WAS WRONG...",
    thumbnail: "/images/testimonials/hqdefault-9c0405cb37.jpg",
    reward: "$15,995",
    desc: "From Failing Challenges to a $65K Payout • Pedro Perez",
  },
  {
    id: "LNXpq8_PwxU",
    title: "THIS IS HOW ALGO TRADING CHANGED IT ALL",
    thumbnail: "/images/testimonials/hqdefault-ae10a042fa.jpg",
    reward: "$22,400",
    desc: "The Reality Of Trading 10 Minutes a Week • Paul Schulz",
  },
];

export const VIP_PROOF = {
  startingAt: "Starting at $18",
  readyRewardDesc:
    "Open your CK Capital dashboard, click request, then complete the required details.",
  totalDisplay: "$1,200,000",
  summary: {
    totalRewards: 1200000,
    analystsRewarded: 20000,
    countries: 120,
    maxRewardPercent: 100,
    asOf: null,
  },
};

export const VIP_CHALLENGE_CONFIG: ChallengeConfig = {
  "rules": {
    "instant": {
      "$10K": {
        "phase1": "$0",
        "phase2": "$0",
        "maxLoss": "$500.00",
        "maxDaily": "$300.00",
        "consistency": "20%"
      },
      "$25K": {
        "phase1": "$0",
        "phase2": "$0",
        "maxLoss": "$1,250.00",
        "maxDaily": "$750.00",
        "consistency": "20%"
      },
      "$50K": {
        "phase1": "$0",
        "phase2": "$0",
        "maxLoss": "$2,500.00",
        "maxDaily": "$1,500.00",
        "consistency": "20%"
      },
      "$100K": {
        "phase1": "$0",
        "phase2": "$0",
        "maxLoss": "$5,000.00",
        "maxDaily": "$3,000.00",
        "consistency": "20%"
      }
    },
    "one-step": {
      "$10K": {
        "phase1": "$1,000.00",
        "phase2": "$0",
        "maxLoss": "$600.00",
        "maxDaily": "$300.00",
        "consistency": "30%"
      },
      "$25K": {
        "phase1": "$2,500.00",
        "phase2": "$0",
        "maxLoss": "$1,500.00",
        "maxDaily": "$750.00",
        "consistency": "30%"
      },
      "$50K": {
        "phase1": "$5,000.00",
        "phase2": "$0",
        "maxLoss": "$3,000.00",
        "maxDaily": "$1,500.00",
        "consistency": "30%"
      },
      "$100K": {
        "phase1": "$10,000.00",
        "phase2": "$0",
        "maxLoss": "$6,000.00",
        "maxDaily": "$3,000.00",
        "consistency": "30%"
      },
      "$200K": {
        "phase1": "$20,000.00",
        "phase2": "$0",
        "maxLoss": "$12,000.00",
        "maxDaily": "$6,000.00",
        "consistency": "30%"
      },
      "$300K": {
        "phase1": "$30,000.00",
        "phase2": "$0",
        "maxLoss": "$18,000.00",
        "maxDaily": "$9,000.00",
        "consistency": "30%"
      }
    },
    "standard": {
      "$10K": {
        "phase1": "$1,000.00",
        "phase2": "$500.00",
        "maxLoss": "$800.00",
        "maxDaily": "$400.00",
        "consistency": "50%"
      },
      "$25K": {
        "phase1": "$2,500.00",
        "phase2": "$1,250.00",
        "maxLoss": "$2,000.00",
        "maxDaily": "$1,000.00",
        "consistency": "50%"
      },
      "$50K": {
        "phase1": "$5,000.00",
        "phase2": "$2,500.00",
        "maxLoss": "$4,000.00",
        "maxDaily": "$2,000.00",
        "consistency": "50%"
      },
      "$100K": {
        "phase1": "$10,000.00",
        "phase2": "$5,000.00",
        "maxLoss": "$8,000.00",
        "maxDaily": "$4,000.00",
        "consistency": "50%"
      },
      "$200K": {
        "phase1": "$20,000.00",
        "phase2": "$10,000.00",
        "maxLoss": "$16,000.00",
        "maxDaily": "$8,000.00",
        "consistency": "50%"
      },
      "$300K": {
        "phase1": "$30,000.00",
        "phase2": "$15,000.00",
        "maxLoss": "$24,000.00",
        "maxDaily": "$12,000.00",
        "consistency": "50%"
      }
    },
    "two-step-pro": {
      "$10K": {
        "phase1": "$1,000.00",
        "phase2": "$500.00",
        "maxLoss": "$800.00",
        "maxDaily": "$400.00",
        "consistency": "N/A"
      },
      "$25K": {
        "phase1": "$2,500.00",
        "phase2": "$1,250.00",
        "maxLoss": "$2,000.00",
        "maxDaily": "$1,000.00",
        "consistency": "N/A"
      },
      "$50K": {
        "phase1": "$5,000.00",
        "phase2": "$2,500.00",
        "maxLoss": "$4,000.00",
        "maxDaily": "$2,000.00",
        "consistency": "N/A"
      },
      "$100K": {
        "phase1": "$10,000.00",
        "phase2": "$5,000.00",
        "maxLoss": "$8,000.00",
        "maxDaily": "$4,000.00",
        "consistency": "N/A"
      },
      "$200K": {
        "phase1": "$20,000.00",
        "phase2": "$10,000.00",
        "maxLoss": "$16,000.00",
        "maxDaily": "$8,000.00",
        "consistency": "N/A"
      },
      "$300K": {
        "phase1": "$30,000.00",
        "phase2": "$15,000.00",
        "maxLoss": "$24,000.00",
        "maxDaily": "$12,000.00",
        "consistency": "N/A"
      }
    }
  },
  "sizes": [
    "$10K",
    "$25K",
    "$50K",
    "$100K",
    "$200K",
    "$300K"
  ],
  "access": [
    "Trader Dashboard",
    "MT5 & TradeLocker",
    "Discord Community",
    "24/7 Support",
    "Economic Calendar",
    "Reset & Top-Up Options"
  ],
  "prices": {
    "standard": {
      "$10K": {
        "price": "$7.52",
        "oldPrice": "$75.20"
      },
      "$25K": {
        "price": "$31.28",
        "oldPrice": "$312.80"
      },
      "$50K": {
        "price": "$47.52",
        "oldPrice": "$475.20"
      },
      "$100K": {
        "price": "$71.28",
        "oldPrice": "$712.80"
      },
      "$200K": {
        "price": "$279.68",
        "oldPrice": "$2,796.80"
      },
      "$300K": {
        "price": "$359.68",
        "oldPrice": "$3,596.80"
      }
    },
    "one-step": {
      "$10K": {
        "price": "$11.28",
        "oldPrice": "$112.80"
      },
      "$25K": {
        "price": "$23.28",
        "oldPrice": "$232.80"
      },
      "$50K": {
        "price": "$55.28",
        "oldPrice": "$552.80"
      },
      "$100K": {
        "price": "$91.92",
        "oldPrice": "$919.20"
      },
      "$200K": {
        "price": "$279.68",
        "oldPrice": "$2,796.80"
      },
      "$300K": {
        "price": "$359.68",
        "oldPrice": "$3,596.80"
      }
    },
    "two-step-pro": {
      "$10K": {
        "price": "$15.04",
        "oldPrice": "$150.40"
      },
      "$25K": {
        "price": "$62.56",
        "oldPrice": "$625.60"
      },
      "$50K": {
        "price": "$95.04",
        "oldPrice": "$950.40"
      },
      "$100K": {
        "price": "$150.56",
        "oldPrice": "$1,505.60"
      },
      "$200K": {
        "price": "$559.36",
        "oldPrice": "$5,593.60"
      },
      "$300K": {
        "price": "$719.36",
        "oldPrice": "$7,193.60"
      }
    },
    "instant": {
      "$10K": {
        "price": "$15.28",
        "oldPrice": "$152.80"
      },
      "$25K": {
        "price": "$31.28",
        "oldPrice": "$312.80"
      },
      "$50K": {
        "price": "$79.28",
        "oldPrice": "$792.80"
      },
      "$100K": {
        "price": "$155.68",
        "oldPrice": "$1,556.80"
      }
    }
  },
  "splits": {
    "instant": "80%",
    "one-step": "80%",
    "standard": "80%",
    "two-step-pro": "80%"
  },
  "currencies": [
    {
      "code": "USD",
      "flag": "🇺🇸",
      "rate": 1,
      "symbol": "$"
    },
    {
      "code": "GBP",
      "flag": "🇬🇧",
      "rate": 0.79,
      "symbol": "£"
    },
    {
      "code": "EUR",
      "flag": "🇪🇺",
      "rate": 0.92,
      "symbol": "€"
    },
    {
      "code": "CAD",
      "flag": "🇨🇦",
      "rate": 1.36,
      "symbol": "C$"
    },
    {
      "code": "AUD",
      "flag": "🇦🇺",
      "rate": 1.53,
      "symbol": "A$"
    },
    {
      "code": "JPY",
      "flag": "🇯🇵",
      "rate": 147.5,
      "symbol": "¥"
    },
    {
      "code": "CHF",
      "flag": "🇨🇭",
      "rate": 0.88,
      "symbol": "CHF"
    }
  ],
  "fundingPlans": {
    "10K": {
      "standard": {
        "orig": "$75.20",
        "disc": "$7.52",
        "p1": "$1,000.00",
        "p2": "$500.00",
        "dailyLoss": "$400.00",
        "maxLoss": "$800.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "50%"
      },
      "1step": {
        "orig": "$112.80",
        "disc": "$11.28",
        "p1": "$1,000.00",
        "p2": "$0.00",
        "dailyLoss": "$300.00",
        "maxLoss": "$600.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "30%"
      },
      "pro": {
        "orig": "$150.40",
        "disc": "$15.04",
        "p1": "$1,000.00",
        "p2": "$500.00",
        "dailyLoss": "$400.00",
        "maxLoss": "$800.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "NA"
      },
      "instant": {
        "orig": "$152.80",
        "disc": "$15.28",
        "p1": "$0.00",
        "p2": "$0.00",
        "dailyLoss": "$300.00",
        "maxLoss": "$500.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "Flexible 50%",
        "split2": "-",
        "split3": "-",
        "consistency": "NA",
        "fundedConsistency": "20%"
      }
    },
    "25K": {
      "standard": {
        "orig": "$312.80",
        "disc": "$31.28",
        "p1": "$2,500.00",
        "p2": "$1,250.00",
        "dailyLoss": "$1,000.00",
        "maxLoss": "$2,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "50%"
      },
      "1step": {
        "orig": "$232.80",
        "disc": "$23.28",
        "p1": "$2,500.00",
        "p2": "$0.00",
        "dailyLoss": "$750.00",
        "maxLoss": "$1,500.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "30%"
      },
      "pro": {
        "orig": "$625.60",
        "disc": "$62.56",
        "p1": "$2,500.00",
        "p2": "$1,250.00",
        "dailyLoss": "$1,000.00",
        "maxLoss": "$2,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "NA"
      },
      "instant": {
        "orig": "$312.80",
        "disc": "$31.28",
        "p1": "$0.00",
        "p2": "$0.00",
        "dailyLoss": "$750.00",
        "maxLoss": "$1,250.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "Flexible 50%",
        "split2": "-",
        "split3": "-",
        "consistency": "NA",
        "fundedConsistency": "20%"
      }
    },
    "50K": {
      "standard": {
        "orig": "$475.20",
        "disc": "$47.52",
        "p1": "$5,000.00",
        "p2": "$2,500.00",
        "dailyLoss": "$2,000.00",
        "maxLoss": "$4,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "50%"
      },
      "1step": {
        "orig": "$552.80",
        "disc": "$55.28",
        "p1": "$5,000.00",
        "p2": "$0.00",
        "dailyLoss": "$1,500.00",
        "maxLoss": "$3,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "30%"
      },
      "pro": {
        "orig": "$950.40",
        "disc": "$95.04",
        "p1": "$5,000.00",
        "p2": "$2,500.00",
        "dailyLoss": "$2,000.00",
        "maxLoss": "$4,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "NA"
      },
      "instant": {
        "orig": "$792.80",
        "disc": "$79.28",
        "p1": "$0.00",
        "p2": "$0.00",
        "dailyLoss": "$1,500.00",
        "maxLoss": "$2,500.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "Flexible 50%",
        "split2": "-",
        "split3": "-",
        "consistency": "NA",
        "fundedConsistency": "20%"
      }
    },
    "100K": {
      "standard": {
        "orig": "$712.80",
        "disc": "$71.28",
        "p1": "$10,000.00",
        "p2": "$5,000.00",
        "dailyLoss": "$4,000.00",
        "maxLoss": "$8,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "50%"
      },
      "1step": {
        "orig": "$919.20",
        "disc": "$91.92",
        "p1": "$10,000.00",
        "p2": "$0.00",
        "dailyLoss": "$3,000.00",
        "maxLoss": "$6,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "30%"
      },
      "pro": {
        "orig": "$1,505.60",
        "disc": "$150.56",
        "p1": "$10,000.00",
        "p2": "$5,000.00",
        "dailyLoss": "$4,000.00",
        "maxLoss": "$8,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "NA"
      },
      "instant": {
        "orig": "$1,556.80",
        "disc": "$155.68",
        "p1": "$0.00",
        "p2": "$0.00",
        "dailyLoss": "$3,000.00",
        "maxLoss": "$5,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "Flexible 50%",
        "split2": "-",
        "split3": "-",
        "consistency": "NA",
        "fundedConsistency": "20%"
      }
    },
    "200K": {
      "standard": {
        "orig": "$2,796.80",
        "disc": "$279.68",
        "p1": "$20,000.00",
        "p2": "$10,000.00",
        "dailyLoss": "$8,000.00",
        "maxLoss": "$16,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "50%"
      },
      "1step": {
        "orig": "$2,796.80",
        "disc": "$279.68",
        "p1": "$20,000.00",
        "p2": "$0.00",
        "dailyLoss": "$6,000.00",
        "maxLoss": "$12,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "30%"
      },
      "pro": {
        "orig": "$5,593.60",
        "disc": "$559.36",
        "p1": "$20,000.00",
        "p2": "$10,000.00",
        "dailyLoss": "$8,000.00",
        "maxLoss": "$16,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "NA"
      },
      "instant": null
    },
    "300K": {
      "standard": {
        "orig": "$3,596.80",
        "disc": "$359.68",
        "p1": "$30,000.00",
        "p2": "$15,000.00",
        "dailyLoss": "$12,000.00",
        "maxLoss": "$24,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "50%"
      },
      "1step": {
        "orig": "$3,596.80",
        "disc": "$359.68",
        "p1": "$30,000.00",
        "p2": "$0.00",
        "dailyLoss": "$9,000.00",
        "maxLoss": "$18,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "30%"
      },
      "pro": {
        "orig": "$7,193.60",
        "disc": "$719.36",
        "p1": "$30,000.00",
        "p2": "$15,000.00",
        "dailyLoss": "$12,000.00",
        "maxLoss": "$24,000.00",
        "period": "Unlimited",
        "minDays": "NA",
        "split1": "80%",
        "split2": "80%",
        "split3": "80%",
        "consistency": "NA",
        "fundedConsistency": "NA"
      },
      "instant": null
    }
  }
}

export const VIP_FAQS: VipFaq[] = [
  {
    question: 'How fast are payouts processed?',
    answer:
      'Every approved payout is guaranteed within 48 hours. Add the 24 Hour Payout option to your account and that guarantee shortens to 24 hours. Funds leave your trading balance within minutes of approval and reach your payment method by crypto or bank transfer.',
  },
  {
    question: 'Are there any time limits on challenges?',
    answer:
      'No! CK Propfirm has zero time limits on challenge evaluations. Trade at your own pace without pressure to hit arbitrary deadlines.',
  },
  {
    question: 'What platforms do you support?',
    answer:
      'CK Propfirm supports both MetaTrader 5 (MT5) and TradeLocker with advanced charting, real-time market data, and fast execution.',
  },
  {
    question: 'What profit splits do you offer?',
    answer:
      'CK Propfirm offers an 80% profit split for verified traders on funded accounts. You keep 80% of your trading profits.',
  },
  {
    question: 'What are the drawdown rules?',
    answer:
      'Our risk parameters are transparent: 4% maximum daily drawdown and 8% maximum overall drawdown based on starting balance.',
  },
  {
    question: 'Can I trade news and hold over weekends?',
    answer:
      'News trading is allowed on every programme that carries a consistency score — 1 Step Standard, 2 Step Standard and Instant Funding. It is not permitted on 2 Step Pro, which has no consistency requirement. Positions may be held overnight and over the weekend on all programmes.',
  },
  {
    question: 'What is the consistency rule?',
    answer:
      'We promote sustainable risk management and consistent trading habits across all challenge phases.',
  },
  {
    question: 'Do you accept crypto payments and payouts?',
    answer:
      'Yes, we support major cryptocurrencies and bank transfers for both evaluation purchases and reward distributions.',
  },
  {
    question: 'Is the challenge fee refundable?',
    answer:
      'Yes, challenge fees are refunded with your first eligible reward payout upon qualifying as a CK Trader.',
  },
  {
    question: 'Are Expert Advisors (EAs) and bots allowed?',
    answer:
      'Yes, algorithmic trading, EAs, and indicators are welcome as long as they follow standard risk guidelines.',
  },
]
