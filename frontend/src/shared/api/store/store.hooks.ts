import { apiEndpointKey, skipToken, useApiMutation, useApiQuery } from "../core";
import {
  CREATE_ORDER, CREATE_REVIEW, CREATE_USER, CURRENT_USER, LOGIN, LOGOUT, MY_ORDER, MY_ORDERS,
  MY_REVIEWS, PRODUCT, PRODUCTS, PRODUCT_RATINGS, PRODUCT_REVIEWS,
} from "./store.endpoints";

export const useProducts = () => useApiQuery(PRODUCTS, undefined);
export const useProduct = (id: number) => useApiQuery(PRODUCT, { id });
export const useProductRatings = () => useApiQuery(PRODUCT_RATINGS, undefined);
export const useProductReviews = (id: number) => useApiQuery(PRODUCT_REVIEWS, { id });
export const useCurrentUser = (enabled = true) =>
  useApiQuery(CURRENT_USER, enabled ? undefined : skipToken);
export const useMyOrders = () => useApiQuery(MY_ORDERS, undefined);
export const useMyOrder = (id: number) => useApiQuery(MY_ORDER, { id });
export const useMyReviews = () => useApiQuery(MY_REVIEWS, undefined);

export const useLogin = () => useApiMutation(LOGIN);
export const useLogout = () => useApiMutation(LOGOUT);
export const useCreateUser = () => useApiMutation(CREATE_USER);
export const useCreateOrder = () =>
  useApiMutation(CREATE_ORDER, {
    invalidate: () => [apiEndpointKey(MY_ORDERS), apiEndpointKey(PRODUCTS), apiEndpointKey(PRODUCT)],
  });
export const useCreateReview = () =>
  useApiMutation(CREATE_REVIEW, {
    invalidate: () => [
      apiEndpointKey(MY_REVIEWS), apiEndpointKey(PRODUCT_REVIEWS), apiEndpointKey(PRODUCT_RATINGS),
    ],
  });
