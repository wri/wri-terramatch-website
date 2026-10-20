import { useT } from "@transifex/react";
import { type FC, useEffect, useMemo } from "react";

import { useLayoutShell } from "@/redesignComponents/Layout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";
import { getProfileDeleteDisabledTooltip, getProfileSubmitDisabledTooltip } from "@/utils/profileActionTooltips";

import type { NurseryIndexRow } from "../nurseryIndex.types";
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
  const { setSidebarCollapseDisabled } = useLayoutShell();
  const selectedCount = selectedNurseries.length;
  const visible = selectedCount > 0;
  const canSubmit = selectedCount > 0 && selectedNurseries.every(isNurserySubmittable);
  const selectedStatuses = useMemo(() => selectedNurseries.map(nursery => nursery.status), [selectedNurseries]);

  useEffect(() => {
    setSidebarCollapseDisabled(visible);
    return () => setSidebarCollapseDisabled(false);
  }, [setSidebarCollapseDisabled, visible]);

  const infoTooltip = useMemo(() => {
    const submitTooltip = canSubmit ? undefined : getProfileSubmitDisabledTooltip(selectedStatuses, t);
    return submitTooltip == null ? undefined : <ToolbarInfoTooltipContent lines={[submitTooltip]} />;
  }, [canSubmit, selectedStatuses, t]);

  const deleteTooltip = useMemo(
    () => (canDelete ? undefined : getProfileDeleteDisabledTooltip(selectedStatuses, t)),
    [canDelete, selectedStatuses, t]
  );

  if (!visible) return null;

  return (
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
        disabled: !canDelete || isUpdating,
        tooltip: deleteTooltip
      }}
      actions={[
        {
          id: "download",
          children: t("Download"),
          onClick: onDownload,
          loading: isDownloading,
          disabled: isDownloading || isUpdating
        },
        ...(selectedCount === 1
          ? [
              {
                id: "edit",
                children: t("Edit"),
                onClick: onEdit,
                disabled: !canEdit || isUpdating,
                tooltip: canEdit ? undefined : t("This profile has already been submitted for review.")
              }
            ]
          : [])
      ]}
      primaryAction={{
        children: t("Submit"),
        disabled: !canSubmit || isUpdating,
        onClick: onSubmit
      }}
      infoTooltip={infoTooltip}
    />
  );
};

export default NurseriesIndexBulkActionToolbar;
