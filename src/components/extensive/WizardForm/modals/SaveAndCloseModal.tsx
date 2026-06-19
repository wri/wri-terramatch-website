import { useT } from "@transifex/react";

import { useModalContext } from "@/context/modal.provider";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";

import { ModalId } from "../../Modal/ModalConst";

export interface SaveAndCloseModalProps {
  title?: string;
  content?: string;
  onConfirm?: () => void;
}

const SaveAndCloseModal = (props: SaveAndCloseModalProps) => {
  const { closeModal } = useModalContext();
  const t = useT();

  return (
    <ModalConfirmation
      open={true}
      title={props.title ?? t("Your Progress Will Be Saved")}
      content={
        props.content ??
        t(
          "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the 'My Applications' section.Would you like to close this form and continue later?"
        )
      }
      buttonsPrimary={[
        {
          id: "close",
          children: t("Close and continue later"),
          onClick: () => {
            props.onConfirm?.();
            closeModal(ModalId.SAVE_AND_CLOSE_MODAL);
          }
        }
      ]}
      buttonsCancel={[
        {
          id: "cancel",
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.SAVE_AND_CLOSE_MODAL)
        }
      ]}
      onOpenChange={() => closeModal(ModalId.SAVE_AND_CLOSE_MODAL)}
    />
  );
};

export default SaveAndCloseModal;
