import { useT } from "@transifex/react";
import { FC } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";

export interface DownloadConfirmationModalProps {
  title: string;
  content: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
}

const DownloadConfirmationModal: FC<DownloadConfirmationModalProps> = ({ title, content, confirmLabel, onConfirm }) => {
  const { closeModal } = useModalContext();
  const t = useT();

  const handleClose = () => closeModal(ModalId.DOWNLOAD_CONFIRMATION);

  return (
    <ModalConfirmation
      open
      title={title}
      content={content}
      buttonsPrimary={[
        {
          id: "download",
          children: confirmLabel ?? t("Download"),
          variant: "primary",
          onClick: async () => {
            handleClose();
            await onConfirm();
          }
        }
      ]}
      buttonsCancel={[
        {
          id: "cancel",
          children: t("Cancel"),
          className: "!w-full",
          variant: "secondary",
          onClick: handleClose
        }
      ]}
      onOpenChange={open => {
        if (!open) handleClose();
      }}
    />
  );
};

export default DownloadConfirmationModal;
