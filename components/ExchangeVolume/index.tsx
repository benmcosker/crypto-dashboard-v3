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
import ErrorState from "@/components/ErrorState";
import type { Exchange } from "@/lib/types";

const btcFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export default function ExchangeVolume() {
  const { data, error, isLoading } = useSWR<Exchange[]>("/api/exchanges");

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Exchange Volume
      </Typography>
      {error && <ErrorState error={error} />}
      {isLoading && <Skeleton variant="rounded" height={280} />}
      {data && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Exchange</TableCell>
                <TableCell align="right">24h Volume (BTC)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((exchange) => (
                <TableRow key={exchange.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box component="img" src={exchange.image} alt="" width={20} height={20} />
                      <Typography variant="body2">{exchange.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{btcFormatter.format(exchange.trade_volume_24h_btc)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
