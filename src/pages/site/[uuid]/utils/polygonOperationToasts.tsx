import { showToast } from "@worldresources/wri-design-systems";
import { createElement } from "react";

import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

export const POLYGON_TOAST_PLACEMENT = "bottom-end" as const;
export const POLYGON_TOAST_DURATION_MS = 5000;

export const showPolygonProgressToast = (t: (key: string) => string, label: string) =>
  showToast({
    label,
    type: "info",
    placement: POLYGON_TOAST_PLACEMENT,
    duration: POLYGON_TOAST_DURATION_MS,
    closableLabel: t("Close"),
    icon: createElement(LoadingIcon, {
      boxSize: 7,
      color: "primary.700",
      animation: "spin 1s linear infinite"
    })
  });

export const showPolygonCompleteToast = (label: string) =>
  showToast({
    label,
    type: "success",
    placement: POLYGON_TOAST_PLACEMENT,
    duration: POLYGON_TOAST_DURATION_MS
  });

export const showPolygonErrorToast = (label: string) =>
  showToast({
    label,
    type: "error",
    placement: POLYGON_TOAST_PLACEMENT,
    duration: POLYGON_TOAST_DURATION_MS
  });

export type PolygonOperationToastLabels = {
  uploadingPolygonsProgress: string;
  uploadingPolygonsComplete: string;
  submittingProgress: string;
  submittingComplete: string;
  savingChangesProgress: string;
  savingChangesComplete: string;
  downloadingPolygonsProgress: string;
  downloadingPolygonsComplete: string;
  updatingPolygonsProgress: string;
  updatingPolygonsComplete: string;
  deletingProgress: string;
  deletingComplete: string;
  fixingOverlapsProgress: string;
  fixingOverlapsComplete: string;
  validatingProgress: string;
  downloadingSamplePlotsProgress: string;
  downloadingSamplePlotsComplete: string;
};

export const getPolygonOperationToastLabels = (t: (key: string) => string): PolygonOperationToastLabels => ({
  uploadingPolygonsProgress: t("Uploading Polygons..."),
  uploadingPolygonsComplete: t("Upload Complete"),
  submittingProgress: t("Submitting Polygons..."),
  submittingComplete: t("Submission Complete"),
  savingChangesProgress: t("Saving Changes..."),
  savingChangesComplete: t("Changes Saved"),
  downloadingPolygonsProgress: t("Downloading Polygons..."),
  downloadingPolygonsComplete: t("Download Complete"),
  updatingPolygonsProgress: t("Updating Polygons..."),
  updatingPolygonsComplete: t("Update Complete"),
  deletingProgress: t("Deleting Polygons..."),
  deletingComplete: t("Deletion Complete"),
  fixingOverlapsProgress: t("Fixing Polygon Overlaps..."),
  fixingOverlapsComplete: t("Overlap Fix Complete"),
  validatingProgress: t("Validating Polygon..."),
  downloadingSamplePlotsProgress: t("Downloading Sample Plots..."),
  downloadingSamplePlotsComplete: t("Download Complete")
});
