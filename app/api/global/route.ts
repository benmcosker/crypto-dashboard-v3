import { getGlobalData } from "@/lib/data";
import { toErrorResponse } from "@/lib/apiError";

export async function GET() {
  try {
    const data = await getGlobalData();
    return Response.json(data);
  } catch (err) {
    return toErrorResponse(err);
  }
}
