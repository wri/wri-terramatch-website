import { Box, Text } from "@chakra-ui/react";
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
  submitLabel?: string;
  isDownloading?: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  onViewPolygonDetails?: (polygon: PolygonTableRow) => void;
  onRunValidation: (polygonUuids: string[]) => Promise<void>;
  isOverlapFixAction?: boolean;
  canAutoFixOverlap?: boolean;
  polygons: PolygonTableRow[];
  polygonValidations: Map<string, ValidationDto>;
  selectedPolygonUuids: string[];
};

const PolygonBulkActionToolbar: FC<PolygonBulkActionToolbarProps> = ({
  visible,
  itemCount,
  isBulkEditDrawerOpen = false,
  submitLabel = "Submit",
  isDownloading = false,
  onCancel,
  onDelete,
  onDownload,
  onEdit,
  onSubmit,
  onViewPolygonDetails,
  polygons,
  onRunValidation,
  polygonValidations,
  selectedPolygonUuids,
  isOverlapFixAction = false,
  canAutoFixOverlap = false
}) => {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const t = useT();
  const [isSystemValidationCompleteModalOpen, setIsSystemValidationCompleteModalOpen] = useState(false);
  const isOverlapAutoFixUnavailable = isOverlapFixAction && !canAutoFixOverlap;

  if (!visible || isPolygonEditDrawerOpen || isBulkEditDrawerOpen) {
    return null;
  }

  return (
    <Box position={"fixed"} zIndex={"100"} bottom={3} left={3} right={3}>
      <SystemValidationComplete
        polygons={polygons}
        polygonValidations={polygonValidations}
        open={isSystemValidationCompleteModalOpen}
        onOpenChange={setIsSystemValidationCompleteModalOpen}
        onViewDetails={polygon => {
          setIsSystemValidationCompleteModalOpen(false);
          onViewPolygonDetails?.(polygon);
        }}
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
        tertiaryButtonProps={{
          children: t("Download"),
          loading: isDownloading,
          disabled: isDownloading,
          onClick: onDownload
        }}
        secondaryButtonProps={{
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
        primaryButtonProps={{
          children: itemCount > 1 ? t("Edit Details") : t("Edit"),
          onClick: onEdit
        }}
        submitButtonProps={{
          children: t(submitLabel),
          disabled: isOverlapAutoFixUnavailable,
          onClick: onSubmit
        }}
        {...(isOverlapAutoFixUnavailable && {
          tooltipContent: (
            <Box>
              <Text color="neutral.200" textStyle={"300"} textAlign={"center"}>
                {t("Auto-fix isn’t available for this selection.")}
              </Text>
              <Text color="neutral.200" textStyle={"300"} textAlign={"center"}>
                {t("Fix the overlap manually.")}
              </Text>
            </Box>
          )
        })}
      />
    </Box>
  );
};

export default PolygonBulkActionToolbar;
