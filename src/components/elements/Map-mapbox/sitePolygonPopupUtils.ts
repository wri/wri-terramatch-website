import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { ValidationTagState } from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";

export const POPUP_METRIC_UNAVAILABLE = "\u2014";

export type NormalizedPolygonValidationStatus = ValidationTagState;

export const findSitePolygonByMapFeatureUuid = (
  sitePolygons: SitePolygonLightDto[] | undefined,
  polygonUuid: string
): SitePolygonLightDto | undefined => {
  if (polygonUuid === "" || sitePolygons == null || sitePolygons.length === 0) {
    return undefined;
  }
  return sitePolygons.find(p => p.polygonUuid === polygonUuid);
};

export const getSitePolygonGeometryUuid = (sitePolygon: SitePolygonLightDto | undefined): string | null => {
  const geometryUuid = sitePolygon?.polygonUuid;
  return geometryUuid != null && geometryUuid !== "" ? geometryUuid : null;
};

export const resolvePolygonTableRowId = (
  polygons: SitePolygonLightDto[] | undefined,
  mapFeatureUuid: string
): string | null => {
  if (mapFeatureUuid === "" || polygons == null || polygons.length === 0) {
    return null;
  }

  const match = polygons.find(polygon => polygon.polygonUuid === mapFeatureUuid || polygon.uuid === mapFeatureUuid);
  const rowId = match?.polygonUuid ?? match?.uuid ?? mapFeatureUuid;
  return rowId !== "" ? rowId : null;
};

export const normalizePolygonValidationStatus = (
  validationStatus: string | null | undefined
): NormalizedPolygonValidationStatus => {
  if (validationStatus == null || validationStatus === "") {
    return "not-started";
  }
  if (validationStatus === "passed" || validationStatus === "failed") {
    return validationStatus;
  }
  if (validationStatus === "partial") {
    return "partially-passed";
  }
  return "not-started";
};

export const formatTreesPlantedForPopup = (value: number | null | undefined): string => {
  if (value == null) {
    return POPUP_METRIC_UNAVAILABLE;
  }
  return Math.round(value).toLocaleString("en-US");
};

export const formatAreaHectaresForPopup = (value: number | null | undefined): string => {
  if (value == null) {
    return POPUP_METRIC_UNAVAILABLE;
  }
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
