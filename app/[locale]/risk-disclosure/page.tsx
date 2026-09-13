import { getTranslations } from "next-intl/server";
import { TriangleAlert } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Risk Disclosure & Trading Warnings",
  description:
    "Important risk disclosure for trading. Understand the risks and market volatility considerations before participating in CK Capital evaluation programs.",
  path: "/risk-disclosure",
});

function RiskSection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-[#E5E7EB] pt-8">
      <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-[#0A0A0C] md:text-2xl">
        <span className="text-[#A98BFF]">{num}.</span> {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-[#4B5563]">
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="ml-5 list-disc space-y-2 text-[#4B5563]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function RiskDisclosurePage() {
  const t = await getTranslations("legal");

  return (
    <div className="min-h-screen bg-background" data-od-id="risk-page">

      {/* ─────────────── Hero ─────────────── */}
      <section className="relative isolate -mt-[72px] md:-mt-[76px] overflow-hidden border-b border-gray-200 bg-white pt-28 md:pt-36 pb-14 md:pb-20 text-[#0A0A0C]" data-od-id="risk-hero">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-full opacity-70 fx-hero-glow-1" />
          <div className="absolute top-[15%] -left-[10%] w-[60%] h-[70%] rounded-full opacity-60 fx-hero-glow-2" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A98BFF]">
              {t("badgeLegal")}
              <span className="text-violet-400">·</span>
              {t("riskBadge")}
            </span>
            <h1
              className="mt-5 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-[#0A0A0C] md:text-5xl"
              data-od-id="risk-hero-title"
            >
              {t("riskTitle")}
            </h1>
          </div>
        </Container>
      </section>

      {/* ─────────────── Document ─────────────── */}
      <section className="bg-white py-12 md:py-20 text-[#111827]" data-od-id="risk-document">
        <Container className="max-w-4xl">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm text-[15px] leading-relaxed text-[#4B5563]">
            {/* Warning callout */}
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
              <TriangleAlert size={20} className="mt-0.5 shrink-0 text-red-600" />
              <p className="font-bold text-red-900 leading-relaxed">
                WARNING: Trading financial instruments involves substantial financial
                risk. You could lose more than your initial investment. Prop trading with
                leverage is extremely risky and not suitable for all investors.
              </p>
            </div>

            <RiskSection num="1" title="Leverage Risk">
              <p>
                Our funded trading accounts offer significant leverage (typically 1:100 or
                higher). While leverage can amplify profits, it equally amplifies losses:
              </p>
              <List
                items={[
                  'A 1% market move can result in a 100% loss of your capital',
                  'Your entire account can be wiped out in seconds',
                  'Liquidation of positions happens automatically when drawdown limits are hit',
                ]}
              />
            </RiskSection>

            <RiskSection num="2" title="Market Volatility Risk">
              <p>Financial markets are inherently unpredictable:</p>
              <List
                items={[
                  'Forex pairs can move 1000+ pips in a single session',
                  'Cryptocurrencies can swing 20-30% in minutes',
                  'Black Swan events can cause massive gap moves',
                  'Central bank announcements create extreme volatility',
                ]}
              />
            </RiskSection>

            <RiskSection num="3" title="News Trading Risk">
              <p>News trading carries exceptional risks:</p>
              <List
                items={[
                  'Economic releases can cause thousand-pip moves instantly',
                  'Gaps often exceed stop-loss levels, creating slippage',
                  'Liquidity dries up during major news events',
                  'Your orders may execute at drastically different prices',
                ]}
              />
            </RiskSection>

            <RiskSection num="4" title="Slippage & Execution Risk">
              <p>During volatile market conditions:</p>
              <List
                items={[
                  'Stops may execute far away from intended levels',
                  'Entry/exit prices may differ significantly from quotations',
                  'Market orders may not fill for several seconds during gaps',
                  'Connection issues could prevent closing losing positions',
                ]}
              />
            </RiskSection>

            <RiskSection num="5" title="Liquidity Risk">
              <p>Some trading instruments have lower liquidity:</p>
              <List
                items={[
                  'Exotic currency pairs may have wide spreads',
                  'Altcoins can experience flash crashes',
                  'Commodities have limited trading hours',
                  'Your position size may exceed available liquidity',
                ]}
              />
            </RiskSection>

            <RiskSection num="6" title="Technical Risk">
              <p>Platform and infrastructure failures can occur:</p>
              <List
                items={[
                  'Server outages preventing position management',
                  'Internet connection loss during critical moments',
                  'Delayed data feeds affecting trading decisions',
                  'System errors causing unexpected fills or rejections',
                ]}
              />
            </RiskSection>

            <RiskSection num="7" title="Counterparty Risk">
              <p>Your funds depend on third parties:</p>
              <List
                items={[
                  'Liquidity providers could default',
                  'Banks holding funds could fail',
                  'Trading platforms could experience insolvency',
                  'Regulatory changes could freeze your account',
                ]}
              />
            </RiskSection>

            <RiskSection num="8" title="Regulatory & Legal Risk">
              <p>Prop trading operates in a complex regulatory environment:</p>
              <List
                items={[
                  'Regulatory changes could affect account terms',
                  'Your account could be restricted or closed',
                  'Tax obligations apply in your jurisdiction',
                  'Regulatory authorities may investigate accounts',
                ]}
              />
            </RiskSection>

            <RiskSection num="9" title="Psychological Risk">
              <p>Trading psychology is often underestimated:</p>
              <List
                items={[
                  'Fear and greed lead to poor decision-making',
                  'Revenge trading after losses wipes accounts',
                  'Overconfidence after wins increases risk exposure',
                  'Fatigue impairs judgment during extended trading',
                ]}
              />
            </RiskSection>

            <RiskSection num="10" title="Past Performance ≠ Future Results">
              <p>
                <strong className="font-semibold text-foreground/80">IMPORTANT:</strong>{' '}
                Previous trading success, wins by other traders, or historical data does
                NOT guarantee future profits. Market conditions change constantly, and
                strategies that worked may fail.
              </p>
            </RiskSection>

            <RiskSection num="11" title="You Could Lose 100% of Your Capital">
              <p>
                This is not an exaggeration. Your entire challenge fee or deposited
                capital can be completely wiped out through:
              </p>
              <List
                items={[
                  'A single large losing trade',
                  'Multiple consecutive losses',
                  'One major news event',
                  'A platform outage during crucial moments',
                ]}
              />
            </RiskSection>

            <RiskSection num="12" title="Only Risk What You Can Afford to Lose">
              <p>
                Do not use borrowed money, savings, or funds needed for living expenses.
                Challenge fees and trading capital should be completely disposable income
                you can afford to lose entirely without affecting your financial wellbeing.
              </p>
            </RiskSection>

            <RiskSection num="13" title="Seek Professional Advice">
              <p>
                If you are uncertain about trading risks, financial decisions, or market
                conditions, consult with a qualified financial advisor before
                participating in prop trading.
              </p>
            </RiskSection>

            <RiskSection num="14" title="Trading Rules Must Be Followed">
              <p>
                Our trading rules exist to protect you. Violating daily loss limits, max
                drawdown, or consistency rules can result in:
              </p>
              <List
                items={[
                  'Account termination',
                  'Loss of remaining capital',
                  'Ineligibility for future challenges',
                ]}
              />
            </RiskSection>

            <RiskSection num="15" title="Acknowledgment">
              <p>
                By using CK Capital&apos;s funded trading accounts, you acknowledge that:
              </p>
              <List
                items={[
                  'You understand all risks outlined in this disclosure',
                  'You accept full responsibility for your trading decisions',
                  'You have sufficient financial knowledge to trade',
                  'You understand leverage and its dangers',
                  'You accept potential complete loss of capital',
                ]}
              />
            </RiskSection>

            {/* Informational callout */}
            <div className="mt-12 rounded-xl border border-primary/25 bg-primary/[0.06] p-5">
              <p className="font-semibold text-foreground/80">
                This Risk Disclosure is provided for informational purposes only and does
                not constitute financial advice. If you have questions about trading
                risks, please contact support before opening an account.
              </p>
            </div>

            <p className="mt-12 text-sm text-foreground/65">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Container>
      </section>
    </div>
  )
}
