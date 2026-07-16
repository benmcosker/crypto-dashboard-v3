import type { ApiErrorBody } from "./types";

export class FetchError extends Error {
  info: ApiErrorBody;
  status: number;
  retryAfter?: number;

  constructor(info: ApiErrorBody, status: number, retryAfter?: number) {
    super(info.error);
    this.info = info;
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const info = (await res.json().catch(() => ({
      error: "Unknown error",
      code: "unknown",
      status: res.status,
    }))) as ApiErrorBody;
    const retryAfter = Number(res.headers.get("Retry-After")) || undefined;
    throw new FetchError(info, res.status, retryAfter);
  }
  return res.json() as Promise<T>;
}
