import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, jsonResponse } from "@/test/render";
import TrendingCoins from "./index";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("TrendingCoins", () => {
  it("renders each trending coin with its rank", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse([
          {
            id: "dogecoin",
            name: "Dogecoin",
            symbol: "doge",
            market_cap_rank: 10,
            thumb: "https://example.com/doge.png",
            price_btc: 0.0000015,
          },
        ])
      )
    );

    renderWithProviders(<TrendingCoins />);

    expect(await screen.findByText("Dogecoin")).toBeInTheDocument();
    expect(screen.getByText(/Rank #10/i)).toBeInTheDocument();
  });

  it("shows an error alert when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ error: "CoinGecko upstream error", code: "upstream_error", status: 502 }, { status: 502 })
      )
    );

    renderWithProviders(<TrendingCoins />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/upstream error/i);
  });
});
