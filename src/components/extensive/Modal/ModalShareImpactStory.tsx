import { useT } from "@transifex/react";
import { FC } from "react";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import IconSocialImpactStory from "../Icon/IconSocialImpactStory";
import { ModalBase, ModalProps } from "./Modal";

export interface ModalShareImpactStoryProps extends ModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ModalShareImpactStory: FC<ModalShareImpactStoryProps> = ({ onClose, onConfirm, className, ...rest }) => {
  const t = useT();

  return (
    <ModalBase {...rest} className={tw("w-[40vw] p-8 mobile:w-full", className)}>
      <div className="relative flex w-full flex-col gap-2">
        <button className="absolute top-0 right-0 w-fit text-grey-500" onClick={onClose}>
          <Icon name={IconNames.CLEAR} className="h-4 w-4 lg:h-5 lg:w-5" />
        </button>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Text variant="text-20-bold" className="text-darkCustom">
              {t("Share this project")}
            </Text>
            <Text variant="text-16-light" className="text-darkCustom-300">
              {t("Invite your team to review collaborate on this project.")}
            </Text>
          </div>
          <div className="flex flex-col gap-3">
            <Text variant="text-18-semibold" className="text-darkCustom">
              {t("Share on Social media")}
            </Text>
            <div className="flex w-full gap-2">
              <IconSocialImpactStory name={IconNames.INSTAGRAM} url="#" />
              <IconSocialImpactStory name={IconNames.TWITTER} url="#" />
              <IconSocialImpactStory name={IconNames.FACEBOOK} url="#" />
              <IconSocialImpactStory name={IconNames.LINKEDIN} url="#" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Text variant="text-18-semibold" className="text-darkCustom">
              {t("Share on Social media")}
            </Text>
            <div className="flex w-full items-center justify-between gap-2 rounded-md border border-grey-350 bg-background py-1 pl-4 pr-1">
              <Text variant="text-16-light" className="leading-[normal] text-darkCustom">
                impactstory.com/share
              </Text>
              <Button
                variant="primary"
                className="w-fit"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {t("Copy")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default ModalShareImpactStory;
