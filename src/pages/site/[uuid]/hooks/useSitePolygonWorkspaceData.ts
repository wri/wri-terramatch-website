import { useMemo } from "react";

import {
  type PolygonEntityScopeProps,
  useSitePolygonMapIndex,
  useSitePolygons,
  useSitePolygonSummary
} from "@/connections/SitePolygons";
import type { SitePolygonsIndexQueryParams } from "@/generated/v3/researchService/researchServiceComponents";

import { getDisturbancePolygonUuids, getMapPolygonUuids } from "../utils/sitePolygonsWorkspace.utils";

type UseSitePolygonWorkspaceDataParams = Required<Pick<PolygonEntityScopeProps, "entityName" | "entityUuid">> & {
  filter: Partial<SitePolygonsIndexQueryParams>;
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
};

/** Loads the table page, map index and summary for the polygons in one entity scope. */
export const useSitePolygonWorkspaceData = ({
  entityName,
  entityUuid,
  filter,
  pageNumber,
  pageSize,
  sortField,
  sortDirection
}: UseSitePolygonWorkspaceDataParams) => {
  const scope = { entityName, entityUuid, enabled: entityUuid !== "", filter };

  const [tablePolygonsLoaded, { data: tablePolygonsPageData, indexTotal, loadFailure }] = useSitePolygons({
    ...scope,
    pageNumber,
    pageSize,
    sortField,
    sortDirection
  });
  const [mapIndexLoaded, { data: mapIndex }] = useSitePolygonMapIndex(scope);
  const [, { data: summaryData }] = useSitePolygonSummary(scope);

  const mapPolygons = useMemo(() => mapIndex?.polygons ?? [], [mapIndex?.polygons]);

  const mapPolygonUuids = useMemo(() => getMapPolygonUuids(mapPolygons), [mapPolygons]);

  const disturbancePolygonUuids = useMemo(() => getDisturbancePolygonUuids(mapPolygons), [mapPolygons]);

  return {
    tablePolygonsLoaded,
    tablePolygonsPageData,
    tableTotalItems: indexTotal ?? 0,
    polygonLoadError: loadFailure,
    mapIndexLoaded,
    mapPolygons,
    mapPolygonTotal: mapIndex?.total ?? 0,
    mapPolygonUuids,
    disturbancePolygonUuids,
    totalTreesPlanted: summaryData?.sumNumTrees ?? 0,
    totalRestorationAreaHa: Math.round((summaryData?.sumCalcArea ?? 0) * 100) / 100
  };
};
