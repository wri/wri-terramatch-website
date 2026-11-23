import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import EntryDefaultValueRenderer from "@/components/extensive/PageElements/PageContent/components/EntryDefaultValueRenderer";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { useModalContext } from "@/context/modal.provider";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { EditIcon } from "@/redesignComponents/foundations/Icons";

import OrganizationEditModal from "../edit/OrganizationEditModal";
import { MOCK_ORGANISATION_FORM_SECTIONS } from "./organizationDetails.mock";

export type OrganisationFormSection = {
  title: string;
  completed: boolean;
  entries: FormEntry[];
};

type OrganizationDetailsTabContentProps = {
  organization?: OrganisationFullDto;
};

const OrganizationDetailsTabContent: FC<OrganizationDetailsTabContentProps> = ({ organization }) => {
  const t = useT();
  const { openModal } = useModalContext();

  const sections = MOCK_ORGANISATION_FORM_SECTIONS;

  const handleEdit = useCallback(
    () => openModal(ModalId.ORGANIZATION_EDIT_MODAL, <OrganizationEditModal organization={organization} />),
    [openModal, organization]
  );

  return (
    <PageContent className="bg-theme-neutral-100 gap-2 sm:px-32">
      {sections.map(({ title, completed, entries }, index) => (
        <Accordion
          key={title}
          defaultOpen={index === 0}
          header={<AccordionHeader title={t(title)} status={completed ? "complete" : undefined} />}
          actions={
            <Button
              variant="secondary"
              size="small"
              leftIcon={completed ? <EditIcon boxSize={4} /> : undefined}
              onClick={handleEdit}
            >
              {completed ? t("Edit") : t("Add")}
            </Button>
          }
        >
          <Flex flexDirection="column" gap={3}>
            {entries.map(entry => (
              <Flex key={entry.title} direction="column" gap={1}>
                <Text textStyle="300-bold" color="primary.900">
                  {t(entry.title)}:
                </Text>
                <EntryDefaultValueRenderer entry={entry} />
              </Flex>
            ))}
          </Flex>
        </Accordion>
      ))}
    </PageContent>
  );
};

export default OrganizationDetailsTabContent;
