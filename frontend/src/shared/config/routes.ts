export const ROUTES = {
  shop: "/",
  product: "/products/:id",
  cart: "/cart",
  checkout: "/checkout",
  signIn: "/sign-in",
  signUp: "/sign-up",
  orders: "/orders",
  order: "/orders/:id",
  account: "/account",
} as const;

export const productPath = (id: number) => `/products/${id}`;
export const orderPath = (id: number) => `/orders/${id}`;

/** Only same-site paths are followed after sign-in, so a crafted link cannot redirect elsewhere. */
export const safeReturnPath = (value: unknown): string =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : ROUTES.shop;
