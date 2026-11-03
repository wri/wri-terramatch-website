import { useCallback } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";

import WhatsNewModal from "./WhatsNewModal";

export const useOpenWhatsNewModal = () => {
  const { openModal, closeModal } = useModalContext();

  return useCallback(() => {
    const close = () => closeModal(ModalId.WHATS_NEW_MODAL);
    openModal(ModalId.WHATS_NEW_MODAL, <WhatsNewModal onSkip={close} onFinish={close} />, true);
  }, [closeModal, openModal]);
};
