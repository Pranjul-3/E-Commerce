import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard, presentationOf, type Category } from "@/entities/product";
import { useProductRatings, useProducts } from "@/shared/api";
import { CATEGORY_TEXT, SHOP_TEXT } from "@/shared/config/constants";
import { Button, Dropdown, SkeletonList, TextField } from "@/shared/ui/reusablecomponent";
import styles from "../page.module.scss";

type Sort = keyof typeof SHOP_TEXT.sort;
const SORT_OPTIONS = (Object.keys(SHOP_TEXT.sort) as Sort[]).map((value) => ({
  value, label: SHOP_TEXT.sort[value],
}));
const CATEGORIES = Object.keys(CATEGORY_TEXT) as Category[];

export default function ShopPage() {
  const products = useProducts();
  const { data: ratings } = useProductRatings();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [sort, setSort] = useState<Sort>("featured");

  const ratingById = useMemo(
    () => new Map(ratings?.map((r) => [r.productId, Number(r.avg)])),
    [ratings],
  );

  // The API has no search or category filter, so the catalogue is narrowed here.
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matched = (products.data ?? []).filter(
      (p) =>
        (!category || presentationOf(p.name).category === category) &&
        (!term || `${p.name} ${p.description ?? ""}`.toLowerCase().includes(term)),
    );
    if (sort === "featured") return matched;
    const direction = sort === "priceLow" ? 1 : -1;
    return [...matched].sort((a, b) => (a.price - b.price) * direction);
  }, [products.data, search, category, sort]);

  const clear = () => {
    setSearch("");
    setCategory(null);
  };

  return (
    <>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{SHOP_TEXT.eyebrow}</p>
        <h1>{SHOP_TEXT.title}</h1>
        <p>{SHOP_TEXT.lead}</p>
      </section>
      <div className={styles.filters}>
        <TextField
          type="search"
          label={SHOP_TEXT.searchLabel}
          placeholder={SHOP_TEXT.searchPlaceholder}
          value={search}
          onChange={setSearch}
          leftIcon={<Search size={16} aria-hidden />}
          clearable
        />
        <Dropdown
          className={styles.filterSort}
          label={SHOP_TEXT.sortLabel}
          options={SORT_OPTIONS}
          value={sort}
          onChange={(value) => setSort((value as Sort | null) ?? "featured")}
          clearable={false}
        />
      </div>
      <div className={styles.tabs} aria-label={SHOP_TEXT.categoryLabel} role="group">
        <button type="button" className={styles.tab} aria-pressed={!category} onClick={() => setCategory(null)}>
          {SHOP_TEXT.allCategories}
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className={styles.tab} aria-pressed={category === c} onClick={() => setCategory(c)}>
            {CATEGORY_TEXT[c]}
          </button>
        ))}
      </div>
      {products.isPending && <SkeletonList rows={3} rowHeight={220} />}
      {products.isError && (
        <div className={styles.empty}>
          <h2>{SHOP_TEXT.loadFailed}</h2>
          <Button variant="outline" onClick={() => void products.refetch()}>{SHOP_TEXT.retry}</Button>
        </div>
      )}
      {products.isSuccess && visible.length === 0 && (
        <div className={styles.empty}>
          <h2>{SHOP_TEXT.emptyTitle}</h2>
          <p>{SHOP_TEXT.emptyBody}</p>
          <Button variant="outline" onClick={clear}>{SHOP_TEXT.clear}</Button>
        </div>
      )}
      <div className={styles.grid}>
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} rating={ratingById.get(p.id)} />
        ))}
      </div>
    </>
  );
}
