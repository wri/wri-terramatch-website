import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "@/components/extensive/Icon/Icon";

import Component from "./IconButton";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/IconButton",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;
export const _IconButton: Story = {
  args: {
    className: "h-11 w-11",
    iconProps: {
      name: IconNames.TRASH_CIRCLE,
      className: " fill-error",
      width: 24,
      height: 28
    }
  }
};
