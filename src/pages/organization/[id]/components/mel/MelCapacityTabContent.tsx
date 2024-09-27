import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import Container from "@/components/generic/Layout/Container";
import { useModalContext } from "@/context/modal.provider";
import { V2OrganisationRead } from "@/generated/apiSchemas";

import BuildStrongerProfile from "../BuildStrongerProfile";
import OrganizationEditModal from "../edit/OrganizationEditModal";

type MelCapacityTabContentProps = {
  organization?: V2OrganisationRead;
};

const MelCapacityTabContent = ({ organization }: MelCapacityTabContentProps) => {
  const t = useT();
  const { openModal } = useModalContext();

  return (
    <Container className="py-15">
      <Text variant="text-heading-2000">{t("Monitoring Evaluation and Learning (MEL) Capacity")}</Text>
      <BuildStrongerProfile
        subtitle={t(
          "Organizational Profiles with Monitoring and Learning (MEL) Capacity information are more likely to be successful in Funding Applications."
        )}
        onEdit={() => openModal(ModalId.ORGANIZATION_EDIT_MODAL, <OrganizationEditModal organization={organization} />)}
        steps={[
          {
            showWhen: true,
            title: t("Monitoring and evaluation experience"),
            subtitle:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet bibendum urna. Aenean tempus eget dolor a porttitor."
          },
          {
            showWhen: true,
            title: t("Monitoring Indicators collected for past projects"),
            subtitle:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet bibendum urna. Aenean tempus eget dolor a porttitor."
          }
        ]}
      />
    </Container>
  );
};

export default MelCapacityTabContent;
