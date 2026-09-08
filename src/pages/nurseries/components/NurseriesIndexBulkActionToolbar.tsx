import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, useEffect, useMemo } from "react";

import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";

import type { NurseryIndexRow } from "../nurseryIndex.types";
import { getNurseryIndexSubmitTooltip, isNurserySubmittable } from "../nurseryIndexSubmit";

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
  const submitTooltip = useMemo(() => getNurseryIndexSubmitTooltip(selectedNurseries, t), [selectedNurseries, t]);

  useEffect(() => {
    setBulkActionToolbarVisible(visible);
    return () => setBulkActionToolbarVisible(false);
  }, [setBulkActionToolbarVisible, visible]);

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
        infoTooltip={
          submitTooltip == null ? undefined : Array.isArray(submitTooltip) ? (
            <ToolbarInfoTooltipContent lines={submitTooltip} />
          ) : (
            submitTooltip
          )
        }
      />
    </Box>
  );
};

export default NurseriesIndexBulkActionToolbar;
