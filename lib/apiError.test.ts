import { describe, expect, it, vi } from "vitest";
import { ApiError, badRequest, toErrorResponse } from "./apiError";

describe("toErrorResponse", () => {
  it("maps an ApiError to the {error, code, status} shape", async () => {
    const res = toErrorResponse(new ApiError(404, "not_found", "Resource not found"));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: "Resource not found",
      code: "not_found",
      status: 404,
    });
  });

  it("sets Retry-After when provided", async () => {
    const res = toErrorResponse(new ApiError(429, "rate_limited", "Rate limit exceeded", 42));
    expect(res.headers.get("Retry-After")).toBe("42");
  });

  it("omits Retry-After when not provided", async () => {
    const res = toErrorResponse(new ApiError(400, "bad_request", "bad"));
    expect(res.headers.get("Retry-After")).toBeNull();
  });

  it("maps badRequest() to a 400", async () => {
    const res = toErrorResponse(badRequest("Invalid id"));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ code: "bad_request" });
  });

  it("maps unknown errors to a generic 502 without leaking details", async () => {
    const logSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = toErrorResponse(new Error("some internal detail"));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.code).toBe("internal_error");
    expect(body.error).not.toContain("some internal detail");
    logSpy.mockRestore();
  });
});
