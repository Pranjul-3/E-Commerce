import { Minus, Plus, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { ProductArt } from "@/entities/product";
import { CART_TEXT, PRODUCT_TEXT } from "@/shared/config/constants";
import { productPath, ROUTES } from "@/shared/config/routes";
import { formatMoney } from "@/shared/lib";
import { itemRemoved, quantitySet } from "@/shared/slices";
import { Button, SkeletonList } from "@/shared/ui/reusablecomponent";
import { useCartItems } from "./useCartItems";
import styles from "../page.module.scss";

export default function CartPage() {
  const { items, subtotal, blocked, isPending } = useCartItems();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isPending) return <SkeletonList rows={3} />;
  if (items.length === 0)
    return (
      <div className={styles.empty}>
        <h2>{CART_TEXT.emptyTitle}</h2>
        <p>{CART_TEXT.emptyBody}</p>
        <Button variant="outline" onClick={() => void navigate(ROUTES.shop)}>{CART_TEXT.browse}</Button>
      </div>
    );

  return (
    <>
      <h1 className={styles.pageTitle}>{CART_TEXT.title}</h1>
      <div className={styles.twoCol}>
        <div>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className={styles.line}>
              <ProductArt name={product.name} size="thumb" />
              <div className={styles.lineBody}>
                <Link to={productPath(product.id)}><h3>{product.name}</h3></Link>
                <p>
                  {quantity > product.quantity ? CART_TEXT.stockLimit(product.quantity) : formatMoney(product.price)}
                </p>
                <div className={styles.stepper} role="group" aria-label={PRODUCT_TEXT.quantity}>
                  <button type="button" aria-label={PRODUCT_TEXT.decrease} disabled={quantity <= 1}
                    onClick={() => dispatch(quantitySet({ productId: product.id, quantity: quantity - 1 }))}>
                    <Minus size={14} aria-hidden />
                  </button>
                  <span>{quantity}</span>
                  <button type="button" aria-label={PRODUCT_TEXT.increase} disabled={quantity >= product.quantity}
                    onClick={() => dispatch(quantitySet({ productId: product.id, quantity: quantity + 1 }))}>
                    <Plus size={14} aria-hidden />
                  </button>
                </div>
              </div>
              <div className={styles.lineEnd}>
                <Button variant="ghost" size="sm" icon={<X size={16} aria-hidden />}
                  aria-label={CART_TEXT.remove(product.name)} onClick={() => dispatch(itemRemoved(product.id))} />
                <span>{formatMoney(product.price * quantity)}</span>
              </div>
            </div>
          ))}
        </div>
        <aside className={styles.summary}>
          <p className={styles.row}><span>{CART_TEXT.subtotal}</span><span>{formatMoney(subtotal)}</span></p>
          <p className={styles.row}><span>{CART_TEXT.shipping}</span><span>{CART_TEXT.shippingValue}</span></p>
          <p className={`${styles.row} ${styles.total}`}><span>{CART_TEXT.total}</span><span>{formatMoney(subtotal)}</span></p>
          <Button fullWidth size="lg" disabled={blocked} onClick={() => void navigate(ROUTES.checkout)}>{CART_TEXT.checkout}</Button>
        </aside>
      </div>
    </>
  );
}
