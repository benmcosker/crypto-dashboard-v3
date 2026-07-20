// The page seeds its widgets with real, server-fetched data before the
// browser ever loads (see CLAUDE.md's SSR-fallback architecture note), so
// the very first paint may briefly show whatever the dev server's real
// CoinGecko key returned (or an error, if no key is configured). SWR always
// revalidates each key on mount regardless of that fallback, which re-fetches
// every `/api/*` route from the browser — the intercepts below stub that
// revalidation, so the assertions here are deterministic either way.

describe("dashboard", () => {
  beforeEach(() => {
    cy.interceptDashboardApis();
    cy.visit("/");
    cy.wait(["@markets", "@global", "@chart", "@trending", "@exchanges"]);
  });

  it("renders all five widgets with fixture data", () => {
    cy.contains("h1", "Crypto Dashboard").should("be.visible");

    cy.contains("Live Prices").should("be.visible");
    cy.contains("Bitcoin").should("be.visible");
    cy.contains("Ethereum").should("be.visible");
    cy.contains("$65,000.12").should("be.visible");

    cy.contains("BTC Dominance").should("be.visible");
    cy.contains("52.4%").should("be.visible");

    cy.contains("Price History").should("be.visible");

    cy.contains("Trending").should("be.visible");
    cy.contains("Pepe").should("be.visible");

    cy.contains("Exchange Volume").should("be.visible");
    cy.contains("Binance").should("be.visible");
  });

  it("shows the time-period filter with all four options", () => {
    ["Today", "Last week", "Last month", "Last quarter"].forEach((label) => {
      cy.get(`[aria-label="${label}"]`).should("be.visible");
    });
    // Defaults to 7 days ("Last week") when no ?period= is in the URL.
    cy.get('[aria-label="Last week"]').should("have.attr", "aria-pressed", "true");
  });
});
