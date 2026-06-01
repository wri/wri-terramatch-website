import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { FC, useCallback, useMemo, useState } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";

import SystemValidationComplete from "./Modals/SystemValidationComplete";
import { PolygonTableRow } from "./PolygonTableRow";

export type PolygonBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  isBulkEditDrawerOpen?: boolean;
  submitLabel: string;
  isDownloading?: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  onViewPolygonDetails?: (polygon: PolygonTableRow) => void;
  onRunValidation: (geometryPolygonUuids: string[]) => Promise<void>;
  isOverlapFixAction?: boolean;
  canAutoFixOverlap?: boolean;
  polygons: PolygonTableRow[];
  polygonValidations: Map<string, ValidationDto>;
  /** Geometry polygon UUIDs (`polygonUuid`), used for validation and GeoJSON download. */
  selectedGeometryPolygonUuids: string[];
};

const PolygonBulkActionToolbar: FC<PolygonBulkActionToolbarProps> = ({
  visible,
  itemCount,
  isBulkEditDrawerOpen = false,
  submitLabel,
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
  selectedGeometryPolygonUuids,
  isOverlapFixAction = false,
  canAutoFixOverlap = false
}) => {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const t = useT();
  const [isSystemValidationCompleteModalOpen, setIsSystemValidationCompleteModalOpen] = useState(false);
  const isOverlapAutoFixUnavailable = isOverlapFixAction && !canAutoFixOverlap;

  const handleRunValidation = useCallback(async () => {
    if (selectedGeometryPolygonUuids.length === 0) {
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
      await onRunValidation(selectedGeometryPolygonUuids);
      setIsSystemValidationCompleteModalOpen(true);
    } catch {
      showToast({
        label: t("Failed to validate polygons"),
        type: "error",
        placement: "bottom-end",
        duration: 5000,
        closableLabel: t("Close")
      });
    }
  }, [onRunValidation, selectedGeometryPolygonUuids, t]);

  const toolbarActions = useMemo<BulkToolbarAction[]>(
    () => [
      {
        id: "download",
        children: t("Download"),
        loading: isDownloading,
        disabled: isDownloading,
        onClick: onDownload
      },
      {
        id: "validate",
        children: t("Run Validation"),
        onClick: () => {
          void handleRunValidation();
        }
      },
      {
        id: "edit",
        children: itemCount > 1 ? t("Edit Details") : t("Edit"),
        onClick: onEdit
      }
    ],
    [handleRunValidation, isDownloading, itemCount, onDownload, onEdit, t]
  );

  const overlapTooltip = useMemo(
    () =>
      isOverlapAutoFixUnavailable ? (
        <Box>
          <Text color="neutral.200" textStyle="300" textAlign="center">
            {t("Auto-fix isn’t available for this selection.")}
          </Text>
          <Text color="neutral.200" textStyle="300" textAlign="center">
            {t("Fix the overlap manually.")}
          </Text>
        </Box>
      ) : undefined,
    [isOverlapAutoFixUnavailable, t]
  );

  if (!visible || isPolygonEditDrawerOpen || isBulkEditDrawerOpen) {
    return null;
  }

  return (
    <Box position="fixed" zIndex="100" bottom={3} left={3} right={3}>
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
        selectedCount={itemCount}
        cancelAction={{
          children: t("Cancel"),
          onClick: onCancel
        }}
        deleteAction={{
          id: "delete",
          tone: "danger",
          children: t("Delete"),
          onClick: onDelete
        }}
        actions={toolbarActions}
        primaryAction={{
          children: submitLabel,
          disabled: isOverlapAutoFixUnavailable,
          onClick: onSubmit
        }}
        infoTooltip={overlapTooltip}
      />
    </Box>
  );
};

export default PolygonBulkActionToolbar;
