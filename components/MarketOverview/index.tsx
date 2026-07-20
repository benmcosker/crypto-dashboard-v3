"use client";

import useSWR from "swr";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ErrorState from "@/components/ErrorState";
import type { GlobalData } from "@/lib/types";

const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});
const pct = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function Stat({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: number;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(99, 102, 241, 0.03)" }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {delta !== undefined && (
          <Typography
            variant="caption"
            sx={{ color: positive ? "success.main" : "error.main", fontWeight: 600 }}
          >
            {positive ? "▲" : "▼"} {positive ? "+" : ""}
            {pct.format(delta)}%
          </Typography>
        )}
      </Paper>
    </Grid>
  );
}

export default function MarketOverview() {
  const { data, error, isLoading } = useSWR<GlobalData>("/api/global");

  if (error) return <ErrorState error={error} />;
  if (isLoading) return <Skeleton variant="rounded" height={100} />;
  if (!data) return null;

  return (
    <Box>
      <Grid container spacing={2}>
        <Stat
          label="Total Market Cap"
          value={usdCompact.format(data.total_market_cap.usd)}
          delta={data.market_cap_change_percentage_24h_usd}
        />
        <Stat label="24h Volume" value={usdCompact.format(data.total_volume.usd)} />
        <Stat label="BTC Dominance" value={`${pct.format(data.market_cap_percentage.btc)}%`} />
        <Stat label="ETH Dominance" value={`${pct.format(data.market_cap_percentage.eth)}%`} />
      </Grid>
    </Box>
  );
}
