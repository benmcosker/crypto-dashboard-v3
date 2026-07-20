"use client";

import useSWR from "swr";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
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

export function useSelectedCoin() {
  return useQueryState("coin", parseAsString.withDefault("bitcoin"));
}

export default function PriceHistoryChart() {
  const [rawPeriod] = usePeriod();
  const period = parsePeriod(String(rawPeriod));
  const [rawCoin] = useSelectedCoin();
  const coin = parseCoin(rawCoin);
  const { data, error, isLoading } = useSWR<ChartData>(`/api/chart/${coin}?period=${period}`);

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
      {data && (
        <LineChart
          height={280}
          grid={{ horizontal: true }}
          xAxis={[
            {
              data: data.prices.map(([timestamp]) => new Date(timestamp)),
              scaleType: "time",
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
