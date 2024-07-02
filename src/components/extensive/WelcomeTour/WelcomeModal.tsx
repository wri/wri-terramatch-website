import { useT } from "@transifex/react";
import Image from "next/image";
import WelcomeBanner from "public/images/welcome-banner.webp";
import { FC } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { zendeskSupportLink } from "@/constants/links";

import { ModalBase } from "../Modal/ModalsBases";

interface IModalProps {
  onSkip: () => void;
  onDontShowAgain: () => void;
  onConfirm: () => void;
}

const WelcomeModal: FC<IModalProps> = ({ onSkip, onDontShowAgain, onConfirm }) => {
  const t = useT();

  return (
    <ModalBase className="pb-10">
      <Image
        src={WelcomeBanner}
        alt=""
        role="presentation"
        className="h-screen max-h-[280px] min-h-[180px] rounded-lg object-cover"
      />
      <Text variant="text-bold-headline-1000" className="mt-10 mb-4 uppercase">
        {t("Welcome to terramatch!")}
      </Text>
      <Text variant="text-light-body-300" containHtml>
        {t(
          `Take the guided tour to be shown the latest features of the TerraMatch platform and read more in the  <a href="{zendeskSupportLink}" target="_blank" rel="noopenner noreferrer">Help Center.</a>`,
          { zendeskSupportLink }
        )}
      </Text>
      <div className="mt-10 flex justify-center gap-8">
        <Button variant="secondary" onClick={onSkip}>
          {t("Skip for now")}
        </Button>
        <Button onClick={onConfirm}>{t("Take guided tour")}</Button>
      </div>
      <Button variant="text" className="mt-[105px] underline screen-height-sm:mt-8" onClick={onDontShowAgain}>
        {t("Don't show this again")}
      </Button>
    </ModalBase>
  );
};

export default WelcomeModal;
