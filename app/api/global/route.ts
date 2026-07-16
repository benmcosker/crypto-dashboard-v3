import { cgFetch } from "@/lib/coingecko";
import { getOrSet } from "@/lib/cache";
import { toErrorResponse } from "@/lib/apiError";
import type { GlobalData } from "@/lib/types";

type UpstreamGlobal = { data: GlobalData };

export async function GET() {
  try {
    const { data } = await getOrSet("global", () => cgFetch<UpstreamGlobal>("/global"));
    return Response.json(data);
  } catch (err) {
    return toErrorResponse(err);
  }
}
