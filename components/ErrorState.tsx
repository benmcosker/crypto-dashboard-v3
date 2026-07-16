import Alert from "@mui/material/Alert";
import { FetchError } from "@/lib/fetcher";

export default function ErrorState({ error }: { error: unknown }) {
  if (error instanceof FetchError) {
    if (error.status === 429) {
      return (
        <Alert severity="warning">
          Rate limited by CoinGecko
          {error.retryAfter ? ` — retry in ${error.retryAfter}s` : ""}.
        </Alert>
      );
    }
    return <Alert severity="error">{error.info.error}</Alert>;
  }
  return <Alert severity="error">Something went wrong loading this widget.</Alert>;
}
