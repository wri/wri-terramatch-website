import type { FeatureCollection } from "geojson";
import { useMemo } from "react";

import { aggregateProject, aggregateSite, LevelAggregate, NOT_MEASURED } from "@/components/semanticZoom/aggregate";
import { ChildEntry } from "@/components/semanticZoom/LevelCard";
import { useProjectSitePolygonsGeoJson, useSitePolygonsGeoJson } from "@/connections/GeoJsonExport";
import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";
import { useAllSitePolygons } from "@/connections/SitePolygons";

import { EntityLevel } from "./entityLevel";

/**
 * The one drill-down data hook, for a project or a site.
 *
 * It replaces the parallel `useProjectDrilldown` / `useSiteDrilldown`. Both always fetched the same
 * per-site rollup and fed the same map + KPI panel; they differed only in three level-specific
 * details, which are switched here:
 *  - the map draws site CENTROIDS at project level (there is no site geometry, and an invented hull
 *    would claim land the project does not hold) and real polygon SHAPES at site level;
 *  - the aggregate is `aggregateProject` over every site, or `aggregateSite` of this one site's row;
 *  - the children are the sites, or this site's polygons.
 *
 * Both geojson hooks are always called (rules of hooks) and gated by `enabled`, exactly as the
 * original `useSemanticZoom` did — the inactive one issues no request.
 */
export interface EntityDrilldown {
  level: EntityLevel;
  loaded: boolean;
  geoLoaded: boolean;
  childCount: number;
  /** Site centroids (project) or polygon shapes (site). Null until geometry loads. */
  mapFeatures: FeatureCollection | null;
  aggregate: LevelAggregate;
  childEntries: ChildEntry[];
}

/** An honest empty site: it exists, but nothing has been measured on it yet. */
const EMPTY_SITE_AGGREGATE: LevelAggregate = {
  level: "site",
  polygons: 0,
  inReviewCount: 0,
  indicators: {
    hectares: NOT_MEASURED,
    treeCover: NOT_MEASURED,
    treeCoverLoss: NOT_MEASURED,
    treeCount: NOT_MEASURED,
    fieldMonitoring: NOT_MEASURED,
    msuCarbon: NOT_MEASURED
  }
};

export const useEntityDrilldown = ({
  level,
  projectUuid,
  siteUuid
}: {
  level: EntityLevel;
  projectUuid: string;
  /** Required at site level; ignored at project level. */
  siteUuid?: string;
}): EntityDrilldown => {
  const isProject = level === "project";
  const hasProject = projectUuid != null && projectUuid !== "";
  const hasSite = !isProject && siteUuid != null && siteUuid !== "";

  const [rollupLoaded, { data: rollupRows }] = useSiteIndicatorRollup(projectUuid);
  const rows = useMemo(() => rollupRows ?? [], [rollupRows]);

  const [projectGeoLoaded, { data: projectGeo }] = useProjectSitePolygonsGeoJson({
    projectUuid,
    geometryOnly: false,
    enabled: isProject && hasProject
  });
  const [siteGeoLoaded, { data: siteGeo }] = useSitePolygonsGeoJson({
    siteUuid: hasSite ? siteUuid : undefined,
    geometryOnly: false,
    enabled: hasSite
  });

  const { data: sitePolygons } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: hasSite
  });

  // Project map: one centroid per site, at the mean of the site's polygon coordinates.
  const centroids = useMemo<FeatureCollection | null>(() => {
    if (!isProject || projectGeo == null) return null;
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
  }, [isProject, projectGeo, rows]);

  // Site map: the polygons' real shapes, each stamped with its uuid so DrilldownMap keys selection
  // on the same id the child list uses.
  const siteFeatures = useMemo<FeatureCollection | null>(() => {
    if (isProject || siteGeo == null) return null;
    return {
      type: "FeatureCollection",
      features: (siteGeo.features ?? []).map(feature => ({
        ...feature,
        properties: { ...feature.properties, uuid: feature.properties?.uuid, siteId: siteUuid, kind: "polygon" }
      }))
    } as unknown as FeatureCollection;
  }, [isProject, siteGeo, siteUuid]);

  const siteRow = useMemo(() => rows.find(row => row.siteUuid === siteUuid), [rows, siteUuid]);

  const aggregate = useMemo<LevelAggregate>(() => {
    if (isProject) return aggregateProject(rows);
    return siteRow == null ? EMPTY_SITE_AGGREGATE : aggregateSite(siteRow);
  }, [isProject, rows, siteRow]);

  const childEntries = useMemo<ChildEntry[]>(() => {
    if (isProject) {
      return rows.map(row => ({
        id: row.siteUuid,
        name: row.siteName ?? "Unnamed site",
        polygons: row.polygons,
        inReviewCount: row.inReviewCount
      }));
    }
    return (sitePolygons ?? []).map(polygon => ({
      id: polygon.uuid,
      name: polygon.name ?? "Unnamed polygon",
      polygons: 1,
      inReviewCount: 0
    }));
  }, [isProject, rows, sitePolygons]);

  return {
    level,
    loaded: rollupLoaded,
    geoLoaded: isProject ? projectGeoLoaded : siteGeoLoaded,
    childCount: childEntries.length,
    mapFeatures: isProject ? centroids : siteFeatures,
    aggregate,
    childEntries
  };
};
