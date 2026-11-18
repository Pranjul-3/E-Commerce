import type { ComponentType } from "react";
import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "@/shared/config/routes";
import { useIsSignedIn } from "@/shared/slices";
import { ErrorPage } from "../errors";
import { MainLayout } from "../layouts/MainLayout";

function RequireAuth() {
  const signedIn = useIsSignedIn();
  const location = useLocation();
  return signedIn ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.signIn} replace state={{ from: location.pathname }} />
  );
}

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: ROUTES.shop, lazy: page(() => import("@/pages/shop/ShopPage")) },
      { path: ROUTES.product, lazy: page(() => import("@/pages/product/ProductPage")) },
      { path: ROUTES.cart, lazy: page(() => import("@/pages/cart/CartPage")) },
      { path: ROUTES.signIn, lazy: page(() => import("@/pages/auth/SignInPage")) },
      { path: ROUTES.signUp, lazy: page(() => import("@/pages/auth/SignUpPage")) },
      {
        element: <RequireAuth />,
        children: [
          { path: ROUTES.checkout, lazy: page(() => import("@/pages/checkout/CheckoutPage")) },
          { path: ROUTES.orders, lazy: page(() => import("@/pages/orders/OrdersPage")) },
          { path: ROUTES.order, lazy: page(() => import("@/pages/order/OrderPage")) },
          { path: ROUTES.account, lazy: page(() => import("@/pages/account/AccountPage")) },
        ],
      },
      { path: "*", lazy: page(() => import("@/pages/not-found/NotFoundPage")) },
    ],
  },
]);
