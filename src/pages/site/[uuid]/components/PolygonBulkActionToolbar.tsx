import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { memo, useEffect, useMemo } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";
import type { BulkToolbarAction } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarInfoTooltipContent from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";
import {
  getSitePolygonsApproveTooltipIfNoneEligible,
  isSitePolygonApprovable,
  toReviewAvailabilityPolygon
} from "@/utils/sitePolygonReview";
import { getSitePolygonsSubmitTooltipIfNoneEligible } from "@/utils/sitePolygonSubmit";

import { PolygonTableRow } from "./PolygonTableRow";

export type PolygonBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  isBulkEditDrawerOpen?: boolean;
  isAdminReview?: boolean;
  submitLabel: string;
  isDownloading?: boolean;
  isValidating?: boolean;
  onCancel: () => void;
  onClearSelection?: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onEdit: () => void;
  // Admin-review "Review" main action: open the review drawer for the selected polygon(s).
  onReview?: () => void;
  onSubmit: () => void;
  onOpenApproveModal: () => void;
  onOpenRequestInformationModal: () => void;
  onRunValidation: (geometryPolygonUuids: string[]) => Promise<void>;
  isOverlapFixAction?: boolean;
  canAutoFixOverlap?: boolean;
  isSubmitDisabled?: boolean;
  polygons: PolygonTableRow[];
  selectedGeometryPolygonUuids: string[];
  // Project-scope Phase 1 is view + validate + approve/request-information only: pass false to
  // disable bulk Delete and omit the Edit/Edit Details action. Both default to true (site behaviour
  // unchanged).
  enableDelete?: boolean;
  enableEditDetails?: boolean;
};

const PolygonBulkActionToolbar = memo(function PolygonBulkActionToolbar({
  visible,
  itemCount,
  isBulkEditDrawerOpen = false,
  isAdminReview = false,
  submitLabel,
  isDownloading = false,
  isValidating = false,
  onCancel,
  onClearSelection,
  onDelete,
  onDownload,
  onEdit,
  onReview,
  onSubmit,
  onOpenApproveModal,
  onOpenRequestInformationModal,
  polygons,
  onRunValidation,
  selectedGeometryPolygonUuids,
  isOverlapFixAction = false,
  canAutoFixOverlap = false,
  isSubmitDisabled = false,
  enableDelete = true,
  enableEditDetails = true
}: PolygonBulkActionToolbarProps) {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const { isBulkActionToolbarVisible, setBulkActionToolbarVisible, setSidebarCollapseDisabled } = useLayoutShell();
  const isAdmin = useIsAdmin();
  const t = useT();
  const isOverlapAutoFixUnavailable = isOverlapFixAction && !canAutoFixOverlap;

  const reviewPolygons = useMemo(() => polygons.map(toReviewAvailabilityPolygon), [polygons]);

  const submitDisabledTooltip = useMemo(
    () =>
      isAdminReview || isOverlapFixAction ? undefined : getSitePolygonsSubmitTooltipIfNoneEligible(reviewPolygons, t),
    [isAdminReview, isOverlapFixAction, reviewPolygons, t]
  );

  const isApproveDisabled = useMemo(
    () => isAdminReview && !reviewPolygons.some(isSitePolygonApprovable),
    [isAdminReview, reviewPolygons]
  );

  const approveDisabledTooltip = useMemo(
    () => (isAdminReview ? getSitePolygonsApproveTooltipIfNoneEligible(reviewPolygons, t) : undefined),
    [isAdminReview, reviewPolygons, t]
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
      ...(enableEditDetails
        ? [
            {
              id: "edit",
              children: itemCount > 1 ? t("Edit Details") : t("Edit"),
              onClick: onEdit
            }
          ]
        : [])
    ],
    [
      enableEditDetails,
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
      disabled: !enableDelete,
      onClick: onDelete
    }),
    [enableDelete, onDelete, t]
  );

  const primaryAction = useMemo(() => {
    // A fixable overlap selection takes over the primary action in BOTH admin-review and champion
    // modes — the clip mutation is polygon-uuid keyed (cross-site safe) and identical either way.
    // The caller swaps `submitLabel` to "Fix Overlap" for this case. Champion keeps its extra
    // submit-disable conditions; admin-review only gates on auto-fix availability.
    if (isOverlapFixAction) {
      return {
        children: submitLabel,
        disabled:
          isOverlapAutoFixUnavailable || (!isAdminReview && (isSubmitDisabled || submitDisabledTooltip != null)),
        onClick: onSubmit
      };
    }
    return isAdminReview
      ? {
          mainActionLabel: t("Review"),
          mainActionOnClick: onReview ?? (() => {}),
          otherActions: [
            {
              label: t("Approve"),
              value: "approve",
              disabled: isApproveDisabled,
              onClick: onOpenApproveModal
            },
            {
              label: t("Request information"),
              value: "request-information",
              onClick: onOpenRequestInformationModal
            }
          ]
        }
      : {
          children: submitLabel,
          disabled: isOverlapAutoFixUnavailable || isSubmitDisabled || submitDisabledTooltip != null,
          onClick: onSubmit
        };
  }, [
    isOverlapFixAction,
    isOverlapAutoFixUnavailable,
    isSubmitDisabled,
    isApproveDisabled,
    onSubmit,
    onOpenApproveModal,
    onOpenRequestInformationModal,
    onReview,
    submitDisabledTooltip,
    submitLabel,
    isAdminReview,
    t
  ]);

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
      isAdminReview && approveDisabledTooltip != null ? (
        <ToolbarInfoTooltipContent lines={[approveDisabledTooltip]} />
      ) : undefined,
    [isAdminReview, approveDisabledTooltip]
  );

  const shouldShowBulkActionToolbar = visible && !isPolygonEditDrawerOpen && !isBulkEditDrawerOpen;

  useEffect(() => {
    setBulkActionToolbarVisible(shouldShowBulkActionToolbar);
    setSidebarCollapseDisabled(shouldShowBulkActionToolbar);

    return () => {
      setBulkActionToolbarVisible(false);
      setSidebarCollapseDisabled(false);
    };
  }, [setBulkActionToolbarVisible, setSidebarCollapseDisabled, shouldShowBulkActionToolbar]);

  return (
    <>
      {isBulkActionToolbarVisible && (
        <Box position="fixed" zIndex="100" bottom={3} left={isAdmin ? 14 : 3} right={isAdmin ? 3 : 0}>
          <BulkActionToolbar
            selectedCount={itemCount}
            cancelAction={cancelAction}
            deleteAction={deleteAction}
            actions={toolbarActions}
            primaryAction={primaryAction}
            infoTooltip={overlapTooltip ?? adminApproveTooltip ?? (isAdminReview ? undefined : submitDisabledTooltip)}
          />
        </Box>
      )}
    </>
  );
});

export default PolygonBulkActionToolbar;
