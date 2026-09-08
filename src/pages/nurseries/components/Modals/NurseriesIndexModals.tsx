import type { FC } from "react";

import type { NurseryIndexRow } from "../../nurseryIndex.types";
import DeleteNursery from "./DeleteNursery";
import NurserySubmitted from "./NurserySubmitted";
import SubmitNurseryConfirmation from "./SubmitNurseryConfirmation";

interface NurseriesIndexModalsProps {
  selectedNurseries: NurseryIndexRow[];
  submittedNurseryNames: string[];
  openDeleteModal: boolean;
  openSubmitModal: boolean;
  openSubmittedModal: boolean;
  onDeleteModalOpenChange: (open: boolean) => void;
  onSubmitModalOpenChange: (open: boolean) => void;
  onSubmittedModalOpenChange: (open: boolean) => void;
  onDelete: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
}

const NurseriesIndexModals: FC<NurseriesIndexModalsProps> = ({
  selectedNurseries,
  submittedNurseryNames,
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
    <DeleteNursery
      open={openDeleteModal}
      onOpenChange={onDeleteModalOpenChange}
      nurseries={selectedNurseries}
      onDelete={onDelete}
    />
    <SubmitNurseryConfirmation
      open={openSubmitModal}
      onOpenChange={onSubmitModalOpenChange}
      nurseries={selectedNurseries}
      onSubmit={onSubmit}
    />
    <NurserySubmitted
      open={openSubmittedModal && submittedNurseryNames.length > 0}
      onOpenChange={onSubmittedModalOpenChange}
      nurseryNames={submittedNurseryNames}
    />
  </>
);

export default NurseriesIndexModals;
