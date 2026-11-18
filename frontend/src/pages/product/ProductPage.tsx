import { Minus, Plus, Star } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ProductArt } from "@/entities/product";
import { useProduct, useProductReviews } from "@/shared/api";
import { PRODUCT_TEXT } from "@/shared/config/constants";
import { ROUTES } from "@/shared/config/routes";
import { formatDay, formatMoney } from "@/shared/lib";
import { itemAdded, useToast } from "@/shared/slices";
import { Breadcrumb, Button, SkeletonList } from "@/shared/ui/reusablecomponent";
import styles from "../page.module.scss";

const LOW_STOCK = 5;

export default function ProductPage() {
  const id = Number(useParams().id);
  const { data: product, isPending, isError } = useProduct(id);
  const { data: reviews = [] } = useProductReviews(id);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const toast = useToast();

  if (isPending) return <SkeletonList rows={2} rowHeight={240} />;
  if (isError || !product) return <div className={styles.empty}><h2>{PRODUCT_TEXT.notFound}</h2></div>;

  const add = () => {
    dispatch(itemAdded({ productId: product.id, quantity }));
    toast.success(PRODUCT_TEXT.added(product.name));
  };
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
  const soldOut = product.quantity === 0;

  return (
    <>
      <Breadcrumb
        className={styles.crumbs}
        items={[{ label: PRODUCT_TEXT.back, to: ROUTES.shop }, { label: product.name }]}
      />
      <div className={styles.product}>
        <ProductArt name={product.name} size="hero" />
        <div className={styles.productInfo}>
          <h1>{product.name}</h1>
          <p className={styles.price}>{formatMoney(product.price)}</p>
          {reviews.length > 0 && (
            <p>{PRODUCT_TEXT.rating(average.toFixed(1))} · {PRODUCT_TEXT.reviewCount(reviews.length)}</p>
          )}
          <p>{product.description}</p>
          <div className={styles.buy}>
            <div className={styles.stepper} role="group" aria-label={PRODUCT_TEXT.quantity}>
              <button type="button" aria-label={PRODUCT_TEXT.decrease} disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}>
                <Minus size={14} aria-hidden />
              </button>
              <span>{quantity}</span>
              <button type="button" aria-label={PRODUCT_TEXT.increase} disabled={quantity >= product.quantity} onClick={() => setQuantity(quantity + 1)}>
                <Plus size={14} aria-hidden />
              </button>
            </div>
            <Button size="lg" disabled={soldOut} onClick={add}>
              {soldOut ? PRODUCT_TEXT.soldOut : PRODUCT_TEXT.addToCart}
            </Button>
          </div>
          <p className={styles.stock}>
            {!soldOut && (product.quantity <= LOW_STOCK ? PRODUCT_TEXT.lowStock(product.quantity) : PRODUCT_TEXT.inStock)}
          </p>
        </div>
      </div>
      <section className={styles.section}>
        <h2>{PRODUCT_TEXT.reviews}</h2>
        {reviews.length === 0 && <p>{PRODUCT_TEXT.noReviews}</p>}
        {reviews.map((r) => (
          <article key={r.id} className={styles.review}>
            <span className={styles.stars} aria-label={PRODUCT_TEXT.rating(String(r.rating))}>
              {Array.from({ length: r.rating }, (_, i) => <Star key={i} size={13} fill="currentColor" aria-hidden />)}
            </span>
            <p>{r.reviewText}</p>
            <small>{PRODUCT_TEXT.verifiedBuyer} · {formatDay(r.createdAt)}</small>
          </article>
        ))}
      </section>
    </>
  );
}
