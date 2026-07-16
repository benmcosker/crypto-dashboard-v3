import { cgFetch } from "@/lib/coingecko";
import { getOrSet } from "@/lib/cache";
import { toErrorResponse } from "@/lib/apiError";
import type { Exchange } from "@/lib/types";

export async function GET() {
  try {
    const data = await getOrSet("exchanges", () =>
      cgFetch<Exchange[]>("/exchanges", { per_page: 20, page: 1 })
    );
    return Response.json(data);
  } catch (err) {
    return toErrorResponse(err);
  }
}
