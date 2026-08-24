import { Box, Flex, TableCell as ChakraTableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { startCase } from "lodash";
import { useCallback, useMemo } from "react";

import { getCurrencyOptions } from "@/constants/options/localCurrency";
import { getMonthOptions } from "@/constants/options/months";
import { useDate } from "@/hooks/useDate";
import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import TitleCell from "@/redesignComponents/dataDisplay/Table/components/TitleCell";
import Table, {
  CHECKBOX_COLUMN_KEY,
  TableColumn,
  TableRenderRowContext
} from "@/redesignComponents/dataDisplay/Table/Table";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import { CalendarIcon, DueIcon } from "@/redesignComponents/foundations/Icons";

import { AdditionalReport, AdditionalReportType } from "../reportIndex.types";
import { getReportStatusSortValue, rememberReportsIndexPosition, withReportsIndexReturn } from "../reportIndex.utils";
import { useReportTableSelection } from "../ReportsSelection.provider";
import ReportsIndexEditButton from "./ReportsIndexEditButton";

const getColumns = (type: AdditionalReportType, t: ReturnType<typeof useT>): TableColumn[] => {
  if (type === "financial-report") {
    return [
      { key: "name", label: t("Report Name"), width: "18.0625rem" },
      { key: "dueAt", label: t("Due Date"), sortable: true, width: "8.75rem" },
      { key: "currency", label: t("Local Currency"), width: "11.25rem" },
      { key: "financialYearStart", label: t("Financial Year Start"), sortable: true, width: "12.1875rem" },
      {
        key: "status",
        label: t("Status"),
        sortable: true,
        width: "12.5rem",
        sortValue: row => getReportStatusSortValue((row as AdditionalReport).status)
      },
      { key: "updatedAt", label: t("Last Updated"), sortable: true, width: "9.375rem" },
      { key: "actions", label: "", width: "8.125rem" }
    ];
  }

  if (type === "srp-report") {
    return [
      { key: "name", label: t("Report Name"), width: "25.25rem" },
      { key: "dueAt", label: t("Due Date"), sortable: true, width: "15.625rem" },
      {
        key: "status",
        label: t("Status"),
        sortable: true,
        width: "15.625rem",
        sortValue: row => getReportStatusSortValue((row as AdditionalReport).status)
      },
      { key: "updatedAt", label: t("Last Updated"), sortable: true, width: "15.625rem" },
      { key: "actions", label: "", width: "8.125rem" }
    ];
  }

  return [
    { key: "name", label: t("Report Name"), width: "21.375rem" },
    { key: "dateOfDisturbance", label: t("Date of Disturbance"), sortable: true, width: "12.5rem" },
    { key: "sitesAffected", label: t("Sites Affected"), sortable: true, width: "9.6875rem" },
    {
      key: "status",
      label: t("Status"),
      sortable: true,
      width: "11.875rem",
      sortValue: row => getReportStatusSortValue((row as AdditionalReport).status)
    },
    { key: "intensity", label: t("Intensity"), sortable: true, width: "7.5rem" },
    { key: "updatedAt", label: t("Last Updated"), sortable: true, width: "9.1875rem" },
    { key: "actions", label: "", width: "8.125rem" }
  ];
};

type AdditionalReportsTableProps = {
  reports: AdditionalReport[];
  type: AdditionalReportType;
  indexHref?: string;
  restoreRowId?: string;
  onRowRestored?: () => void;
};

const AdditionalReportsTable = ({
  reports,
  type,
  indexHref,
  restoreRowId,
  onRowRestored
}: AdditionalReportsTableProps) => {
  const t = useT();
  const { format } = useDate();
  const { selectedRows, isReportSelected, handleRowSelected, handleAllItemsSelected } =
    useReportTableSelection(reports);
  const columns = useMemo(() => getColumns(type, t), [t, type]);
  const currencyLabels = useMemo(() => getCurrencyOptions(t), [t]);
  const monthLabels = useMemo(() => getMonthOptions(t), [t]);

  const renderDateTag = useCallback(
    (date: string | null, dueAt: boolean) =>
      date == null ? (
        "—"
      ) : dueAt ? (
        <Flex>
          <FeedbackTag icon={<DueIcon />} label={format(date)} onClose={() => {}} size="default" type="info-white" />
        </Flex>
      ) : (
        <ActionStatusTag
          state="neutral-light"
          label={format(date)}
          icon={<CalendarIcon boxSize="0.625rem" />}
          size="small"
          className="rounded bg-theme-neutral-200"
        />
      ),
    [format]
  );

  const renderRow = useCallback(
    (report: AdditionalReport, context?: TableRenderRowContext) => {
      const isSelected = isReportSelected(report);
      const reportDate = report.type === "disturbance-report" ? report.dateOfDisturbance : report.dueAt;
      const reportName = reportDate == null ? report.name : `${report.name} - ${format(reportDate, "MMM yyyy")}`;

      return (
        <TableRow
          className={context?.className != null ? `group ${context.className}` : "group"}
          aria-selected={isSelected}
          data-report-id={report.id}
          style={{ scrollMarginTop: "7rem" }}
        >
          <ChakraTableCell {...context?.getCellProps(CHECKBOX_COLUMN_KEY)}>
            <Checkbox
              name={`additional-report-${report.id}`}
              aria-label={t("Select {report}", { report: reportName })}
              checked={isSelected}
              onCheckedChange={({ checked }) => handleRowSelected(report, checked === true)}
            />
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("name")}>
            <TitleCell
              label={reportName}
              link={withReportsIndexReturn(`/reports/${report.type}/${report.id}`, indexHref)}
              linkTarget="_self"
              showChevron={false}
              onClick={() => rememberReportsIndexPosition(indexHref, report.id)}
            />
          </ChakraTableCell>

          {report.type === "financial-report" && (
            <>
              <ChakraTableCell {...context?.getCellProps("dueAt")}>{renderDateTag(report.dueAt, true)}</ChakraTableCell>
              <ChakraTableCell {...context?.getCellProps("currency")}>
                <Text color="neutral.800" textStyle="400">
                  {currencyLabels.find(option => option.value === report.currency)?.title ?? report.currency ?? "—"}
                </Text>
              </ChakraTableCell>
              <ChakraTableCell {...context?.getCellProps("financialYearStart")}>
                <Text color="neutral.800" textStyle="400">
                  {monthLabels.find(option => option.value === report.financialYearStart)?.title ?? "—"}
                </Text>
              </ChakraTableCell>
            </>
          )}

          {report.type === "srp-report" && (
            <ChakraTableCell {...context?.getCellProps("dueAt")}>{renderDateTag(report.dueAt, true)}</ChakraTableCell>
          )}

          {report.type === "disturbance-report" && (
            <>
              <ChakraTableCell {...context?.getCellProps("dateOfDisturbance")}>
                {renderDateTag(report.dateOfDisturbance, false)}
              </ChakraTableCell>
              <ChakraTableCell {...context?.getCellProps("sitesAffected")}>
                <Text color="neutral.800" textStyle="400">
                  {report.sitesAffected}
                </Text>
              </ChakraTableCell>
            </>
          )}

          <ChakraTableCell {...context?.getCellProps("status")}>
            {report.nothingToReport ? (
              <TagSubmission state="nothing-reported" size="small" />
            ) : (
              <TagSubmission state={report.status} size="small" />
            )}
          </ChakraTableCell>

          {report.type === "disturbance-report" && (
            <ChakraTableCell {...context?.getCellProps("intensity")}>
              <Text color="neutral.800" textStyle="400">
                {report.intensity == null ? "—" : t(startCase(report.intensity))}
              </Text>
            </ChakraTableCell>
          )}

          <ChakraTableCell {...context?.getCellProps("updatedAt")}>
            {renderDateTag(report.updatedAt, false)}
          </ChakraTableCell>
          <ChakraTableCell {...context?.getCellProps("actions")}>
            <ReportsIndexEditButton report={report} indexHref={indexHref} />
          </ChakraTableCell>
        </TableRow>
      );
    },
    [currencyLabels, format, handleRowSelected, indexHref, isReportSelected, monthLabels, renderDateTag, t]
  );

  return (
    <Box className="mobile:!w-full mobile:overflow-auto">
      <Table<AdditionalReport>
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

export default AdditionalReportsTable;
