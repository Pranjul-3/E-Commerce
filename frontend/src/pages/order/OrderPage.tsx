import { useState } from "react";
import { useParams } from "react-router";
import { ProductArt } from "@/entities/product";
import { ReviewModal } from "@/features/review/ui/ReviewModal";
import { useMyOrder, useMyReviews, useProducts, type OrderLine } from "@/shared/api";
import { NAV_TEXT, ORDER_TEXT } from "@/shared/config/constants";
import { ROUTES } from "@/shared/config/routes";
import { formatDay, formatMoney } from "@/shared/lib";
import { Breadcrumb, Button, SkeletonList } from "@/shared/ui/reusablecomponent";
import styles from "../page.module.scss";

export default function OrderPage() {
  const id = Number(useParams().id);
  const order = useMyOrder(id);
  const { data: products } = useProducts();
  const { data: reviews } = useMyReviews();
  const [reviewing, setReviewing] = useState<OrderLine | null>(null);

  if (order.isPending) return <SkeletonList rows={3} />;
  if (order.isError) return <div className={styles.empty}><h2>{ORDER_TEXT.notFound}</h2></div>;

  const nameOf = (productId: number) =>
    products?.find((p) => p.id === productId)?.name ?? ORDER_TEXT.removedProduct(productId);
  const isReviewed = (productId: number) =>
    reviews?.some((r) => r.orderId === id && r.productId === productId) ?? false;
  const total = order.data.products.reduce((sum, l) => sum + l.price * l.quantity, 0);

  return (
    <>
      <Breadcrumb className={styles.crumbs} items={[{ label: NAV_TEXT.orders, to: ROUTES.orders }, { label: ORDER_TEXT.number(id) }]} />
      <h1 className={styles.pageTitle}>{ORDER_TEXT.number(id)}</h1>
      <p>{ORDER_TEXT.placedOn(formatDay(order.data.createdAt))}</p>
      {order.data.products.map((line) => (
        <div key={line.productId} className={styles.line}>
          <ProductArt name={nameOf(line.productId)} size="thumb" />
          <div className={styles.lineBody}>
            <h3>{nameOf(line.productId)}</h3>
            <p>{ORDER_TEXT.qty(line.quantity)} · {ORDER_TEXT.each(formatMoney(line.price))}</p>
          </div>
          <div className={styles.lineEnd}>
            <span>{formatMoney(line.price * line.quantity)}</span>
            {isReviewed(line.productId) ? (
              <small>{ORDER_TEXT.reviewed}</small>
            ) : (
              <Button variant="link" size="sm" onClick={() => setReviewing(line)}>{ORDER_TEXT.writeReview}</Button>
            )}
          </div>
        </div>
      ))}
      <p className={`${styles.row} ${styles.total}`}><span>{ORDER_TEXT.total}</span><span>{formatMoney(total)}</span></p>
      {reviewing && (
        <ReviewModal orderId={id} line={reviewing} productName={nameOf(reviewing.productId)} onClose={() => setReviewing(null)} />
      )}
    </>
  );
}
