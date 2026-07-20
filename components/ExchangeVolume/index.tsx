"use client";

import useSWR from "swr";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ErrorState from "@/components/ErrorState";
import type { Exchange } from "@/lib/types";

const btcCompact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export default function ExchangeVolume() {
  const { data, error, isLoading } = useSWR<Exchange[]>("/api/exchanges");
  const maxVolume = data ? Math.max(...data.map((e) => e.trade_volume_24h_btc)) : 0;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6">Exchange Volume</Typography>
        <Typography variant="caption" color="text.secondary">
          24h trade volume (BTC)
        </Typography>
      </Box>
      {error && <ErrorState error={error} />}
      {isLoading && <Skeleton variant="rounded" height={280} />}
      {data && (
        <Box>
          {data.map((exchange) => (
            <Box key={exchange.id} sx={{ py: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box component="img" src={exchange.image} alt="" width={20} height={20} />
                  <Typography variant="body2">{exchange.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  ₿{btcCompact.format(exchange.trade_volume_24h_btc)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={maxVolume > 0 ? (exchange.trade_volume_24h_btc / maxVolume) * 100 : 0}
                sx={{
                  mt: 0.5,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
