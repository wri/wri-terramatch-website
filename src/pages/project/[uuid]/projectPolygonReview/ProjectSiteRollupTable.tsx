import { TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo, useState } from "react";

import Table, { type TableColumn, type TableRenderRowContext } from "@/redesignComponents/dataDisplay/Table/Table";
import { type BaseRow } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import { SearchIcon } from "@/redesignComponents/foundations/Icons";

import { AnomaliesCell, FlaggedFilterButton, orDash, Pill } from "./rollupTableCells";
import { SiteReviewRollupRow } from "./useProjectSiteRollup";

type RollupTableRow = SiteReviewRollupRow & BaseRow;

export interface ProjectSiteRollupTableProps {
  rows: SiteReviewRollupRow[];
  loading: boolean;
  onSelectSite: (siteUuid: string) => void;
}

/**
 * Per-site rollup table for the project polygon-review "rollup" mode (plan §3.2/T3). Adapted from the
 * prototype's Sites view (`design/project-data-experience:src/components/projectData/ProjectDataTable.tsx`
 * ~85-207) onto the design-system Table so it matches the rest of the review workspace, with row
 * click driving the in-place site drill-in instead of a page navigation.
 */
const ProjectSiteRollupTable: FC<ProjectSiteRollupTableProps> = ({ rows, loading, onSelectSite }) => {
  const t = useT();
  const [search, setSearch] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const filteredRows = useMemo<RollupTableRow[]>(() => {
    const term = search.trim().toLowerCase();
    return rows
      .filter(row => {
        if (flaggedOnly && row.overlapCount <= 0) return false;
        if (term !== "" && !(row.siteName || "").toLowerCase().includes(term)) return false;
        return true;
      })
      .map(row => ({ ...row, id: row.siteUuid }));
  }, [rows, search, flaggedOnly]);

  const columns: TableColumn[] = useMemo(
    () => [
      { key: "siteName", label: t("Site"), sortable: true, width: "16rem", sticky: true },
      { key: "activeTotal", label: t("Polygons"), sortable: true, width: "9rem" },
      { key: "approvable", label: t("Approvable"), sortable: false, width: "9rem" },
      { key: "failed", label: t("Failed"), sortable: true, width: "8rem" },
      { key: "notChecked", label: t("Not started"), sortable: true, width: "9rem" },
      { key: "inReview", label: t("In review"), sortable: false, width: "9rem" },
      { key: "overlapCount", label: t("Overlaps"), sortable: true, width: "8rem" },
      { key: "hectares", label: t("Hectares"), sortable: true, width: "9rem" }
    ],
    [t]
  );

  const renderRow = (row: RollupTableRow, context?: TableRenderRowContext) => {
    const approvable = row.passed + row.partial;
    const inReview = row.draft + row.pendingApproval + row.informationRequired;
    const failed = row.failed;
    const notChecked = row.notChecked;
    const overlapCount = row.overlapCount;

    return (
      <TableRow className={classNames(context?.className, "cursor-pointer")} onClick={() => onSelectSite(row.siteUuid)}>
        <TableCell {...context?.getCellProps("siteName")}>
          <Text textStyle="400-bold" color="neutral.800" className="truncate">
            {row.siteName === "" ? t("Unnamed site") : row.siteName}
          </Text>
        </TableCell>
        <TableCell {...context?.getCellProps("activeTotal")}>
          <Text color="neutral.700">{row.activeTotal.toLocaleString()}</Text>
        </TableCell>
        <TableCell {...context?.getCellProps("approvable")}>
          {approvable != null && approvable > 0 ? (
            <Pill label={orDash(approvable)} className="bg-theme-success-100 text-theme-success-900" />
          ) : (
            <Text color="neutral.600">{orDash(approvable)}</Text>
          )}
        </TableCell>
        <TableCell {...context?.getCellProps("failed")}>
          {failed != null && failed > 0 ? (
            <Pill label={orDash(failed)} className="bg-theme-error-100 text-theme-error-900" />
          ) : (
            <Text color="neutral.600">{orDash(failed)}</Text>
          )}
        </TableCell>
        <TableCell {...context?.getCellProps("notChecked")}>
          <Text color="neutral.600">{orDash(notChecked)}</Text>
        </TableCell>
        <TableCell {...context?.getCellProps("inReview")}>
          {inReview != null && inReview > 0 ? (
            <Pill label={orDash(inReview)} className="bg-theme-warning-100 text-theme-warning-900" />
          ) : (
            <Text color="neutral.600">{orDash(inReview)}</Text>
          )}
        </TableCell>
        <TableCell {...context?.getCellProps("overlapCount")}>
          <AnomaliesCell count={overlapCount} />
        </TableCell>
        <TableCell {...context?.getCellProps("hectares")}>
          <Text color="neutral.700">{orDash(row.hectares, " ha")}</Text>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text textStyle="400-bold" color="neutral.800">
          {t("Sites")}
        </Text>
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
              placeholder={t("Search sites…")}
              className="w-48 rounded border border-theme-neutral-200 py-1 pl-7 pr-2 text-xs text-theme-neutral-900 placeholder:text-theme-neutral-400 focus:border-theme-primary-500 focus:outline-none"
            />
          </div>
          <FlaggedFilterButton
            active={flaggedOnly}
            onClick={() => setFlaggedOnly(prev => !prev)}
            label={t("Show only flagged")}
          />
        </div>
      </div>

      <Table<RollupTableRow>
        data={filteredRows}
        columns={columns}
        loading={loading}
        renderRow={renderRow}
        showPagination
        pageSize={10}
      />

      {!loading && filteredRows.length === 0 && (
        <Text textStyle="400" color="neutral.500" className="py-8 text-center">
          {rows.length === 0 ? t("This project has no sites yet.") : t("No sites match your filters.")}
        </Text>
      )}
    </div>
  );
};

export default ProjectSiteRollupTable;
