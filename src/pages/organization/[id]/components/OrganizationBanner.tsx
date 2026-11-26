import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useGadmOptions } from "@/connections/Gadm";
import { useOrganisationMediaByCollection } from "@/connections/Organisation";
import { useOrganisationUserAssociations } from "@/connections/UserAssociation";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { useModalContext } from "@/context/modal.provider";
import { organisationExport } from "@/generated/v3/userService/userServiceComponents";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import { useDownloadToastMessages } from "@/hooks/translation/useDownloadToastMessages";
import OrganisationBanner, {
  OrganisationBannerProps
} from "@/redesignComponents/content/Banner/OrganisationBanner/OrganisationBanner";
import { runWithDownloadToast } from "@/utils/downloadToast";
import Log from "@/utils/log";
import { formatOptionsList } from "@/utils/options";

import OrganizationEditModal from "./edit/OrganizationEditModal";
import InviteTeamMemberModal from "./InviteTeamMemberModal";

const MAX_TEAM_AVATARS = 5;

export interface OrganizationBannerProps extends Omit<OrganisationBannerProps, "header"> {
  organization?: OrganisationFullDto;
  gotoTeamMembers: () => void;
}

const OrganizationBanner: FC<OrganizationBannerProps> = ({ organization, gotoTeamMembers, ...bannerProps }) => {
  const t = useT();
  const { query } = useRouter();
  const { openModal } = useModalContext();
  const countryOptions = useGadmOptions({ level: 0 });
  const downloadToastMessages = useDownloadToastMessages();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const showEditOrgModal = useCallback(
    () => openModal(ModalId.ORGANIZATION_EDIT_MODAL, <OrganizationEditModal organization={organization} />),
    [openModal, organization]
  );

  useEffect(() => {
    if (query.modal === "edit") {
      showEditOrgModal();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.edit]);

  const downloadProfile = useCallback(async () => {
    if (organization == null) return;

    try {
      await runWithDownloadToast(
        {
          downloading: t("Downloading Organization Profile"),
          complete: downloadToastMessages.complete,
          error: downloadToastMessages.error
        },
        () => organisationExport.downloadFile({ pathParams: { uuid: organization.uuid } }),
        "exportToast"
      );
    } catch (error) {
      Log.error("Error exporting organisation profile", error);
    }
  }, [downloadToastMessages, organization, t]);

  const openInviteModal = useCallback(() => setShowInviteModal(true), []);
  const closeInviteModal = useCallback(() => setShowInviteModal(false), []);

  const [, { media: logoMedia }] = useOrganisationMediaByCollection({
    organisationUuid: organization?.uuid ?? "",
    collectionName: "logo"
  });
  const [, { data: approvedUsers }] = useOrganisationUserAssociations({
    organisationUuid: organization?.uuid ?? "",
    status: "approved"
  });

  const team = useMemo(
    () =>
      (approvedUsers ?? []).slice(0, MAX_TEAM_AVATARS).map(({ fullName }) => ({
        name: fullName,
        avatar: { name: fullName }
      })),
    [approvedUsers]
  );

  const hqCountry = organization?.hqCountry;
  const organisationType = organization?.type;
  const foundingDate = organization?.foundingDate;

  return (
    <>
      <OrganisationBanner
        {...bannerProps}
        header={{
          name: organization?.name ?? t("Organization"),
          logoSrc: logoMedia[0]?.url ?? undefined,
          organisationType:
            organisationType == null ? undefined : formatOptionsList(getOrganisationTypeOptions(t), organisationType),
          country: hqCountry == null ? undefined : formatOptionsList(countryOptions ?? [], [hqCountry]),
          countryCode: hqCountry ?? undefined,
          foundedYear: foundingDate == null ? undefined : new Date(foundingDate).getFullYear().toString(),
          websiteUrl: organization?.webUrl ?? undefined,
          team,
          isDownloadDisabled: organization == null,
          onEditClick: showEditOrgModal,
          onDownloadClick: downloadProfile,
          onAddTeamClick: openInviteModal,
          gotoTeamMembers
        }}
      />
      {organization != null && (
        <InviteTeamMemberModal organisationUUID={organization.uuid} open={showInviteModal} onClose={closeInviteModal} />
      )}
    </>
  );
};

export default OrganizationBanner;
