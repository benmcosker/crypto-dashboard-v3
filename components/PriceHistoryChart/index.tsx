"use client";

import useSWR from "swr";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { LineChart } from "@mui/x-charts/LineChart";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { usePeriod } from "@/components/PeriodFilter";
import ErrorState from "@/components/ErrorState";
import { COINS, COIN_IDS } from "@/lib/coins";
import type { ChartData } from "@/lib/types";

export default function PriceHistoryChart() {
  const [period] = usePeriod();
  const [coin, setCoin] = useQueryState(
    "coin",
    parseAsStringLiteral(COIN_IDS).withDefault("bitcoin")
  );
  const { data, error, isLoading } = useSWR<ChartData>(`/api/chart/${coin}?period=${period}`);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h6">Price History</Typography>
        <TextField
          select
          size="small"
          value={coin}
          onChange={(e) => setCoin(e.target.value as (typeof COIN_IDS)[number])}
        >
          {COINS.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {error && <ErrorState error={error} />}
      {isLoading && <Skeleton variant="rounded" height={280} />}
      {data && (
        <LineChart
          height={280}
          xAxis={[
            {
              data: data.prices.map(([timestamp]) => new Date(timestamp)),
              scaleType: "time",
            },
          ]}
          series={[
            {
              data: data.prices.map(([, price]) => price),
              showMark: false,
              area: true,
            },
          ]}
        />
      )}
    </Paper>
  );
}
