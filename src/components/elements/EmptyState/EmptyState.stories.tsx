import { Meta, StoryObj } from "@storybook/react";

import Component from "./EmptyState";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/EmptyState",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {}
};
