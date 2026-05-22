import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";

export type PolygonBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  isBulkEditDrawerOpen?: boolean;
  isDownloading?: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onSubmit: () => void;
};

const PolygonBulkActionToolbar: FC<PolygonBulkActionToolbarProps> = ({
  visible,
  itemCount,
  isBulkEditDrawerOpen = false,
  isDownloading = false,
  onCancel,
  onDelete,
  onDownload,
  onEdit,
  onSubmit
}) => {
  const t = useT();
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();

  if (!visible || isPolygonEditDrawerOpen || isBulkEditDrawerOpen) {
    return null;
  }

  return (
    <Box position={"fixed"} zIndex={"100"} bottom={0} left={3} right={3}>
      <BulkActionToolbar
        ButtonCancel={{
          children: t("Cancel"),
          onClick: onCancel
        }}
        ButtonDelete={{
          children: t("Delete"),
          onClick: onDelete
        }}
        items={String(itemCount)}
        primaryButtonProps={{
          children: t("Download"),
          loading: isDownloading,
          disabled: isDownloading,
          onClick: onDownload
        }}
        quaternaryButtonProps={{
          children: t("Run Validation")
        }}
        secondaryButtonProps={{
          children: itemCount > 1 ? t("Edit Details") : t("Edit"),
          onClick: onEdit
        }}
        tertiaryButtonProps={{
          children: t("Submit"),
          onClick: onSubmit
        }}
      />
    </Box>
  );
};

export default PolygonBulkActionToolbar;
