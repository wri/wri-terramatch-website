import { Dialog } from "@headlessui/react";
import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { When } from "react-if";
import Joyride from "react-joyride";

import { useModalContext } from "@/context/modal.provider";
import { useNavbarContext } from "@/context/navbar.provider";
import { useUserData } from "@/hooks/useUserData";

import ToolTip from "./Tooltip";
import { getTourItems } from "./tourItems";
import WelcomeModal from "./WelcomeModal";

const TOUR_SKIPPED_KEY = "WRI_TOUR_SKIPPED";
const TOUR_COMPLETED_KEY = "WRI_TOUR_COMPLETED";

interface IProps {
  onFinish?: () => void;
  onDontShowAgain?: () => void;
}

const WelcomeTour: FC<IProps> = ({ onFinish, onDontShowAgain }) => {
  const { openModal, closeModal } = useModalContext();
  const [modalInteracted, setModalInteracted] = useState(false);
  const [tourEnabled, setTourEnabled] = useState(false);
  const { setIsOpen: setIsNavOpen, setLinksDisabled: setNavLinksDisabled } = useNavbarContext();
  const t = useT();
  const isLg = useMediaQuery("(min-width:1024px)");
  const userData = useUserData();

  const TOUR_COMPLETED_USER_ID_KEY = `${TOUR_COMPLETED_KEY}_${userData?.id}`;

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

  const joyrideSteps = useMemo(() => getTourItems(t, isLg), [isLg, t]);

  const handleSkip = useCallback(() => {
    sessionStorage.setItem(TOUR_SKIPPED_KEY, "true");
    setModalInteracted(true);
    closeModal();
  }, [closeModal]);

  const handleModalConfirm = useCallback(() => {
    if (!isLg) {
      setIsNavOpen?.(true);
    }
    setNavLinksDisabled?.(true);
    setModalInteracted(true);
    closeModal();
    setTourEnabled(true);
  }, [closeModal, isLg, setIsNavOpen, setNavLinksDisabled]);

  const handleDontShowAgain = useCallback(() => {
    if (userData?.id) {
      localStorage.setItem(TOUR_COMPLETED_USER_ID_KEY, "true");
      onDontShowAgain?.();
      setModalInteracted(true);
      closeModal();
    }
  }, [TOUR_COMPLETED_USER_ID_KEY, closeModal, onDontShowAgain, userData?.id]);

  useEffect(() => {
    const userId = userData?.id?.toString();
    if (userId) {
      const isSkipped = sessionStorage.getItem(TOUR_SKIPPED_KEY) === "true";
      const isCompleted = localStorage.getItem(TOUR_COMPLETED_USER_ID_KEY) === "true";

      if (!isSkipped && !isCompleted && !modalInteracted) {
        openModal(
          <WelcomeModal onSkip={handleSkip} onConfirm={handleModalConfirm} onDontShowAgain={handleDontShowAgain} />,
          true
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalInteracted, userData?.id]);

  return (
    <When condition={tourEnabled}>
      <Dialog as="div" className="z-20" onClose={closeModal} open>
        <div className="fixed inset-0 z-10 bg-black bg-opacity-25">
          <Joyride
            // Force re-render so tooltip re-focuses on correct place
            key={isLg ? 1 : 0}
            steps={joyrideSteps}
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
                localStorage.setItem(TOUR_COMPLETED_USER_ID_KEY, "true");
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
