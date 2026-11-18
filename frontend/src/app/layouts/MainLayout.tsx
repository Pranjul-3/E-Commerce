import { ShoppingBag, UserRound } from "lucide-react";
import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { APP_NAME, NAV_TEXT } from "@/shared/config/constants";
import { ROUTES } from "@/shared/config/routes";
import { useCartCount, useIsSignedIn } from "@/shared/slices";
import styles from "./MainLayout.module.scss";

export function MainLayout() {
  const signedIn = useIsSignedIn();
  const count = useCartCount();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link to={ROUTES.shop} className={styles.brand}>{APP_NAME}</Link>
          <nav aria-label={NAV_TEXT.mainNav} className={styles.nav}>
            <NavLink to={ROUTES.shop} end>{NAV_TEXT.shop}</NavLink>
            {signedIn && <NavLink to={ROUTES.orders}>{NAV_TEXT.orders}</NavLink>}
          </nav>
          <div className={styles.actions}>
            <Link
              to={signedIn ? ROUTES.account : ROUTES.signIn}
              aria-label={signedIn ? NAV_TEXT.account : NAV_TEXT.signIn}
            >
              <UserRound size={20} strokeWidth={1.5} aria-hidden />
            </Link>
            <Link to={ROUTES.cart} aria-label={`${NAV_TEXT.cart}: ${count}`} className={styles.cart}>
              <ShoppingBag size={20} strokeWidth={1.5} aria-hidden />
              {count > 0 && <span>{count}</span>}
            </Link>
          </div>
        </div>
      </header>
      <main className={styles.main}><Outlet /></main>
      <footer className={styles.footer}>
        <strong>{APP_NAME}</strong>
        <span>{NAV_TEXT.footer}</span>
      </footer>
    </div>
  );
}
