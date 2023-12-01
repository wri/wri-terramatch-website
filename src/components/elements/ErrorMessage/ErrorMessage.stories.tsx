import { Meta, StoryObj } from "@storybook/react";

import Component, { ErrorMessageProps as Props } from "./ErrorMessage";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ErrorMessage",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  render: (args: Props) => (
    <div className="relative">
      <Component {...args} />
    </div>
  ),
  args: {
    error: {
      message: "This field is required",
      type: "required"
    }
  }
};
