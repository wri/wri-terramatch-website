import { useMemo } from "react";

import { Anomaly } from "@/components/projectData/anomalies/types";
import { useProjectAnomalies } from "@/components/projectData/anomalies/useProjectAnomalies";
import { useAllSitePolygons } from "@/connections/SitePolygons";

/**
 * The project anomaly engine, narrowed to one site.
 *
 * `useProjectAnomalies` is called WITHOUT the project DTO: the project-goal watchlist checks
 * (under-/over-mapped, trees-vs-hectares desync) are inherently project-level and correctly stay
 * silent without it. What remains is exactly the site-relevant set — per-polygon geometry
 * validation, no-activity-after-plant-start, implausible density — which we then filter to this
 * site: an anomaly attached to the site itself, or to any polygon that belongs to it.
 */
export type UseSiteAnomaliesResult = {
  loaded: boolean;
  anomalies: Anomaly[];
  /** anomaly count keyed by entityUuid (site or polygon), for per-row badges. */
  countsByEntity: Record<string, number>;
  /** Distinct site-wide anomaly count, for the headline badge. */
  totalCount: number;
};

export const useSiteAnomalies = (projectUuid?: string, siteUuid?: string): UseSiteAnomaliesResult => {
  const { loaded, anomalies } = useProjectAnomalies(projectUuid);

  const { data: polygons } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: siteUuid != null && siteUuid !== ""
  });

  return useMemo<UseSiteAnomaliesResult>(() => {
    const sitePolygonUuids = new Set((polygons ?? []).map(polygon => polygon.uuid));
    const filtered = anomalies.filter(
      anomaly => anomaly.entityUuid === siteUuid || sitePolygonUuids.has(anomaly.entityUuid)
    );

    const countsByEntity: Record<string, number> = {};
    for (const anomaly of filtered) {
      countsByEntity[anomaly.entityUuid] = (countsByEntity[anomaly.entityUuid] ?? 0) + 1;
    }

    return { loaded, anomalies: filtered, countsByEntity, totalCount: filtered.length };
  }, [loaded, anomalies, polygons, siteUuid]);
};
