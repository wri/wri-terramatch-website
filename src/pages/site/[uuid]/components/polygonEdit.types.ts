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

export type PolygonValidationJobsStartedCallback = (
  polygonUuids: string[],
  options?: { trackBulkCompletion?: boolean }
) => void;

export type PolygonValidationPendingCallback = (geometryPolygonUuids: string[], options?: { poll?: boolean }) => void;
