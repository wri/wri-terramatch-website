import { closeToast } from "@worldresources/wri-design-systems";
import { createElement } from "react";

import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import { showToast } from "@/redesignComponents/status/Toast/showToast";

export const ENTITY_TOAST_PLACEMENT = "bottom" as const;
export const ENTITY_TOAST_DURATION_MS = 5000;
/** Progress toasts must persist until the async task finishes; design system defaults to 5s when omitted. */
export const ENTITY_PROGRESS_TOAST_DURATION_MS = Number.POSITIVE_INFINITY;

export const ENTITY_TOAST_IDS = {
  downloading: "entity-downloading-toast",
  uploading: "entity-uploading-toast",
  updating: "entity-updating-toast",
  submitting: "entity-submitting-toast",
  deleting: "entity-deleting-toast",
  validating: "entity-validating-toast"
} as const;

export type EntityToastId = (typeof ENTITY_TOAST_IDS)[keyof typeof ENTITY_TOAST_IDS];

export const showEntityProgressToast = (t: (key: string) => string, label: string, id: EntityToastId) =>
  showToast({
    label,
    id,
    type: "info",
    placement: ENTITY_TOAST_PLACEMENT,
    duration: ENTITY_PROGRESS_TOAST_DURATION_MS,
    closableLabel: t("Close"),
    icon: createElement(LoadingIcon, {
      boxSize: 7,
      color: "primary.700",
      animation: "spin 1s linear infinite"
    })
  });

export const closeEntityProgressToast = (id: EntityToastId) => closeToast(id);

export const completeEntityProgressToast = (id: EntityToastId, label: string) =>
  showToast({
    id,
    label,
    type: "success",
    placement: ENTITY_TOAST_PLACEMENT,
    duration: ENTITY_TOAST_DURATION_MS
  });

export const showEntityCompleteToast = (label: string) =>
  showToast({
    label,
    type: "success",
    placement: ENTITY_TOAST_PLACEMENT,
    duration: ENTITY_TOAST_DURATION_MS
  });

export const showEntityErrorToast = (label: string) =>
  showToast({
    label,
    type: "error",
    placement: ENTITY_TOAST_PLACEMENT,
    duration: ENTITY_TOAST_DURATION_MS
  });
