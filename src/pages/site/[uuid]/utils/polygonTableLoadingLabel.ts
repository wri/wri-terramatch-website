import {
  getDeletingProgressLabel,
  getFixingOverlapsProgressLabel,
  getValidatingProgressLabel
} from "./polygonOperationToasts";

type GetPolygonTableLoadingLabelParams = {
  t: (key: string, params?: Record<string, unknown>) => string;
  isFixingOverlaps: boolean;
  fixingOverlapsCount: number;
  isValidatingPolygons: boolean;
  validatingPolygonCount: number;
  isDeletingPolygons: boolean;
  deletingPolygonCount: number;
  polygonLoadProgress: number;
  polygonLoadTotal: number;
};

export const getPolygonTableLoadingLabel = ({
  t,
  isFixingOverlaps,
  fixingOverlapsCount,
  isValidatingPolygons,
  validatingPolygonCount,
  isDeletingPolygons,
  deletingPolygonCount,
  polygonLoadProgress,
  polygonLoadTotal
}: GetPolygonTableLoadingLabelParams) => {
  if (isFixingOverlaps) {
    return getFixingOverlapsProgressLabel(t, fixingOverlapsCount);
  }

  if (isValidatingPolygons) {
    return getValidatingProgressLabel(t, validatingPolygonCount);
  }

  if (isDeletingPolygons) {
    return getDeletingProgressLabel(t, deletingPolygonCount);
  }

  if (polygonLoadTotal > 0) {
    return t("Loading polygons ({loaded}/{total})", { loaded: polygonLoadProgress, total: polygonLoadTotal });
  }

  return t("Loading polygons");
};
