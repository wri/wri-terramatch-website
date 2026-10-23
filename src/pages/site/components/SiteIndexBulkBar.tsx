import { FC, useCallback, useState } from "react";

import { EntityIndexModalItem, EntityIndexModals } from "@/components/generic/EntityIndexModals/EntityIndexModals";
import EntitySubmissionProbe from "@/components/generic/EntityIndexModals/EntitySubmissionProbe";
import { useEntityIndexModalsCopy } from "@/components/generic/EntityIndexModals/useEntityIndexModalsCopy";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";

import type { SiteIndexSite } from "./siteIndex.types";
import SiteIndexBulkActionToolbar from "./SiteIndexBulkActionToolbar";
import { useSiteIndexSelectionActions, useSiteIndexSelectionState } from "./SiteIndexSelection.provider";
import { isSiteSubmittable } from "./siteIndexSubmit";
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
  const [completeness, setCompleteness] = useState<Record<string, boolean>>({});
  const modalsCopy = useEntityIndexModalsCopy("site");

  const handleCompleteness = useCallback((siteUuid: string, complete: boolean) => {
    setCompleteness(previous => (previous[siteUuid] === complete ? previous : { ...previous, [siteUuid]: complete }));
  }, []);
  const isSubmissionReady = useCallback((site: SiteIndexSite) => completeness[site.id] === true, [completeness]);

  const { isDownloading, isUpdating, canEdit, canDelete, canSubmit, handleDownload, handleDelete, handleSubmit } =
    useSiteIndexBulkActions({
      selectedSites,
      isSubmissionReady,
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
      {selectedSites.filter(isSiteSubmittable).map(site => (
        <EntitySubmissionProbe key={site.id} entityName="sites" entityUuid={site.id} onResult={handleCompleteness} />
      ))}
      <SiteIndexBulkActionToolbar
        selectedSites={selectedSites}
        isDownloading={isDownloading}
        isUpdating={isUpdating}
        canEdit={canEdit}
        canDelete={canDelete}
        canSubmit={canSubmit}
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
