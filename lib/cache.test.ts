import { describe, expect, it, vi } from "vitest";
import { getOrSet } from "./cache";

describe("getOrSet", () => {
  it("calls fn once and returns its result", async () => {
    const fn = vi.fn().mockResolvedValue("value");
    const result = await getOrSet("key-a", fn);
    expect(result).toBe("value");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("returns the cached value without calling fn again within the TTL", async () => {
    const fn = vi.fn().mockResolvedValue("first");
    await getOrSet("key-b", fn, 60_000);
    const second = await getOrSet("key-b", fn, 60_000);
    expect(second).toBe("first");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("calls fn again once the TTL has expired", async () => {
    const fn = vi.fn().mockResolvedValueOnce("first").mockResolvedValueOnce("second");
    await getOrSet("key-c", fn, 10);
    await new Promise((resolve) => setTimeout(resolve, 20));
    const result = await getOrSet("key-c", fn, 10);
    expect(result).toBe("second");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("keys are independent of each other", async () => {
    const fn = vi.fn().mockResolvedValue("shared-fn-result");
    await getOrSet("key-d1", fn);
    await getOrSet("key-d2", fn);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
