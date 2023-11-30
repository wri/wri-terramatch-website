import { Meta, StoryObj } from "@storybook/react";
import { IconNames } from "src/components/extensive/Icon/Icon";

import Component from "./CircularButton";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/CircularButton",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    iconName: IconNames.PLUS,
    iconClassName: "fill-black",
    color: "primary"
  }
};
