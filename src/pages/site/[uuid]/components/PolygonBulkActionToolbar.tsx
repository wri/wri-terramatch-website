import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { memo, useCallback, useMemo, useState } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";
import { getSitePolygonsSubmitTooltip } from "@/utils/sitePolygonSubmit";

import SystemValidationComplete from "./Modals/SystemValidationComplete";
import { PolygonTableRow } from "./PolygonTableRow";

export type PolygonBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  isBulkEditDrawerOpen?: boolean;
  submitLabel: string;
  isDownloading?: boolean;
  isValidating?: boolean;
  onCancel: () => void;
  onClearSelection?: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  onViewPolygonDetails?: (polygon: PolygonTableRow) => void;
  onRunValidation: (geometryPolygonUuids: string[]) => Promise<void>;
  isOverlapFixAction?: boolean;
  canAutoFixOverlap?: boolean;
  isSubmitDisabled?: boolean;
  polygons: PolygonTableRow[];
  polygonValidations: Map<string, ValidationDto>;
  selectedGeometryPolygonUuids: string[];
};

const PolygonBulkActionToolbar = memo(function PolygonBulkActionToolbar({
  visible,
  itemCount,
  isBulkEditDrawerOpen = false,
  submitLabel,
  isDownloading = false,
  isValidating = false,
  onCancel,
  onClearSelection,
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
  canAutoFixOverlap = false,
  isSubmitDisabled = false
}: PolygonBulkActionToolbarProps) {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const t = useT();
  const [isSystemValidationCompleteModalOpen, setIsSystemValidationCompleteModalOpen] = useState(false);
  const [validatedPolygons, setValidatedPolygons] = useState<PolygonTableRow[]>([]);
  const isOverlapAutoFixUnavailable = isOverlapFixAction && !canAutoFixOverlap;
  const submitDisabledTooltip = useMemo(
    () =>
      isOverlapFixAction
        ? undefined
        : getSitePolygonsSubmitTooltip(
            polygons.map(polygon => ({ status: polygon.submission, validationStatus: polygon.validation })),
            t
          ),
    [isOverlapFixAction, polygons, t]
  );

  const handleSystemValidationCompleteModalChange = useCallback((open: boolean) => {
    setIsSystemValidationCompleteModalOpen(open);
    if (!open) {
      setValidatedPolygons([]);
    }
  }, []);

  const handleRunValidation = useCallback(async () => {
    if (selectedGeometryPolygonUuids.length === 0) {
      return;
    }

    const polygonUuids = selectedGeometryPolygonUuids;
    setValidatedPolygons(polygons);
    onClearSelection?.();

    try {
      await onRunValidation(polygonUuids);
      setIsSystemValidationCompleteModalOpen(true);
    } catch {
      // Error feedback is handled in the parent.
    }
  }, [onClearSelection, onRunValidation, polygons, selectedGeometryPolygonUuids]);

  const handleViewValidationDetails = useCallback(
    (polygon: PolygonTableRow) => {
      handleSystemValidationCompleteModalChange(false);
      onViewPolygonDetails?.(polygon);
    },
    [handleSystemValidationCompleteModalChange, onViewPolygonDetails]
  );

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
        loading: isValidating,
        disabled: isValidating,
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
    [handleRunValidation, isDownloading, isValidating, itemCount, onDownload, onEdit, t]
  );

  const cancelAction = useMemo(
    () => ({
      children: t("Cancel"),
      onClick: onCancel
    }),
    [onCancel, t]
  );

  const deleteAction = useMemo<BulkToolbarAction>(
    () => ({
      id: "delete",
      tone: "danger",
      children: t("Delete"),
      onClick: onDelete
    }),
    [onDelete, t]
  );

  const primaryAction = useMemo(
    () => ({
      children: submitLabel,
      disabled: isOverlapAutoFixUnavailable || isSubmitDisabled || submitDisabledTooltip != null,
      onClick: onSubmit
    }),
    [isOverlapAutoFixUnavailable, isSubmitDisabled, onSubmit, submitDisabledTooltip, submitLabel]
  );

  const overlapTooltip = useMemo(
    () =>
      isOverlapAutoFixUnavailable ? (
        <ToolbarInfoTooltipContent
          lines={[t("Auto-fix isn’t available for this selection."), t("Fix the overlap manually.")]}
        />
      ) : undefined,
    [isOverlapAutoFixUnavailable, t]
  );

  const isToolbarVisible = visible && !isPolygonEditDrawerOpen && !isBulkEditDrawerOpen;

  return (
    <>
      <SystemValidationComplete
        polygons={validatedPolygons}
        polygonValidations={polygonValidations}
        open={isSystemValidationCompleteModalOpen}
        onOpenChange={handleSystemValidationCompleteModalChange}
        onViewDetails={handleViewValidationDetails}
      />
      {isToolbarVisible && (
        <Box position="fixed" zIndex="100" bottom={3} left={3} right={3}>
          <BulkActionToolbar
            selectedCount={itemCount}
            cancelAction={cancelAction}
            deleteAction={deleteAction}
            actions={toolbarActions}
            primaryAction={primaryAction}
            infoTooltip={overlapTooltip ?? submitDisabledTooltip}
          />
        </Box>
      )}
    </>
  );
});

export default PolygonBulkActionToolbar;
