import { Meta, StoryObj } from "@storybook/react";

import Component, { NotificationProps as Props } from "./Notification";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Notification",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Success: Story = {
  render: (args: Props) => (
    <div className="p-10">
      <Component {...args} />
    </div>
  ),
  args: {
    title: "Success! Your notes were just saved!",
    message: "Your notes were just saved!",
    type: "success",
    open: true
  }
};

export const Error: Story = {
  render: (args: Props) => (
    <div className="p-10">
      <Component {...args} />
    </div>
  ),
  args: {
    title: "Your critical message - make it short",
    message: "Describe the event and give further instruction if needed, including links to other pages.",
    type: "error",
    open: true
  }
};

export const Warning: Story = {
  render: (args: Props) => (
    <div className="p-10">
      <Component {...args} />
    </div>
  ),
  args: {
    title: "Your polygon has been edited. Run a validation check.",
    message: "This is required for site approval.",
    type: "warning",
    open: true
  }
};
