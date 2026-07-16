import { cgFetch } from "@/lib/coingecko";
import { getOrSet } from "@/lib/cache";
import { toErrorResponse } from "@/lib/apiError";
import type { TrendingCoin } from "@/lib/types";

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

export async function GET() {
  try {
    const data = await getOrSet("trending", () => cgFetch<UpstreamTrending>("/search/trending"));
    const coins: TrendingCoin[] = data.coins.map(({ item }) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      market_cap_rank: item.market_cap_rank,
      thumb: item.thumb,
      price_btc: item.price_btc,
    }));
    return Response.json(coins);
  } catch (err) {
    return toErrorResponse(err);
  }
}
