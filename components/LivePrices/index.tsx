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
import { useSelectedCoin } from "@/components/PriceHistoryChart";
import ErrorState from "@/components/ErrorState";
import { parseCoin } from "@/lib/coins";
import { changeWindowForPeriod, parsePeriod } from "@/lib/period";
import type { MarketCoin } from "@/lib/types";

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const pctFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export default function LivePrices() {
  const [rawPeriod] = usePeriod();
  const period = parsePeriod(String(rawPeriod));
  const [rawCoin, setCoin] = useSelectedCoin();
  const selectedCoin = parseCoin(rawCoin);
  const { data, error, isLoading } = useSWR<MarketCoin[]>(`/api/markets?period=${period}`);
  const changeWindow = changeWindowForPeriod(period);

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6">Live Prices</Typography>
        <Typography variant="caption" color="text.secondary">
          Top coins · {changeWindow} change · click a row to chart it
        </Typography>
      </Box>
      {error && <ErrorState error={error} />}
      {isLoading && <Skeleton variant="rounded" height={280} />}
      {data && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Coin</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">{changeWindow} %</TableCell>
                <TableCell align="right">7d</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((coin) => {
                const change = coin.price_change_percentage;
                const positive = (change ?? 0) >= 0;
                const selected = coin.id === selectedCoin;
                return (
                  <TableRow
                    key={coin.id}
                    onClick={() => setCoin(coin.id)}
                    selected={selected}
                    sx={{
                      cursor: "pointer",
                      "&.MuiTableRow-root:hover": { bgcolor: "action.hover" },
                      "&.Mui-selected, &.Mui-selected:hover": {
                        bgcolor: "rgba(99, 102, 241, 0.08)",
                      },
                    }}
                  >
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
                          <Typography variant="body2" sx={{ fontWeight: selected ? 700 : 400 }}>
                            {coin.name}
                          </Typography>
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
