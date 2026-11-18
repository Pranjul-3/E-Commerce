import { useNavigate, Link } from "react-router";
import { useMyOrders } from "@/shared/api";
import { ORDER_TEXT, SHOP_TEXT, CART_TEXT } from "@/shared/config/constants";
import { orderPath, ROUTES } from "@/shared/config/routes";
import { formatDay, formatMoney } from "@/shared/lib";
import { Button, SkeletonList } from "@/shared/ui/reusablecomponent";
import styles from "../page.module.scss";

export default function OrdersPage() {
  const orders = useMyOrders();
  const navigate = useNavigate();

  if (orders.isPending) return <SkeletonList rows={4} />;
  if (orders.isError)
    return (
      <div className={styles.empty}>
        <h2>{ORDER_TEXT.loadFailed}</h2>
        <Button variant="outline" onClick={() => void orders.refetch()}>{SHOP_TEXT.retry}</Button>
      </div>
    );
  if (orders.data.length === 0)
    return (
      <div className={styles.empty}>
        <h2>{ORDER_TEXT.emptyTitle}</h2>
        <p>{ORDER_TEXT.emptyBody}</p>
        <Button variant="outline" onClick={() => void navigate(ROUTES.shop)}>{CART_TEXT.browse}</Button>
      </div>
    );

  const newestFirst = [...orders.data].sort((a, b) => b.id - a.id);
  return (
    <>
      <h1 className={styles.pageTitle}>{ORDER_TEXT.title}</h1>
      {newestFirst.map((order) => (
        <Link key={order.id} to={orderPath(order.id)} className={styles.orderRow}>
          <div>
            <h2>{ORDER_TEXT.number(order.id)}</h2>
            <small>{ORDER_TEXT.placedOn(formatDay(order.createdAt))} · {ORDER_TEXT.items(order.products.reduce((n, l) => n + l.quantity, 0))}</small>
          </div>
          <span>{formatMoney(order.products.reduce((sum, l) => sum + l.price * l.quantity, 0))}</span>
        </Link>
      ))}
    </>
  );
}
