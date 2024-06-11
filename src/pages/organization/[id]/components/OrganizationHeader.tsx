import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import IconSocial from "@/components/extensive/Icon/IconSocial";
import Container from "@/components/generic/Layout/Container";
import { getCountriesOptions } from "@/constants/options/countries";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { useModalContext } from "@/context/modal.provider";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { formatOptionsList } from "@/utils/options";

import OrganizationEditModal from "./edit/OrganizationEditModal";

export type OrganizationHeaderProps = {
  organization?: V2OrganisationRead;
};

const OrganizationHeader = ({ organization }: OrganizationHeaderProps) => {
  const t = useT();
  const router = useRouter();
  const { query } = router;
  const { openModal } = useModalContext();

  const showEditOrgModal = () => {
    return openModal(<OrganizationEditModal organization={organization} />);
  };

  useEffect(() => {
    if (query.modal === "edit") {
      showEditOrgModal();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.edit]);

  return (
    <div className="bg-neutral-150">
      <Container className="mb-6 flex justify-between">
        <section>
          {/* Avatar */}
          <div
            className="tranform h-[200px] w-[200px] translate-y-[-100px] rounded-full border-4 border-solid border-white bg-cover bg-center"
            style={{
              backgroundImage: `url('${organization?.logo?.url ?? "/images/pitch-placeholder.webp"}')`
            }}
          />
          {/* Content Container */}
        </section>
        <div className="mt-8">
          <Button onClick={showEditOrgModal}>{t("Edit Profile")}</Button>
        </div>
      </Container>
      <Container className="mb-6">
        <div className="tranform translate-y-[-70px]">
          <Text variant="text-heading-2000" className="mb-3">
            {organization?.name}
          </Text>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              <Icon name={IconNames.MAP_PIN} width={13} height={18} />
              <Text variant="text-body-900">
                {formatOptionsList(getCountriesOptions(t), organization?.hq_country ?? [])}
              </Text>
            </div>
            <Text variant="text-body-900">
              {formatOptionsList(getOrganisationTypeOptions(t), organization?.type!) || ""}
            </Text>
            <Text variant="text-body-400">{organization?.description}</Text>
          </div>
        </div>
        <div className="flex translate-y-[-30px] transform gap-6">
          <IconSocial name={IconNames.SOCIAL_FACEBOOK} url={organization?.facebook_url} />
          <IconSocial name={IconNames.SOCIAL_INSTAGRAM} url={organization?.instagram_url} />
          <IconSocial name={IconNames.SOCIAL_LINKEDIN} url={organization?.linkedin_url} />
          <IconSocial name={IconNames.SOCIAL_TWITTER} url={organization?.twitter_url} />
          <IconSocial name={IconNames.EARTH} url={organization?.web_url} />
        </div>
      </Container>
    </div>
  );
};

export default OrganizationHeader;
