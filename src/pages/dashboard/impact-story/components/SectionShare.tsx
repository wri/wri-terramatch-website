import { useT } from "@transifex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { twMerge as tw } from "tailwind-merge";

import { IMPACT_CATEGORIES } from "@/admin/modules/impactStories/components/ImpactStoryForm";
import Button from "@/components/elements/Button/Button";
import { IconNames } from "@/components/extensive/Icon/Icon";
import IconSocialImpactStory from "@/components/extensive/Icon/IconSocialImpactStory";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";

import ShareSection from "./ShareSection";

const ModalShareImpactStory = dynamic(() => import("@/components/extensive/Modal/ModalShareImpactStory"), {
  ssr: false
});

interface Organization {
  country?: string;
  name?: string;
  category?: string[];
  instagram_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
}

interface ImpactStoryData {
  uuid?: string;
  status?: string;
  organization?: Organization;
  title?: string;
}

interface SectionShareProps {
  data?: ImpactStoryData;
  className?: string;
}

const getCategoryTitles = (categories: string[] = []) => {
  return categories
    .map(value => IMPACT_CATEGORIES.find(item => item.value === value)?.title)
    .filter((title): title is string => Boolean(title));
};

const SectionShare = ({ data, className }: SectionShareProps) => {
  const { openModal, closeModal } = useModalContext();
  const t = useT();

  const isButtonDisabled = useMemo(() => {
    if (!data || !data.organization) return true;
    if (!data.uuid) return true;
    if (data.status === "draft") return true;
    return false;
  }, [data]);

  const handleCopySuccess = () => {
    console.log("Link copied!");
  };
  const socialMediaLinks = useMemo(() => {
    if (!data?.organization) return [];

    type SocialIconNames = IconNames.FACEBOOK | IconNames.LINKEDIN | IconNames.TWITTER | IconNames.INSTAGRAM;

    return [
      { name: IconNames.INSTAGRAM as SocialIconNames, url: data.organization.instagram_url },
      { name: IconNames.TWITTER as SocialIconNames, url: data.organization.twitter_url },
      { name: IconNames.FACEBOOK as SocialIconNames, url: data.organization.facebook_url },
      { name: IconNames.LINKEDIN as SocialIconNames, url: data.organization.linkedin_url }
    ].filter(link => !!link.url);
  }, [data?.organization]);
  const openModalShare = () => {
    if (!data?.uuid) return;

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${baseUrl}/dashboard/impact-story/${data.uuid}`;

    openModal(
      ModalId.MODAL_SHARE_IMPACT_STORY,
      <ModalShareImpactStory
        title={data.title ?? ""}
        shareUrl={shareUrl}
        onClose={() => closeModal(ModalId.MODAL_SHARE_IMPACT_STORY)}
        onCopySuccess={handleCopySuccess}
      />
    );
  };

  return (
    <div className={tw("flex flex-col gap-y-5", className)}>
      <Button
        variant="primary"
        fullWidth
        disabled={isButtonDisabled}
        iconProps={{ name: IconNames.SHARE_IMPACT_STORY, className: "w-6 h-6" }}
        onClick={openModalShare}
      >
        {t("Share")}
      </Button>
      <ShareSection label="COUNTRY" value={data?.organization?.country} />
      <ShareSection label="ORGANIZATION" value={data?.organization?.name} />
      <ShareSection label="IMPACT CATEGORY" value={getCategoryTitles(data?.organization?.category)} />

      {socialMediaLinks.length > 0 && (
        <div className="flex gap-x-4">
          {socialMediaLinks.map(({ name, url }) => (
            <IconSocialImpactStory key={name} name={name} url={url ?? ""} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionShare;
