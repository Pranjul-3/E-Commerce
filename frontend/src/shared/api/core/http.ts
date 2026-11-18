import { API_TEXT } from "@/shared/config/constants";
import { API_CONFIG, type ApiServerName } from "./config";
import { sessionExpired, sessionToken } from "./session";
import { ApiError, type HttpMethod, type QueryParams } from "./types";

export interface HttpRequest {
  method: HttpMethod;
  path: string;
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Which backend (see API_SERVERS). Default: API_CONFIG.defaultServer. */
  server?: ApiServerName;
}

export interface HttpResult {
  data: unknown;
  headers: Headers;
}

export function buildUrl(
  path: string,
  query?: QueryParams,
  server: ApiServerName = API_CONFIG.defaultServer,
): string {
  const baseUrl = API_CONFIG.servers[server];
  if (!baseUrl) throw new ApiError(0, API_TEXT.noBaseUrl);
  const url = `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  const search = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null)
      search.append(key, String(value));
  });
  const qs = search.toString();
  return qs ? `${url}?${qs}` : url;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** Spring ProblemDetail `detail`, then `message`, then `error`. */
function errorMessageFrom(body: unknown, fallback: string): string {
  if (!isRecord(body))
    return typeof body === "string" && body ? body : fallback;
  if (typeof body.detail === "string" && body.detail) return body.detail;
  if (typeof body.message === "string" && body.message) return body.message;
  if (isRecord(body.error) && typeof body.error.message === "string")
    return body.error.message;
  if (typeof body.error === "string" && body.error) return body.error;
  return fallback;
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/** fetch + base URL + JSON/FormData + caller cancellation + one error shape (`ApiError`). No time limit: a slow backend is waited for. */
export async function httpRequest({
  method,
  path,
  query,
  body,
  headers,
  signal,
  server,
}: HttpRequest): Promise<HttpResult> {
  const url = buildUrl(path, query, server);
  const token = sessionToken();
  try {
    // FormData and raw files (Blob) go as they are; anything else is JSON.
    const isForm = body instanceof FormData || body instanceof Blob;
    const response = await fetch(url, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body !== undefined && !isForm
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
      },
      body:
        body === undefined
          ? undefined
          : isForm
            ? (body as BodyInit)
            : JSON.stringify(body),
    });
    const data = await readBody(response);
    if (!response.ok) {
      if (response.status === 401 && token) sessionExpired();
      throw new ApiError(
        response.status,
        errorMessageFrom(
          data,
          API_TEXT.httpStatus(response.status, response.statusText),
        ),
        data,
      );
    }
    return { data, headers: response.headers };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Caller cancellation (e.g. TanStack unmount) is passed through untouched.
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    if (error instanceof TypeError) throw new ApiError(503, API_TEXT.network);
    throw new ApiError(
      500,
      error instanceof Error && error.message
        ? error.message
        : API_TEXT.unknown,
    );
  }
}
