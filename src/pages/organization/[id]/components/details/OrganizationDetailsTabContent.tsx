import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import EntryDefaultValueRenderer from "@/components/extensive/PageElements/PageContent/components/EntryDefaultValueRenderer";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { EditIcon } from "@/redesignComponents/foundations/Icons";

import { useOrganizationEditModal } from "../edit/useOrganizationEditModal";
import { useOrganisationFormSections } from "./useOrganisationFormSections";

type OrganizationDetailsTabContentProps = {
  organization?: OrganisationFullDto;
};

const OrganizationDetailsTabContent: FC<OrganizationDetailsTabContentProps> = ({ organization }) => {
  const t = useT();
  const sections = useOrganisationFormSections();
  const handleEdit = useOrganizationEditModal(organization);

  return (
    <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
      {sections.map(({ id, title, completed, entries }, index) => (
        <Accordion
          key={id}
          defaultOpen={index === 0}
          header={<AccordionHeader title={title} status={completed ? "complete" : undefined} />}
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
              <Flex key={entry.name ?? entry.title} direction="column" gap={1}>
                <Text textStyle="300-bold" color="primary.900">
                  {t("{label}:", { label: entry.title })}
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
