import { useMemo } from "react";

import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { computeAnomalies } from "./computeAnomalies";
import { Anomaly, AnomalyLevel } from "./types";

/**
 * The one place the anomaly engine is wired to the network.
 *
 * All fetching lives here; `computeAnomalies` stays pure. It reuses the existing connections — the
 * per-site rollup (one GROUP BY) and the paged "all project polygons" loader Overview already
 * uses — and takes the project's ProjectFullDto as an argument rather than refetching it, since the
 * page that renders the badge already has it. Goal fields (hectare goal, tree goal) come from that
 * DTO; pass it once loaded, and the goal-relative checks light up.
 *
 * The badge reads `totalCount`; a table row or a per-entity tab reads its own number out of
 * `countsByEntity`; a Level view reads `byLevel`. All three are derived from the same list so they
 * can never disagree.
 */
export type UseProjectAnomaliesResult = {
  loaded: boolean;
  anomalies: Anomaly[];
  /** anomaly count keyed by entityUuid (project, site, or polygon), for per-row / per-tab badges. */
  countsByEntity: Record<string, number>;
  /** Distinct project-wide anomaly count, for the headline badge. */
  totalCount: number;
  /** anomaly count per level, for the Actions view's level grouping. */
  byLevel: Record<AnomalyLevel, number>;
};

const EMPTY_BY_LEVEL: Record<AnomalyLevel, number> = { project: 0, site: 0, polygon: 0 };

export const useProjectAnomalies = (projectUuid?: string, project?: ProjectFullDto): UseProjectAnomaliesResult => {
  const [rollupLoaded, { data: rollupRows }] = useSiteIndicatorRollup(projectUuid);

  const { data: polygons, isLoading: polygonsLoading } = useAllSitePolygons({
    entityName: "projects",
    entityUuid: projectUuid,
    enabled: projectUuid != null && projectUuid !== ""
  });

  const loaded = projectUuid != null && projectUuid !== "" && rollupLoaded && !polygonsLoading;

  const anomalies = useMemo<Anomaly[]>(() => {
    if (!loaded || project == null) return [];
    return computeAnomalies({
      project: {
        uuid: project.uuid,
        name: project.name ?? project.shortName ?? project.uuid,
        totalHectaresRestoredGoal: project.totalHectaresRestoredGoal,
        treesPlantedCount: project.treesPlantedCount,
        treesGrownGoal: project.treesGrownGoal
      },
      rollups: rollupRows ?? [],
      polygons: polygons ?? []
    });
  }, [loaded, project, rollupRows, polygons]);

  return useMemo<UseProjectAnomaliesResult>(() => {
    const countsByEntity: Record<string, number> = {};
    const byLevel: Record<AnomalyLevel, number> = { ...EMPTY_BY_LEVEL };
    for (const anomaly of anomalies) {
      countsByEntity[anomaly.entityUuid] = (countsByEntity[anomaly.entityUuid] ?? 0) + 1;
      byLevel[anomaly.level] += 1;
    }
    return { loaded, anomalies, countsByEntity, totalCount: anomalies.length, byLevel };
  }, [loaded, anomalies]);
};
