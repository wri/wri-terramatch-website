import { Meta, StoryObj } from "@storybook/react";

import Component from "./TextArea";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/TextArea",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: "Input Label",
    placeholder: "Input placeholder",
    description: "Input description"
  }
};
