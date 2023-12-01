import { Meta, StoryObj } from "@storybook/react";

import Component from "./ReadMoreText";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ReadMoreText",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: "Some really long text with something to line clamp and then eventually read more",
    className: "max-w-[100px]"
  }
};
