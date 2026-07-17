import type { RouteHandler } from "cypress/types/net-stubbing";

type ApiName = "markets" | "global" | "chart" | "trending" | "exchanges";

const ROUTES: Record<ApiName, string> = {
  markets: "/api/markets*",
  global: "/api/global*",
  chart: "/api/chart/**",
  trending: "/api/trending*",
  exchanges: "/api/exchanges*",
};

const FIXTURES: Record<ApiName, string> = {
  markets: "markets.json",
  global: "global.json",
  chart: "chart.json",
  trending: "trending.json",
  exchanges: "exchanges.json",
};

/**
 * Stubs all five dashboard API routes with their default fixtures (aliased
 * as @markets/@global/@chart/@trending/@exchanges), so widgets render
 * deterministic data regardless of what the server-rendered fallback
 * contains. Pass `overrides` to replace one or more routes' intercept
 * options (e.g. a fixture 429 response) for error-state tests.
 */
Cypress.Commands.add(
  "interceptDashboardApis",
  (overrides: Partial<Record<ApiName, RouteHandler>> = {}) => {
    (Object.keys(ROUTES) as ApiName[]).forEach((name) => {
      const override = overrides[name];
      cy.intercept("GET", ROUTES[name], override ?? { fixture: FIXTURES[name] }).as(name);
    });
  }
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      interceptDashboardApis(overrides?: Partial<Record<ApiName, RouteHandler>>): Chainable<void>;
    }
  }
}

export {};
