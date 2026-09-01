import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";

import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";

interface SiteIndexBulkActionToolbarProps {
  selectedCount: number;
  onCancel: () => void;
}

const SiteIndexBulkActionToolbar: FC<SiteIndexBulkActionToolbarProps> = ({ selectedCount, onCancel }) => {
  const t = useT();

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
          children: t("Delete"),
          disabled: true,
          onClick: () => {}
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
          disabled: true,
          onClick: () => {}
        }}
        infoTooltip={t("Only eligible sites can be submitted.")}
      />
    </Box>
  );
};

export default SiteIndexBulkActionToolbar;
