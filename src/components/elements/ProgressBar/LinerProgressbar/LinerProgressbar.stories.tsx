import { Meta, StoryObj } from "@storybook/react";

import Component from "./LinerProgressbar";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ProgressBar",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    color: "primary",
    value: 50
  }
};

export const Secondary = {
  args: {
    color: "secondary",
    value: 50
  }
};

export const Tertiary: Story = {
  args: {
    color: "tertiary",
    value: 50
  }
};

export const Success: Story = {
  args: {
    color: "success",
    value: 50
  }
};

export const Error: Story = {
  args: {
    color: "error",
    value: 50
  }
};
