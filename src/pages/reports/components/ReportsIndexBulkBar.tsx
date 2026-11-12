import { useT } from "@transifex/react";
import { ComponentProps, FC, useCallback, useState } from "react";

import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";

import type { ReportIndexItem } from "../reportIndex.types";
import { isNothingToReportAllowedFor } from "../reportIndex.utils";
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
  const t = useT();
  const [isNothingToReportModalOpen, setIsNothingToReportModalOpen] = useState(false);
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

  const confirmNothingToReport = useCallback(() => {
    setIsNothingToReportModalOpen(false);
    void handleNothingToReport();
  }, [handleNothingToReport]);

  const toolbarProps: Omit<ToolbarProps, "onEdit"> = {
    visible: selectedReports.length > 0,
    itemCount: selectedReports.length,
    canEdit,
    editDisabledTooltip,
    isDownloading,
    showNothingToReport: isNothingToReportAllowedFor(selectedReports),
    nothingToReportDisabled: !canMarkNothingToReport,
    submitDisabled: !canSubmit,
    isUpdating,
    submitDisabledTooltip,
    nothingToReportDisabledTooltip,
    onCancel: clearSelection,
    onDownload: () => void handleDownload(),
    onNothingToReport: () => setIsNothingToReportModalOpen(true),
    onSubmit: () => void handleSubmit()
  };

  return (
    <>
      {selectedReports.length === 1 ? (
        <SingleReportBulkActionToolbar {...toolbarProps} report={selectedReports[0]} indexHref={indexHref} />
      ) : (
        <ReportsBulkActionToolbar {...toolbarProps} />
      )}
      <ModalConfirmation
        open={isNothingToReportModalOpen}
        onOpenChange={setIsNothingToReportModalOpen}
        title={t("Submit as Nothing to Report?")}
        content={t(
          "You’re confirming there were no activities at the selected site(s)/nursery(ies) during this reporting period. Your report(s) will be submitted for review and closed for editing."
        )}
        confirmButton={{
          id: "confirm",
          children: t("Confirm"),
          disabled: !canMarkNothingToReport || isUpdating,
          onClick: confirmNothingToReport
        }}
      />
    </>
  );
};

export default ReportsIndexBulkBar;
