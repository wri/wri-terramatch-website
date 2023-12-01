import { Meta, StoryObj } from "@storybook/react";

import Component from "./TextField";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Fields/SelectImageListField",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: "Metric",
    value: "1,000"
  }
};
