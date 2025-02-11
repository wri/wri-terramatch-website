import { useT } from "@transifex/react";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import { IconNames } from "@/components/extensive/Icon/Icon";
import IconSocialImpactStory from "@/components/extensive/Icon/IconSocialImpactStory";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalShareImpactStory from "@/components/extensive/Modal/ModalShareImpactStory";
import { useModalContext } from "@/context/modal.provider";

import { CARD_IMPACT_STORY_MOCKED_DATA } from "../../mockedData/impactStory";
import ShareSection from "./ShareSection";

const SectionShare = ({ uuid, className }: { uuid: string; className?: string }) => {
  const { openModal, closeModal } = useModalContext();
  const t = useT();
  const data = CARD_IMPACT_STORY_MOCKED_DATA.find(item => item.uuid === uuid);

  const openModalShare = () => {
    openModal(
      ModalId.MODAL_SHARE_IMPACT_STORY,
      <ModalShareImpactStory
        title=""
        onClose={() => closeModal(ModalId.MODAL_SHARE_IMPACT_STORY)}
        onConfirm={() => {}}
      />
    );
  };

  return (
    <div className={tw("flex flex-col gap-y-5 ", className)}>
      <Button
        variant="primary"
        fullWidth
        iconProps={{ name: IconNames.SHARE_IMPACT_STORY, className: "w-6 h-6" }}
        onClick={() => openModalShare()}
      >
        {t("Share")}
      </Button>
      <ShareSection label="LANGUAGES" />
      <ShareSection label="COUNTRY" value={data?.country} />
      <ShareSection label="ORGANIZATION" value={data?.organization} />
      <ShareSection label="IMPACT CATEGORY" value={data?.category} />
      <div className="flex gap-x-4">
        <IconSocialImpactStory name={IconNames.INSTAGRAM} url={data?.instagram_url ?? ""} />
        <IconSocialImpactStory name={IconNames.TWITTER} url={data?.twitter_url ?? ""} />
        <IconSocialImpactStory name={IconNames.FACEBOOK} url={data?.facebook_url ?? ""} />
        <IconSocialImpactStory name={IconNames.LINKEDIN} url={data?.linkedin_url ?? ""} />
      </div>
    </div>
  );
};

export default SectionShare;
