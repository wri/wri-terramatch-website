import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";
import Container from "@/components/generic/Layout/Container";
import { useModalContext } from "@/context/modal.provider";
import { V2OrganisationRead } from "@/generated/apiSchemas";

import BuildStrongerProfile from "../BuildStrongerProfile";
import OrganizationEditModal from "../edit/OrganizationEditModal";

type SocialImpactTabContentProps = {
  organization?: V2OrganisationRead;
};

const SocialImpactTabContent = ({ organization }: SocialImpactTabContentProps) => {
  const t = useT();
  const { openModal } = useModalContext();

  return (
    <Container className="py-15">
      <Text variant="text-heading-2000">{t("Social Impact & Integration")}</Text>
      <BuildStrongerProfile
        subtitle={t(
          "Organizational Profiles with team information are more likely to be successful in Funding Applications."
        )}
        onEdit={() => openModal(<OrganizationEditModal organization={organization} />)}
        steps={[
          {
            showWhen: true,
            title: t("Social Impact & Integration"),
            subtitle:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet bibendum urna. Aenean tempus eget dolor a porttitor."
          }
        ]}
      />
    </Container>
  );
};

export default SocialImpactTabContent;
