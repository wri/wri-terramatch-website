import { useT } from "@transifex/react";
import { type FC, useEffect, useMemo } from "react";

import { useLayoutShell } from "@/redesignComponents/Layout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import { getProfileDeleteDisabledTooltip, getProfileSubmitDisabledTooltip } from "@/utils/profileActionTooltips";

import type { SiteIndexSite } from "./siteIndex.types";
import { isSiteSubmittable } from "./siteIndexSubmit";

interface SiteIndexBulkActionToolbarProps {
  selectedSites: SiteIndexSite[];
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

const SiteIndexBulkActionToolbar: FC<SiteIndexBulkActionToolbarProps> = ({
  selectedSites,
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
  const selectedCount = selectedSites.length;
  const visible = selectedCount > 0;
  const canSubmit = selectedCount > 0 && selectedSites.every(isSiteSubmittable);
  const selectedStatuses = useMemo(() => selectedSites.map(site => site.status), [selectedSites]);
  const submitTooltip = useMemo(
    () => (canSubmit ? undefined : getProfileSubmitDisabledTooltip(selectedStatuses, t)),
    [canSubmit, selectedStatuses, t]
  );
  const deleteTooltip = useMemo(
    () => (canDelete ? undefined : getProfileDeleteDisabledTooltip(selectedStatuses, t)),
    [canDelete, selectedStatuses, t]
  );

  useEffect(() => {
    setSidebarCollapseDisabled(visible);
    return () => setSidebarCollapseDisabled(false);
  }, [setSidebarCollapseDisabled, visible]);

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
        variant: "negative",
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
          disabled: isDownloading || isUpdating,
          onClick: onDownload
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
      infoTooltip={submitTooltip}
    />
  );
};

export default SiteIndexBulkActionToolbar;
