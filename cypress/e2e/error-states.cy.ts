describe("widget error states", () => {
  it("shows a rate-limit alert when CoinGecko returns 429", () => {
    cy.interceptDashboardApis({
      markets: {
        statusCode: 429,
        headers: { "Retry-After": "42" },
        body: { error: "Rate limit exceeded, please retry later", code: "rate_limited", status: 429 },
      },
    });
    cy.visit("/");
    cy.wait(["@markets", "@global", "@chart", "@trending", "@exchanges"]);

    cy.contains("Rate limited by CoinGecko").should("be.visible");
    cy.contains("retry in 42s").should("be.visible");
  });

  it("shows a generic error alert on upstream failure", () => {
    cy.interceptDashboardApis({
      trending: {
        statusCode: 502,
        body: { error: "CoinGecko upstream error", code: "upstream_error", status: 502 },
      },
    });
    cy.visit("/");
    cy.wait(["@markets", "@global", "@chart", "@trending", "@exchanges"]);

    cy.contains("Trending")
      .parents(".MuiPaper-root")
      .within(() => {
        cy.contains("CoinGecko upstream error").should("be.visible");
      });
  });
});
