/** Real 5-star Trustpilot reviews — used as fallback when CMS has no reviews with real author names */

export interface TrustpilotReview {
  name: string;
  location: string;
  text: string;
  rating: number;
  url: string;
}

export const TRUSTPILOT_REVIEWS: TrustpilotReview[] = [
  { rating: 5, text: "Best customer support experience especially on discord. Their plan rules also straightforward as all in their faq website.", name: "Aiman A.", location: "Malaysia", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { rating: 5, text: "CK cap is my new favorite prop firm. The rules are very trader friendly and almost all pairs are available especially indices.", name: "Ghecel V.", location: "Philippines", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { rating: 5, text: "CK PROPFIRM is currently one of my top choices for prop firms — the dashboard is simple, and the support team is quick to respond.", name: "Sandi G.", location: "Indonesia", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { rating: 5, text: "I just love what CK Propfirm has done for me. The customer care is just too proper and I really trust this prop firm to payout on time.", name: "Luyanda", location: "South Africa", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { rating: 5, text: "I've tried a few prop firms before, but CK Propfirm stands out. The platform is clean, and the trading rules actually make sense.", name: "Mmabatho M.", location: "Botswana", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { rating: 5, text: "Customer service is top-notch, the website is good, trading rules aren't bad as well. So I'd rate them with 5 stars.", name: "David A.", location: "Nigeria", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { rating: 5, text: "Had an incredible time with CK Propfirm. Their support team is incredibly great, fast response.", name: "Chudhery M.", location: "Pakistan", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { rating: 5, text: "CK Propfirm has one of the most engaged discord community I've been apart of.", name: "Yazzy", location: "Sweden", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { rating: 5, text: "CK Propfirm offers competitive trading rules and environment, despite being relatively new in the market.", name: "Eric A.", location: "Nigeria", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
  { rating: 5, text: "Best firm, best service, always thinking about traders.", name: "A l", location: "India", url: "https://www.trustpilot.com/review/ckcapital.co.uk" },
];
