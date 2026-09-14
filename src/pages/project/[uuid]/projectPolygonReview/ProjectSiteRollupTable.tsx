import { Box, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo } from "react";

import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import Table, { type TableColumn, type TableRenderRowContext } from "@/redesignComponents/dataDisplay/Table/Table";
import { type BaseRow } from "@/redesignComponents/dataDisplay/Table/tableUtils";

import { AnomaliesCell, orDash } from "./rollupTableCells";
import { SiteReviewRollupRow } from "./useProjectSiteRollup";

type RollupTableRow = SiteReviewRollupRow & BaseRow;

export interface ProjectSiteRollupTableProps {
  // Already filtered by the toolbar/drawer at the view level (so the table and the map show the same
  // sites). The table only adds a row id and keeps column sorting.
  rows: SiteReviewRollupRow[];
  // Unfiltered site count, so the empty state can tell "no sites yet" from "no sites match filters".
  totalSiteCount: number;
  loading: boolean;
  onSelectSite: (siteUuid: string) => void;
}

/**
 * Per-site rollup table for the project polygon-review "rollup" mode (plan §3.2/T3). Adapted from the
 * prototype's Sites view (`design/project-data-experience:src/components/projectData/ProjectDataTable.tsx`
 * ~85-207) onto the design-system Table so it matches the rest of the review workspace, with row
 * click driving the in-place site drill-in instead of a page navigation. Search + facet filtering now
 * live in the view's toolbar/drawer (SiteRollupToolbar); this table just renders the filtered rows.
 */
const ProjectSiteRollupTable: FC<ProjectSiteRollupTableProps> = ({ rows, totalSiteCount, loading, onSelectSite }) => {
  const t = useT();

  const tableRows = useMemo<RollupTableRow[]>(() => rows.map(row => ({ ...row, id: row.siteUuid })), [rows]);

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
            <ActionStatusTag state="success" size="small" label={orDash(approvable)} />
          ) : (
            <Text color="neutral.600">{orDash(approvable)}</Text>
          )}
        </TableCell>
        <TableCell {...context?.getCellProps("failed")}>
          {failed != null && failed > 0 ? (
            // "warning" state renders the error/red palette — matching the old failed pill.
            <ActionStatusTag state="warning" size="small" label={orDash(failed)} />
          ) : (
            <Text color="neutral.600">{orDash(failed)}</Text>
          )}
        </TableCell>
        <TableCell {...context?.getCellProps("notChecked")}>
          <Text color="neutral.600">{orDash(notChecked)}</Text>
        </TableCell>
        <TableCell {...context?.getCellProps("inReview")}>
          {inReview != null && inReview > 0 ? (
            // "attention" state renders the amber/warning palette — matching the old in-review pill.
            <ActionStatusTag state="attention" size="small" label={orDash(inReview)} />
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
      <Table<RollupTableRow>
        data={tableRows}
        columns={columns}
        loading={loading}
        renderRow={renderRow}
        showPagination
        pageSize={10}
      />

      {!loading && tableRows.length === 0 && (
        <Box className="py-8 text-center">
          <Text textStyle="400-bold">{totalSiteCount === 0 ? t("No sites yet") : t("No results found")}</Text>
          <Text textStyle="400">
            {totalSiteCount === 0 ? t("This project has no sites yet.") : t("No sites match your filters.")}
          </Text>
        </Box>
      )}
    </div>
  );
};

export default ProjectSiteRollupTable;
