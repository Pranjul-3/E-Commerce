import { QueryClient } from "@tanstack/react-query";
import { callEndpoint } from "./endpoint";
import { apiQueryKey } from "./hooks";
import { isApiError, type CallArgs, type Endpoint } from "./types";

const MAX_RETRIES = 2;

/** Client errors (4xx) won't succeed on retry; only retry network/server failures. */
const shouldRetry = (failureCount: number, error: unknown) =>
  failureCount < MAX_RETRIES &&
  !(isApiError(error) && error.status >= 400 && error.status < 500);

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
      },
      mutations: {
        retry: false,
      },
    },
  });

/**
 * The app's one query cache, shared by React (QueryProvider) and code outside components (Redux
 * listeners): both read and fill the same entries, so nothing is fetched twice.
 */
export const queryClient = createQueryClient();

/** Same as `useApiQuery` but outside React: cached data when fresh, else one request (shared with the screens). */
export const fetchApiQuery = <TResponse, TParams>(
  endpoint: Endpoint<TResponse, undefined, TParams>,
  params: TParams,
  options: { staleTime?: number } = {},
): Promise<TResponse> =>
  queryClient.fetchQuery({
    queryKey: apiQueryKey(endpoint, params),
    // Same call shape as useApiQuery (params are optional per endpoint, hence the cast).
    queryFn: ({ signal }) =>
      callEndpoint(endpoint, { params, signal } as CallArgs<
        undefined,
        TParams
      >),
    ...options,
  });
