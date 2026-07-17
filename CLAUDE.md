# Crypto Dashboard (v2)

A crypto market dashboard with a **NextJS** backend and an
**NextJS + Material UI** frontend, powered by the live
[CoinGecko API](https://docs.coingecko.com/). Successor to the React/Go v1.

The dashboard shows five metrics, filterable by time period (Today / Last week / Last month / Last quarter):

| # | Metric | CoinGecko endpoint | Backend route |
|---|--------|--------------------|---------------|
| 1 | Live price + change + 7d sparkline | `/coins/markets` | `/api/markets` |
| 2 | Market cap & BTC/ETH dominance | `/global` | `/api/global` |
| 3 | Price-history chart | `/coins/{id}/market_chart` | `/api/chart/{id}?period=` |
| 4 | Trending coins | `/search/trending` | `/api/trending` |
| 5 | Exchange volume | `/exchanges` | `/api/exchanges` |

## Architecture

```
Browser (NextJS/Material) ──/api──▶ NextJS ──x-cg-demo-api-key──▶ CoinGecko
```

The NextJS app **never** calls CoinGecko directly — the API key stays
server-side in the NextJS backend, which also caches upstream responses
(60s TTL) to stay within the CoinGecko demo-plan rate limits. Errors are mapped
to a consistent `{error, code, status}` JSON shape (429 rate-limit + `Retry-After`,
404, 502/504, 400 for invalid input); raw upstream detail is logged, never forwarded.

The `/api/*` route handlers and the dashboard page (`app/page.tsx`) both call
the same server-only functions in `lib/data.ts` (which sit on top of the 60s
cache), rather than the page fetching its own `/api/*` routes over HTTP.
`app/page.tsx` reads `?period=`/`?coin=` from `searchParams` on the server,
fetches matching data there, and seeds it into a per-page `SWRConfig`
`fallback` map so the initial HTML has real content instead of loading
skeletons — the client's first `useSWR` call for the same key reuses that
seed instead of re-fetching. This opts `/` into dynamic (per-request)
rendering instead of static prerendering, since the seeded data depends on
the request's query string. Each server-side fetch is independent
(`Promise.allSettled`): if one upstream call fails, that widget just falls
back to its normal client-side fetch and error state instead of failing the
whole page.

### Time-period filter
`Today → 1 day`, `Last week → 7`, `Last month → 30`, `Last quarter → 90`.
- The **price-history chart** (metric 3) uses the full day range.
- The **Live Prices** % column uses CoinGecko's native change windows
  (24h / 7d / 30d). Quarter has no native window, so it shows the 30d change
  while the chart still renders the full 90 days.
- `/global`, `/search/trending`, `/exchanges` are live snapshots with no
  historical dimension, so those three widgets stay current regardless of period.

## Layout

Single Next.js App Router project — no separate frontend/backend apps:

```
app/
  layout.tsx          # MUI ThemeProvider, SWRConfig, NuqsAdapter
  page.tsx            # dashboard page, renders the 5 widgets in a Grid
  api/
    markets/route.ts
    global/route.ts
    chart/[id]/route.ts
    trending/route.ts
    exchanges/route.ts
components/           # PeriodFilter + one directory per widget (metrics 1-5)
lib/                  # cache.ts, apiError.ts, coingecko.ts, period.ts, fetcher.ts, types.ts
theme/theme.ts
```

The dashboard's period (`?period=1|7|30|90`) and the price-history chart's
selected coin (`?coin=`) are kept in the URL via `nuqs`, so any chart view is
shareable/bookmarkable.

## Configuration

Copy `.env.local.example` to `.env.local` and set `COINGECKO_API_KEY` to a
CoinGecko demo-plan API key. `.env.local` is gitignored — never commit it.

## Running locally

```
npm install
npm run dev
```

## Testing

Vitest + React Testing Library (`npm run test`). Route handlers are tested by
mocking `lib/coingecko.ts`'s `cgFetch`; widgets are tested by stubbing
`global.fetch` and rendering through the `renderWithProviders` helper in
`test/render.tsx` (wraps `SWRConfig` + nuqs's `NuqsTestingAdapter`).

### End-to-end (Cypress)

`npm run e2e` boots `next dev`, waits for it to be reachable, then runs the
specs in `cypress/e2e/` headlessly (`npm run e2e:open` for the interactive
runner; `npm run cy:run`/`cy:run` assume the server is already running).

Every spec calls `cy.interceptDashboardApis()` (defined in
`cypress/support/commands.ts`) before `cy.visit("/")`, which stubs all five
`/api/*` routes with fixtures from `cypress/fixtures/`. This sidesteps the
SSR-fallback architecture described above: the server-rendered first paint
still fetches real data from CoinGecko (or errors, if no key is configured)
before Cypress ever sees the page, but SWR always revalidates every key on
mount regardless of the seeded fallback, so the browser re-fetches each
`/api/*` route immediately — right into the stubs. Assertions target that
converged, deterministic state rather than the transient SSR content, so
specs don't need a real `COINGECKO_API_KEY` to pass. Pass per-route overrides
to `interceptDashboardApis({ markets: { statusCode: 429, ... } })` to test
error states (see `cypress/e2e/error-states.cy.ts`).

## Build (production)

```
npm run build
npm run start
```

