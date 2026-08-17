import { useMemo } from "react";

import { Anomaly } from "@/components/projectData/anomalies/types";
import { useProjectAnomalies } from "@/components/projectData/anomalies/useProjectAnomalies";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { EntityLevel } from "./entityLevel";

/**
 * The one anomaly hook, for a project or a site.
 *
 * The engine (`computeAnomalies` / `useProjectAnomalies`) always runs at project scope — it needs the
 * whole project's rollups and polygon set to do its work. This hook is the level lens over it:
 *  - at project level it returns the full result, and takes the project DTO so the goal-relative
 *    watchlist checks (under-/over-mapped, trees-vs-hectares) can fire;
 *  - at site level it is called WITHOUT the DTO — so those project-goal checks correctly stay silent —
 *    and the result is filtered to this site: an anomaly on the site itself, or on any polygon that
 *    belongs to it.
 *
 * Both the Actions panel and the anomaly badge read this, so the panel and the badge can never
 * disagree about a level's count.
 */
export type EntityAnomalies = {
  loaded: boolean;
  anomalies: Anomaly[];
  /** Count keyed by entityUuid (site or polygon), for per-row badges. */
  countsByEntity: Record<string, number>;
  /** Distinct count in scope, for the headline badge. */
  totalCount: number;
};

export const useEntityAnomalies = ({
  level,
  projectUuid,
  siteUuid,
  project
}: {
  level: EntityLevel;
  projectUuid?: string;
  /** Required at site level. */
  siteUuid?: string;
  /** Only used at project level, to light up the goal-relative watchlist checks. */
  project?: ProjectFullDto;
}): EntityAnomalies => {
  const isProject = level === "project";
  const base = useProjectAnomalies(projectUuid, isProject ? project : undefined);

  const { data: sitePolygons } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: !isProject && siteUuid != null && siteUuid !== ""
  });

  return useMemo<EntityAnomalies>(() => {
    if (isProject) {
      return {
        loaded: base.loaded,
        anomalies: base.anomalies,
        countsByEntity: base.countsByEntity,
        totalCount: base.totalCount
      };
    }

    const sitePolygonUuids = new Set((sitePolygons ?? []).map(polygon => polygon.uuid));
    const filtered = base.anomalies.filter(
      anomaly => anomaly.entityUuid === siteUuid || sitePolygonUuids.has(anomaly.entityUuid)
    );
    const countsByEntity: Record<string, number> = {};
    for (const anomaly of filtered) {
      countsByEntity[anomaly.entityUuid] = (countsByEntity[anomaly.entityUuid] ?? 0) + 1;
    }
    return { loaded: base.loaded, anomalies: filtered, countsByEntity, totalCount: filtered.length };
  }, [isProject, base.loaded, base.anomalies, base.countsByEntity, base.totalCount, sitePolygons, siteUuid]);
};
