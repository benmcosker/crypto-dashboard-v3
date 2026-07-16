export const COINS = [
  { id: "bitcoin", label: "Bitcoin" },
  { id: "ethereum", label: "Ethereum" },
  { id: "solana", label: "Solana" },
  { id: "ripple", label: "XRP" },
  { id: "dogecoin", label: "Dogecoin" },
] as const;

export const COIN_IDS = COINS.map((c) => c.id);
export type CoinId = (typeof COIN_IDS)[number];

export function isCoinId(value: string): value is CoinId {
  return (COIN_IDS as readonly string[]).includes(value);
}

export function parseCoin(raw: string | null, fallback: CoinId = "bitcoin"): CoinId {
  return raw !== null && isCoinId(raw) ? raw : fallback;
}
