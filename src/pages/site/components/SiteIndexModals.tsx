import type { FC } from "react";

import DeleteSite from "./Modals/DeleteSite";
import SiteSubmitted from "./Modals/SiteSubmitted";
import SubmitSiteConfirmation from "./Modals/SubmitSiteConfirmation";
import type { SiteIndexSite } from "./siteIndexMockData";

interface SiteIndexModalsProps {
  selectedSites: SiteIndexSite[];
  submittedSiteNames: string[];
  openDeleteModal: boolean;
  openSubmitModal: boolean;
  openSubmittedModal: boolean;
  onDeleteModalOpenChange: (open: boolean) => void;
  onSubmitModalOpenChange: (open: boolean) => void;
  onSubmittedModalOpenChange: (open: boolean) => void;
  onDelete: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
}

const SiteIndexModals: FC<SiteIndexModalsProps> = ({
  selectedSites,
  submittedSiteNames,
  openDeleteModal,
  openSubmitModal,
  openSubmittedModal,
  onDeleteModalOpenChange,
  onSubmitModalOpenChange,
  onSubmittedModalOpenChange,
  onDelete,
  onSubmit
}) => (
  <>
    <DeleteSite
      open={openDeleteModal}
      onOpenChange={onDeleteModalOpenChange}
      sites={selectedSites}
      onDelete={onDelete}
    />
    <SubmitSiteConfirmation
      open={openSubmitModal}
      onOpenChange={onSubmitModalOpenChange}
      sites={selectedSites}
      onSubmit={onSubmit}
    />
    <SiteSubmitted
      open={openSubmittedModal && submittedSiteNames.length > 0}
      onOpenChange={onSubmittedModalOpenChange}
      siteNames={submittedSiteNames}
    />
  </>
);

export default SiteIndexModals;
