import { Box } from "@chakra-ui/react";
import { showToast } from "@worldresources/wri-design-systems";
import { FC, useState } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";

import SystemValidationComplete from "./Modals/SystemValidationComplete";
import { PolygonTableRow } from "./PolygonTableRow";

export type PolygonBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  isBulkEditDrawerOpen?: boolean;
  submitLabel?: string;
  onDelete: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  polygons: PolygonTableRow[];
};

const PolygonBulkActionToolbar: FC<PolygonBulkActionToolbarProps> = ({
  visible,
  itemCount,
  isBulkEditDrawerOpen = false,
  submitLabel = "Submit",
  onDelete,
  onEdit,
  onSubmit,
  polygons
}) => {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const [isSystemValidationCompleteModalOpen, setIsSystemValidationCompleteModalOpen] = useState(false);
  if (!visible || isPolygonEditDrawerOpen || isBulkEditDrawerOpen) {
    return null;
  }

  return (
    <Box position={"fixed"} zIndex={"100"} bottom={0} left={3} right={3}>
      <SystemValidationComplete
        polygons={polygons}
        open={isSystemValidationCompleteModalOpen}
        onOpenChange={setIsSystemValidationCompleteModalOpen}
      />
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
          children: "Run Validation",
          onClick: () => {
            setTimeout(() => {
              setIsSystemValidationCompleteModalOpen(true);
            }, 5000);
            showToast({
              label: "Validating Polygons...",
              type: "info",
              placement: "bottom-end",
              closableLabel: "Close",
              icon: <LoadingIcon boxSize={7} color="primary.700" animation="spin 1s linear infinite" />
            });
          }
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
