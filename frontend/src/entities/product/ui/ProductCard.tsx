import { Star } from "lucide-react";
import { Link } from "react-router";
import type { Product } from "@/shared/api";
import { PRODUCT_TEXT } from "@/shared/config/constants";
import { formatMoney } from "@/shared/lib";
import { productPath } from "@/shared/config/routes";
import { ProductArt } from "./ProductArt";
import styles from "./Product.module.scss";

export function ProductCard({ product, rating }: { product: Product; rating?: number }) {
  return (
    <Link to={productPath(product.id)} className={styles.card}>
      <ProductArt name={product.name} />
      <div className={styles.cardBody}>
        <h3>{product.name}</h3>
        <p>
          {product.quantity > 0 ? formatMoney(product.price) : PRODUCT_TEXT.soldOut}
          {rating !== undefined && (
            <span className={styles.rating}>
              <Star size={12} aria-hidden /> {rating.toFixed(1)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
