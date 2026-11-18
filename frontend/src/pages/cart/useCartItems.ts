import { useMemo } from "react";
import { useProducts } from "@/shared/api";
import { useCartLines } from "@/shared/slices";

/** Cart lines joined with live product data, so prices and stock are never stale. */
export function useCartItems() {
  const lines = useCartLines();
  const products = useProducts();
  return useMemo(() => {
    const items = lines.flatMap((line) => {
      const product = products.data?.find((p) => p.id === line.productId);
      return product ? [{ ...line, product }] : [];
    });
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const blocked = items.some((i) => i.quantity > i.product.quantity);
    return { items, subtotal, blocked, isPending: products.isPending };
  }, [lines, products.data, products.isPending]);
}
