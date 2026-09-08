import { useCallback, useState } from "react";

import { useNurseriesSelectionActions, useNurseriesSelectionState } from "../NurseriesSelection.provider";
import { useNurseriesBulkActions } from "../useNurseriesBulkActions";
import NurseriesIndexModals from "./Modals/NurseriesIndexModals";
import NurseriesIndexBulkActionToolbar from "./NurseriesIndexBulkActionToolbar";

type NurseriesIndexBulkBarProps = {
  onNurseriesChanged: () => void;
};

const NurseriesIndexBulkBar = ({ onNurseriesChanged }: NurseriesIndexBulkBarProps) => {
  const { selectedNurseries } = useNurseriesSelectionState();
  const { clearSelection } = useNurseriesSelectionActions();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [openSubmittedModal, setOpenSubmittedModal] = useState(false);
  const [submittedNurseryNames, setSubmittedNurseryNames] = useState<string[]>([]);

  const {
    isDownloading,
    isUpdating,
    canEdit,
    canDelete,
    canSubmit,
    handleDownload,
    handleEdit,
    handleDelete,
    handleSubmit
  } = useNurseriesBulkActions({
    selectedNurseries,
    onNurseriesChanged
  });

  const handleConfirmDelete = useCallback(async () => {
    await handleDelete();
    clearSelection();
  }, [clearSelection, handleDelete]);

  const handleConfirmSubmit = useCallback(async () => {
    const names = selectedNurseries.map(nursery => nursery.name ?? "Nursery");
    await handleSubmit();
    setSubmittedNurseryNames(names);
    setOpenSubmittedModal(true);
    clearSelection();
  }, [clearSelection, handleSubmit, selectedNurseries]);

  return (
    <>
      {selectedNurseries.length > 0 ? <div aria-hidden className="h-24" /> : null}
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
        onEdit={handleEdit}
        onSubmit={() => {
          if (!canSubmit) {
            return;
          }
          setOpenSubmitModal(true);
        }}
      />
      <NurseriesIndexModals
        selectedNurseries={selectedNurseries}
        submittedNurseryNames={submittedNurseryNames}
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
