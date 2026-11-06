import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import type { ClippedVersionSummary } from "../hooks/overlapFix.utils";
import type { SitePolygonTableRowSource, ValidatablePolygon } from "./polygonTableRow.utils";

/** Shared async callbacks for polygon drawer save / refetch flows. */
export type PolygonSaveCallback = () => void | Promise<void>;

/** Called after a save that made the backend clear validation criteria for these geometries. */
export type PolygonValidationClearedCallback = (geometryPolygonUuids: string[]) => Promise<unknown>;

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
  startedAtMs?: number;
};

export type PolygonValidationJobsStartedCallback = (
  polygons: ValidatablePolygon[],
  options?: PolygonValidationJobsStartedOptions
) => void;

export type PolygonRunValidationCallback = (polygons: ValidatablePolygon[]) => Promise<void>;

export type PolygonRunValidationWithResultsOptions = {
  validationAfterCriteriaClear?: boolean;
  previousGeometryPolygonUuid?: string;
};

export type PolygonRunValidationWithResultsCallback = (
  polygons: SitePolygonTableRowSource[],
  options?: PolygonRunValidationWithResultsOptions
) => Promise<void>;
