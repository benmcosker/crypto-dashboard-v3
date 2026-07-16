import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { SWRConfig } from "swr";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { fetcher } from "@/lib/fetcher";

export function renderWithProviders(ui: ReactElement, searchParams?: string) {
  const NuqsWrapper = withNuqsTestingAdapter({ searchParams });
  return render(ui, {
    wrapper: ({ children }) => (
      <SWRConfig value={{ provider: () => new Map(), fetcher, dedupingInterval: 0 }}>
        <NuqsWrapper>{children}</NuqsWrapper>
      </SWRConfig>
    ),
  });
}

export function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}
