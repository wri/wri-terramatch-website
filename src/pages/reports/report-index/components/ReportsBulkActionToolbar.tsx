import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useEffect, useMemo } from "react";

import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";

type ReportsBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  editDisabled?: boolean;
  downloadDisabled?: boolean;
  isDownloading?: boolean;
  nothingToReportDisabled?: boolean;
  nothingToReportDisabledTooltip?: string;
  submitDisabled?: boolean;
  isUpdating?: boolean;
  submitDisabledTooltip?: string;
  onCancel: () => void;
  onDownload: () => void;
  onNothingToReport: () => void;
  onEdit: () => void;
  onSubmit: () => void;
};

const BORDERLESS_DISABLED_CLASS = "!cursor-not-allowed !text-theme-neutral-400 !opacity-60";

const ReportsBulkActionToolbar = ({
  visible,
  itemCount,
  editDisabled = false,
  downloadDisabled = false,
  isDownloading = false,
  nothingToReportDisabled = false,
  nothingToReportDisabledTooltip,
  submitDisabled = false,
  isUpdating = false,
  submitDisabledTooltip,
  onCancel,
  onDownload,
  onNothingToReport,
  onEdit,
  onSubmit
}: ReportsBulkActionToolbarProps) => {
  const t = useT();
  const isAdmin = useIsAdmin();
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
        infoTooltip: nothingToReportDisabled ? nothingToReportDisabledTooltip : undefined,
        className: nothingToReportDisabled ? BORDERLESS_DISABLED_CLASS : undefined,
        onClick: onNothingToReport
      }
    ];

    if (!editDisabled) {
      nextActions.push({
        id: "edit",
        children: t("Edit"),
        disabled: isUpdating,
        onClick: onEdit
      });
    }

    return nextActions;
  }, [editDisabled, isUpdating, nothingToReportDisabled, nothingToReportDisabledTooltip, onEdit, onNothingToReport, t]);

  useEffect(() => {
    setSidebarCollapseDisabled(visible);
    return () => setSidebarCollapseDisabled(false);
  }, [setSidebarCollapseDisabled, visible]);

  if (!visible) return null;

  return (
    <Box position="fixed" zIndex="100" bottom={3} left={isAdmin ? 14 : 3} right={3}>
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
    </Box>
  );
};

export default ReportsBulkActionToolbar;
