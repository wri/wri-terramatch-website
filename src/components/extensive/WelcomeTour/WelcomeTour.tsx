import { Dialog } from "@headlessui/react";
import { useMediaQuery } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { When } from "react-if";
import Joyride, { Step } from "react-joyride";

import { useModalContext } from "@/context/modal.provider";
import { useNavbarContext } from "@/context/navbar.provider";
import { useUserData } from "@/hooks/useUserData";

import { ModalId } from "../Modal/ModalConst";
import ToolTip from "./Tooltip";
import WelcomeModal from "./WelcomeModal";

const TOUR_SKIPPED_KEY = "WRI_TOUR_SKIPPED";
const TOUR_COMPLETED_KEY = "WRI_TOUR_COMPLETED";

interface IProps {
  tourId: string;
  tourSteps: Step[];
  hasWelcomeModal?: boolean;
  onDontShowAgain?: () => void;
  onStart?: () => void;
  onFinish?: () => void;
}

const WelcomeTour: FC<IProps> = ({ tourId, tourSteps, onFinish, onStart, onDontShowAgain, hasWelcomeModal = true }) => {
  const { openModal, closeModal } = useModalContext();
  const [modalInteracted, setModalInteracted] = useState(false);
  const [tourEnabled, setTourEnabled] = useState(false);
  const { setIsOpen: setIsNavOpen, setLinksDisabled: setNavLinksDisabled } = useNavbarContext();

  const isLg = useMediaQuery("(min-width:1024px)");
  const userData = useUserData();

  const TOUR_COMPLETED_STORAGE_KEY = `${tourId}_${TOUR_COMPLETED_KEY}_${userData?.id}`;
  const TOUR_SKIPPED_STORAGE_KEY = `${tourId}_${TOUR_SKIPPED_KEY}`;

  const floaterProps = useMemo(() => {
    if (isLg) {
      return {
        styles: {
          floater: {
            filter: "none"
          }
        },
        hideArrow: true
      };
    }

    return {
      hideArrow: true,
      disableAnimation: true
    };
  }, [isLg]);

  useEffect(() => {
    if (!isLg && tourEnabled) {
      setIsNavOpen?.(true);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [isLg, setIsNavOpen, tourEnabled]);

  const handleSkip = useCallback(() => {
    sessionStorage.setItem(TOUR_SKIPPED_STORAGE_KEY, "true");
    setModalInteracted(true);
    closeModal(ModalId.WELCOME_MODAL);
  }, [closeModal, TOUR_SKIPPED_STORAGE_KEY]);

  const handleModalConfirm = useCallback(() => {
    if (!isLg) {
      setIsNavOpen?.(true);
    }
    setNavLinksDisabled?.(true);
    setModalInteracted(true);
    closeModal(ModalId.WELCOME_MODAL);
    setTourEnabled(true);
  }, [closeModal, isLg, setIsNavOpen, setNavLinksDisabled]);

  const handleDontShowAgain = useCallback(() => {
    if (userData?.id) {
      localStorage.setItem(TOUR_COMPLETED_STORAGE_KEY, "true");
      onDontShowAgain?.();
      setModalInteracted(true);
      closeModal(ModalId.WELCOME_MODAL);
    }
  }, [TOUR_COMPLETED_STORAGE_KEY, closeModal, onDontShowAgain, userData?.id]);

  useEffect(() => {
    const userId = userData?.id?.toString();
    if (userId) {
      const isSkipped = sessionStorage.getItem(TOUR_SKIPPED_STORAGE_KEY) === "true";
      const isCompleted = localStorage.getItem(TOUR_COMPLETED_STORAGE_KEY) === "true";

      if (hasWelcomeModal && !isSkipped && !isCompleted && !modalInteracted) {
        openModal(
          ModalId.WELCOME_MODAL,
          <WelcomeModal onSkip={handleSkip} onConfirm={handleModalConfirm} onDontShowAgain={handleDontShowAgain} />,
          true
        );
      } else if (!hasWelcomeModal && !isSkipped && !isCompleted && !modalInteracted) {
        setTourEnabled(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWelcomeModal, modalInteracted, userData?.id]);

  useEffect(() => {
    if (tourEnabled) {
      onStart?.();
    }
  }, [onStart, tourEnabled]);

  return (
    <When condition={tourEnabled}>
      <Dialog as="div" className="z-20" onClose={() => closeModal(ModalId.WELCOME_MODAL)} open>
        <div className="fixed inset-0 z-10 bg-black bg-opacity-25">
          <Joyride
            // Force re-render so tooltip re-focuses on correct place
            key={isLg ? 1 : 0}
            steps={tourSteps}
            run={tourEnabled}
            tooltipComponent={ToolTip}
            showProgress
            continuous
            disableOverlay
            floaterProps={floaterProps}
            styles={{
              options: {
                arrowColor: "#4EBBEA",
                spotlightShadow: "none"
              }
            }}
            callback={data => {
              if (data.status === "finished" && userData?.id) {
                localStorage.setItem(TOUR_COMPLETED_STORAGE_KEY, "true");
                setTourEnabled(false);
                setNavLinksDisabled?.(false);
                onFinish?.();
              }
            }}
          />
        </div>
      </Dialog>
    </When>
  );
};

export default WelcomeTour;
