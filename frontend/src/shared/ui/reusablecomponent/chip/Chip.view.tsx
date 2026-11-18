import { ArrowUp, X } from "lucide-react";
import { CHIP_TEXT } from "@/shared/config/constants";
import { Tooltip } from "../tooltip";
import { useChip } from "./Chip.hook";
import type { ChipProps } from "./Chip.types";
import styles from "./Chip.module.scss";

export function Chip(props: ChipProps) {
  const { label, icon, title, tooltip, disabled } = props;
  const c = useChip(props);

  const chip = (
    <span
      className={c.className}
      title={tooltip ? undefined : (title ?? label)}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
      {c.action && (
        <button
          type="button"
          className={styles.action}
          onClick={c.handleAction}
          disabled={disabled}
          aria-label={
            c.action.kind === "remove"
              ? CHIP_TEXT.remove(label)
              : CHIP_TEXT.restore(label)
          }
        >
          {c.action.kind === "remove" ? <X size={12} /> : <ArrowUp size={12} />}
        </button>
      )}
    </span>
  );
  return tooltip ? <Tooltip content={tooltip}>{chip}</Tooltip> : chip;
}
