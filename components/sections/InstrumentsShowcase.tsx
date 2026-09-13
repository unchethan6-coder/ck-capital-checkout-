"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { Star } from "lucide-react";

const BASE_PRICES = [
  { name: "Bitcoin", symbol: "BTC/USD", base: 119708, decimals: 0, prefix: "$", chg: "+2.31%", up: true, type: "Crypto", color: "#f7931a", icon: "B" },
  { name: "EUR/USD", symbol: "EUR/USD", base: 1.0773, decimals: 4, prefix: "", chg: "-0.80%", up: false, type: "Forex", color: "#003399", icon: "E" },
  { name: "NVIDIA", symbol: "NVDA", base: 173.48, decimals: 2, prefix: "$", chg: "+1.52%", up: true, type: "Stock", color: "#76b900", icon: "N" },
  { name: "Nasdaq 100", symbol: "NQ", base: 21529, decimals: 0, prefix: "$", chg: "+0.94%", up: true, type: "Index", color: "#6366f1", icon: "N" },
];

const TERMINAL_SETS = [
  [
    { prefix: "*", text: "Welcome back, Trader", color: "#e05050" },
    { prefix: ">", text: "tune the EMA crossover", color: "#c0c0c0" },
    { prefix: "●", text: "Bash(sweep.py --grid)", color: "#c0c0c0" },
    { prefix: "└", text: "64 combos · best PF 2.1", color: "#50b050" },
    { prefix: "●", text: "Edit(ema.py)", color: "#c0c0c0" },
    { prefix: "└", text: "Updated 3 hunks", color: "#808080" },
    { prefix: "●", text: "Bash(backtest.py)", color: "#c0c0c0" },
    { prefix: "└", text: "PF 2.4 · Win 54%", color: "#50b050" },
    { prefix: "●", text: "Read(portfolio.py)", color: "#c0c0c0" },
    { prefix: "└", text: "3 positions open", color: "#808080" },
    { prefix: "●", text: "Edit(risk.py)", color: "#c0c0c0" },
    { prefix: "└", text: "Updated 1 hunk", color: "#808080" },
    { prefix: "●", text: "Bash(optimizer.py)", color: "#c0c0c0" },
    { prefix: "└", text: "Searching 128 combinations...", color: "#50b050" },
    { prefix: "●", text: "Bash(deploy.py --live)", color: "#c0c0c0" },
    { prefix: "└", text: "Strategy deployed to sim account", color: "#50b050" },
    { prefix: "*", text: "Optimizing... (6s · ↑3.8k · esc)", color: "#e0a030" },
    { prefix: ">", text: "bypass permissions on", color: "#e0a030" },
  ],
  [
    { prefix: "*", text: "Resumed session", color: "#e05050" },
    { prefix: ">", text: "PnL went negative?", color: "#c0c0c0" },
    { prefix: "●", text: 'Grep("stop" *.py)', color: "#c0c0c0" },
    { prefix: "└", text: "6 matches", color: "#808080" },
    { prefix: "●", text: "Read(risk.py)", color: "#c0c0c0" },
    { prefix: "●", text: "Stop too tight – widening.", color: "#c0c0c0" },
    { prefix: "●", text: "Edit(risk.py)", color: "#c0c0c0" },
    { prefix: "└", text: "Updated 1 hunk", color: "#808080" },
    { prefix: "●", text: "Bash(backtest.py --quick)", color: "#c0c0c0" },
    { prefix: "└", text: "PF 2.8 · Win 58% · Sharpe 1.9", color: "#50b050" },
    { prefix: "●", text: "Read(signals.py)", color: "#c0c0c0" },
    { prefix: "└", text: "14 pending orders", color: "#808080" },
    { prefix: "●", text: "Edit(ema.py)", color: "#c0c0c0" },
    { prefix: "└", text: "Window: 20 → 25", color: "#808080" },
    { prefix: "●", text: "Bash(walk_forward.py)", color: "#c0c0c0" },
    { prefix: "└", text: "OOS PF 1.9 · Win 52%", color: "#50b050" },
    { prefix: "*", text: "Re-running... (3s · ↑12.1k · esc)", color: "#e0a030" },
    { prefix: ">", text: "auto mode on", color: "#e0a030" },
  ],
];

const REVIEWS = [
  { name: "Aiman A.", flag: "🇲🇾", initial: "A", text: "Best customer support experience especially on discord. Plan rules are straightforward as all in their FAQ website.", source: "Verified Trader" },
  { name: "Ghecel V.", flag: "🇵🇭", initial: "G", text: "CK cap is my new favorite prop firm. The rules are very trader friendly and almost all pairs are available.", source: "Verified Trader" },
  { name: "Luyanda", flag: "🇿🇦", initial: "L", text: "I really trust this prop firm to payout on time every time. The customer care is just too proper.", source: "Verified Trader" },
  { name: "David A.", flag: "🇳🇬", initial: "D", text: "Customer service is top-notch, the website is good, trading rules aren't bad. I'd rate them with 5 stars.", source: "Verified Trader" },
];

function useTickingPrice(base: number, decimals: number) {
  const [price, setPrice] = useState(base);
  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = (Math.random() - 0.5) * base * 0.0008;
      setPrice(base + jitter);
    }, 1500 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, [base]);
  return decimals > 0 ? price.toFixed(decimals) : Math.round(price).toLocaleString();
}

function TickerPrice({ base, decimals, prefix }: { base: number; decimals: number; prefix: string }) {
  const price = useTickingPrice(base, decimals);
  return <>{prefix}{price}</>;
}

function AnimatedChart() {
  const [points, setPoints] = useState(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 30; i++) {
      pts.push(120 - i * 3.2 + Math.sin(i * 0.5) * 12);
    }
    return pts;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const last = prev[prev.length - 1];
        const next = last + (Math.random() - 0.48) * 8;
        const clamped = Math.max(15, Math.min(135, next));
        return [...prev.slice(1), clamped];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const w = 400;
  const h = 150;
  const step = w / (points.length - 1);

  const linePoints = points.map((y, i) => `${i * step},${y}`).join(" ");
  const areaD = `M0,${h} L${points.map((y, i) => `${i * step},${y}`).join(" L")} L${w},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 10}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[37.5, 75, 112.5].map((y) => (
        <line key={y} x1="0" y1={y} x2={w} y2={y} stroke="#1a1a1a" strokeWidth="1" />
      ))}
      <polygon points={`0,${h} ${points.map((y, i) => `${i * step},${y}`).join(" ")} ${w},${h}`} fill="url(#chartFill)" />
      <polyline points={linePoints} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={points[points.length - 1]} r="4" fill="#22c55e" stroke="#0b0a07" strokeWidth="2">
        <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function LoopingTerminal() {
  const [setIdx, setSetIdx] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = TERMINAL_SETS[setIdx];
    if (visibleLines < lines.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 350);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines(0);
        setSetIdx((i) => (i + 1) % TERMINAL_SETS.length);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [setIdx, visibleLines]);

  const currentLines = TERMINAL_SETS[setIdx];

  return (
    <div className="rounded-xl overflow-hidden border border-foreground/10 bg-[#0d0b06] font-mono text-[11px] leading-[1.7]">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-foreground/[0.04] border-b border-foreground/[0.06]">
        <div className="w-2 h-2 rounded-full bg-red-500/70" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <div className="w-2 h-2 rounded-full bg-green-500/70" />
        <span className="ml-2 text-[9px] text-foreground/65">~/strategies – zsh</span>
      </div>
      <div ref={termRef} className="p-3 min-h-[280px]">
        {currentLines.map((l, i) => (
          <div
            key={`${setIdx}-${i}`}
            className="whitespace-nowrap"
            style={{
              transition: "all 0.3s ease",
              opacity: i < visibleLines ? 1 : 0,
              transform: i < visibleLines ? "translateY(0)" : "translateY(4px)",
              color: l.color,
            }}
          >
            <span className="mr-1.5">{l.prefix}</span>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function InstrumentsShowcase() {
  const t = useTranslations("instruments");
  const [reviewIdx, setReviewIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIdx((i) => (i + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const r = REVIEWS[reviewIdx];

  return (
    <section className="py-14 md:py-24" data-od-id="instruments">
      <Container>
        <SectionReveal className="text-center mb-10 md:mb-14">
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl font-extrabold text-foreground md:text-5xl">
            {t("title")}
          </h2>
        </SectionReveal>

        {/* Top row — CFDs + Futures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* CFDs card */}
          <div
            className="rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6 sm:p-8 flex flex-col"
          >
            <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-foreground mb-3">{t("cfdsTitle")}</h3>
            <p className="text-sm text-foreground/65 leading-relaxed mb-6 max-w-md">
              {t("cfdsDesc")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BASE_PRICES.map((inst) => (
                <div
                  key={inst.symbol}
                  className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-3.5 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: inst.color }}>
                        {inst.icon}
                      </div>
                      <span className="text-xs font-semibold text-foreground">{inst.name}</span>
                    </div>
                    <span className="text-[9px] text-foreground/65 font-mono">{inst.type}</span>
                  </div>
                  <p className="font-[family-name:var(--font-jakarta)] text-lg font-extrabold text-foreground">
                    <TickerPrice base={inst.base} decimals={inst.decimals} prefix={inst.prefix} />
                  </p>
                  <p className={`text-xs font-mono font-bold ${inst.up ? "text-emerald-400" : "text-red-400"}`}>
                    {inst.up ? "↑" : "↓"} {inst.chg}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <button className="flex-1 rounded-lg py-1.5 text-[11px] font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">{t("btnLong")}</button>
                    <button className="flex-1 rounded-lg py-1.5 text-[11px] font-bold border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">{t("btnShort")}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Futures card */}
          <div
            className="rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6 sm:p-8 flex flex-col"
          >
            <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-foreground mb-3">{t("futuresTitle")}</h3>
            <p className="text-sm text-foreground/65 leading-relaxed mb-6 max-w-md">
              {t("futuresDesc")}
            </p>
            <div className="flex-1 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">N</div>
                  <span className="text-sm font-bold text-foreground">NQ</span>
                </div>
                <div className="text-right">
                  <p className="font-[family-name:var(--font-jakarta)] text-lg font-extrabold text-foreground">24,179.01</p>
                  <p className="text-xs font-mono text-emerald-400">+1.37%</p>
                </div>
              </div>
              <div className="flex-1 min-h-[160px] overflow-hidden">
                <AnimatedChart />
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-mono text-foreground/65">
                <div><span className="block text-foreground/65">{t("high24h")}</span><span className="text-foreground/60 font-bold">24,194</span></div>
                <div><span className="block text-foreground/65">{t("low24h")}</span><span className="text-foreground/60 font-bold">23,745</span></div>
                <div><span className="block text-foreground/65">{t("vol")}</span><span className="text-foreground/60 font-bold">1.3M</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row — Algo terminal + Trust stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            className="rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6 sm:p-8 flex flex-col"
          >
            <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-foreground mb-4">
              {t("algoTitle")}
            </h3>
            <LoopingTerminal />
          </div>

          <div
            className="rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6 sm:p-8 flex flex-col gap-4"
          >
            <div>
              <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold text-foreground mb-2">
                {t("trustTitle")}
              </h3>
              <p className="text-sm text-foreground/65 leading-relaxed mb-4">
                {t("trustSubtitle")}
              </p>
              <div className="flex items-end gap-3">
                <span className="font-[family-name:var(--font-jakarta)] text-5xl font-extrabold text-foreground">4.8</span>
                <span className="text-lg text-foreground/65 mb-1">/5</span>
                <div className="ml-2 flex flex-col gap-0.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="#f7d774" stroke="none" />
                    ))}
                  </div>
                  <span className="text-[10px] text-foreground/65">{t("trustSummary")}</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reviewIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-[#A98BFF]">{r.initial}</div>
                    <span className="text-sm font-bold text-foreground">{r.name} {r.flag}</span>
                  </div>
                  <p className="text-[10px] text-foreground/65 mb-1.5">{r.source}</p>
                  <p className="text-sm text-foreground/70 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} fill="#f7d774" stroke="none" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-foreground/65">{t("verifiedBadge")}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
