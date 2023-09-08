import { Meta, StoryObj } from "@storybook/react";

import Component, { IconNames } from "./Icon";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Icon",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    name: IconNames.PLUS,
    width: 40,
    height: 40,
    className: "fill-primary-500"
  }
};
