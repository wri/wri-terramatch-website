import { ComponentProps, FC } from "react";

import type { ReportIndexItem } from "../reportIndex.types";
import { useReportsSelectionActions, useReportsSelectionState } from "../ReportsSelection.provider";
import { useReportEditHandler } from "../useReportEditHandler";
import { useReportsBulkActions } from "../useReportsBulkActions";
import ReportsBulkActionToolbar from "./ReportsBulkActionToolbar";

type ToolbarProps = ComponentProps<typeof ReportsBulkActionToolbar>;

const SingleReportBulkActionToolbar: FC<
  Omit<ToolbarProps, "onEdit"> & { report: ReportIndexItem; indexHref?: string }
> = ({ report, indexHref, ...toolbarProps }) => {
  const { editReport, EditModals } = useReportEditHandler(report, indexHref);

  return (
    <>
      {EditModals}
      <ReportsBulkActionToolbar {...toolbarProps} onEdit={editReport} />
    </>
  );
};

const ReportsIndexBulkBar: FC<{ indexHref?: string }> = ({ indexHref }) => {
  const { selectedReports } = useReportsSelectionState();
  const { clearSelection } = useReportsSelectionActions();

  const {
    isDownloading,
    isUpdating,
    canEdit,
    canSubmit,
    editDisabledTooltip,
    canMarkNothingToReport,
    submitDisabledTooltip,
    nothingToReportDisabledTooltip,
    handleDownload,
    handleNothingToReport,
    handleSubmit
  } = useReportsBulkActions({ selectedReports, clearSelection });

  const toolbarProps: Omit<ToolbarProps, "onEdit"> = {
    visible: selectedReports.length > 0,
    itemCount: selectedReports.length,
    canEdit,
    editDisabledTooltip,
    isDownloading,
    nothingToReportDisabled: !canMarkNothingToReport,
    submitDisabled: !canSubmit,
    isUpdating,
    submitDisabledTooltip,
    nothingToReportDisabledTooltip,
    onCancel: clearSelection,
    onDownload: () => void handleDownload(),
    onNothingToReport: () => void handleNothingToReport(),
    onSubmit: () => void handleSubmit()
  };

  return selectedReports.length === 1 ? (
    <SingleReportBulkActionToolbar {...toolbarProps} report={selectedReports[0]} indexHref={indexHref} />
  ) : (
    <ReportsBulkActionToolbar {...toolbarProps} />
  );
};

export default ReportsIndexBulkBar;
