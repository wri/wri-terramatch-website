import type { FeatureCollection } from "geojson";
import { useMemo } from "react";

import { aggregateSite, LevelAggregate, NOT_MEASURED } from "@/components/semanticZoom/aggregate";
import { ChildEntry } from "@/components/semanticZoom/LevelCard";
import { useSitePolygonsGeoJson } from "@/connections/GeoJsonExport";
import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";
import { useAllSitePolygons } from "@/connections/SitePolygons";

/**
 * Shared data for the site drill-down: the site's own rollup row, its aggregated figure, the real
 * polygon geometry, and the list of polygons to descend into.
 *
 * The site Overview mirrors the project Overview: the map and the KPI panel sit in the same fixed
 * row but are different components, so the state that keeps them agreeing lives here and both read
 * it. The site differs from the project only in scope — it draws its polygons' actual shapes rather
 * than site centroids, because a site has real geometry and inventing a boundary is never needed.
 *
 * A site can be absent from the per-site rollup (the rollup is built over approved polygons, so a
 * site with none yields no row). When that happens the aggregate falls back to an honest empty
 * site — zeros and em-dashes — rather than borrowing another site's numbers.
 */
export interface SiteDrilldown {
  loaded: boolean;
  geoLoaded: boolean;
  polygonCount: number;
  featureCollection: FeatureCollection | null;
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

export const useSiteDrilldown = (projectUuid: string, siteUuid: string): SiteDrilldown => {
  const enabled = siteUuid != null && siteUuid !== "";

  const [rollupLoaded, { data: rollupRows }] = useSiteIndicatorRollup(projectUuid);
  const siteRow = useMemo(() => (rollupRows ?? []).find(row => row.siteUuid === siteUuid), [rollupRows, siteUuid]);

  const [geoLoaded, { data: siteGeo }] = useSitePolygonsGeoJson({
    siteUuid: enabled ? siteUuid : undefined,
    geometryOnly: false,
    enabled
  });

  // The site's polygons carry their own shapes; stamp each feature's uuid into properties so
  // DrilldownMap keys its selection and click handling on the same id the child list uses.
  const featureCollection = useMemo<FeatureCollection | null>(() => {
    if (siteGeo == null) return null;
    return {
      type: "FeatureCollection",
      features: (siteGeo.features ?? []).map(feature => ({
        ...feature,
        properties: { ...feature.properties, uuid: feature.properties?.uuid, siteId: siteUuid, kind: "polygon" }
      }))
    } as unknown as FeatureCollection;
  }, [siteGeo, siteUuid]);

  const { data: polygons } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled
  });

  const childEntries: ChildEntry[] = useMemo(
    () =>
      (polygons ?? []).map(polygon => ({
        id: polygon.uuid,
        name: polygon.name ?? "Unnamed polygon",
        polygons: 1,
        inReviewCount: 0
      })),
    [polygons]
  );

  const aggregate = useMemo(() => (siteRow == null ? EMPTY_SITE_AGGREGATE : aggregateSite(siteRow)), [siteRow]);

  return {
    loaded: rollupLoaded,
    geoLoaded,
    polygonCount: childEntries.length,
    featureCollection,
    aggregate,
    childEntries
  };
};
