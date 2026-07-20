"use client";

import useSWR from "swr";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ErrorState from "@/components/ErrorState";
import type { TrendingCoin } from "@/lib/types";

const pctFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export default function TrendingCoins() {
  const { data, error, isLoading } = useSWR<TrendingCoin[]>("/api/trending");

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h6">Trending</Typography>
          <Typography variant="caption" color="text.secondary">
            Most searched right now
          </Typography>
        </Box>
        <WhatshotIcon sx={{ color: "warning.main" }} />
      </Box>
      {error && <ErrorState error={error} />}
      {isLoading && <Skeleton variant="rounded" height={280} />}
      {data && (
        <List dense disablePadding>
          {data.map((coin, index) => {
            const change = coin.price_change_percentage_24h;
            const positive = (change ?? 0) >= 0;
            return (
              <ListItem key={coin.id} disableGutters>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 20, flexShrink: 0 }}
                >
                  {index + 1}
                </Typography>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar src={coin.thumb} alt="" sx={{ width: 24, height: 24 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={coin.name}
                  secondary={coin.symbol.toUpperCase()}
                  slotProps={{ primary: { variant: "body2", sx: { fontWeight: 600 } } }}
                />
                {change !== null && (
                  <Typography
                    variant="body2"
                    sx={{ color: positive ? "success.main" : "error.main", fontWeight: 600 }}
                  >
                    {positive ? "▲" : "▼"} {positive ? "+" : ""}
                    {pctFormatter.format(change)}%
                  </Typography>
                )}
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
}
