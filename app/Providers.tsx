"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SWRConfig } from "swr";
import theme from "@/theme/theme";
import { fetcher } from "@/lib/fetcher";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <NuqsAdapter>
          <SWRConfig value={{ fetcher, refreshInterval: 60_000 }}>{children}</SWRConfig>
        </NuqsAdapter>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
