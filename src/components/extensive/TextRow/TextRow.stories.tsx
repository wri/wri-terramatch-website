import { Meta, StoryObj } from "@storybook/react";

import Component from "./TextRow";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/TextRow",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    name: "Address",
    value: "Lonsdale Road 34, London"
  }
};
