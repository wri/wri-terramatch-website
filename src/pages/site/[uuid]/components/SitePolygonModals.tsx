import type { FC } from "react";

import type { BulkSitePolygonAttributeChanges } from "@/connections/SitePolygons";
import type { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

import type { SubmittedPolygonComment } from "../hooks/useSitePolygonBulkActions";
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
  openMapPopupSubmitModal: boolean;
  openMapPopupSubmitConfirmationModal: boolean;
  mapPopupSubmitEligibleCount: number;
  mapPopupSubmitTotalCount: number;
  mapPopupSubmitPolygons: PolygonTableRow[];
  submittedPolygonNames: string[];
  submittedPolygonComment: SubmittedPolygonComment | null;
  isBulkUpdatingPolygons: boolean;
  onBulkEditDrawerOpenChange: (open: boolean) => void;
  onBulkEditSave: (attributeChanges: BulkSitePolygonAttributeChanges) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  onDeletePolygonModalOpenChange: (open: boolean) => void;
  onEditPhotoDetailsClose: () => void;
  onMapPopupSubmitModalOpenChange: (open: boolean) => void;
  onMapPopupSubmitConfirmationModalOpenChange: (open: boolean) => void;
  onMapPopupSubmit: (comment: string) => void | Promise<void>;
  onProceedToBulkSubmitConfirmation: () => void | Promise<void>;
  onProceedToMapPopupSubmitConfirmation: () => void | Promise<void>;
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
};

const SitePolygonModals: FC<SitePolygonModalsProps> = ({
  siteUuid,
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
  openMapPopupSubmitModal,
  openMapPopupSubmitConfirmationModal,
  mapPopupSubmitEligibleCount,
  mapPopupSubmitTotalCount,
  mapPopupSubmitPolygons,
  submittedPolygonNames,
  submittedPolygonComment,
  isBulkUpdatingPolygons,
  onBulkEditDrawerOpenChange,
  onBulkEditSave,
  onDelete,
  onDeletePolygonModalOpenChange,
  onEditPhotoDetailsClose,
  onMapPopupSubmitModalOpenChange,
  onMapPopupSubmitConfirmationModalOpenChange,
  onMapPopupSubmit,
  onOverlapFixClose,
  onPolygonSubmittedModalOpenChange,
  onProceedToBulkSubmitConfirmation,
  onProceedToMapPopupSubmitConfirmation,
  onSubmitPolygonConfirmationModalOpenChange,
  onSubmitPolygonsModalOpenChange,
  onSubmitPolygons,
  onUploadError,
  onUploadErrorModalOpenChange,
  onUploadModalOpenChange,
  onUploadPhotosModalOpenChange,
  onUploadSuccess,
  onViewOverlapPolygon
}) => (
  <>
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
    <SubmitPolygons
      open={openMapPopupSubmitModal}
      onOpenChange={onMapPopupSubmitModalOpenChange}
      eligibleCount={mapPopupSubmitEligibleCount}
      totalCount={mapPopupSubmitTotalCount}
      onSubmit={onProceedToMapPopupSubmitConfirmation}
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

export default SitePolygonModals;
