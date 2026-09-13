"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TermLine {
  prefix: string;
  text: string;
  color: string;
}

const TERMINAL_SETS: TermLine[][] = [
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
    { prefix: "*", text: "Optimizing... (6s · ↑3.8k · esc)", color: "#894CEF" },
    { prefix: ">", text: "bypass permissions on", color: "#894CEF" },
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
    { prefix: "*", text: "Re-running... (3s · ↑12.1k · esc)", color: "#894CEF" },
    { prefix: ">", text: "auto mode on", color: "#894CEF" },
  ],
];

export function TerminalCard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const reduceMotion = useReducedMotion();

  // Mount-guard: useReducedMotion() is true on the client but null during SSR,
  // so branching the render on it directly would fail hydration under
  // prefers-reduced-motion. Resolve the real value only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const staticMode = mounted && reduceMotion;

  const running = inView && !staticMode;

  const [setIdx, setSetIdx] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!running) return;
    const lines = TERMINAL_SETS[setIdx];
    if (visibleLines < lines.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 330);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setVisibleLines(0);
      setSetIdx((i) => (i + 1) % TERMINAL_SETS.length);
    }, 2400);
    return () => clearTimeout(t);
  }, [running, setIdx, visibleLines]);

  // Reduced motion: show the full first script statically.
  const lines = TERMINAL_SETS[staticMode ? 0 : setIdx];
  const shown = staticMode ? lines.length : visibleLines;

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl overflow-hidden border border-white/10 bg-[#080E24] font-mono text-[11px] leading-[1.7]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] border-b border-white/[0.06]">
        <div className="w-2 h-2 rounded-full bg-red-500/70" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <div className="w-2 h-2 rounded-full bg-green-500/70" />
        <span className="ml-2 text-[9px] text-white/40">~/strategies – zsh</span>
      </div>
      <div className="p-3 min-h-[300px]">
        {lines.map((l, i) => (
          <div
            key={`${setIdx}-${i}`}
            className={cn("whitespace-nowrap", !staticMode && i < shown && "term-line term-type")}
            style={{
              opacity: i < shown ? 1 : 0,
              color: l.color,
            }}
          >
            <span className="mr-1.5">{l.prefix}</span>
            {l.text}
            {i === shown - 1 && !staticMode && (
              <span className="term-caret text-[#A98BFF]">▊</span>
            )}
            {i === lines.length - 1 && i < shown && (
              <span className="term-spark text-[#A98BFF]"> ✦</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
