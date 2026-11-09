import { useEffect, useMemo, useState } from "react";

import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { loadSitePolygonsByUuidBatch } from "../../site/[uuid]/hooks/sitePolygonBatchLoad.utils";
import { mergeMapAlertPolygons } from "../../site/[uuid]/utils/sitePolygonsWorkspace.utils";

const NO_POLYGONS: SitePolygonLightDto[] = [];

type UseProjectIssueMarkersParams = {
  projectUuid: string | null;
  overlapPolygonUuids: string[];
  disturbancePolygonUuids: string[];
  excludePolygonUuid: string | null;
  enabled: boolean;
  t: (key: string) => string;
};

/**
 * Map alert icons (overlap and disturbance) for the polygons of a project. The project's map index only carries
 * uuids, so the light polygons are loaded for their coordinates, then merged with the same helper the site map uses.
 */
export const useProjectIssueMarkers = ({
  projectUuid,
  overlapPolygonUuids,
  disturbancePolygonUuids,
  excludePolygonUuid,
  enabled,
  t
}: UseProjectIssueMarkersParams): OverlapPolygonPoint[] => {
  const issuePolygonUuids = useMemo(
    () => Array.from(new Set([...overlapPolygonUuids, ...disturbancePolygonUuids])),
    [overlapPolygonUuids, disturbancePolygonUuids]
  );
  const issuePolygonUuidsKey = issuePolygonUuids.join(",");

  const [issuePolygons, setIssuePolygons] = useState<SitePolygonLightDto[]>(NO_POLYGONS);

  useEffect(() => {
    if (!enabled || projectUuid == null || issuePolygonUuids.length === 0) {
      setIssuePolygons(NO_POLYGONS);
      return;
    }

    let cancelled = false;

    void loadSitePolygonsByUuidBatch({
      entityName: "projects",
      entityUuid: projectUuid,
      polygonUuids: issuePolygonUuids,
      errorContext: "Failed to load project issue marker polygon geometry"
    }).then(polygons => {
      if (!cancelled) {
        setIssuePolygons(polygons);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, projectUuid, issuePolygonUuidsKey, issuePolygonUuids]);

  return useMemo(() => {
    const overlapTooltip = t("Polygon overlap detected");
    const disturbanceTooltip = t("Disturbance reported");
    const overlapUuids = new Set(overlapPolygonUuids);
    const disturbanceUuids = new Set(disturbancePolygonUuids);

    const overlapPoints: OverlapPolygonPoint[] = [];
    const disturbancePoints: OverlapPolygonPoint[] = [];
    for (const polygon of issuePolygons) {
      const uuid = polygon.polygonUuid ?? polygon.uuid;
      if (uuid == null || polygon.lat == null || polygon.long == null) continue;

      const point = { polygonUuid: uuid, lat: polygon.lat, lng: polygon.long };
      if (overlapUuids.has(uuid)) overlapPoints.push({ ...point, tooltip: overlapTooltip });
      if (disturbanceUuids.has(uuid)) disturbancePoints.push({ ...point, tooltip: disturbanceTooltip });
    }

    return mergeMapAlertPolygons(overlapPoints, disturbancePoints, excludePolygonUuid);
  }, [issuePolygons, overlapPolygonUuids, disturbancePolygonUuids, excludePolygonUuid, t]);
};
