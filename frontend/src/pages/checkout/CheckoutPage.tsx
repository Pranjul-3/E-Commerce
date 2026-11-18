import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { useCreateOrder, useCurrentUser } from "@/shared/api";
import { CART_TEXT, CHECKOUT_TEXT } from "@/shared/config/constants";
import { orderPath, ROUTES } from "@/shared/config/routes";
import { formatMoney } from "@/shared/lib";
import { cartCleared, useToast } from "@/shared/slices";
import { Button, SkeletonList } from "@/shared/ui/reusablecomponent";
import { useCartItems } from "../cart/useCartItems";
import styles from "../page.module.scss";

export default function CheckoutPage() {
  const { items, subtotal, blocked, isPending } = useCartItems();
  const { data: user } = useCurrentUser();
  const createOrder = useCreateOrder();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  if (isPending) return <SkeletonList rows={3} />;
  // Not after a successful order: that navigation must win over this one.
  if ((items.length === 0 || blocked) && !createOrder.isSuccess) return <Navigate to={ROUTES.cart} replace />;

  const place = () =>
    createOrder.mutate(
      { body: { products: items.map(({ productId, quantity }) => ({ productId, quantity })) } },
      {
        onSuccess: (order) => {
          void navigate(orderPath(order.id), { replace: true });
          dispatch(cartCleared());
          toast.success(CHECKOUT_TEXT.placed);
        },
        onError: () => toast.error(CHECKOUT_TEXT.failed),
      },
    );

  return (
    <>
      <h1 className={styles.pageTitle}>{CHECKOUT_TEXT.title}</h1>
      <div className={styles.twoCol}>
        <div>
          <section className={styles.panel}>
            <h2>{CHECKOUT_TEXT.account}</h2>
            <p>{user ? `${user.name}, ${user.email}` : " "}</p>
          </section>
          <section className={styles.panel}>
            <h2>{CHECKOUT_TEXT.paymentTitle}</h2>
            <p>{CHECKOUT_TEXT.paymentNote}</p>
          </section>
        </div>
        <aside className={styles.summary}>
          <h2>{CHECKOUT_TEXT.summary}</h2>
          {items.map(({ product, quantity }) => (
            <p key={product.id} className={styles.row}>
              <span>{product.name} × {quantity}</span>
              <span>{formatMoney(product.price * quantity)}</span>
            </p>
          ))}
          <p className={`${styles.row} ${styles.total}`}><span>{CART_TEXT.total}</span><span>{formatMoney(subtotal)}</span></p>
          <Button fullWidth size="lg" loading={createOrder.isPending} onClick={place}>{CHECKOUT_TEXT.place}</Button>
        </aside>
      </div>
    </>
  );
}
