import { useT } from "@transifex/react";
import _ from "lodash";
import { FC, useMemo } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import Container from "@/components/generic/Layout/Container";
import { useOrganisationMedia } from "@/connections/Organisation";
import { useModalContext } from "@/context/modal.provider";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import PastCommunityExperience from "@/pages/organization/[id]/components/overview/PastCommunityExperience";
import TeamAndResources from "@/pages/organization/[id]/components/overview/TeamAndResources";
import { UploadedFile } from "@/types/common";

import BuildStrongerProfile from "../BuildStrongerProfile";
import OrganizationEditModal from "../edit/OrganizationEditModal";
import Files from "../Files";
import About from "./About";
import PastRestorationExperience from "./PastRestorationExperience";

type OverviewTabContentProps = {
  organization?: OrganisationFullDto;
};

const OverviewTabContent: FC<OverviewTabContentProps> = ({ organization }) => {
  const t = useT();
  const { openModal } = useModalContext();

  const [, { media: allMediaFiles }] = useOrganisationMedia({
    organisationUuid: organization?.uuid ?? ""
  });

  const mediaFiles = useMemo(() => {
    return allMediaFiles.filter(media =>
      ["reference", "additional", "op_budget_2year", "legal_registration", "previous_annual_reports"].includes(
        media.collectionName ?? ""
      )
    );
  }, [allMediaFiles]);

  const files: UploadedFile[] = useMemo(() => {
    return mediaFiles
      .filter(
        media =>
          media.url != null &&
          media.uuid != null &&
          media.fileName != null &&
          media.size != null &&
          ["reference", "additional", "op_budget_2year", "legal_registration"].includes(media.collectionName)
      )
      .map(media => {
        const uploadedFile: UploadedFile = {
          uuid: media.uuid,
          url: media.url ?? "",
          thumbUrl: media.thumbUrl ?? undefined,
          size: media.size,
          fileName: media.fileName,
          mimeType: media.mimeType ?? "",
          createdAt: media.createdAt,
          collectionName: media.collectionName,
          isPublic: media.isPublic ?? undefined,
          isCover: media.isCover ?? undefined,
          lat: media.lat ?? undefined,
          lng: media.lng ?? undefined
        };
        return uploadedFile;
      });
  }, [mediaFiles]);

  const previousAnnualReportsFiles: UploadedFile[] = useMemo(() => {
    return mediaFiles
      .filter(
        media =>
          media.url != null &&
          media.uuid != null &&
          media.fileName != null &&
          media.size != null &&
          media.collectionName === "previous_annual_reports"
      )
      .map(media => {
        const uploadedFile: UploadedFile = {
          uuid: media.uuid,
          url: media.url ?? "",
          thumbUrl: media.thumbUrl ?? undefined,
          size: media.size,
          fileName: media.fileName,
          mimeType: media.mimeType ?? "",
          createdAt: media.createdAt,
          collectionName: media.collectionName,
          isPublic: media.isPublic ?? undefined,
          isCover: media.isCover ?? undefined,
          lat: media.lat ?? undefined,
          lng: media.lng ?? undefined
        };
        return uploadedFile;
      });
  }, [mediaFiles]);

  /**
   * Checks if there are incomplete steps (Build a Stronger Profile section).
   * @returns boolean
   */
  const incompleteSteps = useMemo(() => {
    if (organization == null) {
      return {
        pastRestorationExperience: true,
        legitimacy: true
      };
    }

    const pastRestorationExperience = {
      haRestoredTotal: organization.haRestoredTotal,
      haRestored3Year: organization.haRestored3Year,
      treesGrownTotal: organization.treesGrownTotal,
      treesGrown3Year: organization.treesGrown3Year
    };

    const hasLegitimacyFiles = mediaFiles.some(
      media => media.collectionName === "reference" || media.collectionName === "legal_registration"
    );
    return {
      pastRestorationExperience: !_.every(pastRestorationExperience, _.isFinite),
      legitimacy: !hasLegitimacyFiles
    };
  }, [organization, mediaFiles]);

  const showIncompleteStepsSection = _.values(incompleteSteps).includes(true);

  return (
    <Container className="py-15">
      <div className="flex items-center gap-5">
        <Text variant="text-heading-2000">{t("Overview")}</Text>
        <Icon name={IconNames.INFO_CIRCLE} width={24} height={24} className="fill-neutral-800" />
      </div>
      {/* About */}
      <About organization={organization} />
      {/* Past Restoration Experience */}
      {!incompleteSteps.pastRestorationExperience && <PastRestorationExperience organization={organization} />}
      {/* Previous Annual Reports */}
      {previousAnnualReportsFiles.length > 0 && (
        <Files title={t("Monitoring reports from past projects:")} files={previousAnnualReportsFiles} />
      )}
      <PastCommunityExperience organization={organization} />
      <TeamAndResources organization={organization} />
      {/* Files */}
      {!incompleteSteps.legitimacy && (
        <Files title={t("Proof of legally registered, letter of references and additional documents.")} files={files} />
      )}
      {/* Build a Stronger Profile */}
      {showIncompleteStepsSection && (
        <BuildStrongerProfile
          steps={[
            {
              showWhen: incompleteSteps.pastRestorationExperience,
              title: t("Past Restoration Experience"),
              subtitle: t("Including information about total hectares restored and previous restoration work.")
            },
            {
              showWhen: incompleteSteps.legitimacy,
              title: t("Organization legitimacy"),
              subtitle: t("Include a copy of your proof of legally incorporated an letters of reference.")
            }
          ]}
          subtitle={t(
            "Organizational Profiles with overview information are more likely to be successful in Funding Applications."
          )}
          onEdit={() =>
            openModal(ModalId.ORGANIZATION_EDIT_MODAL, <OrganizationEditModal organization={organization} />)
          }
        />
      )}
    </Container>
  );
};

export default OverviewTabContent;
