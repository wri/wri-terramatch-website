import { Flex } from "@chakra-ui/react";
import { FC } from "react";
import { TextInput } from "react-admin";
import { useFormContext } from "react-hook-form";

import AboutPageItemDisplay from "@/components/extensive/PageElements/AboutPageItem/AboutPageItemDisplay";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

const AboutSectionForm: FC = () => {
  const { watch } = useFormContext<AboutSectionDto>();
  return (
    <PageContent>
      <Flex gap={7} className="flex-row">
        <PageItem title="Edit About Section">
          <Flex className="flex-col bg-theme-neutral-100 p-5">
            <TextInput label="Header" source="header" />
          </Flex>
        </PageItem>
        <PageItem title="About Section Preview">
          <SimpleDivider />
          <AboutPageItemDisplay aboutSection={watch()} />
        </PageItem>
      </Flex>
    </PageContent>
  );
};

export default AboutSectionForm;
