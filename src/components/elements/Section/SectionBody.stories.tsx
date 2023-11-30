import { Meta, StoryObj } from "@storybook/react";

import FilePreviewCard from "@/components/elements/FilePreviewCard/FilePreviewCard";
import SectionEntryRow from "@/components/elements/Section/SectionEntryRow";
import Text from "@/components/elements/Text/Text";

import Component from "./SectionBody";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Section/Body",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: (
      <>
        <SectionEntryRow title="Objectives">
          <Text variant="text-heading-100">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet bibendum urna. Aenean tempus eget
            dolor a porttitor. Duis sodales aliquam mi, in commodo velit scelerisque nec. Maecenas vel lorem ac massa
            dapibus porttitor. Donec interdum elit arcu, nec fringilla ante consequat ac. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Morbi sit amet bibendum urna. Aenean tempus eget dolor a porttitor. Duis
            sodales aliquam mi, in commodo velit scelerisque nec. Maecenas vel lorem ac massa dapibus porttitor. Donec
            interdum elit arcu, nec fringilla ante consequat ac.
          </Text>
        </SectionEntryRow>
        <SectionEntryRow title="Country">
          <Text variant="text-heading-100">United States</Text>
        </SectionEntryRow>
        <SectionEntryRow title="County/District">
          <Text variant="text-heading-100">California</Text>
        </SectionEntryRow>
        <SectionEntryRow title="Detailed Project Budget">
          <FilePreviewCard
            file={{
              title: "Project Budget",
              url: "",
              collection_name: "",
              created_at: "",
              file_name: "",
              mime_type: "",
              size: 0,
              uuid: ""
            }}
          />
        </SectionEntryRow>
      </>
    )
  }
};
