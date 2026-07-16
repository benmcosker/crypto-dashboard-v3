import { getExchanges } from "@/lib/data";
import { toErrorResponse } from "@/lib/apiError";

export async function GET() {
  try {
    const exchanges = await getExchanges();
    return Response.json(exchanges);
  } catch (err) {
    return toErrorResponse(err);
  }
}
