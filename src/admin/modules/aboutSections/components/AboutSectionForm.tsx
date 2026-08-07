import { Flex } from "@chakra-ui/react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FC } from "react";
import { ArrayInput, SelectArrayInput, SelectInput, TextInput } from "react-admin";
import { useFormContext } from "react-hook-form";

import { AccordionFormIterator } from "@/admin/components/AccordionFormIterator/AccordionFormIterator";
import { AddItemButton, RemoveItemButton } from "@/admin/components/AccordionFormIterator/AccordionFormIteratorButtons";
import SemanticHtmlInput from "@/admin/modules/aboutSections/components/SemanticHtmlInput";
import { SECTION_TYPE_CHOICES } from "@/admin/modules/aboutSections/util";
import AboutPageItemDisplay from "@/components/extensive/PageElements/AboutPageItem/AboutPageItemDisplay";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

const provideDefaults = (formData: Partial<AboutSectionDto>): AboutSectionDto => ({
  id: formData.id ?? "",
  type: formData.type ?? "project",
  frameworks: formData.frameworks ?? null,
  header: formData.header ?? "<empty header>",
  title: formData.title ?? null,
  description: formData.description ?? "&lt;empty description&gt;",
  contactSupportMessage: formData.contactSupportMessage ?? "<empty contact support message>",
  contactSupportSubject: formData.contactSupportSubject ?? "<empty contact support subject>",
  links: formData.links ?? []
});

const AboutSectionForm: FC = () => {
  const { watch } = useFormContext<Partial<AboutSectionDto>>();
  const sectionType = watch("type");
  const frameworkChoices = useFrameworkChoices();
  return (
    <PageContent>
      <Flex gap={7} className="flex-row">
        <PageItem title="Edit Form">
          <Flex className="flex-col bg-theme-neutral-100 p-5">
            <SelectInput
              label="Section Type"
              source="type"
              choices={SECTION_TYPE_CHOICES}
              fullWidth
              disabled={sectionType != null}
            />
            {sectionType == null ? null : (
              <>
                <SelectArrayInput
                  label="Frameworks"
                  source="frameworks"
                  choices={frameworkChoices}
                  fullWidth
                  helperText="If you choose frameworks that already have an override, an error will be generated on save."
                />
                <TextInput label="Header" source="header" />
                <TextInput label="Title" source="title" />
                <SemanticHtmlInput label="Description" source="description" />
                <TextInput
                  label="Contact Support Subject"
                  source="contactSupportSubject"
                  helperText="Email Subject Line"
                />
                <TextInput label="Contact Support Message" source="contactSupportMessage" />
                <ArrayInput source="links" label="Helpful Links">
                  <AccordionFormIterator
                    accordionSummaryTitle={(index, links) =>
                      `Link ${index + 1} of ${links.length} (${links[index].title})`
                    }
                    addButton={<AddItemButton variant="contained" label="Add Link" />}
                    removeButton={
                      <RemoveItemButton
                        variant="text"
                        label="Delete Link"
                        modalTitle="Delete Link"
                        modalContent="Are you sure you want to delete this link?"
                      >
                        <DeleteIcon />
                      </RemoveItemButton>
                    }
                  >
                    <TextInput source="title" label="Title" fullWidth className="m-0" />
                    <TextInput source="url" label="URL" fullWidth className="m-0" />
                  </AccordionFormIterator>
                </ArrayInput>
              </>
            )}
          </Flex>
        </PageItem>
        <PageItem title="Preview">
          <SimpleDivider />
          <AboutPageItemDisplay aboutSection={provideDefaults(watch())} />
        </PageItem>
      </Flex>
    </PageContent>
  );
};

export default AboutSectionForm;
