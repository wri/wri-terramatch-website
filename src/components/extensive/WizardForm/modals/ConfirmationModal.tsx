import { useT } from "@transifex/react";

import { useModalContext } from "@/context/modal.provider";

import { IconNames } from "../../Icon/Icon";
import Modal from "../../Modal/Modal";
import { ModalId } from "../../Modal/ModalConst";

const ConfirmationModal = () => {
  const { closeModal } = useModalContext();
  const t = useT();

  return (
    <Modal
      title={t("Your Changes have been saved")}
      iconProps={{ name: IconNames.CHECK_CIRCLE, width: 60 }}
      primaryButtonProps={{ children: t("Continue"), onClick: () => closeModal(ModalId.CONFIRMATION_MODAL) }}
    />
  );
};

export default ConfirmationModal;
