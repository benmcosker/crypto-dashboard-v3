"use client";

import useSWR from "swr";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { scaleTime } from "@mui/x-charts-vendor/d3-scale";
import { useQueryState, parseAsString } from "nuqs";
import { usePeriod } from "@/components/PeriodFilter";
import ErrorState from "@/components/ErrorState";
import { parseCoin } from "@/lib/coins";
import { PERIOD_LABELS, parsePeriod } from "@/lib/period";
import type { ChartData } from "@/lib/types";

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const axisFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
// Matches the axis's default tick style ("Jul 20"), but spelled out for the
// tooltip header, e.g. "Jul 20, 2026, 11:09 AM EDT" — MUI's own default
// tooltip formatter falls back to Date.toString(), which is unreadable.
const tooltipDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export function useSelectedCoin() {
  return useQueryState("coin", parseAsString.withDefault("bitcoin"));
}

export default function PriceHistoryChart() {
  const [rawPeriod] = usePeriod();
  const period = parsePeriod(String(rawPeriod));
  const [rawCoin] = useSelectedCoin();
  const coin = parseCoin(rawCoin);
  const { data, error, isLoading } = useSWR<ChartData>(`/api/chart/${coin}?period=${period}`);

  const dates = data?.prices.map(([timestamp]) => new Date(timestamp));
  // Reuses the same d3 time scale x-charts uses internally, so axis ticks
  // keep their default adaptive formatting ("12 PM" / "Jul 20") — only the
  // tooltip gets the spelled-out format.
  const tickFormat =
    dates && dates.length > 0
      ? scaleTime([dates[0], dates[dates.length - 1]], [0, 1]).tickFormat(8)
      : undefined;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6">Price History</Typography>
        <Typography variant="caption" color="text.secondary">
          {coin.toUpperCase()} · {PERIOD_LABELS[period]}
        </Typography>
      </Box>
      {error && <ErrorState error={error} />}
      {isLoading && <Skeleton variant="rounded" height={280} />}
      {data && dates && tickFormat && (
        <LineChart
          height={280}
          grid={{ horizontal: true }}
          xAxis={[
            {
              data: dates,
              scaleType: "time",
              valueFormatter: (value: Date, context) =>
                context.location === "tooltip" ? tooltipDateFormatter.format(value) : tickFormat(value),
            },
          ]}
          yAxis={[{ valueFormatter: (value: number) => axisFormatter.format(value) }]}
          series={[
            {
              data: data.prices.map(([, price]) => price),
              showMark: false,
              area: true,
              valueFormatter: (value: number | null) =>
                value === null ? "" : priceFormatter.format(value),
            },
          ]}
        />
      )}
    </Paper>
  );
}
