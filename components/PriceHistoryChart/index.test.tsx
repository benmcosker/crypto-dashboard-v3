import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, jsonResponse } from "@/test/render";
import PriceHistoryChart from "./index";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PriceHistoryChart", () => {
  it("fetches the chart for the coin and period reflected in the URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        prices: [
          [1700000000000, 60000],
          [1700003600000, 61000],
        ],
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<PriceHistoryChart />, "?coin=ethereum&period=30");

    await screen.findByText("Price History");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/chart/ethereum?period=30")
    );
  });

  it("shows an error alert when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ error: "Resource not found", code: "not_found", status: 404 }, { status: 404 })
      )
    );

    renderWithProviders(<PriceHistoryChart />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/resource not found/i);
  });
});
