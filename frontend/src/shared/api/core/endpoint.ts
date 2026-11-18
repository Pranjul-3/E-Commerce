import { logger } from "@/shared/lib/logger";
import { LOG_TEXT } from "@/shared/config/constants";
import { IS_PROD_BUILD } from "./config";
import { checkContract } from "./contract";
import { httpRequest } from "./http";
import { ApiError, type CallArgs, type Endpoint } from "./types";

/** Declares an endpoint with full typing (response, body, path params). */
export const defineEndpoint = <
  TResponse,
  TBody = undefined,
  TParams = undefined,
>(
  endpoint: Endpoint<TResponse, TBody, TParams>,
): Endpoint<TResponse, TBody, TParams> => endpoint;

export async function callEndpoint<TResponse, TBody, TParams>(
  endpoint: Endpoint<TResponse, TBody, TParams>,
  args: CallArgs<TBody, TParams>,
): Promise<TResponse> {
  // `params` / `body` are only optional in the type when the endpoint has none.
  const params = args.params as TParams;
  const body = args.body as TBody;
  try {
    const { data, headers } = await httpRequest({
      method: endpoint.method,
      server: endpoint.server,
      path: endpoint.path(params),
      query: args.query,
      body:
        body !== undefined && endpoint.encode ? endpoint.encode(body) : body,
      headers: args.headers,
      signal: args.signal,
    });
    if (endpoint.fromHeaders) return endpoint.fromHeaders(headers);
    // Dev: report where the response differs from what our code reads (never changes it).
    if (!IS_PROD_BUILD && endpoint.contract)
      checkContract(endpoint.key, data, endpoint.contract);
    return endpoint.parse ? endpoint.parse(data) : (data as TResponse);
  } catch (error) {
    if (args.signal?.aborted) throw error;
    logger.error(
      LOG_TEXT.api.failed(
        endpoint.method,
        endpoint.path(params),
        error instanceof ApiError ? error.status : 0,
        error instanceof Error ? error.message : String(error),
      ),
    );
    if (
      error instanceof ApiError &&
      error.status === 404 &&
      endpoint.onNotFound
    )
      return endpoint.onNotFound();
    throw error;
  }
}
