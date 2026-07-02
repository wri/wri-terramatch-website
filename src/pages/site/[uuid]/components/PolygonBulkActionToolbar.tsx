import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { memo, useMemo } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";
import { getSitePolygonsApproveTooltipIfNoneEligible } from "@/utils/sitePolygonReview";
import { getSitePolygonsSubmitTooltipIfNoneEligible } from "@/utils/sitePolygonSubmit";

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
  onOpenApproveModal: () => void;
  onOpenRequestInformationModal: () => void;
  onRunValidation: (geometryPolygonUuids: string[]) => Promise<void>;
  isOverlapFixAction?: boolean;
  canAutoFixOverlap?: boolean;
  isSubmitDisabled?: boolean;
  polygons: PolygonTableRow[];
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
  onOpenApproveModal,
  onOpenRequestInformationModal,
  polygons,
  onRunValidation,
  selectedGeometryPolygonUuids,
  isOverlapFixAction = false,
  canAutoFixOverlap = false,
  isSubmitDisabled = false
}: PolygonBulkActionToolbarProps) {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const isAdmin = useIsAdmin();
  const t = useT();
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
          onClearSelection?.();
          void onRunValidation(selectedGeometryPolygonUuids);
        }
      },
      {
        id: "edit",
        children: itemCount > 1 ? t("Edit Details") : t("Edit"),
        onClick: onEdit
      }
    ],
    [
      isDownloading,
      isValidating,
      itemCount,
      onClearSelection,
      onDownload,
      onEdit,
      onRunValidation,
      selectedGeometryPolygonUuids,
      t
    ]
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
