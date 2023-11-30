import { Meta, StoryObj } from "@storybook/react";

import Component from "./BackgroundLayout";

const meta: Meta<typeof Component> = {
  title: "Components/Generic/Layouts/BackgroundLayout",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: <div className="h-[400px]" />
  }
};
