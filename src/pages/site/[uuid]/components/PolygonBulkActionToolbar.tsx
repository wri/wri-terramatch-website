import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";

export type PolygonBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  onDelete: () => void;
  onSubmit: () => void;
};

const PolygonBulkActionToolbar: FC<PolygonBulkActionToolbarProps> = ({ visible, itemCount, onDelete, onSubmit }) => {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();

  if (!visible || isPolygonEditDrawerOpen) {
    return null;
  }

  return (
    <Box position={"fixed"} zIndex={"999999"} bottom={0} left={3} right={3}>
      <BulkActionToolbar
        ButtonCancel={{
          children: "Cancel"
        }}
        ButtonDelete={{
          children: "Delete",
          onClick: onDelete
        }}
        items={String(itemCount)}
        primaryButtonProps={{
          children: "Download"
        }}
        quantityButtonProps={{
          children: "Run Validation"
        }}
        secondaryButtonProps={{
          children: "Edit Details"
        }}
        tertiaryButtonProps={{
          children: "Submit",
          onClick: onSubmit
        }}
      />
    </Box>
  );
};

export default PolygonBulkActionToolbar;
