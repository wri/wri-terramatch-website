import { Meta, StoryObj } from "@storybook/react";

import Component from "./Input";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/Input",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    type: "text",
    label: "Input Label",
    placeholder: "Input placeholder",
    description: "Input description"
  }
};

export const Error: Story = {
  args: {
    type: "text",
    label: "Input Label",
    placeholder: "Input placeholder",
    description: "Input description",
    error: { type: "required", message: "Field Required" }
  }
};

export const Disabled: Story = {
  args: {
    type: "text",
    label: "Input Label",
    placeholder: "Input placeholder",
    description: "Input description",
    disabled: true
  }
};
