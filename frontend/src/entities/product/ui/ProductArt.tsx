import { cx } from "@/shared/lib";
import { presentationOf } from "../catalog";
import styles from "./Product.module.scss";

export function ProductArt({ name, size = "tile" }: { name: string; size?: "thumb" | "tile" | "hero" }) {
  const { icon: Icon, plate } = presentationOf(name);
  return (
    <div className={cx(styles.art, styles[plate], styles[size])} role="img" aria-label={name}>
      <Icon strokeWidth={size === "thumb" ? 1 : 0.4} aria-hidden />
    </div>
  );
}
