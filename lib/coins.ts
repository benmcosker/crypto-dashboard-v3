const COIN_ID_RE = /^[a-z0-9-]+$/;

export function isCoinId(value: string): boolean {
  return COIN_ID_RE.test(value);
}

export function parseCoin(raw: string | null, fallback = "bitcoin"): string {
  return raw !== null && isCoinId(raw) ? raw : fallback;
}
