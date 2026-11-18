import type { ApiServerName } from "./config";
import type { ResponseContract } from "./contract";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export class ApiError extends Error {
  readonly status: number;
  /** Parsed error body from the server, if any. */
  readonly details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;

/**
 * One API endpoint: real path + types.
 */
export interface Endpoint<TResponse, TBody = undefined, TParams = undefined> {
  /** Root of the TanStack query key; also used to invalidate every query of this endpoint. */
  key: string;
  method: HttpMethod;
  /** Path relative to VITE_API_BASE_URL, exactly as the backend expects it. */
  path: (params: TParams) => string;
  /** Turns the raw JSON of a live response into `TResponse` (normalise odd shapes here). */
  parse?: (raw: unknown) => TResponse;
  /** For endpoints that answer in headers rather than the body (login). */
  fromHeaders?: (headers: Headers) => TResponse;
  /** Value to use when the server answers 404 instead of throwing (e.g. "no items" lists). */
  onNotFound?: () => TResponse;
  /**
   * Turns the typed body into what goes over the wire (e.g. FormData for file uploads).
   */
  encode?: (body: TBody) => FormData | Blob | object;
  /** Backend that serves this endpoint (see API_SERVERS in config.ts). Default: "main". */
  server?: ApiServerName;
  /** The shape our code expects (keys it reads). Dev only: differences are logged, nothing is changed. */
  contract?: ResponseContract;
}

type ParamsArg<TParams> = [TParams] extends [undefined]
  ? { params?: undefined }
  : { params: TParams };
type BodyArg<TBody> = [TBody] extends [undefined]
  ? { body?: undefined }
  : { body: TBody };

/** Arguments for calling an endpoint; `params` / `body` are required only when the endpoint has them. */
export type CallArgs<TBody, TParams> = ParamsArg<TParams> &
  BodyArg<TBody> & {
    query?: QueryParams;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  };
