import type { FeatureCollection } from "geojson";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { useProjectSitePolygonsGeoJson, useSitePolygonsGeoJson } from "@/connections/GeoJsonExport";
import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";
import { useSitePolygons } from "@/connections/SitePolygons";

import { aggregatePolygon, aggregateProject, aggregateSite, polygonMeasurementsFrom, reconcile } from "./aggregate";
import DrilldownMap from "./DrilldownMap";
import LevelCard, { ChildEntry } from "./LevelCard";
import { Level } from "./levelContract";

/**
 * Orchestrates the Project -> Site -> Polygon descent.
 *
 * Path state lives in the URL (?tab=zoom&site=<uuid>&polygon=<uuid>) so a level is linkable and
 * the back button behaves. Navigation is shallow: descending must not refetch the page.
 *
 * Site and project figures come from one server-side rollup rather than from paging every polygon.
 * Polygons are only fetched once a site is chosen, and then only a page at a time — the largest
 * site in this data holds 7,293 of them.
 */
const POLYGON_PAGE_SIZE = 100;

export interface SemanticZoomContainerProps {
  projectUuid: string;
  projectName: string;
  /** Reported figures from the project entity, shown as claims beside the measurements. */
  claims?: { hectares?: number | null; trees?: number | null };
  goals?: { hectares?: number | null; trees?: number | null };
}

const SemanticZoomContainer = ({ projectUuid, projectName, claims, goals }: SemanticZoomContainerProps) => {
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

  const geoLoading = siteUuid == null ? !projectGeoLoaded : !siteGeoLoaded;

  const navigate = useCallback(
    (next: { site?: string | null; polygon?: string | null }) => {
      const query = { ...router.query, tab: "zoom" } as Record<string, string>;
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

  const siteRow = useMemo(() => rows.find(row => row.siteUuid === siteUuid), [rows, siteUuid]);
  const selectedPolygon = useMemo(
    () => (polygons ?? []).find(polygon => polygon.polygonUuid === polygonUuid || polygon.uuid === polygonUuid),
    [polygons, polygonUuid]
  );

  // The geojson covers every polygon on the site, so a name is available even when the polygon's
  // record is not in the loaded page.
  const selectedFeature = useMemo(
    () => featureCollection?.features.find(feature => feature.properties?.uuid === polygonUuid) ?? null,
    [featureCollection, polygonUuid]
  );
  const selectedPolygonName =
    selectedPolygon?.name ?? (selectedFeature?.properties?.polyName as string | undefined) ?? null;

  const aggregate = useMemo(() => {
    if (level === "polygon") {
      // Falling back to the site's numbers here would print aggregated figures under a polygon
      // heading. Showing nothing is the honest answer; the caller renders an explanation.
      return selectedPolygon == null
        ? null
        : aggregatePolygon(polygonMeasurementsFrom(selectedPolygon.indicators, selectedPolygon.calcArea ?? null));
    }
    if (level === "site" && siteRow != null) return aggregateSite(siteRow);
    return aggregateProject(rows);
  }, [level, rows, siteRow, selectedPolygon]);

  const children: ChildEntry[] = useMemo(() => {
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

  if (!rollupLoaded) {
    return <p className="p-4 text-sm text-neutral-500">Loading indicators…</p>;
  }

  const title =
    level === "project"
      ? projectName
      : level === "site"
      ? siteRow?.siteName ?? "Site"
      : selectedPolygonName ?? "Polygon";

  return (
    <div className="flex w-full flex-col gap-3">
      <nav className="flex items-center gap-1 text-xs text-neutral-600" aria-label="Zoom path">
        <button type="button" className="hover:underline" onClick={() => navigate({ site: null, polygon: null })}>
          {projectName}
        </button>
        {siteUuid != null && (
          <>
            <span className="text-neutral-400">/</span>
            <button type="button" className="hover:underline" onClick={() => navigate({ polygon: null })}>
              {siteRow?.siteName ?? "Site"}
            </button>
          </>
        )}
        {polygonUuid != null && (
          <>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900">{selectedPolygonName ?? "Polygon"}</span>
          </>
        )}
      </nav>

      <div className="flex w-full flex-col gap-3 ws-1100:flex-row">
        <div className="min-h-[420px] w-full flex-1">
          <DrilldownMap
            featureCollection={featureCollection}
            selectedId={polygonUuid}
            loading={geoLoading}
            // Clicking a shape descends. At project scope the shapes are polygons, so a click
            // jumps straight to the polygon level and the breadcrumb carries the path back up.
            onSelectPolygon={(uuid, siteId) => navigate({ site: siteId ?? siteUuid, polygon: uuid })}
          />
        </div>

        <div className="min-h-[420px] w-full shrink-0 ws-1100:w-[400px]">
          {aggregate == null ? (
            <section className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-[11px] uppercase tracking-wide text-neutral-400">Polygon</p>
              <h3 className="text-base font-semibold text-neutral-900">{selectedPolygonName ?? "Polygon"}</h3>
              <p className="text-orange-700 mt-2 text-xs">
                This polygon is not in the loaded page, so its own measurements are not available. The site aggregate is
                deliberately not shown here — it would be a different number under a polygon heading.
              </p>
            </section>
          ) : (
            <LevelCard
              aggregate={aggregate}
              title={title}
              subtitle={level === "project" ? `${rows.length} sites` : undefined}
              childEntries={children}
              claims={
                level === "project" && claims?.hectares != null
                  ? { hectares: { value: claims.hectares, label: "Reported (approved reports)" } }
                  : undefined
              }
              reconciliations={reconciliations}
              goals={level === "project" ? { hectares: goals?.hectares ?? null } : undefined}
              onSelectChild={id =>
                level === "project" ? navigate({ site: id, polygon: null }) : navigate({ polygon: id })
              }
            />
          )}
          {level === "site" && polygonsLoaded && (polygonTotal ?? 0) > POLYGON_PAGE_SIZE && (
            // Never let a truncated list read as the whole list.
            <p className="text-orange-700 mt-2 text-[11px]">
              Showing the first {POLYGON_PAGE_SIZE} of {(polygonTotal ?? 0).toLocaleString()} polygons. Indicator
              figures above cover all of them.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const asParam = (value: string | string[] | undefined) =>
  value == null ? null : Array.isArray(value) ? value[0] ?? null : value;

export default SemanticZoomContainer;
