import type { NextRequest } from "next/server";
import { cgFetch } from "@/lib/coingecko";
import { getOrSet } from "@/lib/cache";
import { badRequest, toErrorResponse } from "@/lib/apiError";
import { parsePeriod } from "@/lib/period";
import type { ChartData } from "@/lib/types";

const COIN_ID_RE = /^[a-z0-9-]+$/;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!COIN_ID_RE.test(id)) {
      throw badRequest(`Invalid coin id: ${id}`);
    }

    const period = parsePeriod(request.nextUrl.searchParams.get("period"));

    const data = await getOrSet(`chart:${id}:${period}`, () =>
      cgFetch<ChartData>(`/coins/${id}/market_chart`, {
        vs_currency: "usd",
        days: period,
      })
    );

    return Response.json({ prices: data.prices });
  } catch (err) {
    return toErrorResponse(err);
  }
}
