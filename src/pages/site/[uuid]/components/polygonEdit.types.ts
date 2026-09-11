import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import type { ClippedVersionSummary } from "../hooks/overlapFix.utils";

/** Shared async callbacks for polygon drawer save / refetch flows. */
export type PolygonSaveCallback = () => void | Promise<void>;

export type PolygonOverlapFixParams = {
  previousPolygonUuid: string;
  primaryUuid?: string | null;
  sitePolygonUuid?: string | null;
  clippedVersions?: ClippedVersionSummary[];
  relatedPartnerUuids?: string[];
};

export type PolygonOverlapFixCallback = (params: PolygonOverlapFixParams) => Promise<SitePolygonLightDto | undefined>;

export type PolygonValidationJobsStartedOptions = {
  trackBulkCompletion?: boolean;
  validationAfterCriteriaClear?: boolean;
};

export type PolygonValidationJobsStartedCallback = (
  polygonUuids: string[],
  options?: PolygonValidationJobsStartedOptions
) => void;

export type PolygonRunValidationWithResultsOptions = {
  fallbackPolygons?: SitePolygonLightDto[];
  validationAfterCriteriaClear?: boolean;
  previousGeometryPolygonUuid?: string;
};

export type PolygonRunValidationWithResultsCallback = (
  geometryPolygonUuids: string[],
  options?: PolygonRunValidationWithResultsOptions
) => Promise<void>;
