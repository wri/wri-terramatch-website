import { useCallback, useState } from "react";

import SiteIndexBulkActionToolbar from "./SiteIndexBulkActionToolbar";
import SiteIndexModals from "./SiteIndexModals";
import { useSiteIndexSelectionActions, useSiteIndexSelectionState } from "./SiteIndexSelection.provider";
import { useSiteIndexBulkActions } from "./useSiteIndexBulkActions";

type SiteIndexBulkBarProps = {
  onSitesChanged: () => void;
};

const SiteIndexBulkBar = ({ onSitesChanged }: SiteIndexBulkBarProps) => {
  const { selectedSites } = useSiteIndexSelectionState();
  const { clearSelection } = useSiteIndexSelectionActions();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [openSubmittedModal, setOpenSubmittedModal] = useState(false);
  const [submittedSiteNames, setSubmittedSiteNames] = useState<string[]>([]);

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
  } = useSiteIndexBulkActions({
    selectedSites,
    onSitesChanged
  });

  const handleConfirmDelete = useCallback(async () => {
    await handleDelete();
    clearSelection();
  }, [clearSelection, handleDelete]);

  const handleConfirmSubmit = useCallback(async () => {
    const names = selectedSites.map(site => site.name);
    await handleSubmit();
    setSubmittedSiteNames(names);
    setOpenSubmittedModal(true);
    clearSelection();
  }, [clearSelection, handleSubmit, selectedSites]);

  return (
    <>
      {selectedSites.length > 0 ? <div aria-hidden className="h-24" /> : null}
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
      <SiteIndexModals
        selectedSites={selectedSites}
        submittedSiteNames={submittedSiteNames}
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
