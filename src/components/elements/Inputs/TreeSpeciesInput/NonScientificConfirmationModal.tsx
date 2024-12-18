import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import TreeSpeciesModal from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesModal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";

const NonScientificConfirmationModal = ({ onConfirm }: { onConfirm: () => void }) => {
  const t = useT();
  const { closeModal } = useModalContext();

  return (
    <TreeSpeciesModal
      title={t("Your input is a not a scientific name")}
      content={t("You can add this species, but it will be pending review from Admin.")}
      buttons={
        <>
          <Button variant="secondary" onClick={() => closeModal(ModalId.ERROR_MODAL)}>
            {t("CANCEL")}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              closeModal(ModalId.ERROR_MODAL);
              onConfirm();
            }}
          >
            {t("CONFIRM")}
          </Button>
        </>
      }
    />
  );
};

export default NonScientificConfirmationModal;
