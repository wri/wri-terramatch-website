import { useT } from "@transifex/react";

import { useModalContext } from "@/context/modal.provider";

import { IconNames } from "../../Icon/Icon";
import Modal from "../../Modal/Modal";

interface SaveAndCloseModalProps {
  onConfirm: () => void;
}

const SaveAndCloseModal = (props: SaveAndCloseModalProps) => {
  const { closeModal } = useModalContext();
  const t = useT();

  return (
    <Modal
      title={t("Do you want to close this form and continue later?")}
      content={t(
        "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the 'My Applications' section.Would you like to close this form and continue later?"
      )}
      iconProps={{
        name: IconNames.INFO_CIRCLE,
        className: "fill-error-500"
      }}
      primaryButtonProps={{
        children: t("Close and continue later"),
        onClick: () => {
          props.onConfirm();
          closeModal();
        }
      }}
      secondaryButtonProps={{
        children: t("Cancel"),
        onClick: () => closeModal()
      }}
    />
  );
};

export default SaveAndCloseModal;
