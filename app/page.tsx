import { Suspense } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoinOutlined";
import { SWRConfig } from "swr";
import PeriodFilter from "@/components/PeriodFilter";
import LivePrices from "@/components/LivePrices";
import MarketOverview from "@/components/MarketOverview";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import TrendingCoins from "@/components/TrendingCoins";
import ExchangeVolume from "@/components/ExchangeVolume";
import { getChart, getExchanges, getGlobalData, getMarkets, getTrending } from "@/lib/data";
import { parseCoin } from "@/lib/coins";
import { parsePeriod } from "@/lib/period";

type SearchParams = { [key: string]: string | string[] | undefined };

function firstValue(value: string | string[] | undefined): string | null {
  return (Array.isArray(value) ? value[0] : value) ?? null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const period = parsePeriod(firstValue(params.period));
  const coin = parseCoin(firstValue(params.coin));

  // Seed SWR's fallback with data fetched here on the server, so the initial
  // HTML has real content instead of loading skeletons. Fetches are
  // best-effort (allSettled): if one upstream call fails, its key is simply
  // left out of the fallback and the corresponding widget falls back to its
  // normal client-side fetch (and its own error state) instead of failing
  // the whole page.
  const [marketsR, globalR, chartR, trendingR, exchangesR] = await Promise.allSettled([
    getMarkets(period),
    getGlobalData(),
    getChart(coin, period),
    getTrending(),
    getExchanges(),
  ]);

  const fallback: Record<string, unknown> = {};
  if (marketsR.status === "fulfilled") fallback[`/api/markets?period=${period}`] = marketsR.value;
  if (globalR.status === "fulfilled") fallback["/api/global"] = globalR.value;
  if (chartR.status === "fulfilled") fallback[`/api/chart/${coin}?period=${period}`] = chartR.value;
  if (trendingR.status === "fulfilled") fallback["/api/trending"] = trendingR.value;
  if (exchangesR.status === "fulfilled") fallback["/api/exchanges"] = exchangesR.value;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Suspense fallback={<Skeleton variant="rounded" height={600} />}>
        <SWRConfig value={{ fallback }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: { xs: 2, sm: 0 },
              mb: 3,
              px: 3,
              py: 2,
              borderRadius: 2,
              background:
                "linear-gradient(90deg, var(--mui-palette-primary-dark) 0%, var(--mui-palette-primary-light) 100%)",
              color: "primary.contrastText",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CurrencyBitcoinIcon sx={{ color: "primary.contrastText", fontSize: 32 }} />
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                Crypto Dashboard
              </Typography>
            </Box>
            <PeriodFilter />
          </Box>

          <Grid container spacing={3}>
            <Grid size={12}>
              <MarketOverview />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <PriceHistoryChart />
                <LivePrices />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <TrendingCoins />
                <ExchangeVolume />
              </Stack>
            </Grid>
          </Grid>
        </SWRConfig>
      </Suspense>
    </Container>
  );
}
