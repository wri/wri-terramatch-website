import { Meta, StoryObj } from "@storybook/react";

import Component from "./PasswordStrength";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/PasswordStrength",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    password: "somecoolpassword123"
  }
};
