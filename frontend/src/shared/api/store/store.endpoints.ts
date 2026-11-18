import { ApiError, defineEndpoint } from "../core";
import type {
  Credentials, NewOrder, NewReview, NewUser, Order, Product, ProductRating, Review, User,
} from "./store.types";

const BEARER = "Bearer ";
/** Top-rated list size: asked for in full, so ratings can show on every card. */
export const RATINGS_LIMIT = 100;

export const LOGIN = defineEndpoint<string, Credentials>({
  key: "auth.login",
  method: "POST",
  path: () => "api/v1/auth/login",
  // The gateway answers 204 with the JWT in the Authorization header.
  fromHeaders: (headers) => {
    const value = headers.get("Authorization");
    if (!value?.startsWith(BEARER)) throw new ApiError(502, "No token");
    return value.slice(BEARER.length);
  },
});
export const LOGOUT = defineEndpoint<void>({
  key: "auth.logout",
  method: "POST",
  path: () => "api/v1/auth/logout",
});
export const CREATE_USER = defineEndpoint<User, NewUser>({
  key: "users.create",
  method: "POST",
  path: () => "api/v1/users",
});
export const CURRENT_USER = defineEndpoint<User>({
  key: "users.me",
  method: "GET",
  path: () => "api/v1/users/me",
});
export const PRODUCTS = defineEndpoint<Product[]>({
  key: "products.list",
  method: "GET",
  path: () => "api/v1/products",
  contract: { shape: "list", keys: { id: "number", name: "string", price: "number", quantity: "number" } },
});
export const PRODUCT = defineEndpoint<Product, undefined, { id: number }>({
  key: "products.one",
  method: "GET",
  path: ({ id }) => `api/v1/products/${id}`,
});
export const PRODUCT_RATINGS = defineEndpoint<ProductRating[]>({
  key: "reviews.top",
  method: "GET",
  path: () => `api/v1/reviews/products/top?max=${RATINGS_LIMIT}`,
});
export const PRODUCT_REVIEWS = defineEndpoint<Review[], undefined, { id: number }>({
  key: "reviews.product",
  method: "GET",
  path: ({ id }) => `api/v1/reviews/products/${id}`,
});
export const MY_REVIEWS = defineEndpoint<Review[]>({
  key: "reviews.mine",
  method: "GET",
  path: () => "api/v1/reviews/users/me",
});
export const CREATE_REVIEW = defineEndpoint<Review, NewReview>({
  key: "reviews.create",
  method: "POST",
  path: () => "api/v1/reviews/users/me",
});
export const MY_ORDERS = defineEndpoint<Order[]>({
  key: "orders.mine",
  method: "GET",
  path: () => "api/v1/orders/users/me",
});
export const MY_ORDER = defineEndpoint<Order, undefined, { id: number }>({
  key: "orders.one",
  method: "GET",
  path: ({ id }) => `api/v1/orders/users/me/${id}`,
});
export const CREATE_ORDER = defineEndpoint<Order, NewOrder>({
  key: "orders.create",
  method: "POST",
  path: () => "api/v1/orders/users/me",
});
