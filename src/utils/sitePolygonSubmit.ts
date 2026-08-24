import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

type Translate = (key: string, params?: Record<string, unknown>) => string;

type SubmitBlockingReason = "approved" | "submitted" | "not-started" | "failed-validation";

type SubmitValidationStatus = "not-started" | "failed" | "partial" | "passed";

type SubmitAvailabilityPolygon = {
  status?: SitePolygonLightDto["status"] | string | null;
  validationStatus?: SitePolygonLightDto["validationStatus"] | string | null;
};

const SUBMITTABLE_STATUSES: ReadonlySet<string> = new Set([POLYGON_DRAFT, POLYGON_INFORMATION_REQUIRED]);

export const normalizeSubmitValidationStatus = (
  validationStatus: SubmitAvailabilityPolygon["validationStatus"]
): SubmitValidationStatus => {
  switch (validationStatus) {
    case "passed":
      return "passed";
    case "partial":
    case "partially-passed":
      return "partial";
    case "failed":
      return "failed";
    default:
      return "not-started";
  }
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

  const validationStatus = normalizeSubmitValidationStatus(polygon?.validationStatus);
  if (validationStatus === "failed") {
    return "failed-validation";
  }
  if (validationStatus !== "passed" && validationStatus !== "partial") {
    return "not-started";
  }

  if (polygon?.status == null || !SUBMITTABLE_STATUSES.has(polygon.status)) {
    return "not-started";
  }

  return null;
};

export const isSitePolygonSubmittable = (polygon: SubmitAvailabilityPolygon | null | undefined): boolean =>
  getSitePolygonSubmitBlockingReason(polygon) == null;

export const shouldShowRunValidationAsPrimaryAction = (
  polygon: SubmitAvailabilityPolygon | null | undefined
): boolean =>
  polygon?.status === POLYGON_DRAFT && normalizeSubmitValidationStatus(polygon?.validationStatus) === "not-started";

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
      return t("Validation failed. Review and correct the issues before submitting.");
    case "not-started":
      return t("Run validation before submitting this polygon.");
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
    return t("These polygons have already been approved, submitted or failed validations.");
  }

  switch (Array.from(reasons)[0]) {
    case "approved":
      return t("These polygons have already been approved.");
    case "submitted":
      return t("These polygons have already been submitted.");
    case "failed-validation":
      return t("These polygons failed validation. Review and correct the issues before submitting.");
    case "not-started":
      return t("Run validation before submitting these polygons.");
    default:
      return undefined;
  }
};
