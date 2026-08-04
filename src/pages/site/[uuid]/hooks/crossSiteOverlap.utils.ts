import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { type OverlapExtraInfo, checkPolygonFixability } from "@/utils/polygonFixValidation";

import { getOverlapCriteria } from "./overlapFix.utils";

const toNonEmptyUuid = (value: string | null | undefined): value is string => value != null && value !== "";

const toUuidSet = (currentSiteGeometryUuids: ReadonlySet<string> | string[]): ReadonlySet<string> =>
  currentSiteGeometryUuids instanceof Set ? currentSiteGeometryUuids : new Set(currentSiteGeometryUuids);

export const getCrossSiteOverlapPartners = (
  overlapDetails: OverlapExtraInfo[],
  currentSiteGeometryUuids: ReadonlySet<string> | string[]
): OverlapExtraInfo[] => {
  const currentSiteUuids = toUuidSet(currentSiteGeometryUuids);

  return overlapDetails.filter(detail => toNonEmptyUuid(detail.polyUuid) && !currentSiteUuids.has(detail.polyUuid));
};

export const getCrossSiteOverlapPartnerUuids = (
  overlapDetails: OverlapExtraInfo[],
  currentSiteGeometryUuids: ReadonlySet<string> | string[]
): string[] => [
  ...new Set(getCrossSiteOverlapPartners(overlapDetails, currentSiteGeometryUuids).map(({ polyUuid }) => polyUuid))
];

export const hasCrossSiteOverlap = (
  overlapDetails: OverlapExtraInfo[],
  currentSiteGeometryUuids: ReadonlySet<string> | string[]
): boolean => getCrossSiteOverlapPartners(overlapDetails, currentSiteGeometryUuids).length > 0;

export const getCrossSiteOverlapPartnersForValidation = (
  validation: ValidationDto | undefined,
  currentSiteGeometryUuids: ReadonlySet<string> | string[]
): OverlapExtraInfo[] => {
  const overlapCriteria = getOverlapCriteria(validation);
  if (overlapCriteria == null) {
    return [];
  }

  const { overlapDetails } = checkPolygonFixability(overlapCriteria.extraInfo);
  return getCrossSiteOverlapPartners(overlapDetails, currentSiteGeometryUuids);
};
