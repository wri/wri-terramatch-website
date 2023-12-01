import { Meta, StoryObj } from "@storybook/react";

import Component from "./Paper";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Paper",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: <p>Paper content</p>
  }
};
