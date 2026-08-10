import type { FeatureCollection } from "geojson";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { useProjectSitePolygonsGeoJson, useSitePolygonsGeoJson } from "@/connections/GeoJsonExport";
import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";
import { useSitePolygons } from "@/connections/SitePolygons";

import {
  aggregatePolygon,
  aggregateProject,
  aggregateSite,
  LevelAggregate,
  polygonMeasurementsFrom,
  reconcile,
  Reconciliation
} from "./aggregate";
import { ChildEntry } from "./LevelCard";
import { Level } from "./levelContract";

/**
 * All of the Project -> Site -> Polygon descent, with no layout attached.
 *
 * The map and the indicator panel are rendered in two different places on the project Overview tab
 * — the map in the existing "Project Map" slot, the panel full-width beneath it — so the state that
 * keeps them in agreement cannot live inside either component. It lives here, and both read it.
 *
 * Path state stays in the URL (?site=<uuid>&polygon=<uuid>) so a level is linkable and the back
 * button behaves. Navigation is shallow: descending must not refetch the page.
 *
 * Site and project figures come from one server-side rollup rather than from paging every polygon.
 * Polygons are only fetched once a site is chosen, and then only a page at a time — the largest
 * site in this data holds 7,293 of them.
 */
export const POLYGON_PAGE_SIZE = 100;

export interface UseSemanticZoomOptions {
  projectUuid: string;
  projectName: string;
  /** Reported figures from the project entity, shown as claims beside the measurements. */
  claims?: { hectares?: number | null; trees?: number | null };
  goals?: { hectares?: number | null; trees?: number | null };
}

export interface SemanticZoom {
  level: Level;
  /** Name of the level currently in view. */
  title: string;
  projectName: string;
  siteUuid: string | null;
  polygonUuid: string | null;
  siteName: string | null;
  polygonName: string | null;
  siteCount: number;
  /** Null at polygon level when the polygon's own record could not be loaded. */
  aggregate: LevelAggregate | null;
  childEntries: ChildEntry[];
  claims?: Partial<Record<"hectares", { value: number | null; label: string }>>;
  reconciliations?: Partial<Record<"hectares", Reconciliation | null>>;
  goals?: Partial<Record<"hectares", number | null>>;
  /** What the map should draw: site centroids at project level, polygons below it. */
  mapFeatures: FeatureCollection | null;
  mapLoading: boolean;
  rollupLoaded: boolean;
  /** Set when the child list is showing fewer polygons than the site actually holds. */
  truncatedAt: number | null;
  navigate: (next: { site?: string | null; polygon?: string | null }) => void;
  selectFromMap: (uuid: string, siteId?: string | null) => void;
}

export const useSemanticZoom = ({ projectUuid, projectName, claims, goals }: UseSemanticZoomOptions): SemanticZoom => {
  const router = useRouter();
  const siteUuid = asParam(router.query.site);
  const polygonUuid = asParam(router.query.polygon);

  const level: Level = polygonUuid != null ? "polygon" : siteUuid != null ? "site" : "project";

  const [rollupLoaded, { data: rollupRows }] = useSiteIndicatorRollup(projectUuid);
  const rows = useMemo(() => rollupRows ?? [], [rollupRows]);

  // Only fetched below the project level. At project level the rollup is all we need.
  const [polygonsLoaded, { data: polygons, indexTotal: polygonTotal }] = useSitePolygons({
    enabled: siteUuid != null,
    entityName: "sites",
    entityUuid: siteUuid ?? undefined,
    pageSize: POLYGON_PAGE_SIZE,
    pageNumber: 1
  });

  // The selected polygon is fetched by uuid rather than hunted for in the loaded page: a site can
  // hold 7,293 polygons and the one that was clicked is usually not in the first 100.
  const [, { data: selectedPolygonRows }] = useSitePolygons({
    enabled: polygonUuid != null,
    filter: polygonUuid == null ? undefined : { "uuid[]": [polygonUuid] },
    pageSize: 1,
    pageNumber: 1
  });

  // Geometry follows the level. Project scope loads every polygon's shape in one request; once a
  // site is chosen the map narrows to that site, which is both the smaller payload and the
  // correct frame.
  const [projectGeoLoaded, { data: projectGeo }] = useProjectSitePolygonsGeoJson({
    projectUuid,
    geometryOnly: false,
    enabled: siteUuid == null
  });
  const [siteGeoLoaded, { data: siteGeo }] = useSitePolygonsGeoJson({
    siteUuid: siteUuid ?? undefined,
    geometryOnly: false,
    enabled: siteUuid != null
  });

  const featureCollection = useMemo(() => {
    const dto = siteUuid == null ? projectGeo : siteGeo;
    if (dto == null) return null;
    return { type: "FeatureCollection", features: dto.features ?? [] } as FeatureCollection;
  }, [siteUuid, projectGeo, siteGeo]);

  const mapLoading = siteUuid == null ? !projectGeoLoaded : !siteGeoLoaded;

  // At project level the map shows one point per site, not every polygon. There is no site
  // geometry in the data, and a computed hull would draw a boundary the project does not have —
  // a confident wrong shape is worse than an honest dot. The point sits at the mean of the site's
  // polygon coordinates and is labelled with its name and approved polygon count.
  const siteCentroids = useMemo(() => {
    if (siteUuid != null || featureCollection == null) return null;

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

    for (const feature of featureCollection.features) {
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
            // uuid and siteId are both the site here, so a click resolves to the site.
            properties: {
              uuid: row.siteUuid,
              siteId: row.siteUuid,
              name: row.siteName ?? "Unnamed site",
              polygons: row.polygons,
              polygonsLabel: `${row.polygons.toLocaleString()} polygons`
            },
            geometry: { type: "Point" as const, coordinates: [acc.lng / acc.n, acc.lat / acc.n] }
          };
        })
        .filter(feature => feature != null)
    } as FeatureCollection;
  }, [siteUuid, featureCollection, rows]);

  const navigate = useCallback(
    (next: { site?: string | null; polygon?: string | null }) => {
      // The current tab is carried through untouched. The descent is not a tab of its own any
      // more, so hardcoding one here would eject the user from wherever they are reading it.
      const query = { ...router.query } as Record<string, string>;
      const apply = (key: "site" | "polygon", value: string | null | undefined) => {
        if (value == null) delete query[key];
        else query[key] = value;
      };
      if ("site" in next) apply("site", next.site);
      if ("polygon" in next) apply("polygon", next.polygon);
      router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    },
    [router]
  );

  // One level per interaction. From the project the map descends to the polygon's SITE; only once
  // inside a site does a click select the polygon itself. Skipping the site hides the level where
  // the aggregation rule actually changes.
  const selectFromMap = useCallback(
    (uuid: string, siteId?: string | null) =>
      siteUuid == null ? navigate({ site: siteId, polygon: null }) : navigate({ polygon: uuid }),
    [siteUuid, navigate]
  );

  const siteRow = useMemo(() => rows.find(row => row.siteUuid === siteUuid), [rows, siteUuid]);
  const selectedPolygon = useMemo(
    () =>
      selectedPolygonRows?.[0] ??
      (polygons ?? []).find(polygon => polygon.polygonUuid === polygonUuid || polygon.uuid === polygonUuid),
    [selectedPolygonRows, polygons, polygonUuid]
  );

  // The geojson covers every polygon on the site, so a name is available even when the polygon's
  // record is not in the loaded page.
  const selectedFeature = useMemo(
    () => featureCollection?.features.find(feature => feature.properties?.uuid === polygonUuid) ?? null,
    [featureCollection, polygonUuid]
  );
  const polygonName = selectedPolygon?.name ?? (selectedFeature?.properties?.polyName as string | undefined) ?? null;

  const aggregate = useMemo(() => {
    if (level === "polygon") {
      // Falling back to the site's numbers here would print aggregated figures under a polygon
      // heading. Showing nothing is the honest answer; the panel renders an explanation.
      return selectedPolygon == null
        ? null
        : aggregatePolygon(polygonMeasurementsFrom(selectedPolygon.indicators, selectedPolygon.calcArea ?? null));
    }
    if (level === "site" && siteRow != null) return aggregateSite(siteRow);
    return aggregateProject(rows);
  }, [level, rows, siteRow, selectedPolygon]);

  const childEntries: ChildEntry[] = useMemo(() => {
    if (level === "project") {
      return rows.map(row => ({
        id: row.siteUuid,
        name: row.siteName ?? "Unnamed site",
        polygons: row.polygons,
        inReviewCount: row.inReviewCount
      }));
    }
    if (level === "site") {
      return (polygons ?? []).map(polygon => ({
        id: polygon.polygonUuid ?? polygon.uuid ?? "",
        name: polygon.name ?? "Unnamed polygon",
        polygons: 1,
        inReviewCount: 0
      }));
    }
    return [];
  }, [level, rows, polygons]);

  const reconciliations = useMemo(() => {
    if (level !== "project") return undefined;
    return { hectares: reconcile(claims?.hectares ?? null, aggregate?.indicators.hectares.value ?? null) };
  }, [level, claims, aggregate]);

  const title =
    level === "project" ? projectName : level === "site" ? siteRow?.siteName ?? "Site" : polygonName ?? "Polygon";

  return {
    level,
    title,
    projectName,
    siteUuid,
    polygonUuid,
    siteName: siteRow?.siteName ?? null,
    polygonName,
    siteCount: rows.length,
    aggregate,
    childEntries,
    claims:
      level === "project" && claims?.hectares != null
        ? { hectares: { value: claims.hectares, label: "Reported (approved reports)" } }
        : undefined,
    reconciliations,
    goals: level === "project" ? { hectares: goals?.hectares ?? null } : undefined,
    mapFeatures: siteCentroids ?? featureCollection,
    mapLoading,
    rollupLoaded,
    truncatedAt:
      level === "site" && polygonsLoaded && (polygonTotal ?? 0) > POLYGON_PAGE_SIZE ? polygonTotal ?? null : null,
    navigate,
    selectFromMap
  };
};

const asParam = (value: string | string[] | undefined) =>
  value == null ? null : Array.isArray(value) ? value[0] ?? null : value;
