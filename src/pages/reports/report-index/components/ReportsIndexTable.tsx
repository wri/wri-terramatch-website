import { Box, TableCell as ChakraTableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useCallback, useMemo } from "react";

import { useDate } from "@/hooks/useDate";
import { getThemedColor } from "@/lib/theme";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import TitleCell from "@/redesignComponents/dataDisplay/Table/components/TitleCell";
import Table, {
  CHECKBOX_COLUMN_KEY,
  TableColumn,
  TableRenderRowContext
} from "@/redesignComponents/dataDisplay/Table/Table";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import { CalendarIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

import { ReportsIndexReport } from "../reportIndex.types";
import {
  getReportIndexItemPath,
  getReportStatusSortValue,
  getReportTypeSortValue,
  rememberReportsIndexPosition,
  withReportsIndexReturn
} from "../reportIndex.utils";
import { useReportTableSelection } from "../ReportsSelection.provider";

const ReportsIndexTable = ({
  reports,
  indexHref,
  restoreRowId,
  onRowRestored
}: {
  reports: ReportsIndexReport[];
  indexHref?: string;
  restoreRowId?: string;
  onRowRestored?: () => void;
}) => {
  const t = useT();
  const { format } = useDate();
  const { selectedRows, isReportSelected, handleRowSelected, handleAllItemsSelected } =
    useReportTableSelection(reports);

  const typeLabels = useMemo(
    () => ({
      "project-report": t("Project Report"),
      "site-report": t("Site Report"),
      "nursery-report": t("Nursery Report")
    }),
    [t]
  );

  const columns = useMemo<TableColumn[]>(
    () => [
      {
        key: "name",
        label: t("Report Name"),
        width: "52%"
      },
      {
        key: "type",
        label: t("Report Type"),
        sortable: true,
        sortValue: row => getReportTypeSortValue((row as ReportsIndexReport).type)
      },
      {
        key: "status",
        label: t("Status"),
        sortable: true,
        sortValue: row => getReportStatusSortValue((row as ReportsIndexReport).status)
      },
      {
        key: "updatedAt",
        label: t("Last Updated"),
        sortable: true
      },
      {
        key: "actions",
        label: ""
      }
    ],
    [t]
  );

  const renderRow = useCallback(
    (report: ReportsIndexReport, context?: TableRenderRowContext) => {
      const isSelected = isReportSelected(report);

      return (
        <TableRow
          className={context?.className != null ? `group ${context.className}` : "group"}
          aria-selected={isSelected}
          data-report-id={report.id}
          style={{ scrollMarginTop: "7rem" }}
        >
          <ChakraTableCell {...context?.getCellProps(CHECKBOX_COLUMN_KEY)}>
            <Checkbox
              name={`report-${report.id}`}
              aria-label={t("Select {report}", { report: report.name ?? typeLabels[report.type] })}
              checked={isSelected}
              onCheckedChange={({ checked }) => handleRowSelected(report, checked === true)}
            />
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("name")}>
            <TitleCell
              label={report.name ?? typeLabels[report.type]}
              link={withReportsIndexReturn(`/reports/${report.type}/${report.id}`, indexHref)}
              linkTarget="_self"
              showChevron={false}
              onClick={() => rememberReportsIndexPosition(indexHref, report.id)}
            />
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("type")}>
            <Text color="neutral.800" textStyle="400">
              {typeLabels[report.type]}
            </Text>
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("status")}>
            <TagSubmission state={report.status} size="small" />
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("updatedAt")}>
            {report.status === "due" ? (
              "—"
            ) : (
              <ActionStatusTag
                state="neutral-light"
                label={format(report.updatedAt)}
                icon={<CalendarIcon boxSize="0.625rem" />}
                size="small"
                className="rounded bg-theme-neutral-200"
              />
            )}
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("actions")}>
            <Box pr="1.5625rem">
              <ActionCell
                button={{
                  children: t("Edit"),
                  as: "a",
                  href: withReportsIndexReturn(getReportIndexItemPath(report), indexHref),
                  onClick: () => rememberReportsIndexPosition(indexHref, report.id),
                  leftIcon: (
                    <EditIcon
                      css={{
                        "& svg path": {
                          fill: getThemedColor("neutral", 900) + " !important",
                          color: getThemedColor("neutral", 900) + " !important"
                        }
                      }}
                    />
                  )
                }}
              />
            </Box>
          </ChakraTableCell>
        </TableRow>
      );
    },
    [format, handleRowSelected, indexHref, isReportSelected, t, typeLabels]
  );

  if (reports.length === 0) {
    return (
      <div className="flex min-h-[7.5rem] items-center justify-center">
        <Button variant="borderless" disabled>
          {t("No reports are available for this reporting period.")}
        </Button>
      </div>
    );
  }

  return (
    <Box className="mobile:!w-full mobile:overflow-auto">
      <Table<ReportsIndexReport>
        data={reports}
        columns={columns}
        selectable
        selectedRows={selectedRows}
        onRowSelected={handleRowSelected}
        onAllItemsSelected={handleAllItemsSelected}
        renderRow={renderRow}
        pageSize={10}
        totalItems={reports.length}
        restoreRowId={restoreRowId}
        onRowRestored={onRowRestored}
        className="overflow-hidden rounded"
      />
    </Box>
  );
};

export default ReportsIndexTable;
