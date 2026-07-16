"use client";

import useSWR from "swr";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import ErrorState from "@/components/ErrorState";
import type { GlobalData } from "@/lib/types";

const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});
const pct = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 6, sm: 3 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Grid>
  );
}

export default function MarketOverview() {
  const { data, error, isLoading } = useSWR<GlobalData>("/api/global");

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Market Overview
      </Typography>
      {error && <ErrorState error={error} />}
      {isLoading && <Skeleton variant="rounded" height={80} />}
      {data && (
        <Grid container spacing={2}>
          <Stat label="Total market cap" value={usdCompact.format(data.total_market_cap.usd)} />
          <Stat
            label="24h market cap change"
            value={`${data.market_cap_change_percentage_24h_usd >= 0 ? "+" : ""}${pct.format(
              data.market_cap_change_percentage_24h_usd
            )}%`}
          />
          <Stat label="BTC dominance" value={`${pct.format(data.market_cap_percentage.btc)}%`} />
          <Stat label="ETH dominance" value={`${pct.format(data.market_cap_percentage.eth)}%`} />
        </Grid>
      )}
    </Paper>
  );
}
