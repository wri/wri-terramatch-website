import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";

export type PolygonBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  isBulkEditDrawerOpen?: boolean;
  submitLabel?: string;
  onDelete: () => void;
  onEdit: () => void;
  onSubmit: () => void;
};

const PolygonBulkActionToolbar: FC<PolygonBulkActionToolbarProps> = ({
  visible,
  itemCount,
  isBulkEditDrawerOpen = false,
  submitLabel = "Submit",
  onDelete,
  onEdit,
  onSubmit
}) => {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();

  if (!visible || isPolygonEditDrawerOpen || isBulkEditDrawerOpen) {
    return null;
  }

  return (
    <Box position={"fixed"} zIndex={"100"} bottom={0} left={3} right={3}>
      <BulkActionToolbar
        ButtonCancel={{
          children: "Cancel"
        }}
        ButtonDelete={{
          children: "Delete",
          onClick: onDelete
        }}
        items={String(itemCount)}
        tertiaryButtonProps={{
          children: "Download"
        }}
        quaternaryButtonProps={{
          children: "Run Validation"
        }}
        secondaryButtonProps={{
          children: itemCount > 1 ? "Edit Details" : "Edit",
          onClick: onEdit
        }}
        primaryButtonProps={{
          children: submitLabel,
          onClick: onSubmit
        }}
      />
    </Box>
  );
};

export default PolygonBulkActionToolbar;
