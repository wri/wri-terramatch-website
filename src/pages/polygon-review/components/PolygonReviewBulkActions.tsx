import { useT } from "@transifex/react";
import { noop } from "lodash";
import { FC, useCallback, useMemo } from "react";

import { PolygonEditDrawerDataSync } from "@/context/polygonEditDrawer.provider";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { InfoIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import { trackPolygonsIndexBulkActionSubmitted } from "@/utils/analytics/polygonsIndexAnalytics";
import type { BulkActionType } from "@/utils/polygonAnalytics";
import { isSitePolygonApprovable, toReviewAvailabilityPolygon } from "@/utils/sitePolygonReview";

import ApprovePolygonConfirmation from "../../site/[uuid]/components/Modals/ApprovePolygon/ApprovePolygonConfirmation";
import PolygonApproved from "../../site/[uuid]/components/Modals/ApprovePolygon/PolygonApproved";
import DeletePolygon from "../../site/[uuid]/components/Modals/DeletePolygon";
import InformationRequested from "../../site/[uuid]/components/Modals/RequestInformation/InformationRequested";
import RequestInformationConfirmation from "../../site/[uuid]/components/Modals/RequestInformation/RequestInformationConfirmation";
import SystemValidationComplete from "../../site/[uuid]/components/Modals/SystemValidationComplete";
import PolygonBulkActionToolbar from "../../site/[uuid]/components/PolygonBulkActionToolbar";
import PolygonBulkEditDrawer from "../../site/[uuid]/components/PolygonBulkEditDrawer";
import type { PolygonTableRow } from "../../site/[uuid]/components/PolygonTableRow";
import { isPolygonBackgroundJob } from "../../site/[uuid]/hooks/usePolygonBackgroundJob";
import type { ProjectPolygonBulkActions } from "../hooks/useProjectPolygonBulkActions";

type PolygonReviewBulkActionsProps = {
  actions: ProjectPolygonBulkActions;
  projectUuid: string | null;
  polygons: SitePolygonLightDto[];
  selectedRows: PolygonTableRow[];
  visible: boolean;
};

const PolygonReviewBulkActions: FC<PolygonReviewBulkActionsProps> = ({
  actions,
  projectUuid,
  polygons,
  selectedRows,
  visible
}) => {
  const t = useT();
  const { bulkActions, reviewActions } = actions;
  const { handleSystemValidationCompleteModalChange } = bulkActions;
  const { openPolygonEditDrawerByPolygonId } = actions;

  const selectedCount = selectedRows.length;
  const approvableCount = useMemo(
    () => selectedRows.filter(row => isSitePolygonApprovable(toReviewAvailabilityPolygon(row))).length,
    [selectedRows]
  );
  const trackSubmitted = useCallback(
    (actionType: BulkActionType, eligibleCount: number) =>
      trackPolygonsIndexBulkActionSubmitted({ actionType, selectedCount, eligibleCount }),
    [selectedCount]
  );
  const handleDownload = useCallback(() => {
    trackSubmitted("download", selectedCount);
    bulkActions.handleBulkDownloadClick();
  }, [bulkActions, selectedCount, trackSubmitted]);
  const handleRunValidation = useCallback(() => {
    trackSubmitted("run_validation", selectedCount);
    bulkActions.handleBulkRunValidation();
  }, [bulkActions, selectedCount, trackSubmitted]);
  const handleOpenDelete = useCallback(() => {
    trackSubmitted("delete", selectedCount);
    bulkActions.handleOpenDeletePolygonModal();
  }, [bulkActions, selectedCount, trackSubmitted]);
  const handleOpenApprove = useCallback(() => {
    trackSubmitted("approve", approvableCount);
    reviewActions.handleOpenApprovePolygonModal();
  }, [approvableCount, reviewActions, trackSubmitted]);
  const handleOpenRequestInformation = useCallback(() => {
    trackSubmitted("request_information", selectedCount);
    reviewActions.handleOpenRequestInformationModal();
  }, [reviewActions, selectedCount, trackSubmitted]);

  const handleViewValidationDetails = useCallback(
    (row: PolygonTableRow) => {
      handleSystemValidationCompleteModalChange(false);
      openPolygonEditDrawerByPolygonId(row.id);
    },
    [handleSystemValidationCompleteModalChange, openPolygonEditDrawerByPolygonId]
  );

  return (
    <>
      <PolygonEditDrawerDataSync
        polygons={polygons}
        onRefetchPolygons={actions.refetchPolygons}
        onOverlapFixed={bulkActions.handleDrawerOverlapFixed}
        onRunValidation={bulkActions.runPolygonValidation}
        onRunValidationWithResultsModal={bulkActions.runValidationWithResultsModal}
        onValidationCleared={bulkActions.clearValidationUi}
        onPolygonDeletingChange={bulkActions.handlePolygonDeletingChange}
        onRequestApproveModal={reviewActions.handleDrawerRequestApproveModal}
        onRequestInformationModal={reviewActions.handleDrawerRequestInformationModal}
      />
      <PolygonBulkActionToolbar
        visible={visible}
        itemCount={selectedRows.length}
        isBulkEditDrawerOpen={bulkActions.showBulkEditDrawer}
        isAdminReview
        submitLabel={t("Approve")}
        polygons={selectedRows}
        isDownloading={bulkActions.isDownloadingSelectedPolygons}
        isValidating={bulkActions.isValidatingPolygons}
        onCancel={actions.clearBulkTableSelection}
        onClearSelection={actions.clearBulkTableSelection}
        onDelete={handleOpenDelete}
        onDownload={handleDownload}
        onEdit={bulkActions.handleBulkEditDetails}
        onRunValidation={handleRunValidation}
        onSubmit={noop}
        onOpenApproveModal={handleOpenApprove}
        onOpenRequestInformationModal={handleOpenRequestInformation}
      />
      <DeletePolygon
        open={bulkActions.showDeletePolygonModal}
        onOpenChange={bulkActions.handleDeletePolygonModalChange}
        polygons={bulkActions.deletePayload?.polygons ?? []}
        onDelete={bulkActions.handleBulkDelete}
        view="table"
        width="35rem"
        footnote={
          isPolygonBackgroundJob(bulkActions.deletePayload?.sitePolygonUuids.length ?? 0) ? (
            <InlineMessage
              label={t("This runs in the background, you can leave this page.")}
              variant="info-grey"
              size="full-width"
              icon={<InfoIcon />}
            />
          ) : undefined
        }
      />
      <PolygonBulkEditDrawer
        selectedPolygons={bulkActions.bulkEditPayload?.polygons ?? []}
        open={bulkActions.showBulkEditDrawer}
        onOpenChange={bulkActions.handleBulkEditDrawerOpenChange}
        isSaving={bulkActions.isBulkUpdatingPolygons}
        onSave={bulkActions.handleBulkEditSave}
      />
      <ApprovePolygonConfirmation
        open={reviewActions.showApprovePolygonConfirmationModal}
        onOpenChange={reviewActions.handleApprovePolygonConfirmationModalChange}
        polygons={reviewActions.approvePayload?.polygons ?? []}
        projectUuid={projectUuid}
        onApprove={reviewActions.handleApprovePolygons}
      />
      <RequestInformationConfirmation
        open={reviewActions.showRequestInformationModal}
        onOpenChange={reviewActions.handleRequestInformationModalChange}
        polygons={reviewActions.requestInformationPayload?.polygons ?? []}
        onRequestInformation={reviewActions.handleConfirmRequestInformation}
      />
      <PolygonApproved
        open={bulkActions.showPolygonApprovedModal && bulkActions.approvedPolygonNames.length > 0}
        onOpenChange={bulkActions.handlePolygonApprovedModalChange}
        polygons={bulkActions.approvedPolygonNames}
        comment={bulkActions.approvedPolygonComment}
      />
      <InformationRequested
        open={bulkActions.showInformationRequestedModal && bulkActions.requestedInformationPolygonNames.length > 0}
        onOpenChange={bulkActions.handleInformationRequestedModalChange}
        polygons={bulkActions.requestedInformationPolygonNames}
        comment={bulkActions.requestedInformationComment}
      />
      <SystemValidationComplete
        open={bulkActions.isSystemValidationCompleteModalOpen}
        onOpenChange={bulkActions.handleSystemValidationCompleteModalChange}
        polygons={bulkActions.validatedPolygons}
        polygonValidations={actions.polygonValidations}
        pendingValidationPolygonIds={actions.pendingValidationPolygonUuids}
        isLoadingResults={actions.pendingValidationPolygonUuids.length > 0}
        onViewDetails={handleViewValidationDetails}
      />
    </>
  );
};

export default PolygonReviewBulkActions;
