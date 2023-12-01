import { Meta, StoryObj } from "@storybook/react";

import Component from "./ButtonField";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Fields/ButtonField",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: "2023 Report",
    buttonProps: {
      children: "View"
    }
  }
};
