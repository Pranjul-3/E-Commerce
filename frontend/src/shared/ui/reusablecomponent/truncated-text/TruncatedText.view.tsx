import { Tooltip } from "../tooltip";
import { TEXT_MAX_CHARS } from "./TruncatedText.config";
import { isTruncated, truncateText, type TruncateMode } from "./truncateText";

export interface TruncatedTextProps {
  text: string;
  /** Longest text shown in full; anything longer is cut to this many characters + "…". Default 20. */
  max?: number;
  /** Where to cut: "end" (default) keeps the start, "start" keeps the end, "middle" keeps both ends. */
  mode?: TruncateMode;
  className?: string;
}

/** Text cut to `max` characters with "…" (where depends on `mode`); when cut, the full text is a tooltip on hover. */
export function TruncatedText({
  text,
  max = TEXT_MAX_CHARS,
  mode = "end",
  className,
}: TruncatedTextProps) {
  if (!isTruncated(text, max)) return <span className={className}>{text}</span>;
  return (
    <Tooltip content={text}>
      <span className={className}>{truncateText(text, max, mode)}</span>
    </Tooltip>
  );
}
