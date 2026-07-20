import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, jsonResponse } from "@/test/render";
import ExchangeVolume from "./index";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ExchangeVolume", () => {
  it("renders each exchange with its 24h volume", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse([
          {
            id: "binance",
            name: "Binance",
            image: "https://example.com/binance.png",
            trust_score: 10,
            trade_volume_24h_btc: 500000,
          },
        ])
      )
    );

    renderWithProviders(<ExchangeVolume />);

    expect(await screen.findByText("Binance")).toBeInTheDocument();
    expect(screen.getByText("₿500K")).toBeInTheDocument();
  });

  it("shows an error alert when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ error: "CoinGecko upstream error", code: "upstream_error", status: 502 }, { status: 502 })
      )
    );

    renderWithProviders(<ExchangeVolume />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/upstream error/i);
  });
});
