import { cgFetch } from "./coingecko";
import { getOrSet } from "./cache";
import { badRequest } from "./apiError";
import { changeWindowForPeriod, type PeriodDays } from "./period";
import type { ChartData, Exchange, GlobalData, MarketCoin, TrendingCoin } from "./types";

/**
 * Shared server-side data access, called both by the `/api/*` route
 * handlers (for client-side SWR revalidation) and directly by Server
 * Components (to seed SWR's initial fallback data). Both paths share the
 * same in-memory TTL cache.
 */

type UpstreamMarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  price_change_percentage_30d_in_currency?: number | null;
  sparkline_in_7d?: { price: number[] };
};

export async function getMarkets(period: PeriodDays): Promise<MarketCoin[]> {
  const changeWindow = changeWindowForPeriod(period);

  const data = await getOrSet(`markets:${changeWindow}`, () =>
    cgFetch<UpstreamMarketCoin[]>("/coins/markets", {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 20,
      page: 1,
      sparkline: true,
      price_change_percentage: changeWindow,
    })
  );

  const changeKey = `price_change_percentage_${changeWindow}_in_currency` as const;
  return data.map((c) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    image: c.image,
    current_price: c.current_price,
    price_change_percentage: c[changeKey] ?? null,
    sparkline_in_7d: c.sparkline_in_7d,
  }));
}

type UpstreamGlobal = { data: GlobalData };

export async function getGlobalData(): Promise<GlobalData> {
  const { data } = await getOrSet("global", () => cgFetch<UpstreamGlobal>("/global"));
  return data;
}

const COIN_ID_RE = /^[a-z0-9-]+$/;

export async function getChart(id: string, period: PeriodDays): Promise<ChartData> {
  if (!COIN_ID_RE.test(id)) {
    throw badRequest(`Invalid coin id: ${id}`);
  }

  const data = await getOrSet(`chart:${id}:${period}`, () =>
    cgFetch<ChartData>(`/coins/${id}/market_chart`, {
      vs_currency: "usd",
      days: period,
    })
  );

  return { prices: data.prices };
}

type UpstreamTrending = {
  coins: {
    item: {
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: number | null;
      thumb: string;
      price_btc: number;
    };
  }[];
};

export async function getTrending(): Promise<TrendingCoin[]> {
  const data = await getOrSet("trending", () => cgFetch<UpstreamTrending>("/search/trending"));
  return data.coins.map(({ item }) => ({
    id: item.id,
    name: item.name,
    symbol: item.symbol,
    market_cap_rank: item.market_cap_rank,
    thumb: item.thumb,
    price_btc: item.price_btc,
  }));
}

export async function getExchanges(): Promise<Exchange[]> {
  return getOrSet("exchanges", () => cgFetch<Exchange[]>("/exchanges", { per_page: 20, page: 1 }));
}
