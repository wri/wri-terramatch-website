import { useCallback } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import DownloadConfirmationModal, {
  DownloadConfirmationModalProps
} from "@/components/extensive/WizardForm/modals/DownloadConfirmationModal";
import { useModalContext } from "@/context/modal.provider";

export const useOpenDownloadConfirmation = () => {
  const { openModal } = useModalContext();

  return useCallback(
    (options: DownloadConfirmationModalProps) => {
      openModal(ModalId.DOWNLOAD_CONFIRMATION, <DownloadConfirmationModal {...options} />);
    },
    [openModal]
  );
};
