import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";

type Translate = (key: string, params?: Record<string, unknown>) => string;

type ApproveBlockingReason = "approved" | "failed-validation" | "draft" | "information-required";

export type ReviewAvailabilityPolygon = {
  status?: string | null;
  validationStatus?: string | null;
};

export const getSitePolygonApproveBlockingReason = (
  polygon: ReviewAvailabilityPolygon | null | undefined
): ApproveBlockingReason | null => {
  if (polygon?.status === POLYGON_APPROVED) return "approved";
  if (polygon?.status === POLYGON_DRAFT) return "draft";
  if (polygon?.status === POLYGON_INFORMATION_REQUIRED) return "information-required";
  if (polygon?.validationStatus === "failed") return "failed-validation";
  return null;
};

export const isSitePolygonApprovable = (polygon: ReviewAvailabilityPolygon | null | undefined): boolean =>
  getSitePolygonApproveBlockingReason(polygon) == null;

export const getSingleSitePolygonApproveTooltip = (
  polygon: ReviewAvailabilityPolygon | null | undefined,
  t: Translate
): string | undefined => {
  switch (getSitePolygonApproveBlockingReason(polygon)) {
    case "approved":
      return t("This polygon has already been approved.");
    case "draft":
      return t("Polygons must be submitted before they can be approved.");
    case "information-required":
      return t("Additional information was requested");
    case "failed-validation":
      return t("Polygons that failed System Validation can't be approved.");
    default:
      return undefined;
  }
};

const getMultipleSitePolygonsApproveTooltip = (
  polygons: ReviewAvailabilityPolygon[],
  t: Translate
): string | undefined => {
  const reasons = new Set(
    polygons.map(getSitePolygonApproveBlockingReason).filter((r): r is ApproveBlockingReason => r != null)
  );

  if (reasons.size > 1) {
    return t("One or more polygons cannot be approved yet");
  }

  switch (Array.from(reasons)[0]) {
    case "approved":
      return t("These polygons have already been approved.");
    case "draft":
      return t("Polygons must be submitted before they can be approved.");
    case "information-required":
      return t("Additional information was requested");
    case "failed-validation":
      return t("Polygons that failed System Validation can't be approved.");
    default:
      return undefined;
  }
};

export const getSitePolygonsApproveTooltip = (
  polygons: ReviewAvailabilityPolygon[],
  t: Translate
): string | undefined => {
  if (polygons.length === 1) return getSingleSitePolygonApproveTooltip(polygons[0], t);
  return getMultipleSitePolygonsApproveTooltip(polygons, t);
};

export const getSitePolygonsApproveTooltipIfNoneEligible = (
  polygons: ReviewAvailabilityPolygon[],
  t: Translate
): string | undefined => {
  if (polygons.some(isSitePolygonApprovable)) return undefined;
  return getSitePolygonsApproveTooltip(polygons, t);
};

export const isSitePolygonEligibleForRequestInformation = (
  polygon: ReviewAvailabilityPolygon | null | undefined
): boolean => polygon?.status === POLYGON_PENDING_APPROVAL || polygon?.status === POLYGON_DRAFT;

export type PolygonTableReviewFields = {
  submission?: string | null;
  validation?: string | null;
};

export const toReviewAvailabilityPolygon = (polygon: PolygonTableReviewFields): ReviewAvailabilityPolygon => ({
  status: polygon.submission,
  validationStatus: polygon.validation
});
