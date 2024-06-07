import { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

import Notification, { NotificationProps as Props } from "./Notification";

export default {
  title: "Components/Elements/Notification",
  component: Notification
} as Meta;

type Story = StoryObj<typeof Notification>;

const withPortalRoot = (Story: React.ComponentType<Props>, args: Props) => {
  useEffect(() => {
    let NotificationRoot = args.portalRootId ? document.getElementById(args.portalRootId) : null;
    NotificationRoot = NotificationRoot ?? document.createElement("div");
    if (!NotificationRoot) {
      NotificationRoot = document.createElement("div");
      NotificationRoot.setAttribute("id", args.portalRootId ?? "");
      document.body.appendChild(NotificationRoot);
    }
  }, []);

  return <Story {...args} />;
};

export const Success: Story = {
  render: (args: Props) => withPortalRoot(Notification, args),
  args: {
    title: "Success! Your notes were just saved!",
    message: "Your notes were just saved!",
    type: "success",
    open: true,
    portalRootId: "notification-root"
  }
};

export const Error: Story = {
  render: (args: Props) => withPortalRoot(Notification, args),
  args: {
    title: "Your critical message - make it short",
    message: "Describe the event and give further instruction if needed, including links to other pages.",
    type: "error",
    open: true,
    portalRootId: "notification-root"
  }
};

export const Warning: Story = {
  render: (args: Props) => withPortalRoot(Notification, args),
  args: {
    title: "Your polygon has been edited. Run a validation check.",
    message: "This is required for site approval.",
    type: "warning",
    open: true,
    portalRootId: "notification-root"
  }
};
