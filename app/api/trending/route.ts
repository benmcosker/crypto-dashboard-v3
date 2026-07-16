import { getTrending } from "@/lib/data";
import { toErrorResponse } from "@/lib/apiError";

export async function GET() {
  try {
    const coins = await getTrending();
    return Response.json(coins);
  } catch (err) {
    return toErrorResponse(err);
  }
}
