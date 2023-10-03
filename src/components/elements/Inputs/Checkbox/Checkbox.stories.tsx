import { Meta, StoryObj } from "@storybook/react";

import Component from "./Checkbox";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/Checkbox",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Unchecked: Story = {
  args: {
    label: "Unchecked Checkbox"
  }
};

export const Checked: Story = {
  args: {
    label: "Checked Checkbox",
    checked: true
  }
};
