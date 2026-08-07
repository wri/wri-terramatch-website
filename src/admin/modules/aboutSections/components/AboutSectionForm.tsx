import { Flex } from "@chakra-ui/react";
import { FC } from "react";
import { SelectArrayInput, SelectInput, TextInput } from "react-admin";
import { useFormContext } from "react-hook-form";

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
