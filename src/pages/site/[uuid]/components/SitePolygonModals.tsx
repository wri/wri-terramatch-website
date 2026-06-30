import type { FC } from "react";

import type { BulkSitePolygonAttributeChanges } from "@/connections/SitePolygons";
import type { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useIsAdmin } from "@/hooks/useIsAdmin";

import type { SubmittedPolygonComment } from "../hooks/useSitePolygonBulkActions";
import ApprovePolygonConfirmation from "./Modals/ApprovePolygon/ApprovePolygonConfirmation";
import DeletePolygon from "./Modals/DeletePolygon";
import EditPhotoDetails from "./Modals/GeotaggedPhotos/EditPhotoDetails";
import OverlapFix, { type OverlapFixPolygon } from "./Modals/OverlapFix";
import PolygonSubmitted from "./Modals/PolygonSubmitted";
import SubmitPolygonConfirmation from "./Modals/SubmitPolygonConfirmation";
import SubmitPolygons from "./Modals/SubmitPolygons";
import UploadError from "./Modals/UploadError";
import UploadPhotos from "./Modals/UploadPhotos";
import UploadPolygons from "./Modals/UploadPolygons";
import PolygonBulkEditDrawer from "./PolygonBulkEditDrawer";
import type { PolygonTableRow } from "./PolygonTableRow";

type SitePolygonModalsProps = {
  siteUuid: string;
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
  onUploadError: () => void;
  openUploadErrorModal: boolean;
  openUploadModal: boolean;
  openUploadPhotosModal: boolean;
  onUploadErrorModalOpenChange: (open: boolean) => void;
  onUploadModalOpenChange: (open: boolean) => void;
  onUploadPhotosModalOpenChange: (open: boolean) => void;
  onUploadSuccess: (result: { createdSitePolygonUuid?: string | null; uploadedFileCount: number }) => void;
  onViewOverlapPolygon: (polygonUuid: string) => void;
  openApprovePolygonConfirmationModal: boolean;
  onApprovePolygonConfirmationModalOpenChange: (open: boolean) => void;
  approvePayload: { polygons: PolygonTableRow[] } | null;
  onApprove: (comment: string) => void | Promise<void>;
  onRequestInformation: () => void | Promise<void>;
};

const SitePolygonModals: FC<SitePolygonModalsProps> = ({
  siteUuid,
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
  openUploadPhotosModal,
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
  onUploadModalOpenChange,
  onUploadPhotosModalOpenChange,
  onUploadSuccess,
  onViewOverlapPolygon,
  openApprovePolygonConfirmationModal,
  onApprovePolygonConfirmationModalOpenChange,
  approvePayload,
  onApprove,
  onRequestInformation
}) => {
  const isAdmin = useIsAdmin();
  return (
    <>
      {isAdmin && (
        <ApprovePolygonConfirmation
          open={openApprovePolygonConfirmationModal}
          onOpenChange={onApprovePolygonConfirmationModalOpenChange}
          polygons={approvePayload?.polygons ?? []}
          onApprove={onApprove}
          onRequestInformation={onRequestInformation}
        />
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
      <UploadError open={openUploadErrorModal} onOpenChange={onUploadErrorModalOpenChange} />
      <UploadPhotos open={openUploadPhotosModal} onOpenChange={onUploadPhotosModalOpenChange} />
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
