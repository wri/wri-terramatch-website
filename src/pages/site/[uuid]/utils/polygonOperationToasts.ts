import { closeToast, showToast } from "@worldresources/wri-design-systems";
import { createElement } from "react";

import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

export const POLYGON_TOAST_PLACEMENT = "bottom" as const;
export const POLYGON_TOAST_DURATION_MS = 5000;
/** Progress toasts must persist until the async task finishes; design system defaults to 5s when omitted. */
export const POLYGON_PROGRESS_TOAST_DURATION_MS = Number.POSITIVE_INFINITY;

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
    duration: POLYGON_PROGRESS_TOAST_DURATION_MS,
    closableLabel: t("Close"),
    icon: createElement(LoadingIcon, {
      boxSize: 7,
      color: "primary.700",
      animation: "spin 1s linear infinite"
    }),
    maxWidth: "auto"
  });

export const closePolygonProgressToast = (id: PolygonToastId) => closeToast(id);

export const completePolygonProgressToast = (id: PolygonToastId, label: string) =>
  showToast({
    id,
    label,
    type: "success",
    placement: POLYGON_TOAST_PLACEMENT,
    duration: POLYGON_TOAST_DURATION_MS,
    maxWidth: "auto"
  });

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

const polygonCountLabel = (count: number | undefined, singular: string, plural: string) =>
  count === 1 ? singular : plural;

export const getUploadingPolygonsProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(count, t("Uploading Polygon"), t("Uploading Polygons"));

export const getSubmittingProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(count, t("Submitting Polygon"), t("Submitting Polygons"));

export const getDownloadingPolygonsProgressLabel = (t: TranslateFn, count?: number) =>
  polygonCountLabel(count, t("Downloading Polygon"), t("Downloading Polygons"));

export const getUpdatingPolygonsProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(count, t("Updating Polygon"), t("Updating Polygons"));

export const getDeletingProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(count, t("Deleting Polygon"), t("Deleting Polygons"));

export const getValidatingProgressLabel = (t: TranslateFn, count: number) =>
  polygonCountLabel(count, t("Validating Polygon"), t("Validating Polygons"));

export const getFixingOverlapsProgressLabel = (t: TranslateFn, count: number) =>
  count === 1 ? t("Fixing Polygon Overlaps") : t("Fixing Polygons Overlaps");

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
  savingChangesProgress: t("Saving Changes"),
  savingChangesComplete: t("Changes Saved"),
  downloadingPolygonsComplete: t("Download Complete"),
  updatingPolygonsComplete: t("Update Complete"),
  deletingComplete: t("Deletion Complete"),
  fixingOverlapsComplete: t("Overlap Fix Complete"),
  downloadingSamplePlotsProgress: t("Downloading Sample Plots"),
  downloadingSamplePlotsComplete: t("Download Complete"),
  validatingComplete: t("Validation Complete")
});
