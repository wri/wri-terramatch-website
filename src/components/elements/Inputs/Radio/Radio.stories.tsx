import { Meta, StoryObj } from "@storybook/react";

import Component from "./Radio";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/Radio",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: "Radio Label",
    checked: true
  }
};
