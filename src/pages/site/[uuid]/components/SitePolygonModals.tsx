import type { FC } from "react";

import type { BulkSitePolygonAttributeChanges } from "@/connections/SitePolygons";
import type { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";

import type { SubmittedPolygonComment } from "../hooks/useSitePolygonBulkActions";
import type { PolygonStatusChangeComment } from "../utils/polygonStatusChangeComment";
import ApprovePolygonConfirmation from "./Modals/ApprovePolygon/ApprovePolygonConfirmation";
import PolygonApproved from "./Modals/ApprovePolygon/PolygonApproved";
import DeletePolygon from "./Modals/DeletePolygon";
import EditPhotoDetails from "./Modals/GeotaggedPhotos/EditPhotoDetails";
import OverlapFix, { type OverlapFixPolygon } from "./Modals/OverlapFix";
import PolygonSubmitted from "./Modals/PolygonSubmitted";
import InformationRequested from "./Modals/RequestInformation/InformationRequested";
import RequestInformationConfirmation from "./Modals/RequestInformation/RequestInformationConfirmation";
import SubmitPolygonConfirmation from "./Modals/SubmitPolygonConfirmation";
import SubmitPolygons from "./Modals/SubmitPolygons";
import SystemValidationComplete from "./Modals/SystemValidationComplete";
import UploadError from "./Modals/UploadError";
import UploadPolygons from "./Modals/UploadPolygons";
import PolygonBulkEditDrawer from "./PolygonBulkEditDrawer";
import type { PolygonTableRow } from "./PolygonTableRow";

type SitePolygonModalsProps = {
  siteUuid: string;
  isAdminReview?: boolean;
  siteHasExistingPolygons?: boolean;
  bulkEditPayload: { polygons: PolygonTableRow[] } | null;
  deletePayload: { polygons: PolygonTableRow[] } | null;
  submitPayload: { eligibleCount: number; totalCount: number; polygons: PolygonTableRow[] } | null;
  overlapFixResults: {
    polygonsFixed: OverlapFixPolygon[];
    polygonsNotFixed: OverlapFixPolygon[];
  };
  editPhotoDetailsMedia: MediaDto | null;
  openBulkEditDrawer: boolean;
  openDeletePolygonModal: boolean;
  openOverlapFixModal: boolean;
  openPolygonSubmittedModal: boolean;
  openSubmitPolygonsModal: boolean;
  openSubmitPolygonConfirmationModal: boolean;
  openMapPopupSubmitConfirmationModal: boolean;
  mapPopupSubmitPolygons: PolygonTableRow[];
  submittedPolygonNames: string[];
  submittedPolygonComment: SubmittedPolygonComment | null;
  isBulkUpdatingPolygons: boolean;
  onBulkEditDrawerOpenChange: (open: boolean) => void;
  onBulkEditSave: (attributeChanges: BulkSitePolygonAttributeChanges) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  onDeletePolygonModalOpenChange: (open: boolean) => void;
  onEditPhotoDetailsClose: () => void;
  onMapPopupSubmitConfirmationModalOpenChange: (open: boolean) => void;
  onMapPopupSubmit: (comment: string) => void | Promise<void>;
  onProceedToBulkSubmitConfirmation: () => void | Promise<void>;
  onOverlapFixClose: () => void;
  onPolygonSubmittedModalOpenChange: (open: boolean) => void;
  onSubmitPolygonConfirmationModalOpenChange: (open: boolean) => void;
  onSubmitPolygonsModalOpenChange: (open: boolean) => void;
  onSubmitPolygons: (comment: string) => void | Promise<void>;
  onUploadError: (message: string) => void;
  openUploadErrorModal: boolean;
  uploadErrorMessage: string | null;
  openUploadModal: boolean;
  onUploadErrorModalOpenChange: (open: boolean) => void;
  onUploadModalOpenChange: (open: boolean) => void;
  onUploadSuccess: (result: { createdSitePolygonUuid?: string | null; uploadedFileCount: number }) => void;
  onViewOverlapPolygon: (polygonUuid: string) => void;
  openApprovePolygonConfirmationModal: boolean;
  onApprovePolygonConfirmationModalOpenChange: (open: boolean) => void;
  approvePayload: { polygons: PolygonTableRow[] } | null;
  projectUuid?: string | null;
  onApprove: (comment: string, selectedPolygons: PolygonTableRow[]) => void | Promise<void>;
  openRequestInformationModal: boolean;
  onRequestInformationModalOpenChange: (open: boolean) => void;
  requestInformationPayload: { polygons: PolygonTableRow[] } | null;
  onConfirmRequestInformation: (comment: string) => void | Promise<void>;
  openPolygonApprovedModal: boolean;
  onPolygonApprovedModalOpenChange: (open: boolean) => void;
  approvedPolygonNames: string[];
  approvedPolygonComment: PolygonStatusChangeComment | null;
  openInformationRequestedModal: boolean;
  onInformationRequestedModalOpenChange: (open: boolean) => void;
  requestedInformationPolygonNames: string[];
  requestedInformationComment: PolygonStatusChangeComment | null;
  openSystemValidationCompleteModal: boolean;
  validatedPolygons: PolygonTableRow[];
  polygonValidations: Map<string, ValidationDto>;
  pendingValidationPolygonIds: string[];
  isAwaitingValidationResults: boolean;
  onSystemValidationCompleteModalOpenChange: (open: boolean) => void;
  onViewValidationDetails: (polygon: PolygonTableRow) => void;
};

const SitePolygonModals: FC<SitePolygonModalsProps> = ({
  siteUuid,
  isAdminReview = false,
  siteHasExistingPolygons = false,
  bulkEditPayload,
  deletePayload,
  submitPayload,
  overlapFixResults,
  editPhotoDetailsMedia,
  openBulkEditDrawer,
  openDeletePolygonModal,
  openOverlapFixModal,
  openPolygonSubmittedModal,
  openSubmitPolygonsModal,
  openSubmitPolygonConfirmationModal,
  openUploadErrorModal,
  openUploadModal,
  openMapPopupSubmitConfirmationModal,
  mapPopupSubmitPolygons,
  submittedPolygonNames,
  submittedPolygonComment,
  isBulkUpdatingPolygons,
  onBulkEditDrawerOpenChange,
  onBulkEditSave,
  onDelete,
  onDeletePolygonModalOpenChange,
  onEditPhotoDetailsClose,
  onMapPopupSubmitConfirmationModalOpenChange,
  onMapPopupSubmit,
  onOverlapFixClose,
  onPolygonSubmittedModalOpenChange,
  onProceedToBulkSubmitConfirmation,
  onSubmitPolygonConfirmationModalOpenChange,
  onSubmitPolygonsModalOpenChange,
  onSubmitPolygons,
  onUploadError,
  onUploadErrorModalOpenChange,
  uploadErrorMessage,
  onUploadModalOpenChange,
  onUploadSuccess,
  onViewOverlapPolygon,
  openApprovePolygonConfirmationModal,
  onApprovePolygonConfirmationModalOpenChange,
  approvePayload,
  projectUuid,
  onApprove,
  openRequestInformationModal,
  onRequestInformationModalOpenChange,
  requestInformationPayload,
  onConfirmRequestInformation,
  openPolygonApprovedModal,
  onPolygonApprovedModalOpenChange,
  approvedPolygonNames,
  approvedPolygonComment,
  openInformationRequestedModal,
  onInformationRequestedModalOpenChange,
  requestedInformationPolygonNames,
  requestedInformationComment,
  openSystemValidationCompleteModal,
  validatedPolygons,
  polygonValidations,
  pendingValidationPolygonIds,
  isAwaitingValidationResults,
  onSystemValidationCompleteModalOpenChange,
  onViewValidationDetails
}) => {
  return (
    <>
      {isAdminReview && (
        <>
          <ApprovePolygonConfirmation
            open={openApprovePolygonConfirmationModal}
            onOpenChange={onApprovePolygonConfirmationModalOpenChange}
            polygons={approvePayload?.polygons ?? []}
            projectUuid={projectUuid}
            onApprove={onApprove}
          />
          <RequestInformationConfirmation
            open={openRequestInformationModal}
            onOpenChange={onRequestInformationModalOpenChange}
            polygons={requestInformationPayload?.polygons ?? []}
            onRequestInformation={onConfirmRequestInformation}
          />
          <PolygonApproved
            open={openPolygonApprovedModal}
            onOpenChange={onPolygonApprovedModalOpenChange}
            polygons={approvedPolygonNames}
            comment={approvedPolygonComment}
          />
          <InformationRequested
            open={openInformationRequestedModal}
            onOpenChange={onInformationRequestedModalOpenChange}
            polygons={requestedInformationPolygonNames}
            comment={requestedInformationComment}
          />
        </>
      )}
      <PolygonBulkEditDrawer
        selectedPolygons={bulkEditPayload?.polygons ?? []}
        open={openBulkEditDrawer}
        onOpenChange={onBulkEditDrawerOpenChange}
        isSaving={isBulkUpdatingPolygons}
        onSave={onBulkEditSave}
      />
      <UploadPolygons
        open={openUploadModal}
        siteUuid={siteUuid}
        siteHasExistingPolygons={siteHasExistingPolygons}
        onOpenChange={onUploadModalOpenChange}
        onUploadSuccess={onUploadSuccess}
        onUploadError={onUploadError}
      />
      <SubmitPolygons
        open={openSubmitPolygonsModal}
        onOpenChange={onSubmitPolygonsModalOpenChange}
        eligibleCount={submitPayload?.eligibleCount ?? 0}
        totalCount={submitPayload?.totalCount ?? 0}
        onSubmit={onProceedToBulkSubmitConfirmation}
      />
      <SubmitPolygonConfirmation
        open={openSubmitPolygonConfirmationModal}
        onOpenChange={onSubmitPolygonConfirmationModalOpenChange}
        polygons={submitPayload?.polygons ?? []}
        onSubmit={onSubmitPolygons}
      />
      <SubmitPolygonConfirmation
        open={openMapPopupSubmitConfirmationModal}
        onOpenChange={onMapPopupSubmitConfirmationModalOpenChange}
        polygons={mapPopupSubmitPolygons}
        onSubmit={onMapPopupSubmit}
      />
      <PolygonSubmitted
        open={openPolygonSubmittedModal && submittedPolygonNames.length > 0}
        onOpenChange={onPolygonSubmittedModalOpenChange}
        polygons={submittedPolygonNames}
        submittedComment={submittedPolygonComment}
      />
      <DeletePolygon
        open={openDeletePolygonModal}
        onOpenChange={onDeletePolygonModalOpenChange}
        polygons={deletePayload?.polygons ?? []}
        onDelete={onDelete}
      />
      <OverlapFix
        open={
          openOverlapFixModal &&
          (overlapFixResults.polygonsFixed.length > 0 || overlapFixResults.polygonsNotFixed.length > 0)
        }
        onClose={onOverlapFixClose}
        polygonsFixed={overlapFixResults.polygonsFixed}
        polygonsNotFixed={overlapFixResults.polygonsNotFixed}
        onViewPolygon={onViewOverlapPolygon}
      />
      <SystemValidationComplete
        open={openSystemValidationCompleteModal}
        onOpenChange={onSystemValidationCompleteModalOpenChange}
        polygons={validatedPolygons}
        polygonValidations={polygonValidations}
        pendingValidationPolygonIds={pendingValidationPolygonIds}
        isLoadingResults={isAwaitingValidationResults}
        onViewDetails={onViewValidationDetails}
      />
      <UploadError
        open={openUploadErrorModal}
        backendErrorMessage={uploadErrorMessage}
        onOpenChange={onUploadErrorModalOpenChange}
      />
      {editPhotoDetailsMedia != null && (
        <EditPhotoDetails
          key={editPhotoDetailsMedia.uuid}
          open
          data={editPhotoDetailsMedia}
          onClose={onEditPhotoDetailsClose}
        />
      )}
    </>
  );
};

export default SitePolygonModals;
