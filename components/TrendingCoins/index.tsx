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
import ErrorState from "@/components/ErrorState";
import type { TrendingCoin } from "@/lib/types";

export default function TrendingCoins() {
  const { data, error, isLoading } = useSWR<TrendingCoin[]>("/api/trending");

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Trending Coins
      </Typography>
      {error && <ErrorState error={error} />}
      {isLoading && <Skeleton variant="rounded" height={280} />}
      {data && (
        <List dense>
          {data.map((coin) => (
            <ListItem key={coin.id} disableGutters>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar src={coin.thumb} alt="" sx={{ width: 24, height: 24 }} />
              </ListItemAvatar>
              <ListItemText
                primary={coin.name}
                secondary={`${coin.symbol.toUpperCase()}${
                  coin.market_cap_rank ? ` · Rank #${coin.market_cap_rank}` : ""
                }`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
