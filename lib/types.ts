export type ApiErrorBody = {
  error: string;
  code: string;
  status: number;
};

export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage: number | null;
  sparkline_in_7d: { price: number[] } | undefined;
};

export type GlobalData = {
  active_cryptocurrencies: number;
  total_market_cap: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
};

export type ChartData = {
  prices: [number, number][];
};

export type TrendingCoin = {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  price_btc: number;
};

export type Exchange = {
  id: string;
  name: string;
  image: string;
  trust_score: number | null;
  trade_volume_24h_btc: number;
};
