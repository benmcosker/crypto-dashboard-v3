import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, jsonResponse } from "@/test/render";
import LivePrices from "./index";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LivePrices", () => {
  it("renders a row per coin with price and change", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse([
          {
            id: "bitcoin",
            symbol: "btc",
            name: "Bitcoin",
            image: "https://example.com/btc.png",
            current_price: 65000,
            price_change_percentage: 3.21,
            sparkline_in_7d: { price: [1, 2, 3] },
          },
        ])
      )
    );

    renderWithProviders(<LivePrices />, "?period=7");

    expect(await screen.findByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("$65,000.00")).toBeInTheDocument();
    expect(screen.getByText("+3.21%")).toBeInTheDocument();
  });

  it("shows an error alert when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ error: "CoinGecko upstream error", code: "upstream_error", status: 502 }, { status: 502 })
      )
    );

    renderWithProviders(<LivePrices />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/upstream error/i);
  });
});
