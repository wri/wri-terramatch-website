import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
const fn = () => () => {};

import Password from "./Password";

const meta = {
  title: "Redesign Components/Forms/Input/Password",
  component: Password,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onChange: fn() },
  decorators: [
    (Story: any) => (
      <div style={{ width: "480px" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Password>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    required: true
  }
};

export const RulesDisabled: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    disabledRules: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      specialCharacters: true
    },
    required: true
  }
};

export const CustomMinCharacters: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    minLength: 10,
    required: true
  }
};

export const NoValidations: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    hideValidations: true,
    required: true
  }
};
