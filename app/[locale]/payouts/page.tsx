import { RewardsPageClient } from "@/components/sections/RewardsPageClient";
import { getFirmReviews, getPayouts, getRewardsSummary, getVideoReviews } from "@/lib/cms";
import type { CmsFirmReview } from "@/lib/cms";

export const revalidate = 300;

const TRUSTPILOT_REVIEWS = [
  { name: "Aiman A.", location: "Malaysia", text: "Best customer support experience especially on discord. Their plan rules also straightforward as all in their faq website.", rating: 5 },
  { name: "Ghecel V.", location: "Philippines", text: "CK cap is my new favorite prop firm. The rules are very trader friendly and almost all pairs are available especially indices.", rating: 5 },
  { name: "Sandi G.", location: "Indonesia", text: "CK PROPFIRM is currently one of my top choices for prop firms — the dashboard is simple, and the support team is quick to respond.", rating: 5 },
  { name: "Luyanda", location: "South Africa", text: "I just love what CK Propfirm has done for me. The customer care is just too proper and I really trust this prop firm to payout on time.", rating: 5 },
  { name: "Mmabatho M.", location: "Botswana", text: "I've tried a few prop firms before, but CK Propfirm stands out. The platform is clean, and the trading rules actually make sense.", rating: 5 },
  { name: "David A.", location: "Nigeria", text: "Customer service is top-notch, the website is good, trading rules aren't bad as well. So I'd rate them with 5 stars.", rating: 5 },
  { name: "Chudhery M.", location: "Pakistan", text: "Had an incredible time with CK Propfirm. Their support team is incredibly great, fast response.", rating: 5 },
  { name: "Yazzy", location: "Sweden", text: "CK Propfirm has one of the most engaged discord community I've been apart of.", rating: 5 },
  { name: "Eric A.", location: "Nigeria", text: "CK Propfirm offers competitive trading rules and environment, despite being relatively new in the market.", rating: 5 },
  { name: "A l", location: "India", text: "Best firm, best service, always thinking about traders.", rating: 5 },
];

export default async function PayoutsPage() {
  const [payouts, videos, cmsReviews, summary] = await Promise.all([
    getPayouts(),
    getVideoReviews(),
    getFirmReviews(),
    getRewardsSummary(),
  ]);

  // Use CMS reviews with real author names, or fall back to Trustpilot reviews
  const realCmsReviews = cmsReviews.filter(
    (r) => r.authorName && r.authorName.trim().length > 0 && !/^verified trader$/i.test(r.authorName.trim())
  );
  const reviews: CmsFirmReview[] = realCmsReviews.length > 0
    ? realCmsReviews
    : TRUSTPILOT_REVIEWS.map((r, i) => ({
        id: i,
        summary: r.text,
        rating: r.rating,
        body: [],
        publishedAt: new Date().toISOString(),
        authorName: r.name,
        countryName: r.location,
        countryCode: null,
        source: "Trustpilot",
        verified: undefined,
      }));

  return <RewardsPageClient payouts={payouts} videos={videos} reviews={reviews} summary={summary} />;
}
