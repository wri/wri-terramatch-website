import {
  getDeletingProgressLabel,
  getFixingOverlapsProgressLabel,
  getValidatingProgressLabel
} from "./polygonOperationToasts";

type GetPolygonTableLoadingLabelParams = {
  t: (key: string, params?: Record<string, unknown>) => string;
  isFixingOverlaps: boolean;
  fixingOverlapsCount: number;
  isSubmittingPolygons: boolean;
  submittingPolygonCount: number;
  isValidatingPolygons: boolean;
  validatingPolygonCount: number;
  isDeletingPolygons: boolean;
  deletingPolygonCount: number;
};

export const getSubmittingTableLoadingLabel = (t: (key: string) => string, count: number) =>
  count === 1 ? t("Submitting Polygon") : t("Submitting Polygons");

export const getPolygonTableLoadingLabel = ({
  t,
  isFixingOverlaps,
  fixingOverlapsCount,
  isSubmittingPolygons,
  submittingPolygonCount,
  isValidatingPolygons,
  validatingPolygonCount,
  isDeletingPolygons,
  deletingPolygonCount
}: GetPolygonTableLoadingLabelParams) => {
  if (isFixingOverlaps) {
    return getFixingOverlapsProgressLabel(t, fixingOverlapsCount);
  }

  if (isSubmittingPolygons) {
    return getSubmittingTableLoadingLabel(t, submittingPolygonCount);
  }

  if (isValidatingPolygons) {
    return getValidatingProgressLabel(t, validatingPolygonCount);
  }

  if (isDeletingPolygons) {
    return getDeletingProgressLabel(t, deletingPolygonCount);
  }

  return t("Loading polygons");
};
