import type { NextRequest } from "next/server";
import { getChart } from "@/lib/data";
import { toErrorResponse } from "@/lib/apiError";
import { parsePeriod } from "@/lib/period";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const period = parsePeriod(request.nextUrl.searchParams.get("period"));
    const data = await getChart(id, period);
    return Response.json(data);
  } catch (err) {
    return toErrorResponse(err);
  }
}
