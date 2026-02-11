import { useT } from "@transifex/react";
import _ from "lodash";
import { useMemo } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import Container from "@/components/generic/Layout/Container";
import { useModalContext } from "@/context/modal.provider";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import PastCommunityExperience from "@/pages/organization/[id]/components/overview/PastCommunityExperience";
import TeamAndResources from "@/pages/organization/[id]/components/overview/TeamAndResources";

import BuildStrongerProfile from "../BuildStrongerProfile";
import OrganizationEditModal from "../edit/OrganizationEditModal";
import Files from "../Files";
import About from "./About";
import PastRestorationExperience from "./PastRestorationExperience";

type OverviewTabContentProps = {
  organization?: OrganisationFullDto;
};

const OverviewTabContent = ({ organization }: OverviewTabContentProps) => {
  const t = useT();
  const { openModal } = useModalContext();

  /**
   * Checks if there are incomplete steps (Build a Stronger Profile section).
   * @returns boolean
   */
  const incompleteSteps = useMemo(() => {
    const pastRestorationExperience = organization
      ? {
          haRestoredTotal: organization.haRestoredTotal,
          haRestored3Year: organization.haRestored3Year,
          treesGrownTotal: organization.treesGrownTotal,
          treesGrown3Year: organization.treesGrown3Year
          // treeCareApproach: organization.treeCareApproach // !Enable this in next release
        }
      : {};

    // Note: reference and legal_registration may not be in v3 DTO - these might be sideloaded or in a different structure
    // For now, we'll check if they exist as any properties
    const legitimacy = organization
      ? {
          reference: (organization as any)?.reference,
          legal_registration: (organization as any)?.legal_registration
        }
      : {};

    return {
      pastRestorationExperience: _.some(
        pastRestorationExperience,
        value => value == null || (typeof value === "number" && isNaN(value))
      ),
      legitimacy: _.some(legitimacy, _.isEmpty)
    };
  }, [organization]);

  const showIncompleteStepsSection = _.values(incompleteSteps).includes(true);

  const files: any[] = useMemo(() => {
    // Note: These fields may be sideloaded or in a different structure in v3
    return [
      ...((organization as any)?.reference ?? []),
      ...((organization as any)?.additional ?? []),
      ...((organization as any)?.op_budget_2year ?? []),
      ...((organization as any)?.legal_registration ?? [])
    ];
  }, [organization]);

  return (
    <Container className="py-15">
      <div className="flex items-center gap-5">
        <Text variant="text-heading-2000">{t("Overview")}</Text>
        <Icon name={IconNames.INFO_CIRCLE} width={24} height={24} className="fill-neutral-800" />
      </div>
      {/* About */}
      <About organization={organization} />
      {/* Past Restoration Experience */}
      <When condition={!incompleteSteps.pastRestorationExperience}>
        <PastRestorationExperience organization={organization} />
      </When>
      <When
        condition={
          !!(organization as any)?.previous_annual_reports && (organization as any).previous_annual_reports.length > 0
        }
      >
        <Files
          title={t("Monitoring reports from past projects:")}
          files={(organization as any)?.previous_annual_reports ?? []}
        />
      </When>
      <PastCommunityExperience organization={organization} />
      <TeamAndResources organization={organization} />
      {/* Files */}
      <When condition={!incompleteSteps.legitimacy}>
        <Files title={t("Proof of legally registered, letter of references and additional documents.")} files={files} />
      </When>
      {/* Build a Stronger Profile */}
      <When condition={showIncompleteStepsSection}>
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
      </When>
    </Container>
  );
};

export default OverviewTabContent;
