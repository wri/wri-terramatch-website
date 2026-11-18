import { useMemo } from "react";

import { SitePolygonMapIndexFilter, useSitePolygonMapIndex } from "@/connections/SitePolygons";
import type { SitePolygonMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { getDisturbancePolygonUuids, getMapPolygonUuids } from "../../site/[uuid]/utils/sitePolygonsWorkspace.utils";

type UseProjectPolygonIssuesParams = {
  projectUuid: string | null;
  siteUuids: string[];
  polygonFilter: SitePolygonMapIndexFilter;
  showDeleted: boolean;
};

const NO_POLYGONS: SitePolygonMapEntryDto[] = [];

export const useProjectPolygonIssues = ({
  projectUuid,
  siteUuids,
  polygonFilter,
  showDeleted
}: UseProjectPolygonIssuesParams) => {
  const scope = {
    entityName: "projects" as const,
    entityUuid: projectUuid ?? undefined,
    siteUuids,
    enabled: projectUuid != null
  };
  const overlapFilter = useMemo(() => ({ ...polygonFilter, hasOverlap: true }), [polygonFilter]);

  const [, { data: mapIndex }] = useSitePolygonMapIndex({ ...scope, filter: polygonFilter });
  // Overlaps don't apply to deleted polygons, so the overlap query is skipped in the deleted audit view.
  const [, { data: overlapMapIndex }] = useSitePolygonMapIndex({
    ...scope,
    enabled: scope.enabled && !showDeleted,
    filter: overlapFilter
  });

  const mapPolygons = mapIndex?.polygons ?? NO_POLYGONS;
  const overlapPolygons = showDeleted ? NO_POLYGONS : overlapMapIndex?.polygons ?? NO_POLYGONS;

  const overlapPolygonUuids = useMemo(() => getMapPolygonUuids(overlapPolygons), [overlapPolygons]);
  const disturbancePolygonUuids = useMemo(() => getDisturbancePolygonUuids(mapPolygons), [mapPolygons]);

  return { overlapPolygonUuids, disturbancePolygonUuids };
};
