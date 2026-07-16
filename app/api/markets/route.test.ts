import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { ApiError } from "@/lib/apiError";
import { clearCache } from "@/lib/cache";

const cgFetch = vi.fn();
vi.mock("@/lib/coingecko", () => ({ cgFetch: (...args: unknown[]) => cgFetch(...args) }));

import { GET } from "./route";

beforeEach(() => {
  cgFetch.mockReset();
  clearCache();
});

describe("GET /api/markets", () => {
  it("shapes upstream data down to MarketCoin fields for the requested period", async () => {
    cgFetch.mockResolvedValueOnce([
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://example.com/btc.png",
        current_price: 65000,
        price_change_percentage_7d_in_currency: 3.2,
        sparkline_in_7d: { price: [1, 2, 3] },
      },
    ]);

    const req = new NextRequest("http://localhost/api/markets?period=7");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://example.com/btc.png",
        current_price: 65000,
        price_change_percentage: 3.2,
        sparkline_in_7d: { price: [1, 2, 3] },
      },
    ]);
    expect(cgFetch).toHaveBeenCalledWith(
      "/coins/markets",
      expect.objectContaining({ price_change_percentage: "7d" })
    );
  });

  it("falls back to the default period for an invalid period value", async () => {
    cgFetch.mockResolvedValueOnce([]);
    const req = new NextRequest("http://localhost/api/markets?period=nonsense");
    await GET(req);
    expect(cgFetch).toHaveBeenCalledWith(
      "/coins/markets",
      expect.objectContaining({ price_change_percentage: "7d" })
    );
  });

  it("returns the {error, code, status} shape when upstream fails", async () => {
    cgFetch.mockRejectedValueOnce(new ApiError(429, "rate_limited", "Rate limit exceeded", 30));
    const req = new NextRequest("http://localhost/api/markets");
    const res = await GET(req);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("30");
    expect(await res.json()).toEqual({
      error: "Rate limit exceeded",
      code: "rate_limited",
      status: 429,
    });
  });
});
