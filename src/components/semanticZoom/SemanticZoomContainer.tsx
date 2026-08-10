import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";
import { useSitePolygons } from "@/connections/SitePolygons";

import { aggregatePolygon, aggregateProject, aggregateSite, polygonMeasurementsFrom, reconcile } from "./aggregate";
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

  const aggregate = useMemo(() => {
    if (level === "polygon" && selectedPolygon != null) {
      return aggregatePolygon(polygonMeasurementsFrom(selectedPolygon.indicators, selectedPolygon.calcArea ?? null));
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
    return { hectares: reconcile(claims?.hectares ?? null, aggregate.indicators.hectares.value) };
  }, [level, claims, aggregate]);

  if (!rollupLoaded) {
    return <p className="p-4 text-sm text-neutral-500">Loading indicators…</p>;
  }

  const title =
    level === "project"
      ? projectName
      : level === "site"
      ? siteRow?.siteName ?? "Site"
      : selectedPolygon?.name ?? "Polygon";

  return (
    <div className="flex flex-col gap-3">
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
            <span className="text-neutral-900">{selectedPolygon?.name ?? "Polygon"}</span>
          </>
        )}
      </nav>

      <div className="grid gap-3 lg:grid-cols-[1fr_380px]">
        <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500">
          Map — not yet wired
        </div>

        <div className="min-h-[420px]">
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
