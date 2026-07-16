type Entry<T> = { data: T; expiry: number };

const store = new Map<string, Entry<unknown>>();

/**
 * Returns the cached value for `key` if it hasn't expired, otherwise calls
 * `fn`, caches the result for `ttlMs`, and returns it.
 */
export async function getOrSet<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs = 60_000
): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expiry > Date.now()) {
    return hit.data as T;
  }

  const data = await fn();
  store.set(key, { data, expiry: Date.now() + ttlMs });
  return data;
}

export function clearCache(): void {
  store.clear();
}
