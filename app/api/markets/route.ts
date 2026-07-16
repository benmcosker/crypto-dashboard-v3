import type { NextRequest } from "next/server";
import { cgFetch } from "@/lib/coingecko";
import { getOrSet } from "@/lib/cache";
import { toErrorResponse } from "@/lib/apiError";
import { parsePeriod, changeWindowForPeriod } from "@/lib/period";
import type { MarketCoin } from "@/lib/types";

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

export async function GET(request: NextRequest) {
  try {
    const period = parsePeriod(request.nextUrl.searchParams.get("period"));
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
    const coins: MarketCoin[] = data.map((c) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      image: c.image,
      current_price: c.current_price,
      price_change_percentage: c[changeKey] ?? null,
      sparkline_in_7d: c.sparkline_in_7d,
    }));

    return Response.json(coins);
  } catch (err) {
    return toErrorResponse(err);
  }
}
