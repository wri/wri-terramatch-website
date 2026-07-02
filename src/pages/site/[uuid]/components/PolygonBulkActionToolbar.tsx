import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { memo, useCallback, useMemo, useState } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";
import { trackPolygonRunValidationClicked } from "@/utils/polygonAnalytics";
import { getSitePolygonsApproveTooltipIfNoneEligible } from "@/utils/sitePolygonReview";
import { getSitePolygonsSubmitTooltipIfNoneEligible } from "@/utils/sitePolygonSubmit";

import SystemValidationComplete from "./Modals/SystemValidationComplete";
import { PolygonTableRow } from "./PolygonTableRow";

export type PolygonBulkActionToolbarProps = {
  siteUuid: string;
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
  onOpenApproveModal: () => void;
  onOpenRequestInformationModal: () => void;
  onViewPolygonDetails?: (polygon: PolygonTableRow) => void;
  onRunValidation: (geometryPolygonUuids: string[]) => Promise<void>;
  isOverlapFixAction?: boolean;
  canAutoFixOverlap?: boolean;
  isSubmitDisabled?: boolean;
  polygons: PolygonTableRow[];
  polygonValidations: Map<string, ValidationDto>;
  selectedGeometryPolygonUuids: string[];
  isAwaitingValidationResults?: boolean;
};

const PolygonBulkActionToolbar = memo(function PolygonBulkActionToolbar({
  siteUuid,
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
  onOpenApproveModal,
  onOpenRequestInformationModal,
  onViewPolygonDetails,
  polygons,
  onRunValidation,
  polygonValidations,
  selectedGeometryPolygonUuids,
  isAwaitingValidationResults = false,
  isOverlapFixAction = false,
  canAutoFixOverlap = false,
  isSubmitDisabled = false
}: PolygonBulkActionToolbarProps) {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const isAdmin = useIsAdmin();
  const t = useT();
  const [isSystemValidationCompleteModalOpen, setIsSystemValidationCompleteModalOpen] = useState(false);
  const [validatedPolygons, setValidatedPolygons] = useState<PolygonTableRow[]>([]);
  const [validatedGeometryPolygonUuids, setValidatedGeometryPolygonUuids] = useState<string[]>([]);
  const isOverlapAutoFixUnavailable = isOverlapFixAction && !canAutoFixOverlap;

  const submitDisabledTooltip = useMemo(
    () =>
      isOverlapFixAction
        ? undefined
        : getSitePolygonsSubmitTooltipIfNoneEligible(
            polygons.map(polygon => ({ status: polygon.submission, validationStatus: polygon.validation })),
            t
          ),
    [isOverlapFixAction, polygons, t]
  );

  const approveDisabledTooltip = useMemo(
    () =>
      isAdmin
        ? getSitePolygonsApproveTooltipIfNoneEligible(
            polygons.map(polygon => ({ status: polygon.submission, validationStatus: polygon.validation })),
            t
          )
        : undefined,
    [isAdmin, polygons, t]
  );

  const handleSystemValidationCompleteModalChange = useCallback((open: boolean) => {
    setIsSystemValidationCompleteModalOpen(open);
    if (!open) {
      setValidatedPolygons([]);
      setValidatedGeometryPolygonUuids([]);
    }
  }, []);

  const handleRunValidation = useCallback(async () => {
    if (selectedGeometryPolygonUuids.length === 0) {
      return;
    }

    const polygonUuids = selectedGeometryPolygonUuids;
    trackPolygonRunValidationClicked({
      siteUuid,
      polygonIds: polygonUuids
    });

    setValidatedPolygons(
      polygons.map((polygon, index) => ({
        ...polygon,
        id: polygonUuids[index] ?? polygon.id
      }))
    );
    setValidatedGeometryPolygonUuids(polygonUuids);
    onClearSelection?.();

    try {
      await onRunValidation(polygonUuids);
      setIsSystemValidationCompleteModalOpen(true);
    } catch {
      // Error feedback is handled in the parent.
    }
  }, [onClearSelection, onRunValidation, polygons, selectedGeometryPolygonUuids, siteUuid]);

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
      children: isAdmin ? t("Review") : submitLabel,
      disabled: isAdmin ? false : isOverlapAutoFixUnavailable || isSubmitDisabled || submitDisabledTooltip != null,
      onClick: isAdmin ? () => {} : onSubmit,
      ...(isAdmin && {
        otherActions: [
          {
            label: t("Approve"),
            value: "approve",
            onClick: onOpenApproveModal
          },
          {
            label: t("Request information"),
            value: "request-information",
            onClick: onOpenRequestInformationModal
          }
        ]
      })
    }),
    [
      isOverlapAutoFixUnavailable,
      isSubmitDisabled,
      onSubmit,
      onOpenApproveModal,
      onOpenRequestInformationModal,
      submitDisabledTooltip,
      submitLabel,
      isAdmin,
      t
    ]
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

  const adminApproveTooltip = useMemo(
    () =>
      isAdmin && approveDisabledTooltip != null ? (
        <ToolbarInfoTooltipContent lines={[approveDisabledTooltip]} />
      ) : undefined,
    [isAdmin, approveDisabledTooltip]
  );

  const isToolbarVisible = visible && !isPolygonEditDrawerOpen && !isBulkEditDrawerOpen;

  return (
    <>
      <SystemValidationComplete
        polygons={validatedPolygons}
        geometryPolygonUuids={validatedGeometryPolygonUuids}
        polygonValidations={polygonValidations}
        open={isSystemValidationCompleteModalOpen}
        onOpenChange={handleSystemValidationCompleteModalChange}
        onViewDetails={handleViewValidationDetails}
        isLoadingResults={isAwaitingValidationResults}
      />
      {isToolbarVisible && (
        <Box position="fixed" zIndex="100" bottom={3} left={isAdmin ? 14 : 3} right={isAdmin ? 3 : 0}>
          <BulkActionToolbar
            selectedCount={itemCount}
            cancelAction={cancelAction}
            deleteAction={deleteAction}
            actions={toolbarActions}
            primaryAction={primaryAction}
            infoTooltip={overlapTooltip ?? adminApproveTooltip ?? submitDisabledTooltip}
          />
        </Box>
      )}
    </>
  );
});

export default PolygonBulkActionToolbar;
