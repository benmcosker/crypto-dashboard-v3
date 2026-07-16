import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearCache } from "@/lib/cache";

const cgFetch = vi.fn();
vi.mock("@/lib/coingecko", () => ({ cgFetch: (...args: unknown[]) => cgFetch(...args) }));

import { GET } from "./route";

beforeEach(() => {
  cgFetch.mockReset();
  clearCache();
});

describe("GET /api/trending", () => {
  it("flattens the upstream {coins: [{item}]} shape to TrendingCoin[]", async () => {
    cgFetch.mockResolvedValueOnce({
      coins: [
        {
          item: {
            id: "dogecoin",
            name: "Dogecoin",
            symbol: "doge",
            market_cap_rank: 10,
            thumb: "https://example.com/doge.png",
            price_btc: 0.0000015,
          },
        },
      ],
    });

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      {
        id: "dogecoin",
        name: "Dogecoin",
        symbol: "doge",
        market_cap_rank: 10,
        thumb: "https://example.com/doge.png",
        price_btc: 0.0000015,
      },
    ]);
  });
});
