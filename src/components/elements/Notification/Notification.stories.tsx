import { Meta, StoryObj } from "@storybook/react";

import Notification, { NotificationProps as Props } from "./Notification";

export default {
  title: "Components/Elements/Notification",
  component: Notification
} as Meta;

type Story = StoryObj<typeof Notification>;

export const Success: Story = {
  render: (args: Props) => (
    <div className="p-10">
      <Notification {...args} />
    </div>
  ),
  args: {
    title: "Success! Your notes were just saved!",
    message: "Your notes were just saved!",
    type: "success"
  }
};

export const Error: Story = {
  render: (args: Props) => (
    <div className="p-10">
      <Notification {...args} />
    </div>
  ),
  args: {
    title: "Your critical message - make it short",
    message: "Describe the event and give further instruction if needed, including links to other pages.",
    type: "error"
  }
};

export const Warning: Story = {
  render: (args: Props) => (
    <div className="p-10">
      <Notification {...args} />
    </div>
  ),
  args: {
    title: "Your polygon has been edited. Run a validation check.",
    message: "This is required for site approval.",
    type: "warning"
  }
};
