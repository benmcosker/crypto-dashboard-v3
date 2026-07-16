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

## Build (production)

```
npm run build
npm run start
```

