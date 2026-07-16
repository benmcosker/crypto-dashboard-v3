import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/apiError";
import { clearCache } from "@/lib/cache";

const cgFetch = vi.fn();
vi.mock("@/lib/coingecko", () => ({ cgFetch: (...args: unknown[]) => cgFetch(...args) }));

import { GET } from "./route";

beforeEach(() => {
  cgFetch.mockReset();
  clearCache();
});

describe("GET /api/global", () => {
  it("unwraps the upstream {data} envelope", async () => {
    const globalData = {
      active_cryptocurrencies: 100,
      total_market_cap: { usd: 1_000_000 },
      market_cap_percentage: { btc: 50, eth: 20 },
      market_cap_change_percentage_24h_usd: 1.5,
    };
    cgFetch.mockResolvedValueOnce({ data: globalData });

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(globalData);
    expect(cgFetch).toHaveBeenCalledWith("/global");
  });

  it("returns the {error, code, status} shape when upstream fails", async () => {
    cgFetch.mockRejectedValueOnce(new ApiError(502, "upstream_error", "CoinGecko upstream error"));
    const res = await GET();
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({
      error: "CoinGecko upstream error",
      code: "upstream_error",
      status: 502,
    });
  });
});
