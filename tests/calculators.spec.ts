import { test, expect } from "@playwright/test";
import {
  INSTRUMENTS,
  PROGRAMMES,
  lotsForRisk,
  marginRequired,
  notionalValue,
  pipValue,
  priceDistanceInPips,
  profitLoss,
  programmeById,
  ruleCheck,
  swapCost,
  toUsd,
  usdPerUnit,
  formatMoney,
  formatNumber,
  type RateTable,
} from "../lib/calculators";

/**
 * Formula coverage for the calculator suite. These are pure-function tests, so
 * they run without a browser context; every exported formula is exercised.
 */

const RATES: RateTable = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 147.5, AUD: 1.53, CAD: 1.36, CHF: 0.88, NZD: 1.66 };
const find = (s: string) => INSTRUMENTS.find((i) => i.symbol === s)!;
const near = (actual: number, expected: number, tolerance = 0.01) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);

test.describe("currency conversion", () => {
  test("USD passes through and other currencies divide by the USD rate", () => {
    expect(toUsd(100, "USD", RATES)).toBe(100);
    near(toUsd(147.5, "JPY", RATES), 1);
    near(usdPerUnit("EUR", RATES), 1.0869565, 0.000001);
  });

  test("an unknown currency falls back to 1:1 instead of returning NaN", () => {
    expect(toUsd(50, "ZZZ", RATES)).toBe(50);
  });
});

test.describe("margin", () => {
  test("1 lot EURUSD at 1:100", () => {
    // 100,000 x 1.0842 = 108,420 USD notional / 100
    near(marginRequired(find("EURUSD"), 1, 1.0842, 100, RATES), 1084.2);
  });

  test("quote-currency pairs convert into USD", () => {
    // 100,000 x 147.50 JPY = 14,750,000 JPY -> 100,000 USD -> /100
    near(marginRequired(find("USDJPY"), 1, 147.5, 100, RATES), 1000);
  });

  test("gold uses its 100 oz contract", () => {
    near(marginRequired(find("XAUUSD"), 0.5, 2400, 50, RATES), 2400);
  });

  test("invalid input yields zero rather than Infinity or NaN", () => {
    expect(marginRequired(find("EURUSD"), 0, 1.08, 100, RATES)).toBe(0);
    expect(marginRequired(find("EURUSD"), 1, 1.08, 0, RATES)).toBe(0);
    expect(marginRequired(find("EURUSD"), -1, 1.08, 100, RATES)).toBe(0);
  });

  test("notional value is margin times leverage", () => {
    const i = find("GBPUSD");
    near(notionalValue(i, 2, 1.27, RATES), marginRequired(i, 2, 1.27, 100, RATES) * 100, 0.05);
  });
});

test.describe("pip value", () => {
  test("USD-quoted pairs are $10 per standard lot", () => {
    near(pipValue(find("EURUSD"), 1, RATES), 10);
    near(pipValue(find("EURUSD"), 0.1, RATES), 1);
  });

  test("JPY-quoted pairs convert at the JPY rate", () => {
    // 0.01 x 100,000 = 1,000 JPY -> /147.5
    near(pipValue(find("USDJPY"), 1, RATES), 6.7797);
  });

  test("distance between prices is measured in pips", () => {
    near(priceDistanceInPips(find("EURUSD"), 1.085, 1.0875), 25, 0.0001);
    near(priceDistanceInPips(find("USDJPY"), 147.5, 148.0), 50, 0.0001);
  });
});

test.describe("profit and loss", () => {
  test("a long that moves up profits, a short loses the same", () => {
    const i = find("EURUSD");
    const long = profitLoss(i, 1, 1.08, 1.085, "buy", RATES, 100_000);
    const short = profitLoss(i, 1, 1.08, 1.085, "sell", RATES, 100_000);
    near(long.gross, 500);
    near(short.gross, -500);
    near(long.pips, 50, 0.001);
    near(long.returnOnBalance ?? 0, 0.5, 0.001);
  });

  test("return on balance is null without a balance", () => {
    expect(profitLoss(find("EURUSD"), 1, 1.08, 1.09, "buy", RATES).returnOnBalance).toBeNull();
  });
});

test.describe("lot sizing", () => {
  test("solves for the lot size that risks exactly the given amount", () => {
    const i = find("EURUSD");
    const lots = lotsForRisk(i, 1_000, 20, RATES); // $10/pip/lot -> 5 lots
    near(lots, 5, 0.0001);
    // round-trip: losing the stop on that size equals the risk
    near(Math.abs(profitLoss(i, lots, 1.08, 1.078, "buy", RATES).gross), 1_000, 0.5);
  });

  test("zero or negative inputs return zero", () => {
    expect(lotsForRisk(find("EURUSD"), 0, 20, RATES)).toBe(0);
    expect(lotsForRisk(find("EURUSD"), 100, 0, RATES)).toBe(0);
  });
});

test.describe("swap", () => {
  test("negative points cost money and scale with nights", () => {
    const s = swapCost(find("EURUSD"), 1, -7.2, 3, RATES, false);
    near(s.perNight, -7.2 * 0.0001 * 100_000, 0.01);
    near(s.total, s.perNight * 3, 0.01);
    expect(s.chargedNights).toBe(3);
  });

  test("a full week adds two extra nights for the Wednesday rollover", () => {
    expect(swapCost(find("EURUSD"), 1, -7.2, 7, RATES, true).chargedNights).toBe(9);
    expect(swapCost(find("EURUSD"), 1, -7.2, 7, RATES, false).chargedNights).toBe(7);
  });

  test("negative nights never produce a credit", () => {
    expect(swapCost(find("EURUSD"), 1, -7.2, -5, RATES).chargedNights).toBe(0);
  });
});

test.describe("CK programme rules", () => {
  test("every programme exposes the published limits", () => {
    expect(PROGRAMMES.map((p) => p.id)).toEqual(["1step", "standard", "pro", "instant"]);
    expect(programmeById("1step").dailyLoss).toBe(0.03);
    expect(programmeById("standard").maxLoss).toBe(0.08);
    expect(programmeById("pro").fundedConsistency).toBeNull();
    expect(programmeById("instant").sizes).not.toContain(200_000);
    expect(programmeById("nope").id).toBe("standard"); // unknown ids fall back
  });

  test("limits and payout thresholds match the published tables", () => {
    const c = ruleCheck(programmeById("standard"), 100_000);
    near(c.dailyLossLimit, 4_000);
    near(c.maxLossLimit, 8_000);
    near(c.phase1Target ?? 0, 10_000);
    near(c.phase2Target ?? 0, 5_000);
    expect(c.payoutBuffer).toBe(103_100);
    expect(c.firstPayoutTarget).toBe(2_500);
    expect(c.nextPayoutTarget).toBe(3_000);

    const small = ruleCheck(programmeById("1step"), 10_000);
    expect(small.payoutBuffer).toBe(10_700);
    expect(small.phase2Target).toBeNull();
  });

  test("risk is flagged against the daily and overall limits", () => {
    const ok = ruleCheck(programmeById("standard"), 100_000, 1_000);
    expect(ok.breachesDaily).toBe(false);
    near(ok.riskOfDaily ?? 0, 0.25, 0.001);

    const tooBig = ruleCheck(programmeById("standard"), 100_000, 5_000);
    expect(tooBig.breachesDaily).toBe(true);
    expect(tooBig.breachesMax).toBe(false);

    const huge = ruleCheck(programmeById("standard"), 100_000, 9_000);
    expect(huge.breachesMax).toBe(true);
  });

  test("an unpriced check leaves the risk ratios null", () => {
    const c = ruleCheck(programmeById("instant"), 50_000);
    expect(c.riskOfDaily).toBeNull();
    expect(c.breachesDaily).toBe(false);
  });
});

test.describe("formatting", () => {
  test("money and numbers render predictably, including non-finite input", () => {
    expect(formatMoney(1234.5)).toBe("$1,234.50");
    expect(formatMoney(1234.5, "USD", 0)).toBe("$1,235");
    expect(formatNumber(0.12345, 3)).toBe("0.123");
    expect(formatMoney(Number.NaN)).toBe("$0.00");
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe("0.00");
  });
});

test.describe("instrument table", () => {
  test("every instrument is internally consistent", () => {
    for (const i of INSTRUMENTS) {
      expect(i.contractSize, i.symbol).toBeGreaterThan(0);
      expect(i.pip, i.symbol).toBeGreaterThan(0);
      expect(i.indicativePrice, i.symbol).toBeGreaterThan(0);
      expect(pipValue(i, 1, RATES), i.symbol).toBeGreaterThan(0);
      expect(marginRequired(i, 1, i.indicativePrice, 100, RATES), i.symbol).toBeGreaterThan(0);
    }
  });

  test("symbols are unique", () => {
    const symbols = INSTRUMENTS.map((i) => i.symbol);
    expect(new Set(symbols).size).toBe(symbols.length);
  });
});
