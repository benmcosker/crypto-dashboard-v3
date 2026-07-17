describe("period filter", () => {
  beforeEach(() => {
    cy.interceptDashboardApis();
    cy.visit("/");
    // Initial mount: one request per widget, using the default ?period=7.
    cy.wait(["@markets", "@global", "@chart", "@trending", "@exchanges"]);
  });

  it("re-fetches period-scoped widgets and updates the URL when a period is picked", () => {
    cy.get('[aria-label="Today"]').click();

    cy.url().should("include", "period=1");
    cy.get('[aria-label="Today"]').should("have.attr", "aria-pressed", "true");
    cy.get('[aria-label="Last week"]').should("have.attr", "aria-pressed", "false");

    // Live Prices and the price-history chart are period-scoped, so picking a
    // new period dequeues a second request on each of those aliases.
    cy.wait("@markets").its("request.url").should("include", "period=1");
    cy.wait("@chart").its("request.url").should("include", "period=1");

    // Snapshot-only widgets (global/trending/exchanges) have no period
    // dimension and shouldn't re-fetch just because the period changed.
    cy.get("@global.all").should("have.length", 1);
    cy.get("@trending.all").should("have.length", 1);
    cy.get("@exchanges.all").should("have.length", 1);
  });
});
