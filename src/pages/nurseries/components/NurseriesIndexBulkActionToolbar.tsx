import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, useEffect, useMemo } from "react";

import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";

import type { NurseryIndexRow } from "../nurseryIndex.types";
import { getSelectionApprovalLockReason } from "../nurseryIndex.utils";
import { isNurserySubmittable } from "../nurseryIndexSubmit";

interface NurseriesIndexBulkActionToolbarProps {
  selectedNurseries: NurseryIndexRow[];
  isDownloading?: boolean;
  isUpdating?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onSubmit: () => void;
}

const NurseriesIndexBulkActionToolbar: FC<NurseriesIndexBulkActionToolbarProps> = ({
  selectedNurseries,
  isDownloading = false,
  isUpdating = false,
  canEdit = false,
  canDelete = false,
  onCancel,
  onDelete,
  onDownload,
  onEdit,
  onSubmit
}) => {
  const t = useT();
  const { setBulkActionToolbarVisible } = useLayoutShell();
  const selectedCount = selectedNurseries.length;
  const visible = selectedCount > 0;
  const canSubmit = selectedCount > 0 && selectedNurseries.every(isNurserySubmittable);
  const isEditDisabled = selectedCount !== 1;
  const approvalLockReason = useMemo(() => getSelectionApprovalLockReason(selectedNurseries), [selectedNurseries]);

  useEffect(() => {
    setBulkActionToolbarVisible(visible);
    return () => setBulkActionToolbarVisible(false);
  }, [setBulkActionToolbarVisible, visible]);

  const infoTooltip = useMemo(() => {
    const statusLine =
      approvalLockReason === "pending-approval"
        ? selectedCount === 1
          ? t("This profile has already been submitted for review")
          : t("One or more selected profiles have already been submitted for review")
        : approvalLockReason === "approved"
        ? selectedCount === 1
          ? t("This profile has already been approved")
          : t("One or more selected profiles have already been approved")
        : approvalLockReason === "mixed"
        ? t("One or more selected profile can't be submitted because they are already approved or awaiting approval")
        : null;
    const lines = [statusLine, isEditDisabled ? t("Select one nursery to edit it.") : null].filter(
      (line): line is string => line != null
    );

    if (lines.length === 0) return undefined;
    return <ToolbarInfoTooltipContent lines={lines} />;
  }, [approvalLockReason, isEditDisabled, selectedCount, t]);

  if (!visible) return null;

  return (
    <Box position="fixed" zIndex="100" bottom={3} left={3} right={3}>
      <BulkActionToolbar
        selectedCount={selectedCount}
        cancelAction={{
          children: t("Cancel"),
          onClick: onCancel,
          disabled: isUpdating
        }}
        deleteAction={{
          id: "delete",
          tone: "danger",
          children: t("Delete"),
          onClick: onDelete,
          disabled: !canDelete || isUpdating
        }}
        actions={[
          {
            id: "download",
            children: t("Download"),
            onClick: onDownload,
            loading: isDownloading,
            disabled: isDownloading || isUpdating
          },
          {
            id: "edit",
            children: t("Edit"),
            onClick: onEdit,
            disabled: !canEdit || isUpdating
          }
        ]}
        primaryAction={{
          children: t("Submit"),
          disabled: !canSubmit || isUpdating,
          onClick: onSubmit
        }}
        infoTooltip={infoTooltip}
      />
    </Box>
  );
};

export default NurseriesIndexBulkActionToolbar;
