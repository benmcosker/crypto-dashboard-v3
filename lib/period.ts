export const PERIOD_DAYS = [1, 7, 30, 90] as const;
export type PeriodDays = (typeof PERIOD_DAYS)[number];

export const PERIOD_LABELS: Record<PeriodDays, string> = {
  1: "Today",
  7: "Last week",
  30: "Last month",
  90: "Last quarter",
};

export function isPeriodDays(value: number): value is PeriodDays {
  return (PERIOD_DAYS as readonly number[]).includes(value);
}

export function parsePeriod(raw: string | null, fallback: PeriodDays = 7): PeriodDays {
  const n = Number(raw);
  return isPeriodDays(n) ? n : fallback;
}

/**
 * CoinGecko's /coins/markets only has native 24h/7d/30d change windows.
 * "Last quarter" (90d) has no native window, so the Live Prices % column
 * falls back to 30d while the price-history chart still renders 90 days.
 */
const CHANGE_WINDOW: Record<PeriodDays, "24h" | "7d" | "30d"> = {
  1: "24h",
  7: "7d",
  30: "30d",
  90: "30d",
};

export function changeWindowForPeriod(days: PeriodDays): "24h" | "7d" | "30d" {
  return CHANGE_WINDOW[days];
}
