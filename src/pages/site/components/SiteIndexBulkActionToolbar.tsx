import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, useMemo } from "react";

import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";

import type { SiteIndexSite } from "./siteIndexMockData";
import { getSiteIndexSubmitTooltip, isSiteSubmittable } from "./siteIndexSubmit";

interface SiteIndexBulkActionToolbarProps {
  selectedSites: SiteIndexSite[];
  onCancel: () => void;
  onDelete: () => void;
  onSubmit: () => void;
}

const SiteIndexBulkActionToolbar: FC<SiteIndexBulkActionToolbarProps> = ({
  selectedSites,
  onCancel,
  onDelete,
  onSubmit
}) => {
  const t = useT();
  const selectedCount = selectedSites.length;
  const canSubmit = selectedCount > 0 && selectedSites.every(isSiteSubmittable);
  const submitTooltip = useMemo(() => getSiteIndexSubmitTooltip(selectedSites, t), [selectedSites, t]);

  if (selectedCount === 0) return null;

  return (
    <Box position="fixed" zIndex="100" bottom={3} left={3} right={3}>
      <BulkActionToolbar
        selectedCount={selectedCount}
        cancelAction={{
          children: t("Cancel"),
          onClick: onCancel
        }}
        deleteAction={{
          id: "delete",
          variant: "negative",
          tone: "danger",
          children: t("Delete"),
          onClick: onDelete
        }}
        actions={[
          {
            id: "download",
            children: t("Download"),
            onClick: () => {}
          },
          {
            id: "edit",
            children: t("Edit"),
            onClick: () => {}
          }
        ]}
        primaryAction={{
          children: t("Submit"),
          disabled: !canSubmit,
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
