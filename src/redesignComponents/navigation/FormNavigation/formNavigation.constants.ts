export const TAB_TYPE = {
  COMPLETE: "complete",
  AVAILABLE: "available",
  DISABLED: "disabled",
  ERROR: "error"
} as const;

export type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE];

export const NAVIGATION_CLASSES = {
  tab: {
    base: "group h-13 w-72 gap-0 rounded-sm border-b border-theme-neutral-300 px-2 text-theme-primary-900 before:!h-0 hover:bg-theme-primary-100",
    selected: "border !border-theme-primary-900"
  },
  badge: {
    base: "text-18-bold mr-2 flex h-8 w-8 items-center justify-center rounded-full border shadow-monitored",
    complete: "border-theme-primary-400 text-theme-primary-800 group-hover:bg-theme-primary-400 bg-theme-primary-100",
    available: "border-theme-neutral-500 text-theme-neutral-700 group-hover:bg-theme-neutral-300 bg-theme-neutral-200",
    disabled: "border-theme-neutral-500 text-theme-neutral-700 group-hover:bg-theme-neutral-300 bg-theme-neutral-200",
    error: "!border-theme-error-300 !bg-theme-error-500"
  },
  label: {
    default: "text-16-light text-theme-neutral-700",
    selected: "text-16-bold text-theme-primary-900"
  },
  number: {
    base: "text-18-bold leading-[normal]",
    selected: "text-theme-primary-800",
    default: "text-theme-neutral-700"
  }
} as const;
