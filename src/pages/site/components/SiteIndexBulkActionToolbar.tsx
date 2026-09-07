import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, useEffect, useMemo } from "react";

import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";

import type { SiteIndexSite } from "./siteIndex.types";
import { getSiteIndexSubmitTooltip, isSiteSubmittable } from "./siteIndexSubmit";

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
  const isAdmin = useIsAdmin();
  const { setSidebarCollapseDisabled } = useLayoutShell();
  const selectedCount = selectedSites.length;
  const visible = selectedCount > 0;
  const canSubmit = selectedCount > 0 && selectedSites.every(isSiteSubmittable);
  const submitTooltip = useMemo(() => getSiteIndexSubmitTooltip(selectedSites, t), [selectedSites, t]);

  useEffect(() => {
    setSidebarCollapseDisabled(visible);
    return () => setSidebarCollapseDisabled(false);
  }, [setSidebarCollapseDisabled, visible]);

  if (!visible) return null;

  return (
    <Box position="fixed" zIndex="100" bottom={3} left={isAdmin ? 14 : 3} right={3}>
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

export default SiteIndexBulkActionToolbar;
