describe("price-history coin selector", () => {
  beforeEach(() => {
    cy.interceptDashboardApis();
    cy.visit("/");
    cy.wait(["@markets", "@global", "@chart", "@trending", "@exchanges"]);
  });

  it("re-fetches the chart for the coin clicked in Live Prices and updates the URL", () => {
    cy.contains("BITCOIN").should("be.visible");

    cy.contains("tr", "Ethereum").click();

    cy.url().should("include", "coin=ethereum");
    cy.wait("@chart").its("request.url").should("include", "/api/chart/ethereum");
    cy.contains("ETHEREUM").should("be.visible");
  });
});
