import { useT } from "@transifex/react";
import { FC, useEffect, useMemo } from "react";

import { useLayoutShell } from "@/redesignComponents/Layout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";

type ReportsBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  canEdit: boolean;
  editDisabled?: boolean;
  downloadDisabled?: boolean;
  isDownloading?: boolean;
  nothingToReportDisabled?: boolean;
  submitDisabled?: boolean;
  isUpdating?: boolean;
  submitDisabledTooltip?: string;
  nothingToReportDisabledTooltip?: string;
  onCancel: () => void;
  onDownload: () => void;
  onNothingToReport: () => void;
  onEdit: () => void;
  onSubmit: () => void;
};

const ReportsBulkActionToolbar: FC<ReportsBulkActionToolbarProps> = ({
  visible,
  itemCount,
  canEdit,
  editDisabled = false,
  downloadDisabled = false,
  isDownloading = false,
  nothingToReportDisabled = false,
  submitDisabled = false,
  isUpdating = false,
  submitDisabledTooltip,
  nothingToReportDisabledTooltip,
  onCancel,
  onDownload,
  onNothingToReport,
  onEdit,
  onSubmit
}) => {
  const t = useT();
  const { setSidebarCollapseDisabled } = useLayoutShell();

  const downloadAction: BulkToolbarAction = {
    id: "download",
    children: t("Download"),
    disabled: downloadDisabled || isDownloading,
    loading: isDownloading,
    onClick: onDownload
  };

  const actions = useMemo<BulkToolbarAction[]>(() => {
    const nextActions: BulkToolbarAction[] = [
      {
        id: "nothing-to-report",
        children: t("Nothing to Report"),
        disabled: nothingToReportDisabled || isUpdating,
        tooltip: nothingToReportDisabled ? nothingToReportDisabledTooltip : undefined,
        onClick: onNothingToReport
      },
      ...(canEdit
        ? [
            {
              id: "edit",
              children: t("Edit"),
              disabled: editDisabled || isUpdating,
              onClick: onEdit
            }
          ]
        : [])
    ];

    return nextActions;
  }, [
    canEdit,
    editDisabled,
    isUpdating,
    nothingToReportDisabled,
    nothingToReportDisabledTooltip,
    onEdit,
    onNothingToReport,
    t
  ]);

  useEffect(() => {
    setSidebarCollapseDisabled(visible);
    return () => setSidebarCollapseDisabled(false);
  }, [setSidebarCollapseDisabled, visible]);

  if (!visible) return null;

  return (
    <BulkActionToolbar
      selectedCount={itemCount}
      cancelAction={{ children: t("Cancel"), onClick: onCancel, disabled: isUpdating }}
      deleteAction={downloadAction}
      actions={actions}
      primaryAction={{
        children: t("Submit"),
        disabled: submitDisabled || isUpdating,
        onClick: onSubmit
      }}
      infoTooltip={submitDisabled ? submitDisabledTooltip : undefined}
    />
  );
};

export default ReportsBulkActionToolbar;
