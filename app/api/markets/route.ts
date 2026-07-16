import type { NextRequest } from "next/server";
import { getMarkets } from "@/lib/data";
import { toErrorResponse } from "@/lib/apiError";
import { parsePeriod } from "@/lib/period";

export async function GET(request: NextRequest) {
  try {
    const period = parsePeriod(request.nextUrl.searchParams.get("period"));
    const coins = await getMarkets(period);
    return Response.json(coins);
  } catch (err) {
    return toErrorResponse(err);
  }
}
