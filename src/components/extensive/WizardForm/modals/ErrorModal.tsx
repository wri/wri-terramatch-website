import { useT } from "@transifex/react";

import { useModalContext } from "@/context/modal.provider";

import { IconNames } from "../../Icon/Icon";
import Modal from "../../Modal/Modal";
import { ModalId } from "../../Modal/ModalConst";

const ErrorModal = () => {
  const { closeModal } = useModalContext();
  const t = useT();

  return (
    <Modal
      title={t("Unable to save your changes")}
      content={t("Please try again")}
      iconProps={{
        name: IconNames.INFO_CIRCLE,
        className: "fill-error-500"
      }}
      primaryButtonProps={{
        children: t("Continue"),
        onClick: () => closeModal(ModalId.ERROR_MODAL)
      }}
    />
  );
};

export default ErrorModal;
