import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import PolygonDataTable from "@/components/entityData/PolygonDataTable";
import { AnomaliesCell, FlaggedFilterButton, orDash } from "@/components/entityData/polygonTableCells";
import { useProjectAnomalies } from "@/components/projectData/anomalies/useProjectAnomalies";
import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SearchIcon } from "@/redesignComponents/foundations/Icons";

/**
 * The project Details-and-Data table.
 *
 * A project spans sites, so this view has a Sites | Polygons toggle. The Sites view is a per-site
 * rollup (counts, hectares, status, anomaly flag) rendered here; the Polygons view is the shared
 * `PolygonDataTable` — the same table the site page uses — passed the whole project's polygons and a
 * Site column. The single merged anomaly count from `useProjectAnomalies` flags rows in both views.
 */

type TableView = "sites" | "polygons";

export interface ProjectDataTableProps {
  projectUuid: string;
  project: ProjectFullDto;
}

const MAX_BODY_HEIGHT = "26rem";

const SegmentedToggle = ({
  view,
  onChange,
  sitesCount,
  polygonsCount
}: {
  view: TableView;
  onChange: (view: TableView) => void;
  sitesCount: number;
  polygonsCount: number;
}) => (
  <div className="inline-flex shrink-0 gap-0.5 rounded-md border border-theme-neutral-200 bg-theme-neutral-100 p-0.5">
    {(
      [
        ["sites", "Sites", sitesCount],
        ["polygons", "Polygons", polygonsCount]
      ] as const
    ).map(([key, label, count]) => (
      <button
        key={key}
        type="button"
        onClick={() => onChange(key)}
        className={
          view === key
            ? "shadow-sm rounded bg-white px-3 py-1 text-xs font-semibold text-theme-neutral-900"
            : "rounded px-3 py-1 text-xs text-theme-neutral-500 hover:text-theme-neutral-700"
        }
      >
        {label} ({count.toLocaleString()})
      </button>
    ))}
  </div>
);

const ProjectDataTable = ({ projectUuid, project }: ProjectDataTableProps) => {
  const router = useRouter();
  const [view, setView] = useState<TableView>("sites");
  // Sites-view filters. The Polygons view is the shared PolygonDataTable, which owns its own.
  const [siteSearch, setSiteSearch] = useState("");
  const [siteFlaggedOnly, setSiteFlaggedOnly] = useState(false);

  const [rollupLoaded, { data: rollupRows }] = useSiteIndicatorRollup(projectUuid);
  const sites = useMemo(() => rollupRows ?? [], [rollupRows]);

  const { data: allPolygons, isLoading: polygonsLoading } = useAllSitePolygons({
    entityName: "projects",
    entityUuid: projectUuid,
    // Loaded regardless of the active view: useProjectAnomalies below already fetches the same
    // polygons for its counts, so this hits the cache — and gating it on the polygon view left the
    // "Polygons (N)" toggle reading 0 until first clicked.
    enabled: projectUuid != null && projectUuid !== ""
  });

  const { countsByEntity } = useProjectAnomalies(projectUuid, project);

  const filteredSites = useMemo(() => {
    const term = siteSearch.trim().toLowerCase();
    return sites.filter(site => {
      if (siteFlaggedOnly && (countsByEntity[site.siteUuid] ?? 0) <= 0) return false;
      if (term !== "" && !(site.siteName ?? "").toLowerCase().includes(term)) return false;
      return true;
    });
  }, [sites, siteSearch, siteFlaggedOnly, countsByEntity]);

  const goToSite = (siteUuid: string) => router.push(`/site/${siteUuid}`);

  const toggle = (
    <SegmentedToggle
      view={view}
      onChange={setView}
      sitesCount={sites.length}
      polygonsCount={allPolygons?.length ?? 0}
    />
  );

  if (view === "polygons") {
    return (
      <PolygonDataTable
        polygons={allPolygons ?? []}
        countsByEntity={countsByEntity}
        projectUuid={projectUuid}
        loading={polygonsLoading}
        showSiteColumn
        emptyLabel="This project has no polygons yet."
        toolbarLeading={toggle}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {toggle}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon
              boxSize={3.5}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-theme-neutral-400"
            />
            <input
              type="text"
              value={siteSearch}
              onChange={event => setSiteSearch(event.target.value)}
              placeholder="Search sites…"
              className="w-48 rounded border border-theme-neutral-200 py-1 pl-7 pr-2 text-xs text-theme-neutral-900 placeholder:text-theme-neutral-400 focus:border-theme-primary-500 focus:outline-none"
            />
          </div>
          <FlaggedFilterButton active={siteFlaggedOnly} onClick={() => setSiteFlaggedOnly(prev => !prev)} />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-theme-neutral-200 bg-white">
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: MAX_BODY_HEIGHT }}>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="sticky top-0 bg-theme-neutral-100">
              <tr>
                {["Site name", "Polygons", "Hectares", "In review", "Anomalies"].map(header => (
                  <th
                    key={header}
                    className="border-b border-theme-neutral-200 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-theme-neutral-400"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSites.map(site => {
                const anomalyCount = countsByEntity[site.siteUuid] ?? 0;
                const flagged = anomalyCount > 0;
                return (
                  <tr
                    key={site.siteUuid}
                    onClick={() => goToSite(site.siteUuid)}
                    className={`cursor-pointer border-b border-l-2 border-theme-neutral-200 last:border-b-0 hover:bg-theme-neutral-100 ${
                      flagged ? "border-l-theme-warning-500" : "border-l-transparent"
                    }`}
                  >
                    <td className="px-4 py-2 font-medium text-theme-neutral-900">{site.siteName ?? "Unnamed site"}</td>
                    <td className="px-4 py-2 tabular-nums text-theme-neutral-700">{site.polygons.toLocaleString()}</td>
                    <td className="px-4 py-2 tabular-nums text-theme-neutral-700">{orDash(site.hectares, " ha")}</td>
                    <td className="px-4 py-2 tabular-nums">
                      {site.inReviewCount > 0 ? (
                        <span className="text-theme-warning-900">{site.inReviewCount.toLocaleString()}</span>
                      ) : (
                        <span className="text-theme-neutral-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <AnomaliesCell count={anomalyCount} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rollupLoaded && filteredSites.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-theme-neutral-500">
              {sites.length === 0 ? "This project has no sites yet." : "No sites match your filters."}
            </p>
          )}

          {!rollupLoaded && <p className="px-4 py-8 text-center text-sm text-theme-neutral-500">Loading…</p>}
        </div>
      </div>

      <p className="text-[11px] text-theme-neutral-400">
        Anomaly counts fold together geometry validation and watchlist checks into one flag per row.
      </p>
    </div>
  );
};

export default ProjectDataTable;
