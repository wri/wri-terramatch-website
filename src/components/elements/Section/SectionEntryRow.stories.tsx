import { Meta, StoryObj } from "@storybook/react";

import Text from "@/components/elements/Text/Text";

import Component from "./SectionEntryRow";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Section/EntryRow",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Objectives",
    children: (
      <Text variant="text-heading-100">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet bibendum urna. Aenean tempus eget dolor
        a porttitor. Duis sodales aliquam mi, in commodo velit scelerisque nec. Maecenas vel lorem ac massa dapibus
        porttitor. Donec interdum elit arcu, nec fringilla ante consequat ac. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Morbi sit amet bibendum urna. Aenean tempus eget dolor a porttitor. Duis sodales aliquam mi, in
        commodo velit scelerisque nec. Maecenas vel lorem ac massa dapibus porttitor. Donec interdum elit arcu, nec
        fringilla ante consequat ac.
      </Text>
    )
  }
};
