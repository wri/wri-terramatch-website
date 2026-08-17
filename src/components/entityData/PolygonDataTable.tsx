import { useRouter } from "next/router";
import { Fragment, ReactNode, useCallback, useMemo, useState } from "react";

import BulkEditBar from "@/components/projectData/BulkEditBar";
import InlineRowEditor from "@/components/projectData/InlineRowEditor";
import { useSitePolygonEditing } from "@/components/projectData/useSitePolygonEditing";
import { POLYGON_APPROVED } from "@/constants/polygonStatuses";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { EditIcon, SearchIcon } from "@/redesignComponents/foundations/Icons";

import {
  AnomaliesCell,
  FlaggedFilterButton,
  orDash,
  StatusPill,
  TriStateCheckbox,
  ValidationPill
} from "./polygonTableCells";

/**
 * The one polygon table, rendered by every entity that lists polygons — the project Details tab
 * (Polygons view) and the site Details tab.
 *
 * It owns the full surface: search + "show only flagged" filter, the merged anomaly flag column,
 * checkbox selection, the sticky bulk approve/edit bar, and the per-row inline editor. Editing runs
 * through `useSitePolygonEditing` against the real bulk endpoints, so an edit made from a site table
 * hits the identical path an edit from the project table does.
 *
 * The only per-caller differences are configuration, not structure: whether a "Site" column shows
 * (a project spans sites; a single site does not), what the empty-state text says, and what element
 * leads the toolbar (a Sites|Polygons toggle on the project, a plain count on a site).
 */
export interface PolygonDataTableProps {
  /** Raw, unfiltered polygons for this scope. Filtering and optimistic edit-overrides happen here. */
  polygons: SitePolygonLightDto[];
  /** Merged anomaly count per polygon uuid. */
  countsByEntity: Record<string, number>;
  /** Parent project — polygon click-through and the anomaly footnote resolve against it. */
  projectUuid: string;
  loading: boolean;
  /** Show which site each polygon belongs to. True at project scope, false within one site. */
  showSiteColumn?: boolean;
  /** Text when the scope genuinely has no polygons (vs. none matching the filters). */
  emptyLabel: string;
  /** Leads the toolbar: a Sites|Polygons toggle on the project, a "Polygons (N)" label on a site. */
  toolbarLeading?: ReactNode;
}

const MAX_BODY_HEIGHT = "26rem";

const PolygonDataTable = ({
  polygons,
  countsByEntity,
  projectUuid,
  loading,
  showSiteColumn = false,
  emptyLabel,
  toolbarLeading
}: PolygonDataTableProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [editingUuid, setEditingUuid] = useState<string | null>(null);

  const { withOverride, approve, applyAttributes, isApproving, isSavingAttributes, savingRowUuid } =
    useSitePolygonEditing();

  // Overrides merge on before filtering so an optimistically-approved row's new status is visible
  // everywhere downstream — including the status-derived "Approve N" count.
  const filteredPolygons = useMemo(() => {
    const term = search.trim().toLowerCase();
    return polygons.map(withOverride).filter(polygon => {
      if (flaggedOnly && (countsByEntity[polygon.uuid] ?? 0) <= 0) return false;
      if (term !== "" && !(polygon.name ?? "").toLowerCase().includes(term)) return false;
      return true;
    });
  }, [polygons, search, flaggedOnly, countsByEntity, withOverride]);

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

  const goToPolygon = (polygonUuid: string) => router.push(`/project/${projectUuid}/polygon/${polygonUuid}`);

  const isLoading = loading && polygons.length === 0;
  const headers = showSiteColumn
    ? ["Polygon name", "Site", "Status", "Validation", "Area", "Trees", "Anomalies"]
    : ["Polygon name", "Status", "Validation", "Area", "Trees", "Anomalies"];
  // checkbox + data columns + the trailing edit-actions column.
  const colSpan = headers.length + 2;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {toolbarLeading ?? <span />}

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
              placeholder="Search polygons…"
              className="w-48 rounded border border-theme-neutral-200 py-1 pl-7 pr-2 text-xs text-theme-neutral-900 placeholder:text-theme-neutral-400 focus:border-theme-primary-500 focus:outline-none"
            />
          </div>
          <FlaggedFilterButton active={flaggedOnly} onClick={() => setFlaggedOnly(prev => !prev)} />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-theme-neutral-200 bg-white">
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: MAX_BODY_HEIGHT }}>
          <table className={`w-full ${showSiteColumn ? "min-w-[820px]" : "min-w-[760px]"} text-left text-sm`}>
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
                {headers.map(header => (
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
                      {showSiteColumn && (
                        <td className="px-4 py-2 text-theme-neutral-700">{polygon.siteName ?? "—"}</td>
                      )}
                      <td className="px-4 py-2">
                        <StatusPill status={polygon.status} />
                      </td>
                      <td className="px-4 py-2">
                        <ValidationPill validationStatus={polygon.validationStatus} />
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
                        colSpan={colSpan}
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

          {!isLoading && filteredPolygons.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-theme-neutral-500">
              {polygons.length === 0 ? emptyLabel : "No polygons match your filters."}
            </p>
          )}

          {isLoading && <p className="px-4 py-8 text-center text-sm text-theme-neutral-500">Loading…</p>}
        </div>
      </div>

      {selectedPolygons.length > 0 && (
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

      <p className="text-[11px] text-theme-neutral-400">
        Anomaly counts fold together geometry validation and watchlist checks into one flag per row.
      </p>
    </div>
  );
};

export default PolygonDataTable;
