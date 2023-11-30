import { Meta, StoryObj } from "@storybook/react";

import Component from "./ProgressField";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Fields/ProgressField",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: "ProgressField",
    value: 35,
    limit: 100
  }
};
