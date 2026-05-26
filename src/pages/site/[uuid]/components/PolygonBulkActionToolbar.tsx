import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { FC, useState } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";

import SystemValidationComplete from "./Modals/SystemValidationComplete";
import { PolygonTableRow } from "./PolygonTableRow";

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
  onRunValidation: (polygonUuids: string[]) => Promise<void>;
  polygons: PolygonTableRow[];
  polygonValidations: Map<string, ValidationDto>;
  selectedPolygonUuids: string[];
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
  onSubmit,
  onRunValidation,
  polygons,
  polygonValidations,
  selectedPolygonUuids
}) => {
  const t = useT();
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const [isSystemValidationCompleteModalOpen, setIsSystemValidationCompleteModalOpen] = useState(false);
  if (!visible || isPolygonEditDrawerOpen || isBulkEditDrawerOpen) {
    return null;
  }

  return (
    <Box position={"fixed"} zIndex={"100"} bottom={0} left={3} right={3}>
      <SystemValidationComplete
        polygons={polygons}
        polygonValidations={polygonValidations}
        open={isSystemValidationCompleteModalOpen}
        onOpenChange={setIsSystemValidationCompleteModalOpen}
      />
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
          children: t("Run Validation"),
          onClick: async () => {
            if (selectedPolygonUuids.length === 0) {
              return;
            }
            showToast({
              label: t("Validating Polygons..."),
              type: "info",
              placement: "bottom-end",
              duration: 5000,
              closableLabel: t("Close"),
              icon: <LoadingIcon boxSize={7} color="primary.700" animation="spin 1s linear infinite" />
            });
            try {
              await onRunValidation(selectedPolygonUuids);
              setIsSystemValidationCompleteModalOpen(true);
            } catch (error) {
              showToast({
                label: t("Failed to validate polygons"),
                type: "error",
                placement: "bottom-end",
                duration: 5000,
                closableLabel: t("Close")
              });
            }
          }
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
