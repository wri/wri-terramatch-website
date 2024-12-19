import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import TreeSpeciesModal from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesModal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";

const SpeciesAlreadyExistsModal = ({ speciesName }: { speciesName: string }) => {
  const { closeModal } = useModalContext();
  const t = useT();

  return (
    <TreeSpeciesModal
      title={t("Species {name} already included", { name: speciesName })}
      content={t("Please find species below to enter reported value.")}
      buttons={
        <>
          <Button variant="secondary" onClick={() => closeModal(ModalId.ERROR_MODAL)}>
            {t("CONTINUE")}
          </Button>
        </>
      }
    />
  );
};

export default SpeciesAlreadyExistsModal;
