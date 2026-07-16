import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearCache } from "@/lib/cache";

const cgFetch = vi.fn();
vi.mock("@/lib/coingecko", () => ({ cgFetch: (...args: unknown[]) => cgFetch(...args) }));

import { GET } from "./route";

beforeEach(() => {
  cgFetch.mockReset();
  clearCache();
});

describe("GET /api/exchanges", () => {
  it("returns the upstream exchange list", async () => {
    const exchanges = [
      {
        id: "binance",
        name: "Binance",
        image: "https://example.com/binance.png",
        trust_score: 10,
        trade_volume_24h_btc: 500000,
      },
    ];
    cgFetch.mockResolvedValueOnce(exchanges);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(exchanges);
    expect(cgFetch).toHaveBeenCalledWith("/exchanges", { per_page: 20, page: 1 });
  });
});
