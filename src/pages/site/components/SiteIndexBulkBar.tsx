import { FC, useCallback, useState } from "react";

import { EntityIndexModalItem, EntityIndexModals } from "@/components/generic/EntityIndexModals/EntityIndexModals";
import { useEntityIndexModalsCopy } from "@/components/generic/EntityIndexModals/useEntityIndexModalsCopy";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";

import SiteIndexBulkActionToolbar from "./SiteIndexBulkActionToolbar";
import { useSiteIndexSelectionActions, useSiteIndexSelectionState } from "./SiteIndexSelection.provider";
import { useSiteIndexBulkActions } from "./useSiteIndexBulkActions";

type SiteIndexBulkBarProps = {
  onSitesChanged: () => void;
};

const SiteIndexBulkBar: FC<SiteIndexBulkBarProps> = ({ onSitesChanged }) => {
  const { selectedSites } = useSiteIndexSelectionState();
  const { clearSelection } = useSiteIndexSelectionActions();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [openSubmittedModal, setOpenSubmittedModal] = useState(false);
  const [submittedItems, setSubmittedItems] = useState<EntityIndexModalItem[]>([]);
  const modalsCopy = useEntityIndexModalsCopy("site");

  const { isDownloading, isUpdating, canEdit, canDelete, canSubmit, handleDownload, handleDelete, handleSubmit } =
    useSiteIndexBulkActions({
      selectedSites,
      onSitesChanged
    });

  const editSite = canEdit ? selectedSites[0] : undefined;
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "sites",
    entityUUID: editSite?.id ?? "",
    entityStatus: editSite?.status ?? "draft",
    updateRequestStatus: editSite?.updateRequestStatus ?? null,
    useInformationRequiredModal: true
  });

  const handleConfirmDelete = useCallback(async () => {
    await handleDelete();
    clearSelection();
  }, [clearSelection, handleDelete]);

  const handleConfirmSubmit = useCallback(async () => {
    await handleSubmit();
    setSubmittedItems(selectedSites);
    setOpenSubmittedModal(true);
    clearSelection();
  }, [clearSelection, handleSubmit, selectedSites]);

  return (
    <>
      {EditModals}
      <SiteIndexBulkActionToolbar
        selectedSites={selectedSites}
        isDownloading={isDownloading}
        isUpdating={isUpdating}
        canEdit={canEdit}
        canDelete={canDelete}
        onCancel={clearSelection}
        onDelete={() => {
          if (!canDelete) {
            return;
          }
          setOpenDeleteModal(true);
        }}
        onDownload={() => void handleDownload()}
        onEdit={handleEdit}
        onSubmit={() => {
          if (!canSubmit) {
            return;
          }
          setOpenSubmitModal(true);
        }}
      />
      <EntityIndexModals
        copy={modalsCopy}
        items={selectedSites}
        submittedItems={submittedItems}
        openDeleteModal={openDeleteModal}
        openSubmitModal={openSubmitModal}
        openSubmittedModal={openSubmittedModal}
        onDeleteModalOpenChange={setOpenDeleteModal}
        onSubmitModalOpenChange={setOpenSubmitModal}
        onSubmittedModalOpenChange={setOpenSubmittedModal}
        onDelete={handleConfirmDelete}
        onSubmit={handleConfirmSubmit}
      />
    </>
  );
};

export default SiteIndexBulkBar;
