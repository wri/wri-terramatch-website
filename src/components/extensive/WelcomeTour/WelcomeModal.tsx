import { useT } from "@transifex/react";
import WelcomeBanner from "public/images/welcome-banner.webp";
import { FC } from "react";

import AnnouncementModal from "@/components/extensive/WelcomeTour/AnnouncementModal";
import { zendeskSupportLink } from "@/constants/links";

interface IModalProps {
  onSkip: () => void;
  onDontShowAgain: () => void;
  onConfirm: () => void;
}

const WelcomeModal: FC<IModalProps> = ({ onSkip, onDontShowAgain, onConfirm }) => {
  const t = useT();

  return (
    <AnnouncementModal
      bannerImage={WelcomeBanner}
      title={t("Welcome to terramatch!")}
      body={t(
        `Take the guided tour to be shown the latest features of the TerraMatch platform and read more in the  <a href="{zendeskSupportLink}" target="_blank" rel="noopenner noreferrer">Help Center.</a>`,
        { zendeskSupportLink }
      )}
      primaryCtaLabel={t("Take guided tour")}
      secondaryCtaLabel={t("Skip for now")}
      dontShowAgainLabel={t("Don't show this again")}
      onSkip={onSkip}
      onPrimaryAction={onConfirm}
      onDontShowAgain={onDontShowAgain}
    />
  );
};

export default WelcomeModal;
