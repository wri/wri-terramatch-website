import type { FeatureCollection } from "geojson";
import { useMemo } from "react";

import { aggregateProject } from "@/components/semanticZoom/aggregate";
import { ChildEntry } from "@/components/semanticZoom/LevelCard";
import { useProjectSitePolygonsGeoJson } from "@/connections/GeoJsonExport";
import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";

/**
 * Shared data for the project drill-down: the per-site rollup, the aggregated project figure, and a
 * FeatureCollection of one centroid per site.
 *
 * The map and the KPI panel now sit in different rows of the Overview tab, so the state that keeps
 * them agreeing cannot live in either component. It lives here, and both read it — same pattern the
 * semantic-zoom `useSemanticZoom` used to keep its map and panel in sync.
 *
 * Sites are drawn as centroids, never as invented hulls: there is no site geometry in the data, and
 * a computed boundary would claim land the project does not hold. Each point sits at the mean of the
 * site's polygon coordinates. A site with no polygons yields no centroid — there is nothing to place.
 */
export interface ProjectDrilldown {
  loaded: boolean;
  geoLoaded: boolean;
  siteCount: number;
  centroids: FeatureCollection | null;
  aggregate: ReturnType<typeof aggregateProject>;
  childEntries: ChildEntry[];
}

export const useProjectDrilldown = (projectUuid: string): ProjectDrilldown => {
  const [rollupLoaded, { data: rollupRows }] = useSiteIndicatorRollup(projectUuid);
  const rows = useMemo(() => rollupRows ?? [], [rollupRows]);

  const [geoLoaded, { data: projectGeo }] = useProjectSitePolygonsGeoJson({
    projectUuid,
    geometryOnly: false,
    enabled: projectUuid != null && projectUuid !== ""
  });

  const centroids = useMemo<FeatureCollection | null>(() => {
    if (projectGeo == null) return null;
    const features = projectGeo.features ?? [];

    const sums = new Map<string, { lng: number; lat: number; n: number }>();
    const visit = (siteId: string, coords: unknown): void => {
      if (!Array.isArray(coords)) return;
      if (typeof coords[0] === "number" && typeof coords[1] === "number") {
        const [lng, lat] = coords as [number, number];
        if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
        const acc = sums.get(siteId) ?? { lng: 0, lat: 0, n: 0 };
        sums.set(siteId, { lng: acc.lng + lng, lat: acc.lat + lat, n: acc.n + 1 });
        return;
      }
      for (const child of coords) visit(siteId, child);
    };
    for (const feature of features) {
      const siteId = feature.properties?.siteId;
      if (typeof siteId !== "string") continue;
      if (feature.geometry != null && "coordinates" in feature.geometry) visit(siteId, feature.geometry.coordinates);
    }

    return {
      type: "FeatureCollection",
      features: rows
        .map(row => {
          const acc = sums.get(row.siteUuid);
          if (acc == null || acc.n === 0) return null;
          return {
            type: "Feature" as const,
            properties: {
              uuid: row.siteUuid,
              siteId: row.siteUuid,
              kind: "site",
              name: row.siteName ?? "Unnamed site",
              polygons: row.polygons,
              polygonsLabel: `${row.polygons.toLocaleString()} polygons`
            },
            geometry: { type: "Point" as const, coordinates: [acc.lng / acc.n, acc.lat / acc.n] }
          };
        })
        .filter(feature => feature != null)
    } as FeatureCollection;
  }, [projectGeo, rows]);

  const aggregate = useMemo(() => aggregateProject(rows), [rows]);

  const childEntries: ChildEntry[] = useMemo(
    () =>
      rows.map(row => ({
        id: row.siteUuid,
        name: row.siteName ?? "Unnamed site",
        polygons: row.polygons,
        inReviewCount: row.inReviewCount
      })),
    [rows]
  );

  return { loaded: rollupLoaded, geoLoaded, siteCount: rows.length, centroids, aggregate, childEntries };
};
