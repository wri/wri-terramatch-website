import { useRouter } from "next/router";
import { useCallback } from "react";

import { getReportIndexItemPath } from "../reportIndex.utils";
import { useReportsSelectionActions, useReportsSelectionState } from "../ReportsSelection.provider";
import { useReportsBulkActions } from "../useReportsBulkActions";
import ReportsBulkActionToolbar from "./ReportsBulkActionToolbar";

type ReportsIndexBulkBarProps = {
  onReportsChanged: () => void;
};

const ReportsIndexBulkBar = ({ onReportsChanged }: ReportsIndexBulkBarProps) => {
  const router = useRouter();
  const { selectedReports } = useReportsSelectionState();
  const { clearSelection } = useReportsSelectionActions();

  const {
    isDownloading,
    isUpdating,
    canEdit,
    canSubmit,
    canMarkNothingToReport,
    submitDisabledTooltip,
    handleDownload,
    handleNothingToReport,
    handleSubmit
  } = useReportsBulkActions({
    selectedReports,
    clearSelection,
    onReportsChanged
  });

  const handleBulkEdit = useCallback(() => {
    if (!canEdit || selectedReports.length !== 1) return;
    void router.push(getReportIndexItemPath(selectedReports[0]));
  }, [canEdit, router, selectedReports]);

  return (
    <>
      {selectedReports.length > 0 ? <div aria-hidden className="h-24" /> : null}
      <ReportsBulkActionToolbar
        visible={selectedReports.length > 0}
        itemCount={selectedReports.length}
        editDisabled={!canEdit}
        isDownloading={isDownloading}
        nothingToReportDisabled={!canMarkNothingToReport}
        submitDisabled={!canSubmit}
        isUpdating={isUpdating}
        submitDisabledTooltip={submitDisabledTooltip}
        onCancel={clearSelection}
        onDownload={() => void handleDownload()}
        onNothingToReport={() => void handleNothingToReport()}
        onEdit={handleBulkEdit}
        onSubmit={() => void handleSubmit()}
      />
    </>
  );
};

export default ReportsIndexBulkBar;
