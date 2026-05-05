import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

export const POPUP_METRIC_UNAVAILABLE = "\u2014";

export type NormalizedPolygonValidationStatus = "notChecked" | "passed" | "partial" | "failed";

export const findSitePolygonByMapFeatureUuid = (
  sitePolygons: SitePolygonLightDto[] | undefined,
  polygonUuid: string
): SitePolygonLightDto | undefined => {
  if (polygonUuid === "" || sitePolygons == null || sitePolygons.length === 0) {
    return undefined;
  }
  return sitePolygons.find(p => p.polygonUuid === polygonUuid);
};

export const normalizePolygonValidationStatus = (
  validationStatus: string | null | undefined
): NormalizedPolygonValidationStatus => {
  if (validationStatus == null || validationStatus === "") {
    return "notChecked";
  }
  if (
    validationStatus === "passed" ||
    validationStatus === "partial" ||
    validationStatus === "failed" ||
    validationStatus === "notChecked"
  ) {
    return validationStatus;
  }
  return "notChecked";
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
