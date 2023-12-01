import { Meta, StoryObj } from "@storybook/react";

import Component from "./SectionHeader";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Section/Header",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Objectives",
    ctaProps: {
      children: "View more"
    }
  }
};
