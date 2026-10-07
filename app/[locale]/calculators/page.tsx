import { Container } from "@/components/shared/Container";
import { Aurora } from "@/components/fx/Aurora";
import { CalculatorSuite } from "@/components/calculators/CalculatorSuite";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Trading Calculators",
  description:
    "Plan trades on your CK Capital simulated account: margin, profit and loss, lot size and swap, checked against the daily loss, drawdown and payout rules of your programme.",
  path: "/calculators",
});

const HIGHLIGHTS = [
  "Margin, P/L, lot size and swap in one place",
  "Live FX rates, refreshed on load",
  "Checked against your programme's limits",
];

export default function CalculatorsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#030A1C] pt-14 pb-10 text-white md:pt-20 md:pb-12">
        <Aurora />
        <Container className="relative">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#A98BFF]">
            [ // TRADER TOOLS ]
          </p>
          <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-jakarta)] text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl">
            Trading calculators built around CK rules
          </h1>
          <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-white/70 sm:text-base">
            Size a position before you take it. Every result is measured against the daily loss limit, drawdown and
            payout thresholds of the programme and account size you select.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {HIGHLIGHTS.map((h) => (
              <li
                key={h}
                className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-semibold text-white/75"
              >
                {h}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CalculatorSuite />
    </>
  );
}
