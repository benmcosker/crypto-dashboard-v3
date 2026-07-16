export class ApiError extends Error {
  status: number;
  code: string;
  retryAfter?: number;

  constructor(status: number, code: string, message: string, retryAfter?: number) {
    super(message);
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export function badRequest(message: string): ApiError {
  return new ApiError(400, "bad_request", message);
}

/** Converts any thrown error into the {error, code, status} JSON response shape. */
export function toErrorResponse(err: unknown): Response {
  if (err instanceof ApiError) {
    console.error(`[api] ${err.code} (${err.status}): ${err.message}`);
    const headers: HeadersInit = {};
    if (err.retryAfter !== undefined) {
      headers["Retry-After"] = String(err.retryAfter);
    }
    return Response.json(
      { error: err.message, code: err.code, status: err.status },
      { status: err.status, headers }
    );
  }

  console.error("[api] unexpected error:", err);
  return Response.json(
    { error: "Unexpected server error", code: "internal_error", status: 502 },
    { status: 502 }
  );
}
