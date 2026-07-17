describe("price-history coin selector", () => {
  beforeEach(() => {
    cy.interceptDashboardApis();
    cy.visit("/");
    cy.wait(["@markets", "@global", "@chart", "@trending", "@exchanges"]);
  });

  it("re-fetches the chart for the selected coin and updates the URL", () => {
    cy.get('[role="combobox"]').contains("Bitcoin").should("be.visible");

    cy.get('[role="combobox"]').click();
    cy.get('[role="option"]').contains("Ethereum").click();

    cy.url().should("include", "coin=ethereum");
    cy.wait("@chart").its("request.url").should("include", "/api/chart/ethereum");
  });
});
