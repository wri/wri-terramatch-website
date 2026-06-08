import { closeToast, showToast } from "@worldresources/wri-design-systems";
import { createElement } from "react";

import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

export const POLYGON_TOAST_PLACEMENT = "bottom" as const;
export const POLYGON_TOAST_DURATION_MS = 5000;

export const POLYGON_TOAST_IDS = {
  uploading: "polygon-uploading-toast",
  updating: "polygon-updating-toast",
  submitting: "polygon-submitting-toast",
  downloading: "polygon-downloading-toast",
  downloadingSamplePlots: "polygon-downloading-sample-plots-toast",
  savingChanges: "polygon-saving-changes-toast",
  fixingOverlaps: "polygon-fixing-overlaps-toast",
  deleting: "polygon-deleting-toast",
  validating: "polygon-validating-toast"
} as const;

export type PolygonToastId = (typeof POLYGON_TOAST_IDS)[keyof typeof POLYGON_TOAST_IDS];

export const showPolygonProgressToast = (t: (key: string) => string, label: string, id: PolygonToastId) =>
  showToast({
    label,
    id,
    type: "info",
    placement: POLYGON_TOAST_PLACEMENT,
    duration: POLYGON_TOAST_DURATION_MS,
    closableLabel: t("Close"),
    icon: createElement(LoadingIcon, {
      boxSize: 7,
      color: "primary.700",
      animation: "spin 1s linear infinite"
    }),
    maxWidth: "auto"
  });

export const closePolygonProgressToast = (id: PolygonToastId) => closeToast(id);

export const showPolygonCompleteToast = (label: string) =>
  showToast({
    label,
    type: "success",
    placement: POLYGON_TOAST_PLACEMENT,
    duration: POLYGON_TOAST_DURATION_MS,
    maxWidth: "auto"
  });

export const showPolygonErrorToast = (label: string) =>
  showToast({
    label,
    type: "error",
    placement: POLYGON_TOAST_PLACEMENT,
    duration: POLYGON_TOAST_DURATION_MS,
    maxWidth: "auto"
  });

type TranslateFn = (key: string) => string;

const polygonCountLabel = (t: TranslateFn, count: number | undefined, singular: string, plural: string) =>
  count === 1 ? t(singular) : t(plural);

export const getUploadingPolygonsProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(t, count, "Uploading Polygon...", "Uploading Polygons...");

export const getSubmittingProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(t, count, "Submitting Polygon...", "Submitting Polygons...");

export const getDownloadingPolygonsProgressLabel = (t: TranslateFn, count?: number) =>
  polygonCountLabel(t, count, "Downloading Polygon...", "Downloading Polygons...");

export const getUpdatingPolygonsProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(t, count, "Updating Polygon...", "Updating Polygons...");

export const getDeletingProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(t, count, "Deleting Polygon...", "Deleting Polygons...");

export const getValidatingProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(t, count, "Validating Polygon...", "Validating Polygons...");

export const getFixingOverlapsProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(t, count, "Fixing Polygon Overlaps...", "Fixing Polygons' Overlaps...");

export type PolygonOperationToastLabels = {
  uploadingPolygonsComplete: string;
  submittingComplete: string;
  savingChangesProgress: string;
  savingChangesComplete: string;
  downloadingPolygonsComplete: string;
  updatingPolygonsComplete: string;
  deletingComplete: string;
  fixingOverlapsComplete: string;
  downloadingSamplePlotsProgress: string;
  downloadingSamplePlotsComplete: string;
  validatingComplete: string;
};

export const getPolygonOperationToastLabels = (t: TranslateFn): PolygonOperationToastLabels => ({
  uploadingPolygonsComplete: t("Upload Complete"),
  submittingComplete: t("Submission Complete"),
  savingChangesProgress: t("Saving Changes..."),
  savingChangesComplete: t("Changes Saved"),
  downloadingPolygonsComplete: t("Download Complete"),
  updatingPolygonsComplete: t("Update Complete"),
  deletingComplete: t("Polygon Deleted"),
  fixingOverlapsComplete: t("Overlap Fix Complete"),
  downloadingSamplePlotsProgress: t("Downloading Sample Plots..."),
  downloadingSamplePlotsComplete: t("Download Complete"),
  validatingComplete: t("Validation Complete")
});
