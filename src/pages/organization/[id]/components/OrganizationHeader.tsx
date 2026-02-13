import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import IconSocial from "@/components/extensive/Icon/IconSocial";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import Container from "@/components/generic/Layout/Container";
import { useGadmOptions } from "@/connections/Gadm";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { useModalContext } from "@/context/modal.provider";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { MediaDto, OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import { AppStore } from "@/store/store";
import { formatOptionsList } from "@/utils/options";

import OrganizationEditModal from "./edit/OrganizationEditModal";

export type OrganizationHeaderProps = {
  organization?: OrganisationFullDto;
};

const OrganizationHeader = ({ organization }: OrganizationHeaderProps) => {
  const t = useT();
  const router = useRouter();
  const { query } = router;
  const { openModal } = useModalContext();
  const countryOptions = useGadmOptions({ level: 0 });

  const logoMedia = useSelector<AppStore, MediaDto[]>(state => {
    if (organization?.uuid == null || state.api.media == null) return [];

    return Object.values(state.api.media)
      .filter(
        resource =>
          resource.attributes.entityUuid === organization.uuid &&
          resource.attributes.entityType === "organisations" &&
          resource.attributes.collectionName === "logo"
      )
      .map(resource => resource.attributes)
      .filter((attrs): attrs is MediaDto => Boolean(attrs));
  });

  const logoUrl = logoMedia[0]?.url ?? null;

  const showEditOrgModal = () => {
    // TODO: Update OrganizationEditModal to accept OrganisationFullDto
    return openModal(
      ModalId.ORGANIZATION_EDIT_MODAL,
      <OrganizationEditModal organization={organization as unknown as V2OrganisationRead | undefined} />
    );
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
              backgroundImage: `url('${logoUrl ?? "/images/pitch-placeholder.webp"}')`
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
            {organization?.name ?? null}
          </Text>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              <Icon name={IconNames.MAP_PIN} width={13} height={18} />
              <Text variant="text-body-900">
                {formatOptionsList(countryOptions ?? [], organization?.hqCountry ? [organization.hqCountry] : [])}
              </Text>
            </div>
            <Text variant="text-body-900">
              {formatOptionsList(getOrganisationTypeOptions(t), organization?.type ?? undefined) ?? ""}
            </Text>
          </div>
        </div>
        <div className="flex translate-y-[-30px] transform gap-6">
          <IconSocial name={IconNames.SOCIAL_FACEBOOK} url={organization?.facebookUrl ?? undefined} />
          <IconSocial name={IconNames.SOCIAL_INSTAGRAM} url={organization?.instagramUrl ?? undefined} />
          <IconSocial name={IconNames.SOCIAL_LINKEDIN} url={organization?.linkedinUrl ?? undefined} />
          <IconSocial name={IconNames.SOCIAL_TWITTER} url={organization?.twitterUrl ?? undefined} />
          <IconSocial name={IconNames.EARTH} url={organization?.webUrl ?? undefined} />
        </div>
      </Container>
    </div>
  );
};

export default OrganizationHeader;
