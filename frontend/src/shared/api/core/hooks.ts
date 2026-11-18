import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { callEndpoint } from "./endpoint";
import type { ApiError, CallArgs, Endpoint, QueryParams } from "./types";

/** Matches every cached call of an endpoint (use for invalidation). */
export const apiEndpointKey = (endpoint: { key: string }): QueryKey => [
  endpoint.key,
];

/** Query key for one call: `[endpoint.key, params, query]`. Use `[endpoint.key]` to match all calls. */
export const apiQueryKey = <TParams>(
  endpoint: Endpoint<unknown, never, TParams> | { key: string },
  params?: TParams,
  query?: QueryParams,
): QueryKey => [endpoint.key, params ?? null, query ?? null] as const;

type QueryHookOptions<TResponse, TSelected> = Omit<
  UseQueryOptions<TResponse, ApiError, TSelected>,
  "queryKey" | "queryFn"
> & {
  query?: QueryParams;
};

/**
 * Generic GET hook for any endpoint.
 * Pass `skipToken` as params to wait for data another query provides (dependent queries).
 */
export function useApiQuery<
  TResponse,
  TParams = undefined,
  TSelected = TResponse,
>(
  endpoint: Endpoint<TResponse, undefined, TParams>,
  params: TParams | typeof skipToken,
  options: QueryHookOptions<TResponse, TSelected> = {},
) {
  const { query, ...queryOptions } = options;
  const skip = params === skipToken;

  return useQuery<TResponse, ApiError, TSelected>({
    queryKey: apiQueryKey(endpoint, skip ? undefined : params, query),
    queryFn: skip
      ? skipToken
      : ({ signal }) =>
          callEndpoint(endpoint, { params, query, signal } as CallArgs<
            undefined,
            TParams
          >),
    ...queryOptions,
  });
}

export type MutationVariables<TBody, TParams> = CallArgs<TBody, TParams>;

type MutationHookOptions<TResponse, TBody, TParams> = UseMutationOptions<
  TResponse,
  ApiError,
  MutationVariables<TBody, TParams>
> & {
  /** Query keys to refetch after success, e.g. `[apiQueryKey(LIST_ENDPOINT)]`. */
  invalidate?: (
    data: TResponse,
    variables: MutationVariables<TBody, TParams>,
  ) => QueryKey[];
};

/** Generic POST/PUT/PATCH/DELETE hook for any endpoint. */
export function useApiMutation<
  TResponse,
  TBody = undefined,
  TParams = undefined,
>(
  endpoint: Endpoint<TResponse, TBody, TParams>,
  options: MutationHookOptions<TResponse, TBody, TParams> = {},
) {
  const queryClient = useQueryClient();
  const { invalidate, onSuccess, ...mutationOptions } = options;

  return useMutation<TResponse, ApiError, MutationVariables<TBody, TParams>>({
    mutationFn: (variables) => callEndpoint(endpoint, variables),
    ...mutationOptions,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all(
        (invalidate?.(data, variables) ?? []).map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
