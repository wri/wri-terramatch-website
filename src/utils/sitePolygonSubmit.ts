import { POLYGON_APPROVED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

type Translate = (key: string, params?: Record<string, unknown>) => string;

type SubmitBlockingReason = "approved" | "failed-validation" | "submitted";

type SubmitAvailabilityPolygon = {
  status?: SitePolygonLightDto["status"] | string | null;
  validationStatus?: SitePolygonLightDto["validationStatus"] | string | null;
};

export const getSitePolygonSubmitBlockingReason = (
  polygon: SubmitAvailabilityPolygon | null | undefined
): SubmitBlockingReason | null => {
  if (polygon?.status === POLYGON_APPROVED) {
    return "approved";
  }
  if (polygon?.status === POLYGON_PENDING_APPROVAL) {
    return "submitted";
  }
  if (polygon?.validationStatus === "failed") {
    return "failed-validation";
  }
  return null;
};

export const isSitePolygonSubmittable = (polygon: SubmitAvailabilityPolygon | null | undefined): boolean =>
  getSitePolygonSubmitBlockingReason(polygon) == null;

export const getSingleSitePolygonSubmitTooltip = (
  polygon: SubmitAvailabilityPolygon | null | undefined,
  t: Translate
): string | undefined => {
  switch (getSitePolygonSubmitBlockingReason(polygon)) {
    case "approved":
      return t("This polygon has already been approved.");
    case "submitted":
      return t("This polygon has already been submitted.");
    case "failed-validation":
      return t("Polygons that failed System Validation can’t be submitted.");
    default:
      return undefined;
  }
};

export const getSitePolygonsSubmitTooltip = (
  polygons: SubmitAvailabilityPolygon[],
  t: Translate
): string | undefined => {
  if (polygons.length === 1) {
    return getSingleSitePolygonSubmitTooltip(polygons[0], t);
  }
  return getMultipleSitePolygonsSubmitTooltip(polygons, t);
};

export const getSitePolygonsSubmitTooltipIfNoneEligible = (
  polygons: SubmitAvailabilityPolygon[],
  t: Translate
): string | undefined => {
  if (polygons.some(isSitePolygonSubmittable)) {
    return undefined;
  }
  return getSitePolygonsSubmitTooltip(polygons, t);
};

export const getMultipleSitePolygonsSubmitTooltip = (
  polygons: SubmitAvailabilityPolygon[],
  t: Translate
): string | undefined => {
  const reasons = new Set(
    polygons.map(getSitePolygonSubmitBlockingReason).filter((reason): reason is SubmitBlockingReason => reason != null)
  );

  if (reasons.size > 1) {
    return t("These polygons have already been approved, submitted, or failed validation.");
  }

  switch (Array.from(reasons)[0]) {
    case "approved":
      return t("These polygons have already been approved.");
    case "submitted":
      return t("These polygons have already been submitted.");
    case "failed-validation":
      return t("Polygons that failed System Validation can’t be submitted.");
    default:
      return undefined;
  }
};
