import { Meta, StoryObj } from "@storybook/react";

import Component from "./LoadingContainerOpacity";

const meta: Meta<typeof Component> = {
  title: "Components/Generic/LoadingContainerOpacity",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    loading: true,
    children: <div>Child component</div>
  }
};
