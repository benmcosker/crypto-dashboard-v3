import { ApiError } from "./apiError";

const BASE_URL = "https://api.coingecko.com/api/v3";

/**
 * Server-only fetch wrapper for the CoinGecko API. Attaches the demo API key
 * header and maps upstream failures to ApiError. Never expose this to the
 * client — it reads process.env.COINGECKO_API_KEY.
 */
export async function cgFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const apiKey = process.env.COINGECKO_API_KEY;
  const headers: HeadersInit = apiKey ? { "x-cg-demo-api-key": apiKey } : {};

  let res: Response;
  try {
    res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    throw new ApiError(
      timedOut ? 504 : 502,
      timedOut ? "upstream_timeout" : "upstream_unreachable",
      "Failed to reach CoinGecko"
    );
  }

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("Retry-After")) || 60;
    throw new ApiError(429, "rate_limited", "Rate limit exceeded, please retry later", retryAfter);
  }

  if (res.status === 404) {
    const detail = await res.text().catch(() => "");
    console.error("[coingecko] 404:", url.toString(), detail);
    throw new ApiError(404, "not_found", "Resource not found");
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`[coingecko] upstream ${res.status}:`, url.toString(), detail);
    throw new ApiError(502, "upstream_error", "CoinGecko upstream error");
  }

  return res.json() as Promise<T>;
}
