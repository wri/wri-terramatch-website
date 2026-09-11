import { useMemo } from "react";

import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { ProjectOverlapPair } from "./projectOverlapPairs";

type UseProjectAnomaliesParams = {
  overlapPairs: ProjectOverlapPair[];
  polygonsData: SitePolygonLightDto[];
};

/**
 * Ordered, deduped list of "anomaly" polygon uuids for the `PolygonAnomalyStepper` (F7): cross-site
 * overlaps first (the project-level value-add — these can't be seen from any single site's page),
 * then same-site overlaps, then other failed-criteria polygons, then partial. Pure/presentational —
 * no requests.
 */
export const useProjectAnomalies = ({ overlapPairs, polygonsData }: UseProjectAnomaliesParams): string[] =>
  useMemo(() => {
    const ordered: string[] = [];
    const seen = new Set<string>();

    // Only step to polygons that have a loaded row. A cross-site overlap partner filtered out of the
    // current page has no row/geometry loaded, so stepping to it would zoom/open a popup for a polygon
    // that isn't there and give no table highlight — a dead step. Restrict the stepper to loaded uuids.
    const loadedUuids = new Set<string>();
    for (const polygon of polygonsData) {
      const uuid = polygon.polygonUuid ?? polygon.uuid;
      if (uuid != null && uuid !== "") loadedUuids.add(uuid);
    }

    const addUuid = (uuid: string | null | undefined): void => {
      if (uuid == null || uuid === "" || seen.has(uuid) || !loadedUuids.has(uuid)) {
        return;
      }
      seen.add(uuid);
      ordered.push(uuid);
    };

    for (const pair of overlapPairs) {
      if (pair.crossSite) {
        addUuid(pair.aUuid);
        addUuid(pair.bUuid);
      }
    }

    for (const pair of overlapPairs) {
      if (!pair.crossSite) {
        addUuid(pair.aUuid);
        addUuid(pair.bUuid);
      }
    }

    for (const polygon of polygonsData) {
      if (polygon.validationStatus === "failed") {
        addUuid(polygon.polygonUuid ?? polygon.uuid);
      }
    }

    for (const polygon of polygonsData) {
      if (polygon.validationStatus === "partial") {
        addUuid(polygon.polygonUuid ?? polygon.uuid);
      }
    }

    return ordered;
  }, [overlapPairs, polygonsData]);
