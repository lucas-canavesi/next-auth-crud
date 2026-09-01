export class ApiError extends Error {
  public readonly status: number;
  public readonly data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }

  static fromResponse(response: Response, data: unknown): ApiError {
    const message = typeof data === "object" && data !== null && "error" in data
      ? String((data as Record<string, unknown>).error)
      : response.statusText;
    return new ApiError(message, response.status, data);
  }
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };