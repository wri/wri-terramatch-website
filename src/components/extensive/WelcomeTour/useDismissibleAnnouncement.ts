import { ReactNode, useCallback, useEffect, useState } from "react";

import { useMyUser } from "@/connections/User";
import { useModalContext } from "@/context/modal.provider";

const ANNOUNCEMENT_SKIPPED_KEY = "WRI_TOUR_SKIPPED";
const ANNOUNCEMENT_COMPLETED_KEY = "WRI_TOUR_COMPLETED";

export type DismissibleAnnouncementHandlers = {
  onSkip: () => void;
  onPrimaryAction: () => void;
  onDontShowAgain: () => void;
};

type UseDismissibleAnnouncementOptions = {
  announcementId: string;
  modalId: string;
  enabled?: boolean;
  renderModal: (handlers: DismissibleAnnouncementHandlers) => ReactNode;
};

export const useDismissibleAnnouncement = ({
  announcementId,
  modalId,
  enabled = true,
  renderModal
}: UseDismissibleAnnouncementOptions) => {
  const { openModal, closeModal } = useModalContext();
  const [modalInteracted, setModalInteracted] = useState(false);
  const [, { user }] = useMyUser();

  const completedStorageKey = `${announcementId}_${ANNOUNCEMENT_COMPLETED_KEY}_${user?.uuid}`;
  const skippedStorageKey = `${announcementId}_${ANNOUNCEMENT_SKIPPED_KEY}`;

  const dismissForSession = useCallback(() => {
    sessionStorage.setItem(skippedStorageKey, "true");
    setModalInteracted(true);
    closeModal(modalId);
  }, [closeModal, modalId, skippedStorageKey]);

  const dismissPermanently = useCallback(() => {
    if (user?.uuid != null) {
      localStorage.setItem(completedStorageKey, "true");
      setModalInteracted(true);
      closeModal(modalId);
    }
  }, [closeModal, completedStorageKey, modalId, user?.uuid]);

  useEffect(() => {
    const userId = user?.uuid?.toString();
    if (!enabled || userId == null || userId === "" || modalInteracted) {
      return;
    }

    const isSkipped = sessionStorage.getItem(skippedStorageKey) === "true";
    const isCompleted = localStorage.getItem(completedStorageKey) === "true";

    if (!isSkipped && !isCompleted) {
      openModal(
        modalId,
        renderModal({
          onSkip: dismissForSession,
          onPrimaryAction: dismissForSession,
          onDontShowAgain: dismissPermanently
        }),
        true
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, modalInteracted, user?.uuid]);
};
