import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, jsonResponse } from "@/test/render";
import MarketOverview from "./index";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MarketOverview", () => {
  it("renders market cap and dominance stats once loaded", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          total_market_cap: { usd: 2_500_000_000_000 },
          market_cap_percentage: { btc: 51.2, eth: 17.8 },
          market_cap_change_percentage_24h_usd: 1.23,
        })
      )
    );

    renderWithProviders(<MarketOverview />);

    expect(await screen.findByText(/BTC dominance/i)).toBeInTheDocument();
    expect(screen.getByText("51.2%")).toBeInTheDocument();
    expect(screen.getByText("17.8%")).toBeInTheDocument();
  });

  it("shows an error alert when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          { error: "Rate limit exceeded, please retry later", code: "rate_limited", status: 429 },
          { status: 429 }
        )
      )
    );

    renderWithProviders(<MarketOverview />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/rate limited/i);
  });
});
