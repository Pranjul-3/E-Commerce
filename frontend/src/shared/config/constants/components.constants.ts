// UI text of every reusable component in shared/ui/reusablecomponent.
// Text that includes values is written as a small function.

export const BUTTON_TEXT = {
  iconOnlyWarning: "Button: icon-only buttons need an `aria-label`.",
  /** Common "why is this disabled" reasons. */
  busy: "Please wait until the current action finishes.",
  loading: "Still loading, please wait.",
} as const;

export const DROPDOWN_TEXT = {
  placeholder: "Select an option",
  empty: "No options found",
  clear: "Clear selection",
  searchPlaceholder: "Search...",
  searchAria: "Search options",
} as const;

export const DATE_DROPDOWN_TEXT = {
  label: "Date",
  customRangeAria: "Custom date range",
  from: "From",
  to: "To",
  cancel: "Cancel",
  apply: "Apply",
  invalidRange: "“From” must be on or before “To”.",
  appliedRange: (from: string, to: string) => `${from} → ${to}`,
  presets: {
    today: "Today",
    yesterday: "Yesterday",
    last7Days: "Last 7 days",
    thisMonth: "This month",
    lastMonth: "Last month",
    custom: "Custom range",
  },
} as const;

export const CHIP_TEXT = {
  remove: (label: string) => `Remove ${label}`,
  restore: (label: string) => `Restore ${label}`,
  more: (count: number) => `+${count}`,
} as const;

export const TOOLTIP_TEXT = {
  infotipAria: "More information",
} as const;

export const TEXT_FIELD_TEXT = {
  required: "This field is required",
  clear: "Clear",
  showPassword: "Show password",
  hidePassword: "Hide password",
  actionFailed: "Something went wrong. Please try again.",
  counter: (count: number, max: number) => `${count}/${max} chars used`,
} as const;

export const FILE_UPLOAD_TEXT = {
  dropHere: "Drag & drop a file here",
  dropHereMultiple: "Drag & drop files here",
  orBrowse: "or click to browse",
  browse: "Choose files",
  dropNow: "Drop to upload",
  remove: (name: string) => `Remove ${name}`,
  accepted: (types: string) => `Accepted: ${types}`,
  maxSize: (size: string) => `Max ${size}`,
  wrongType: (name: string) => `${name}: file type not allowed.`,
  tooLarge: (name: string, size: string, max: string) =>
    `${name} is ${size}; the limit is ${max}.`,
  tooMany: (max: number) =>
    `You can upload up to ${max} file${max === 1 ? "" : "s"}.`,
  duplicate: (name: string) => `${name} is already added.`,
} as const;

export const CROPPER_TEXT = {
  roleDescription: "image cropper",
  frameLabel:
    "Image position. Drag or use arrow keys to move, plus and minus to zoom.",
  cropAreaLabel:
    "Crop area. Drag the box to move it, drag a corner to resize, or use the arrow keys.",
  modeLabel: "Crop mode",
  modes: { crop: "Crop", fit: "Fit", drag: "Drag" },
  modeHints: {
    crop: "Move or resize the box to choose the part of the image to keep.",
    fit: "The whole image is kept; the empty space is filled.",
    drag: "Drag to position the image · scroll or pinch to zoom.",
  },
  backgroundLabel: "Fill",
  backgrounds: { color: "Colour", blur: "Blurred image" },
  backgroundColor: "Background colour",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  zoom: "Zoom",
  reset: "Reset",
  cancel: "Cancel",
  apply: "Apply",
  notReady: "The image is still loading.",
  loadError: "This image could not be loaded.",
  exportError: "Could not create the cropped image.",
  outputSize: (w: number, h: number) => `Output ${w} × ${h} px`,
  ratio: (w: number, h: number) => `Ratio ${w}:${h}`,
} as const;

export const TABLE_TEXT = {
  searchPlaceholder: "Search...",
  empty: "No data found",
  downloadFileName: "table",
  download: "Download",
  nothingToDownload: "There is no data to download.",
  sortedAscending: "Already sorted ascending.",
  sortedDescending: "Already sorted descending.",
  filter: "Filter",
  showFilters: "Show filters",
  hideFilters: "Hide filters",
  filtersTitle: "Filters",
  closeFilters: "Close filters",
  reset: "Reset",
  apply: "Apply",
  appliedFilters: "Applied filters",
  appliedCount: (n: number) =>
    `${n} filter${n === 1 ? "" : "s"} applied — show / manage`,
  closeApplied: "Close applied filters",
  editFilters: "Edit filters",
  clearAllFilters: "Clear all",
  filterChip: (column: string, value: string) => `${column}: ${value}`,
  selectAllOnPage: "Select all rows on this page",
  selectRow: (rowNumber: number) => `Select row ${rowNumber}`,
  cannotSelectRow: "Cannot select this row",
  sortAscending: "Sort ascending",
  sortDescending: "Sort descending",
  expandColumn: "Expand column",
  collapseColumn: "Collapse column",
} as const;

export const TABLE_FILTER_TEXT = {
  placeholder: (label: string) => `Filter by ${label}`,
  defaultLabel: "value",
  dateLabel: "date",
} as const;

export const SEARCH_BOX_TEXT = {
  placeholder: "Search",
} as const;

export const PAGINATION_TEXT = {
  onFirstPage: "You are on the first page.",
  onLastPage: "You are on the last page.",
  navLabel: "Pagination",
  noItems: "0 items",
  range: (first: number, last: number, total: number) =>
    `${first}-${last} of ${total} items`,
  rowsPerPage: "Rows per page",
  perPage: "Per Page",
  currentPage: "Current page",
  ofPages: (count: number) => `of ${count}`,
  previous: "Previous page",
  next: "Next page",
} as const;

export const ROW_ACTIONS_TEXT = {
  trigger: "More actions",
  disabled: "Actions are disabled",
  edit: "Edit",
  clone: "Clone",
  duplicate: "Duplicate",
  assign: "Assign",
  preview: "Preview",
  launch: "Launch",
  retry: "Retry",
  approve: "Approve",
  reject: "Reject",
  curl: "Generate cURL",
  review: "Review",
  delete: "Delete",
} as const;

export const TOGGLE_TEXT = {
  active: "Active",
  inactive: "Inactive",
  updating: "Updating…",
  failed: "Could not update. Please try again.",
} as const;

export const MODAL_TEXT = {
  close: "Close",
} as const;

export const CONFIRMATION_MODAL_TEXT = {
  confirm: "Confirm",
  cancel: "Cancel",
  detailsTitle: "Details",
  none: "None",
  failed: "Something went wrong. Please try again.",
  acknowledgement: "I understand and want to proceed with this action",
  discard: {
    title: "Discard changes?",
    message: "You have unsaved changes. If you leave now, they will be lost.",
    warning: "This action cannot be undone.",
    acknowledgement: "I understand that my changes will be lost",
    confirm: "Discard",
    cancel: "Keep editing",
  },
} as const;

export const API_TEXT = {
  noBaseUrl: "Configuration error: API server not configured correctly",
  network: "Unable to connect to API server - service unavailable",
  unknown: "Unknown error occurred",
  httpStatus: (status: number, statusText: string) =>
    `HTTP ${status}${statusText ? `: ${statusText}` : ""}`,
} as const;

export const TOAST_TEXT = {
  dismiss: "Dismiss notification",
} as const;

export const EMOJI_TEXT = {
  button: "Emoji",
  dialog: "Pick an emoji",
  loading: "Loading emojis…",
} as const;

export const DATE_TIME_PICKER_TEXT = {
  placeholder: "yyyy-MM-dd HH:mm:ss",
  dialog: "Pick date and time",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  hour: "Hour",
  minute: "Minute",
  second: "Second",
  pickDay: "Pick a day first.",
  pickValid: "Pick a day (and a time that has not passed) first.",
  now: "Now",
  clear: "Clear",
  apply: "Apply",
} as const;

export const PHONE_INPUT_TEXT = {
  selectCountry: "Select country code",
  searchPlaceholder: "Search country or code...",
  noCountries: "No countries found",
  globe: "🌐",
  placeholder: "Phone number",
} as const;

export const DURATION_FIELD_TEXT = {
  units: { d: "days", h: "hours", m: "minutes" },
  short: { d: "d", h: "h", m: "min" },
  presets: "Quick picks",
  /** "1 h 30 min", "2 d", "15 min". */
  format: (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.round((seconds % 3600) / 60);
    const parts = [d && `${d} d`, h && `${h} h`, m && `${m} min`].filter(
      Boolean,
    );
    return parts.length ? parts.join(" ") : "0 min";
  },
} as const;

export const FILTER_TABS_TEXT = {
  more: "More",
  moreLabel: (n: number) => `${n} more filters`,
  /** Multi-select: how many of the hidden ("More") values are picked. */
  morePicked: (n: number) => `+${n}`,
} as const;

export const CHANGES_NOTICE_TEXT = {
  view: "View",
  go: "Go",
  goLabel: (title: string) => `Go to ${title}`,
} as const;

export const NEW_ITEMS_PILL_TEXT = {
  show: "Show",
} as const;

export const SIDE_PANEL_TEXT = {
  close: "Close",
} as const;

export const DONUT_LEGEND_TEXT = {
  /** The slice that groups everything past the top few. */
  other: (n: number) => `Other (${n})`,
} as const;

export const SKELETON_LIST_TEXT = {
  loading: "Loading",
} as const;
