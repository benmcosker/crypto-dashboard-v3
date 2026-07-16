"use client";

import useSWR from "swr";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { usePeriod } from "@/components/PeriodFilter";
import ErrorState from "@/components/ErrorState";
import type { MarketCoin } from "@/lib/types";

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const pctFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export default function LivePrices() {
  const [period] = usePeriod();
  const { data, error, isLoading } = useSWR<MarketCoin[]>(`/api/markets?period=${period}`);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Live Prices
      </Typography>
      {error && <ErrorState error={error} />}
      {isLoading && <Skeleton variant="rounded" height={280} />}
      {data && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Coin</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Change</TableCell>
                <TableCell align="right">7d</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((coin) => {
                const change = coin.price_change_percentage;
                const positive = (change ?? 0) >= 0;
                return (
                  <TableRow key={coin.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          component="img"
                          src={coin.image}
                          alt=""
                          width={20}
                          height={20}
                        />
                        <Box>
                          <Typography variant="body2">{coin.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {coin.symbol.toUpperCase()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{priceFormatter.format(coin.current_price)}</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: change === null ? "text.secondary" : positive ? "success.main" : "error.main" }}
                    >
                      {change === null ? "—" : `${positive ? "+" : ""}${pctFormatter.format(change)}%`}
                    </TableCell>
                    <TableCell align="right" sx={{ width: 100 }}>
                      {coin.sparkline_in_7d && (
                        <SparkLineChart
                          data={coin.sparkline_in_7d.price}
                          height={32}
                          width={90}
                          color={positive ? "#2e7d32" : "#d32f2f"}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
