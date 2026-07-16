import { Suspense } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import PeriodFilter from "@/components/PeriodFilter";
import LivePrices from "@/components/LivePrices";
import MarketOverview from "@/components/MarketOverview";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import TrendingCoins from "@/components/TrendingCoins";
import ExchangeVolume from "@/components/ExchangeVolume";

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Suspense fallback={<Skeleton variant="rounded" height={600} />}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Crypto Dashboard
          </Typography>
          <PeriodFilter />
        </Box>

        <Grid container spacing={3}>
          <Grid size={12}>
            <MarketOverview />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <LivePrices />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <PriceHistoryChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TrendingCoins />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ExchangeVolume />
          </Grid>
        </Grid>
      </Suspense>
    </Container>
  );
}
