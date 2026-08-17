import { useRouter } from "next/router";
import { Fragment, useCallback, useMemo, useState } from "react";

import { useProjectAnomalies } from "@/components/projectData/anomalies/useProjectAnomalies";
import BulkEditBar from "@/components/projectData/BulkEditBar";
import InlineRowEditor from "@/components/projectData/InlineRowEditor";
import { useSitePolygonEditing } from "@/components/projectData/useSitePolygonEditing";
import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { POLYGON_APPROVED } from "@/constants/polygonStatuses";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { EditIcon, SearchIcon, WarningIcon } from "@/redesignComponents/foundations/Icons";

/**
 * The project-level sites/polygons table.
 *
 * The PRD calls for one place to see every site and every polygon in a project, filter to the ones
 * with problems, and click through — rather than a per-entity aggregate card. This is a plain,
 * self-contained `<table>`, not a re-skin of `ConnectionTable`/`SitePolygonsWorkspace`: those solve
 * server-side paging and bulk editing, neither of which this table needs, since both source hooks
 * already return the whole project's data in one shot.
 *
 * The "Anomalies" column reads a single merged count from `useProjectAnomalies` — geometry
 * validation failures and watchlist checks are already folded into one number there, so this
 * table does not add a second, competing "validation" filter. "Show only flagged" is the one
 * filter; a name search is the other. That is the full filter surface by design.
 */

type TableView = "sites" | "polygons";

export interface ProjectDataTableProps {
  projectUuid: string;
  project: ProjectFullDto;
}

const MAX_BODY_HEIGHT = "26rem";

// "—" for anything absent — never 0. A null hectare/tree/area figure means "not measured", which
// is a different fact than a genuine zero.
const orDash = (value: number | null | undefined, suffix = ""): string =>
  value == null ? "—" : `${value.toLocaleString()}${suffix}`;

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  "pending-approval": "Pending approval",
  "information-required": "Information required",
  approved: "Approved"
};

// Same axis split PolygonDetailView uses: status is workflow position, validation is geometry
// health. Kept as separate columns/pills here for the same reason.
const STATUS_STYLES: Record<string, string> = {
  draft: "bg-theme-neutral-200 text-theme-neutral-800",
  "pending-approval": "bg-theme-warning-100 text-theme-warning-900",
  "information-required": "bg-theme-warning-100 text-theme-warning-900",
  approved: "bg-theme-success-100 text-theme-success-900"
};

const VALIDATION_LABELS: Record<string, string> = {
  passed: "Passed",
  partial: "Partial",
  failed: "Failed"
};

const VALIDATION_STYLES: Record<string, string> = {
  passed: "bg-theme-success-100 text-theme-success-900",
  partial: "bg-theme-warning-100 text-theme-warning-900",
  failed: "bg-theme-error-100 text-theme-error-900"
};

const Pill = ({ label, className }: { label: string; className: string }) => (
  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium leading-none ${className}`}>
    {label}
  </span>
);

/** The merged anomaly count. A pill with a flag icon when flagged, a quiet zero otherwise — the
 * count is a real measurement (never null), so a genuine zero is shown as "0", not "—". */
const AnomaliesCell = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="inline-flex items-center gap-1 rounded bg-theme-warning-100 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-theme-warning-900">
      <WarningIcon boxSize={2.5} />
      {count.toLocaleString()}
    </span>
  ) : (
    <span className="text-xs text-theme-neutral-400">0</span>
  );

/** A checkbox that can show the "some but not all" indeterminate state (native checkboxes only
 * expose this via a DOM ref, not a prop). */
const TriStateCheckbox = ({
  checked,
  indeterminate,
  onChange,
  ariaLabel
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  ariaLabel: string;
}) => {
  return (
    <input
      ref={node => {
        if (node) node.indeterminate = !checked && indeterminate;
      }}
      type="checkbox"
      aria-label={ariaLabel}
      checked={checked}
      onChange={onChange}
      // Selecting a row must never trigger the row's navigation click.
      onClick={event => event.stopPropagation()}
      className="h-3.5 w-3.5 cursor-pointer accent-theme-primary-500"
    />
  );
};

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
  const [search, setSearch] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [editingUuid, setEditingUuid] = useState<string | null>(null);

  const { withOverride, approve, applyAttributes, isApproving, isSavingAttributes, savingRowUuid } =
    useSitePolygonEditing();

  const [rollupLoaded, { data: rollupRows }] = useSiteIndicatorRollup(projectUuid);
  const sites = useMemo(() => rollupRows ?? [], [rollupRows]);

  const { data: allPolygons, isLoading: polygonsLoading } = useAllSitePolygons({
    entityName: "projects",
    entityUuid: projectUuid,
    // Loaded regardless of the active view: useProjectAnomalies below already fetches the same
    // polygons for its counts, so this hits the cache rather than the network — and gating it on
    // the polygon view left the "Polygons (N)" toggle reading 0 until first clicked.
    enabled: projectUuid != null && projectUuid !== ""
  });

  const { loaded: anomaliesLoaded, countsByEntity } = useProjectAnomalies(projectUuid, project);

  const filteredSites = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sites.filter(site => {
      if (flaggedOnly && (countsByEntity[site.siteUuid] ?? 0) <= 0) return false;
      if (term !== "" && !(site.siteName ?? "").toLowerCase().includes(term)) return false;
      return true;
    });
  }, [sites, search, flaggedOnly, countsByEntity]);

  // Overrides are merged on before filtering so an optimistically-approved row's new status is
  // visible everywhere downstream — including the "Approve N" count, which is status-derived.
  const filteredPolygons = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (allPolygons ?? []).map(withOverride).filter(polygon => {
      if (flaggedOnly && (countsByEntity[polygon.uuid] ?? 0) <= 0) return false;
      if (term !== "" && !(polygon.name ?? "").toLowerCase().includes(term)) return false;
      return true;
    });
  }, [allPolygons, search, flaggedOnly, countsByEntity, withOverride]);

  const selectedPolygons = useMemo(
    () => filteredPolygons.filter(polygon => selected.has(polygon.uuid)),
    [filteredPolygons, selected]
  );
  const approvableUuids = useMemo(
    () => selectedPolygons.filter(polygon => polygon.status !== POLYGON_APPROVED).map(polygon => polygon.uuid),
    [selectedPolygons]
  );
  const allFilteredSelected = filteredPolygons.length > 0 && selectedPolygons.length === filteredPolygons.length;

  const toggleRow = useCallback((uuid: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected(prev => {
      if (filteredPolygons.length > 0 && prev.size >= filteredPolygons.length) return new Set();
      return new Set(filteredPolygons.map(polygon => polygon.uuid));
    });
  }, [filteredPolygons]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const handleChangeView = useCallback((next: TableView) => {
    setView(next);
    setSelected(new Set());
    setEditingUuid(null);
  }, []);

  const handleBulkApprove = useCallback(async () => {
    const ok = await approve(approvableUuids);
    if (ok) clearSelection();
  }, [approve, approvableUuids, clearSelection]);

  const handleBulkAttributes = useCallback(
    async (changes: Parameters<typeof applyAttributes>[1]) => {
      const ok = await applyAttributes(selectedPolygons, changes);
      if (ok) clearSelection();
      return ok;
    },
    [applyAttributes, selectedPolygons, clearSelection]
  );

  const goToSite = (siteUuid: string) => router.push(`/site/${siteUuid}`);
  const goToPolygon = (polygonUuid: string) => router.push(`/project/${projectUuid}/polygon/${polygonUuid}`);

  const isLoading = view === "sites" ? !rollupLoaded : polygonsLoading && (allPolygons ?? []).length === 0;
  const rowCount = view === "sites" ? filteredSites.length : filteredPolygons.length;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedToggle
          view={view}
          onChange={handleChangeView}
          sitesCount={sites.length}
          polygonsCount={allPolygons?.length ?? 0}
        />

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon
              boxSize={3.5}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-theme-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder={view === "sites" ? "Search sites…" : "Search polygons…"}
              className="w-48 rounded border border-theme-neutral-200 py-1 pl-7 pr-2 text-xs text-theme-neutral-900 placeholder:text-theme-neutral-400 focus:border-theme-primary-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setFlaggedOnly(prev => !prev)}
            aria-pressed={flaggedOnly}
            className={
              flaggedOnly
                ? "inline-flex items-center gap-1 rounded border border-theme-warning-500 bg-theme-warning-100 px-2 py-1 text-xs font-medium text-theme-warning-900"
                : "inline-flex items-center gap-1 rounded border border-theme-neutral-200 px-2 py-1 text-xs text-theme-neutral-600 hover:bg-theme-neutral-100"
            }
          >
            <WarningIcon boxSize={2.5} />
            Show only flagged
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-theme-neutral-200 bg-white">
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: MAX_BODY_HEIGHT }}>
          {view === "sites" ? (
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
                      <td className="px-4 py-2 font-medium text-theme-neutral-900">
                        {site.siteName ?? "Unnamed site"}
                      </td>
                      <td className="px-4 py-2 tabular-nums text-theme-neutral-700">
                        {site.polygons.toLocaleString()}
                      </td>
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
          ) : (
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="sticky top-0 bg-theme-neutral-100">
                <tr>
                  <th className="border-b border-theme-neutral-200 px-4 py-2">
                    <TriStateCheckbox
                      ariaLabel="Select all filtered polygons"
                      checked={allFilteredSelected}
                      indeterminate={selectedPolygons.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  {["Polygon name", "Site", "Status", "Validation", "Area", "Trees", "Anomalies"].map(header => (
                    <th
                      key={header}
                      className="border-b border-theme-neutral-200 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-theme-neutral-400"
                    >
                      {header}
                    </th>
                  ))}
                  <th className="border-b border-theme-neutral-200 px-4 py-2" aria-label="Row actions" />
                </tr>
              </thead>
              <tbody>
                {filteredPolygons.map(polygon => {
                  const anomalyCount = countsByEntity[polygon.uuid] ?? 0;
                  const flagged = anomalyCount > 0;
                  const validationKey = polygon.validationStatus?.toLowerCase() ?? null;
                  const isSelected = selected.has(polygon.uuid);
                  const isEditing = editingUuid === polygon.uuid;
                  return (
                    <Fragment key={polygon.uuid}>
                      <tr
                        onClick={() => goToPolygon(polygon.uuid)}
                        className={`cursor-pointer border-b border-l-2 border-theme-neutral-200 last:border-b-0 hover:bg-theme-neutral-100 ${
                          flagged ? "border-l-theme-warning-500" : "border-l-transparent"
                        } ${isEditing ? "bg-theme-neutral-50" : ""}`}
                      >
                        <td className="px-4 py-2">
                          <TriStateCheckbox
                            ariaLabel={`Select ${polygon.name ?? "polygon"}`}
                            checked={isSelected}
                            indeterminate={false}
                            onChange={() => toggleRow(polygon.uuid)}
                          />
                        </td>
                        <td className="px-4 py-2 font-medium text-theme-neutral-900">
                          {polygon.name ?? "Unnamed polygon"}
                        </td>
                        <td className="px-4 py-2 text-theme-neutral-700">{polygon.siteName ?? "—"}</td>
                        <td className="px-4 py-2">
                          <Pill
                            label={polygon.status == null ? "—" : STATUS_LABELS[polygon.status] ?? polygon.status}
                            className={
                              polygon.status == null
                                ? "bg-theme-neutral-100 text-theme-neutral-500"
                                : STATUS_STYLES[polygon.status] ?? "bg-theme-neutral-200 text-theme-neutral-800"
                            }
                          />
                        </td>
                        <td className="px-4 py-2">
                          <Pill
                            label={
                              validationKey == null
                                ? "—"
                                : VALIDATION_LABELS[validationKey] ?? polygon.validationStatus!
                            }
                            className={
                              validationKey == null
                                ? "bg-theme-neutral-100 text-theme-neutral-500"
                                : VALIDATION_STYLES[validationKey] ?? "bg-theme-neutral-200 text-theme-neutral-800"
                            }
                          />
                        </td>
                        <td className="px-4 py-2 tabular-nums text-theme-neutral-700">
                          {orDash(polygon.calcArea, " ha")}
                        </td>
                        <td className="px-4 py-2 tabular-nums text-theme-neutral-700">{orDash(polygon.numTrees)}</td>
                        <td className="px-4 py-2">
                          <AnomaliesCell count={anomalyCount} />
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            aria-label={`Edit ${polygon.name ?? "polygon"}`}
                            onClick={event => {
                              // The edit control opens the inline editor; it must not navigate the row.
                              event.stopPropagation();
                              setEditingUuid(isEditing ? null : polygon.uuid);
                            }}
                            className={
                              isEditing
                                ? "rounded border border-theme-primary-500 bg-theme-primary-100 p-1 text-theme-primary-500"
                                : "rounded border border-transparent p-1 text-theme-neutral-400 hover:border-theme-neutral-200 hover:text-theme-neutral-700"
                            }
                          >
                            <EditIcon boxSize={2.5} />
                          </button>
                        </td>
                      </tr>
                      {isEditing && (
                        <InlineRowEditor
                          polygon={polygon}
                          colSpan={9}
                          isSaving={savingRowUuid === polygon.uuid}
                          onCancel={() => setEditingUuid(null)}
                          onSave={changes => applyAttributes([polygon], changes, { row: true })}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}

          {!isLoading && rowCount === 0 && (
            <p className="px-4 py-8 text-center text-sm text-theme-neutral-500">
              {view === "sites"
                ? sites.length === 0
                  ? "This project has no sites yet."
                  : "No sites match your filters."
                : (allPolygons ?? []).length === 0
                ? "This project has no polygons yet."
                : "No polygons match your filters."}
            </p>
          )}

          {isLoading && <p className="px-4 py-8 text-center text-sm text-theme-neutral-500">Loading…</p>}
        </div>
      </div>

      {view === "polygons" && selectedPolygons.length > 0 && (
        <BulkEditBar
          selectedCount={selectedPolygons.length}
          approvableCount={approvableUuids.length}
          isApproving={isApproving}
          isSavingAttributes={isSavingAttributes}
          onClear={clearSelection}
          onApprove={handleBulkApprove}
          onApplyAttributes={handleBulkAttributes}
        />
      )}

      {anomaliesLoaded && (
        <p className="text-[11px] text-theme-neutral-400">
          Anomaly counts fold together geometry validation and watchlist checks into one flag per row.
        </p>
      )}
    </div>
  );
};

export default ProjectDataTable;
