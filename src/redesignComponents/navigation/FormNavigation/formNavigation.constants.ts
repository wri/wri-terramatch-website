export const TAB_TYPE = {
  COMPLETE: "complete",
  AVAILABLE: "available",
  DISABLED: "disabled",
  ERROR: "error",
  WARNING: "warning"
} as const;

export type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE];

export type BadgeStatus = "completed" | "active" | "available" | "disabled" | "error" | "warning";

export const BADGE_FOCUS_RING_CLASSES = "outline-offset-ring shrink-0";
export const FORCED_FOCUS_CLASSES = "outline-solid outline-2 !outline-offset-2 outline-theme-primary-700";
export const STEP_STATUS_HOVER_STYLE_MAP = {
  completed: "bg-theme-primary-200",
  active: "bg-theme-neutral-200",
  available: "bg-theme-neutral-300",
  disabled: "bg-theme-neutral-300",
  error: "bg-theme-error-150",
  warning: "bg-theme-warning-150"
} as const;

export const STEP_STATUS_PRESSED_STYLE_MAP = {
  completed: "bg-theme-primary-300",
  active: "bg-theme-neutral-400",
  available: "bg-theme-neutral-400",
  disabled: "bg-theme-neutral-300",
  error: "bg-theme-error-300",
  warning: "bg-theme-warning-300"
} as const;

export const NAVIGATION_CLASSES = {
  tab: {
    base: "group h-13 w-full gap-0 rounded-sm border-b border-theme-neutral-300 px-2 text-theme-primary-900 before:!h-0 hover:bg-theme-primary-100 focus-visible:outline focus-visible:outline-theme-primary-900"
  },
  badge: {
    base: "text-18-bold mr-2 flex h-8 w-8 items-center justify-center rounded-full border shadow-monitored",
    complete:
      "border-theme-primary-400 text-theme-primary-800 group-hover:bg-theme-primary-200 bg-theme-primary-100 group-active:bg-theme-primary-300",
    available:
      "border-theme-neutral-500 text-theme-neutral-700 group-hover:bg-theme-neutral-300 bg-theme-neutral-200 group-active:bg-theme-neutral-400",
    disabled:
      "border-theme-neutral-300 text-theme-neutral-700 group-hover:bg-theme-neutral-300 bg-theme-neutral-300 group-active:bg-theme-neutral-300",
    error:
      "border-theme-error-300 bg-theme-error-100 text-theme-error-500 group-hover:bg-theme-error-150 group-active:bg-theme-error-300",
    warning:
      "border-theme-warning-300 bg-theme-warning-100 text-theme-warning-500 group-hover:bg-theme-warning-150 group-active:bg-theme-warning-300"
  },
  label: {
    default: "text-16-light text-theme-neutral-700",
    selected: "text-16-bold text-theme-primary-900 font-bold"
  },
  number: {
    base: "text-18-bold leading-[normal]",
    selected: "text-theme-primary-800",
    default: "text-theme-neutral-700"
  }
} as const;
