import { Loader2 } from "lucide-react";
import { Tooltip } from "../tooltip";
import { useButton } from "./Button.hook";
import type { ButtonProps } from "./Button.types";
import styles from "./Button.module.scss";

export function Button(props: ButtonProps) {
  const b = useButton(props);

  const button = (
    <button {...b.buttonProps}>
      {b.loading ? (
        <Loader2 className={styles.spinner} size={16} aria-hidden />
      ) : (
        b.icon
      )}
      {b.hasLabel && <span className={styles.label}>{b.children}</span>}
      {b.iconRight}
    </button>
  );

  // A disabled button gets no hover events, so the shared Tooltip sits on a wrapper.
  return b.disabledTooltip ? (
    <Tooltip content={b.disabledTooltip}>
      <span className={styles.disabledWrapper}>{button}</span>
    </Tooltip>
  ) : (
    button
  );
}
