import { ActionStatusTagState } from "./ActionStatusTag.type";

export interface ActionStatusTagVariantConfig {
  className?: string;
}

export const ACTION_STATUS_TAG_MAP: Record<ActionStatusTagState, ActionStatusTagVariantConfig> = {
  "neutral-light": {
    className: "border-theme-neutral-300 bg-theme-neutral-100 text-theme-neutral-800"
  },
  "neutral-dark": {
    className: "border-theme-neutral-300 bg-theme-neutral-100 text-theme-neutral-900"
  },
  attention: {
    className: "border-theme-warning-300 bg-theme-warning-100 text-theme-warning-900"
  },
  success: {
    className: "border-theme-success-300 bg-theme-success-100 text-theme-success-900"
  },
  warning: {
    className: "border-theme-error-300 bg-theme-error-100 text-theme-error-900"
  }
};
