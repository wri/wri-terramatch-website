import { Box } from "@chakra-ui/react";
import { showToast } from "@worldresources/wri-design-systems";
import { FC } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
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
        quaternaryButtonProps={{
          children: "Run Validation",
          onClick: () =>
            showToast({
              label: "Validating Polygons...",
              type: "info",
              placement: "bottom-end",
              closableLabel: "Close",
              icon: <LoadingIcon boxSize={7} color="primary.700" animation="spin 1s linear infinite" />
            })
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
