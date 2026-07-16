import { describe, expect, it } from "vitest";
import { changeWindowForPeriod, isPeriodDays, parsePeriod } from "./period";

describe("isPeriodDays", () => {
  it("accepts the four supported day counts", () => {
    expect(isPeriodDays(1)).toBe(true);
    expect(isPeriodDays(7)).toBe(true);
    expect(isPeriodDays(30)).toBe(true);
    expect(isPeriodDays(90)).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isPeriodDays(14)).toBe(false);
    expect(isPeriodDays(0)).toBe(false);
    expect(isPeriodDays(NaN)).toBe(false);
  });
});

describe("parsePeriod", () => {
  it("parses a valid numeric string", () => {
    expect(parsePeriod("30")).toBe(30);
  });

  it("falls back to the default for invalid input", () => {
    expect(parsePeriod("not-a-number")).toBe(7);
    expect(parsePeriod("14")).toBe(7);
    expect(parsePeriod(null)).toBe(7);
  });

  it("respects a custom fallback", () => {
    expect(parsePeriod(null, 1)).toBe(1);
  });
});

describe("changeWindowForPeriod", () => {
  it("maps today/week/month to their native CoinGecko windows", () => {
    expect(changeWindowForPeriod(1)).toBe("24h");
    expect(changeWindowForPeriod(7)).toBe("7d");
    expect(changeWindowForPeriod(30)).toBe("30d");
  });

  it("falls back quarter to the 30d window since CoinGecko has no native 90d window", () => {
    expect(changeWindowForPeriod(90)).toBe("30d");
  });
});
