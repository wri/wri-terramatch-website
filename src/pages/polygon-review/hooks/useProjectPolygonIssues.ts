import { useMemo } from "react";

import { SitePolygonMapIndexFilter, useSitePolygonMapIndex } from "@/connections/SitePolygons";
import type { SitePolygonMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { getDisturbancePolygonUuids, getMapPolygonUuids } from "../../site/[uuid]/utils/sitePolygonsWorkspace.utils";

type UseProjectPolygonIssuesParams = {
  projectUuid: string | null;
  siteUuids: string[];
  polygonFilter: SitePolygonMapIndexFilter;
};

const NO_POLYGONS: SitePolygonMapEntryDto[] = [];

/**
 * Polygons in the project scope with a failed overlap validation or a linked disturbance. The scoped map index request
 * is the same one the map makes, so only the overlap query adds a request.
 */
export const useProjectPolygonIssues = ({ projectUuid, siteUuids, polygonFilter }: UseProjectPolygonIssuesParams) => {
  const scope = {
    entityName: "projects" as const,
    entityUuid: projectUuid ?? undefined,
    siteUuids,
    enabled: projectUuid != null
  };
  const overlapFilter = useMemo(() => ({ ...polygonFilter, hasOverlap: true }), [polygonFilter]);

  const [, { data: mapIndex }] = useSitePolygonMapIndex({ ...scope, filter: polygonFilter });
  const [, { data: overlapMapIndex }] = useSitePolygonMapIndex({ ...scope, filter: overlapFilter });

  const mapPolygons = mapIndex?.polygons ?? NO_POLYGONS;
  const overlapPolygons = overlapMapIndex?.polygons ?? NO_POLYGONS;

  const overlapPolygonUuids = useMemo(() => getMapPolygonUuids(overlapPolygons), [overlapPolygons]);
  const disturbancePolygonUuids = useMemo(() => getDisturbancePolygonUuids(mapPolygons), [mapPolygons]);

  return { overlapPolygonUuids, disturbancePolygonUuids };
};
