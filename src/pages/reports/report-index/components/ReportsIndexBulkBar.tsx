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
    canSubmit,
    canMarkNothingToReport,
    submitDisabledTooltip,
    nothingToReportDisabledTooltip,
    handleDownload,
    handleNothingToReport,
    handleSubmit
  } = useReportsBulkActions({
    selectedReports,
    clearSelection,
    onReportsChanged
  });

  const handleBulkEdit = useCallback(() => {
    if (selectedReports.length === 1) {
      void router.push(getReportIndexItemPath(selectedReports[0]));
    }
  }, [router, selectedReports]);

  return (
    <>
      {selectedReports.length > 0 ? <div aria-hidden className="h-24" /> : null}
      <ReportsBulkActionToolbar
        visible={selectedReports.length > 0}
        itemCount={selectedReports.length}
        editDisabled={selectedReports.length !== 1}
        isDownloading={isDownloading}
        nothingToReportDisabled={!canMarkNothingToReport}
        submitDisabled={!canSubmit}
        isUpdating={isUpdating}
        submitDisabledTooltip={submitDisabledTooltip}
        nothingToReportDisabledTooltip={nothingToReportDisabledTooltip}
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
