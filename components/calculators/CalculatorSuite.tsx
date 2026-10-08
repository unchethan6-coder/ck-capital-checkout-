"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Calculator, Check, Minus, Plus, RefreshCw, RotateCcw, Wifi, WifiOff } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";
import {
  INSTRUMENTS,
  LEVERAGE_OPTIONS,
  LOT_PRESETS,
  MIN_PAYOUT_REQUEST,
  PROGRAMMES,
  PAYOUT_SPLIT,
  formatMoney,
  formatNumber,
  lotsForRisk,
  marginRequired,
  notionalValue,
  pipValue,
  priceDistanceInPips,
  profitLoss,
  programmeById,
  ruleCheck,
  swapCost,
  type Direction,
  type Instrument,
  type RateTable,
} from "@/lib/calculators";

type TabId = "margin" | "pnl" | "lot" | "swap";

const TABS: { id: TabId; label: string }[] = [
  { id: "margin", label: "Margin" },
  { id: "pnl", label: "Profit / Loss" },
  { id: "lot", label: "Lot Size" },
  { id: "swap", label: "Swap" },
];

const FALLBACK_RATES: RateTable = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 147.5, AUD: 1.53, CAD: 1.36, CHF: 0.88, NZD: 1.66 };

/* ---------------------------------------------------------------- */
/* Small shared pieces                                               */
/* ---------------------------------------------------------------- */

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] font-semibold text-rose-300">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-white/55">{hint}</span>
      ) : null}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#894CEF] focus:ring-2 focus:ring-[#894CEF]/30";

function Row({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-2.5 last:border-0">
      <span className="text-xs text-white/65">{label}</span>
      <span
        className={cn(
          "text-right tabular-nums",
          strong ? "text-base font-extrabold" : "text-sm font-bold",
          accent ? "text-emerald-400" : "text-white"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function LotInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const step = (delta: number) => {
    const next = Math.max(0.01, Math.round(((parseFloat(value) || 0) + delta) * 100) / 100);
    onChange(String(next));
  };
  return (
    <div>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          aria-label="Decrease lot size"
          onClick={() => step(-0.01)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.04] text-white/80 transition-colors hover:text-white"
        >
          <Minus size={15} />
        </button>
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClass, "text-center")}
        />
        <button
          type="button"
          aria-label="Increase lot size"
          onClick={() => step(0.01)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.04] text-white/80 transition-colors hover:text-white"
        >
          <Plus size={15} />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {LOT_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(String(p))}
            className={cn(
              "rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors",
              parseFloat(value) === p
                ? "border-[#894CEF] bg-[#894CEF]/20 text-white"
                : "border-white/12 bg-white/[0.04] text-white/65 hover:text-white"
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Suite                                                             */
/* ---------------------------------------------------------------- */

export function CalculatorSuite() {
  const [tab, setTab] = useState<TabId>("margin");

  // Account model
  const [programmeId, setProgrammeId] = useState("standard");
  const programme = programmeById(programmeId);
  const [balance, setBalance] = useState(100_000);
  const [phase, setPhase] = useState<"phase1" | "phase2" | "funded">("phase1");
  const [leverage, setLeverage] = useState(100);

  // Instrument + price
  const [symbol, setSymbol] = useState("EURUSD");
  const instrument = useMemo<Instrument>(
    () => INSTRUMENTS.find((i) => i.symbol === symbol) ?? INSTRUMENTS[0],
    [symbol]
  );

  // Rate feed
  const [rates, setRates] = useState<RateTable>(FALLBACK_RATES);
  const [feed, setFeed] = useState<"live" | "fallback" | "loading">("loading");
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const loadRates = useCallback(async () => {
    setFeed("loading");
    try {
      const res = await fetch("/api/rates", { cache: "no-store" });
      const data = (await res.json()) as { rates?: RateTable; source?: string; updatedAt?: number | null };
      if (data.rates && Object.keys(data.rates).length) setRates({ ...FALLBACK_RATES, ...data.rates });
      setFeed(data.source === "live" ? "live" : "fallback");
      setUpdatedAt(data.updatedAt ?? null);
    } catch {
      setRates(FALLBACK_RATES);
      setFeed("fallback");
    }
  }, []);

  useEffect(() => {
    void loadRates();
  }, [loadRates]);

  /** Live price for FX pairs is derived from the USD rate table; everything
   *  else keeps its indicative price until the trader overrides it. */
  const livePrice = useMemo(() => {
    if (instrument.group !== "fx") return null;
    const base = rates[instrument.base];
    const quote = rates[instrument.quote];
    if (!base || !quote) return null;
    return quote / base;
  }, [instrument, rates]);

  const [priceInput, setPriceInput] = useState("");
  const [priceTouched, setPriceTouched] = useState(false);

  useEffect(() => {
    setPriceTouched(false);
    const p = instrument.group === "fx" && livePrice ? livePrice : instrument.indicativePrice;
    setPriceInput(p.toFixed(instrument.digits));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, livePrice]);

  const price = parseFloat(priceInput) || 0;

  // Tab-specific inputs
  const [lots, setLots] = useState("1");
  const [direction, setDirection] = useState<Direction>("buy");
  const [exitPrice, setExitPrice] = useState("");
  const [riskPct, setRiskPct] = useState("1");
  const [stopPips, setStopPips] = useState("20");
  const [swapPoints, setSwapPoints] = useState("");
  const [nights, setNights] = useState("3");
  const [tripleWed, setTripleWed] = useState(true);

  useEffect(() => {
    setSwapPoints(String(direction === "buy" ? instrument.swapLong : instrument.swapShort));
  }, [instrument, direction]);

  useEffect(() => {
    if (!exitPrice && price > 0) setExitPrice((price * 1.002).toFixed(instrument.digits));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  // Keep the balance valid for the selected programme
  useEffect(() => {
    if (!programme.sizes.includes(balance)) setBalance(programme.sizes[programme.sizes.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programmeId]);

  const lotsNum = parseFloat(lots) || 0;
  const riskAmount = (balance * (parseFloat(riskPct) || 0)) / 100;
  const checks = ruleCheck(programme, balance, tab === "lot" ? riskAmount : undefined);

  const errors = {
    lots: lotsNum <= 0 ? "Enter a lot size above zero." : lotsNum > 200 ? "Maximum 200 lots per position." : null,
    price: price <= 0 ? "Enter a price above zero." : null,
    exit: tab === "pnl" && (parseFloat(exitPrice) || 0) <= 0 ? "Enter an exit price above zero." : null,
    stop: tab === "lot" && (parseFloat(stopPips) || 0) <= 0 ? "Stop distance must be above zero." : null,
    risk:
      tab === "lot" && (parseFloat(riskPct) || 0) <= 0
        ? "Enter a risk percentage above zero."
        : checks.breachesDaily
          ? `Risk exceeds the ${(programme.dailyLoss * 100).toFixed(0)}% daily loss limit.`
          : null,
  };

  const reset = () => {
    setProgrammeId("standard");
    setBalance(100_000);
    setPhase("phase1");
    setLeverage(100);
    setSymbol("EURUSD");
    setLots("1");
    setDirection("buy");
    setExitPrice("");
    setRiskPct("1");
    setStopPips("20");
    setNights("3");
    setTripleWed(true);
    setPriceTouched(false);
    void loadRates();
  };

  /* ---------------- results ---------------- */

  const margin = marginRequired(instrument, lotsNum, price, leverage, rates);
  const notional = notionalValue(instrument, lotsNum, price, rates);
  const pip = pipValue(instrument, lotsNum, rates);
  const freeMargin = balance - margin;

  const pnl = profitLoss(instrument, lotsNum, price, parseFloat(exitPrice) || 0, direction, rates, balance);

  const suggestedLots = lotsForRisk(instrument, riskAmount, parseFloat(stopPips) || 0, rates);
  const suggestedMargin = marginRequired(instrument, suggestedLots, price, leverage, rates);

  const swap = swapCost(instrument, lotsNum, parseFloat(swapPoints) || 0, parseFloat(nights) || 0, rates, tripleWed);

  const phaseTarget =
    phase === "phase1" ? checks.phase1Target : phase === "phase2" ? checks.phase2Target : checks.firstPayoutTarget;
  const phaseTargetLabel =
    phase === "phase1" ? "Phase 1 profit target" : phase === "phase2" ? "Phase 2 profit target" : "First payout threshold";

  return (
    <section className="relative bg-[#050B1C] py-14 md:py-20" data-od-id="calculator-suite">
      <Container>
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Calculator"
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          data-od-id="calculator-tabs"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "min-h-11 rounded-xl border px-4 text-sm font-bold transition-all",
                tab === t.id
                  ? "border-[#894CEF] bg-[#21184F] text-white ring-1 ring-[#894CEF]"
                  : "border-white/10 bg-[#171820] text-white/70 hover:border-[#703AD7]/60 hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* ---------------- inputs ---------------- */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/10 bg-[#0B1024] p-5 sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account model">
                <select
                  value={programmeId}
                  onChange={(e) => setProgrammeId(e.target.value)}
                  className={inputClass}
                >
                  {PROGRAMMES.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0B1024]">
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Account balance">
                <select
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className={inputClass}
                >
                  {programme.sizes.map((s) => (
                    <option key={s} value={s} className="bg-[#0B1024]">
                      {formatMoney(s, "USD", 0)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Phase">
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value as typeof phase)}
                  className={inputClass}
                >
                  {programme.phase1 !== null && (
                    <option value="phase1" className="bg-[#0B1024]">Phase 1</option>
                  )}
                  {programme.phase2 !== null && (
                    <option value="phase2" className="bg-[#0B1024]">Phase 2</option>
                  )}
                  <option value="funded" className="bg-[#0B1024]">Funded</option>
                </select>
              </Field>

              <Field label="Leverage">
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className={inputClass}
                >
                  {LEVERAGE_OPTIONS.map((l) => (
                    <option key={l} value={l} className="bg-[#0B1024]">
                      1:{l}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Instrument">
                <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className={inputClass}>
                  {(["fx", "metal", "index", "crypto"] as const).map((g) => (
                    <optgroup
                      key={g}
                      label={{ fx: "Forex", metal: "Metals", index: "Indices", crypto: "Crypto" }[g]}
                      className="bg-[#0B1024]"
                    >
                      {INSTRUMENTS.filter((i) => i.group === g).map((i) => (
                        <option key={i.symbol} value={i.symbol} className="bg-[#0B1024]">
                          {i.symbol} — {i.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Field>

              <Field
                label={tab === "pnl" ? "Entry price" : "Price"}
                hint={
                  instrument.group === "fx"
                    ? priceTouched
                      ? "Manual override"
                      : feed === "live"
                        ? "Autofilled from the live rate feed"
                        : "Indicative rate — feed unavailable"
                    : "Indicative price, edit to match your platform"
                }
                error={errors.price}
              >
                <input
                  inputMode="decimal"
                  value={priceInput}
                  onChange={(e) => {
                    setPriceInput(e.target.value);
                    setPriceTouched(true);
                  }}
                  className={inputClass}
                />
              </Field>

              {tab !== "lot" && (
                <Field label="Lot size" error={errors.lots}>
                  <LotInput value={lots} onChange={setLots} />
                </Field>
              )}

              {(tab === "pnl" || tab === "swap") && (
                <Field label="Direction">
                  <div className="flex gap-2">
                    {(["buy", "sell"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDirection(d)}
                        className={cn(
                          "h-11 flex-1 rounded-xl border text-sm font-bold capitalize transition-colors",
                          direction === d
                            ? d === "buy"
                              ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-300"
                              : "border-rose-400/60 bg-rose-400/15 text-rose-300"
                            : "border-white/12 bg-white/[0.04] text-white/65 hover:text-white"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </Field>
              )}

              {tab === "pnl" && (
                <Field label="Exit price" error={errors.exit}>
                  <input
                    inputMode="decimal"
                    value={exitPrice}
                    onChange={(e) => setExitPrice(e.target.value)}
                    className={inputClass}
                  />
                </Field>
              )}

              {tab === "lot" && (
                <>
                  <Field
                    label="Risk per trade (%)"
                    hint={`= ${formatMoney(riskAmount)} of your ${formatMoney(balance, "USD", 0)} balance`}
                    error={errors.risk}
                  >
                    <input
                      inputMode="decimal"
                      value={riskPct}
                      onChange={(e) => setRiskPct(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Stop loss (pips)" error={errors.stop}>
                    <input
                      inputMode="decimal"
                      value={stopPips}
                      onChange={(e) => setStopPips(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </>
              )}

              {tab === "swap" && (
                <>
                  <Field label="Swap rate (points / lot / night)" hint="Indicative — check your platform for the live rate">
                    <input
                      inputMode="decimal"
                      value={swapPoints}
                      onChange={(e) => setSwapPoints(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Nights held">
                    <input
                      inputMode="numeric"
                      value={nights}
                      onChange={(e) => setNights(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </>
              )}
            </div>

            {tab === "swap" && (
              <label className="mt-4 flex min-h-11 w-fit cursor-pointer items-center gap-2 text-xs font-semibold text-white/75">
                <input
                  type="checkbox"
                  checked={tripleWed}
                  onChange={(e) => setTripleWed(e.target.checked)}
                  className="h-4 w-4 accent-[#894CEF]"
                />
                Apply triple swap on Wednesday rollover
              </label>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-bold text-white/80 transition-colors hover:border-white/35 hover:text-white"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <span className="inline-flex min-h-11 items-center gap-2 rounded-xl brand-gradient-btn px-5 text-sm font-bold text-[#1A1030]">
                <Calculator size={15} /> Calculating live
              </span>
              <button
                type="button"
                onClick={() => void loadRates()}
                className="ml-auto inline-flex min-h-11 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-white"
              >
                {feed === "loading" ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : feed === "live" ? (
                  <Wifi size={13} className="text-emerald-400" />
                ) : (
                  <WifiOff size={13} className="text-amber-300" />
                )}
                {feed === "live" ? "Live rates" : feed === "loading" ? "Loading" : "Cached rates"}
              </button>
            </div>
            {updatedAt && (
              <p className="mt-2 text-[10px] text-white/45">
                Rates updated {new Date(updatedAt).toUTCString()}
              </p>
            )}
          </motion.div>

          {/* ---------------- results ---------------- */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-[#894CEF]/35 bg-gradient-to-br from-[#17113D] via-[#0B1024] to-[#080B18] p-5 sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">Result</p>

              {tab === "margin" && (
                <>
                  <p className="mt-1 text-3xl font-extrabold tabular-nums text-emerald-400">{formatMoney(margin)}</p>
                  <p className="mt-0.5 text-xs text-white/60">Required margin</p>
                  <div className="mt-4">
                    <Row label="Contract / notional value" value={formatMoney(notional)} />
                    <Row label="Pip value" value={formatMoney(pip)} />
                    <Row label="Leverage" value={`1:${leverage}`} />
                    <Row label="Free margin after entry" value={formatMoney(freeMargin)} accent={freeMargin >= 0} />
                    <Row label="Margin as % of balance" value={`${formatNumber((margin / balance) * 100)}%`} />
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-white/55">
                    Margin = (lots × contract size × price) ÷ leverage, converted to USD.
                  </p>
                </>
              )}

              {tab === "pnl" && (
                <>
                  <p
                    className={cn(
                      "mt-1 text-3xl font-extrabold tabular-nums",
                      pnl.gross >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {formatMoney(pnl.gross)}
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">
                    {direction === "buy" ? "Long" : "Short"} {formatNumber(lotsNum)} lots {instrument.symbol}
                  </p>
                  <div className="mt-4">
                    <Row label="Move" value={`${formatNumber(pnl.pips, 1)} pips`} />
                    <Row label="Pip value" value={formatMoney(pnl.pipValue)} />
                    <Row
                      label="Return on balance"
                      value={pnl.returnOnBalance === null ? "—" : `${formatNumber(pnl.returnOnBalance)}%`}
                    />
                    <Row label={phaseTargetLabel} value={phaseTarget === null ? "—" : formatMoney(phaseTarget)} />
                    <Row
                      label="Progress to that target"
                      value={phaseTarget ? `${formatNumber((pnl.gross / phaseTarget) * 100)}%` : "—"}
                      accent={!!phaseTarget && pnl.gross >= phaseTarget}
                    />
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-white/55">
                    P/L = (exit − entry) × contract size × lots, signed by direction and converted to USD.
                  </p>
                </>
              )}

              {tab === "lot" && (
                <>
                  <p className="mt-1 text-3xl font-extrabold tabular-nums text-emerald-400">
                    {formatNumber(suggestedLots, 2)} lots
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">
                    Risking {formatMoney(riskAmount)} over {formatNumber(parseFloat(stopPips) || 0, 0)} pips
                  </p>
                  <div className="mt-4">
                    <Row label="Pip value at that size" value={formatMoney(pipValue(instrument, suggestedLots, rates))} />
                    <Row label="Margin needed" value={formatMoney(suggestedMargin)} />
                    <Row label="Units of base asset" value={formatNumber(suggestedLots * instrument.contractSize, 0)} />
                    <Row
                      label="Risk vs daily loss limit"
                      value={checks.riskOfDaily === null ? "—" : `${formatNumber(checks.riskOfDaily * 100)}%`}
                      accent={!checks.breachesDaily}
                    />
                    <Row
                      label="Risk vs max drawdown"
                      value={checks.riskOfMax === null ? "—" : `${formatNumber(checks.riskOfMax * 100)}%`}
                      accent={!checks.breachesMax}
                    />
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-white/55">
                    Lots = risk amount ÷ (stop distance in pips × pip value per lot).
                  </p>
                </>
              )}

              {tab === "swap" && (
                <>
                  <p
                    className={cn(
                      "mt-1 text-3xl font-extrabold tabular-nums",
                      swap.total >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {formatMoney(swap.total)}
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">Total financing over {formatNumber(parseFloat(nights) || 0, 0)} nights</p>
                  <div className="mt-4">
                    <Row label="Per night" value={formatMoney(swap.perNight)} />
                    <Row label="Nights charged" value={formatNumber(swap.chargedNights, 0)} />
                    <Row label="Swap rate used" value={`${formatNumber(parseFloat(swapPoints) || 0, 1)} points`} />
                    <Row label="As % of balance" value={`${formatNumber((swap.total / balance) * 100, 3)}%`} />
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-white/55">
                    Swap = points × pip size × contract size × lots, per night, with Wednesday counted three times.
                  </p>
                </>
              )}
            </div>

            {/* CK rule panel */}
            <div className="rounded-2xl border border-white/10 bg-[#0B1024] p-5 sm:p-6" data-od-id="calculator-rules">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">
                {programme.label} · {formatMoney(balance, "USD", 0)} rules
              </p>
              <div className="mt-3">
                <Row label={`Daily loss limit (${(programme.dailyLoss * 100).toFixed(0)}%)`} value={formatMoney(checks.dailyLossLimit)} />
                <Row
                  label={`Max drawdown (${(programme.maxLoss * 100).toFixed(0)}%${programme.trailing ? ", trailing EOD" : ""})`}
                  value={formatMoney(checks.maxLossLimit)}
                />
                {checks.phase1Target !== null && <Row label="Phase 1 target (10%)" value={formatMoney(checks.phase1Target)} />}
                {checks.phase2Target !== null && <Row label="Phase 2 target (5%)" value={formatMoney(checks.phase2Target)} />}
                <Row label="Balance to keep for a payout" value={formatMoney(checks.payoutBuffer)} />
                <Row label="1st payout threshold" value={formatMoney(checks.firstPayoutTarget)} />
                <Row label="2nd payout onwards" value={formatMoney(checks.nextPayoutTarget)} />
                <Row label="Minimum payout request" value={formatMoney(MIN_PAYOUT_REQUEST)} />
                <Row
                  label="Funded consistency score"
                  value={programme.fundedConsistency === null ? "None" : `${(programme.fundedConsistency * 100).toFixed(0)}%`}
                />
                <Row label="Approved payout split" value={`${(PAYOUT_SPLIT * 100).toFixed(0)} / ${(100 - PAYOUT_SPLIT * 100).toFixed(0)}`} />
              </div>

              {(checks.breachesDaily || checks.breachesMax) && (
                <p className="mt-3 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-[11px] font-semibold leading-5 text-rose-200">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  This risk would {checks.breachesMax ? "exceed your max drawdown" : "exceed your daily loss limit"} in a
                  single trade.
                </p>
              )}
              {!checks.breachesDaily && !checks.breachesMax && tab === "lot" && checks.riskOfDaily !== null && (
                <p className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-[11px] font-semibold leading-5 text-emerald-200">
                  <Check size={14} className="mt-0.5 shrink-0" />
                  Within your limits — this trade uses {formatNumber(checks.riskOfDaily * 100)}% of today's loss allowance.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-[11px] leading-5 text-white/50">
          These calculators are planning tools for simulated trading on CK Capital evaluation and Qualified Analyst
          accounts. Figures are estimates: spreads, commissions, slippage and your platform's live swap rates are not
          included, and exchange rates refresh periodically rather than tick by tick. Nothing here is investment advice,
          and no result guarantees a payout or the outcome of an evaluation.
        </p>
      </Container>
    </section>
  );
}
