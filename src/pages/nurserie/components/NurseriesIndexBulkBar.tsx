import { FC, useCallback, useState } from "react";

import { EntityIndexModalItem, EntityIndexModals } from "@/components/generic/EntityIndexModals/EntityIndexModals";
import { useEntityIndexModalsCopy } from "@/components/generic/EntityIndexModals/useEntityIndexModalsCopy";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";

import { useNurseriesSelectionActions, useNurseriesSelectionState } from "../NurseriesSelection.provider";
import { useNurseriesBulkActions } from "../useNurseriesBulkActions";
import NurseriesIndexBulkActionToolbar from "./NurseriesIndexBulkActionToolbar";

type NurseriesIndexBulkBarProps = {
  onNurseriesChanged: () => void;
};

const NurseriesIndexBulkBar: FC<NurseriesIndexBulkBarProps> = ({ onNurseriesChanged }) => {
  const { selectedNurseries } = useNurseriesSelectionState();
  const { clearSelection } = useNurseriesSelectionActions();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [openSubmittedModal, setOpenSubmittedModal] = useState(false);
  const [submittedItems, setSubmittedItems] = useState<EntityIndexModalItem[]>([]);
  const modalsCopy = useEntityIndexModalsCopy("nursery");

  const { isDownloading, isUpdating, canEdit, canDelete, canSubmit, handleDownload, handleDelete, handleSubmit } =
    useNurseriesBulkActions({
      selectedNurseries,
      onNurseriesChanged
    });

  // Edit is only available for a single selection; route it through the shared handler so approved nurseries
  // get the same "resubmit for approval" confirmation as the nursery page.
  const editNursery = canEdit ? selectedNurseries[0] : undefined;
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: editNursery?.uuid ?? "",
    entityStatus: editNursery?.status ?? "draft",
    updateRequestStatus: editNursery?.updateRequestStatus ?? null,
    useInformationRequiredModal: true
  });

  const handleEditClick = useCallback(() => {
    if (editNursery == null) {
      return;
    }
    handleEdit();
  }, [editNursery, handleEdit]);

  const handleConfirmDelete = useCallback(async () => {
    await handleDelete();
    clearSelection();
  }, [clearSelection, handleDelete]);

  const handleConfirmSubmit = useCallback(async () => {
    await handleSubmit();
    setSubmittedItems(selectedNurseries);
    setOpenSubmittedModal(true);
    clearSelection();
  }, [clearSelection, handleSubmit, selectedNurseries]);

  return (
    <>
      {EditModals}
      <NurseriesIndexBulkActionToolbar
        selectedNurseries={selectedNurseries}
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
        onEdit={handleEditClick}
        onSubmit={() => {
          if (!canSubmit) {
            return;
          }
          setOpenSubmitModal(true);
        }}
      />
      <EntityIndexModals
        copy={modalsCopy}
        items={selectedNurseries}
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

export default NurseriesIndexBulkBar;
