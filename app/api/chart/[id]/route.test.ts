import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { clearCache } from "@/lib/cache";

const cgFetch = vi.fn();
vi.mock("@/lib/coingecko", () => ({ cgFetch: (...args: unknown[]) => cgFetch(...args) }));

import { GET } from "./route";

beforeEach(() => {
  cgFetch.mockReset();
  clearCache();
});

describe("GET /api/chart/[id]", () => {
  it("passes the coin id and period days through to CoinGecko", async () => {
    cgFetch.mockResolvedValueOnce({ prices: [[1700000000000, 65000]] });

    const req = new NextRequest("http://localhost/api/chart/bitcoin?period=90");
    const res = await GET(req, { params: Promise.resolve({ id: "bitcoin" }) });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ prices: [[1700000000000, 65000]] });
    expect(cgFetch).toHaveBeenCalledWith(
      "/coins/bitcoin/market_chart",
      expect.objectContaining({ days: 90 })
    );
  });

  it("rejects a coin id containing invalid characters with a 400", async () => {
    const req = new NextRequest("http://localhost/api/chart/../../etc?period=7");
    const res = await GET(req, { params: Promise.resolve({ id: "../../etc" }) });

    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("bad_request");
    expect(cgFetch).not.toHaveBeenCalled();
  });
});
