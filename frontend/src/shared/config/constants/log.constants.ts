// Developer-console log lines (shared/lib/logger: dev only, removed from production builds).
// Each area has its own tag so its lines are easy to spot / filter in the console.

export const LOG_TAGS = {
  /** API calls and response checks. */
  api: "+++ [API]",
  /** RCS templates. */
  rcs: "=== [RCS]",
  /** WhatsApp templates. */
  wa: "%%% [WA]",
  /** Campaigns. */
  campaign: "*** [Campaign]",
  /** Embedded signup (Meta). */
  signup: "### [Embedded signup]",
  /** Saved drafts / selections (localStorage). */
  persist: "~~~ [Saved state]",
  /** Page access (channels on the TUC). */
  access: ">>> [Access]",
  /** Shared UI components. */
  ui: "^^^ [UI]",
} as const;

export const LOG_TEXT = {
  api: {
    failed: (method: string, path: string, status: number, message: string) =>
      `${LOG_TAGS.api} ${method} ${path} → ${status || "no response"} ${message}`,
    /** Response checks (only report; nothing is changed). */
    structure: (endpoint: string, expected: string, got: string) =>
      `${LOG_TAGS.api} [contract] ${endpoint}: expected ${expected}, got ${got}`,
    missingKey: (endpoint: string, key: string, present: string) =>
      `${LOG_TAGS.api} [contract] ${endpoint}: "${key}" missing (got: ${present})`,
    wrongType: (endpoint: string, key: string, expected: string, got: string) =>
      `${LOG_TAGS.api} [contract] ${endpoint}: "${key}" should be ${expected}, got ${got}`,
  },
  persist: {
    unreadable: `${LOG_TAGS.persist} saved data could not be read (bad JSON or storage blocked); starting fresh`,
    badShape: `${LOG_TAGS.persist} saved data has an unexpected shape; starting fresh`,
    newer: (saved: number, current: number) =>
      `${LOG_TAGS.persist} saved data v${saved} is newer than this app (v${current}); starting fresh`,
    noMigration: (from: number, to: number) =>
      `${LOG_TAGS.persist} saved data v${from} discarded: no migration ${from} → ${to}`,
    migrationFailed: (from: number) =>
      `${LOG_TAGS.persist} saved data discarded: migration from v${from} failed`,
    migrated: (from: number, to: number) =>
      `${LOG_TAGS.persist} saved data upgraded v${from} → v${to}`,
    saveFailed: `${LOG_TAGS.persist} could not save (storage full or blocked)`,
  },
  campaign: {
    processingFailed: `${LOG_TAGS.campaign} start_processing failed`,
    phonebookCountFailed: `${LOG_TAGS.campaign} phonebook group count failed`,
    uploadFailed: (fileName: string) =>
      `${LOG_TAGS.campaign} upload failed: ${fileName}`,
    uploadRejected: (fileName: string) =>
      `${LOG_TAGS.campaign} upload answered without success: ${fileName}`,
    removeFailed: (fileName: string) =>
      `${LOG_TAGS.campaign} file remove failed: ${fileName}`,
    primaryFailed: (fileName: string) =>
      `${LOG_TAGS.campaign} set_primary failed: ${fileName}`,
  },
  wa: {
    mediaUploadFailed: (fileName: string) =>
      `${LOG_TAGS.wa} media upload failed: ${fileName}`,
  },
  rcs: {
    thumbnailFailed: (fileName: string) =>
      `${LOG_TAGS.rcs} video thumbnail could not be made: ${fileName}`,
    urlFetchFailed: (url: string) =>
      `${LOG_TAGS.rcs} media URL could not be downloaded (CORS / network); kept as a plain URL: ${url}`,
  },
  access: {
    redirect: (from: string, to: string, reason: string) =>
      `${LOG_TAGS.access} ${from} → ${to} (${reason})`,
    /** Why a page is not allowed: the channels it needs (and embedded signup, if it needs that). */
    needs: (channels: string, embeddedSignup: boolean) =>
      `needs ${channels || "a channel"} active on the TUC${embeddedSignup ? " with embedded signup enabled" : ""}`,
    loadFailed: `${LOG_TAGS.access} channels of the TUC could not be loaded`,
    noChannels: `${LOG_TAGS.access} no channel is active on this TUC`,
  },
  ui: {
    toggleFailed: `${LOG_TAGS.ui} Toggle: change failed`,
    fieldActionFailed: `${LOG_TAGS.ui} TextField: action failed`,
  },
} as const;
