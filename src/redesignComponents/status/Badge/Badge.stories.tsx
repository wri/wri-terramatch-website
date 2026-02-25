import { HStack } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import Badge from "./Badge";

const meta = {
  title: "Redesign Components/Status/Badge",
  component: Badge,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Text label displayed inside the badge"
    },
    notificationCount: {
      control: { type: "number", min: 0 },
      description: "Number to show as notification count"
    },
    hasNotification: {
      control: "boolean",
      description: "Whether the badge displays a notification indicator"
    }
  }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const WithNotification: Story = {
  args: {
    hasNotification: true
  }
};

export const WithNotificationCount: Story = {
  args: {
    notificationCount: 5,
    hasNotification: true
  }
};

export const WithHighCount: Story = {
  args: {
    notificationCount: 9999,
    hasNotification: true
  }
};

export const NotificationCountWitLabel: Story = {
  args: {
    label: "Label",
    hasNotification: true,
    notificationCount: 5
  }
};

export const AllVariants: Story = {
  render: () => (
    <HStack gap={4} flexWrap="wrap">
      <Badge />
      <Badge hasNotification={true} notificationCount={3} />
      <Badge hasNotification={true} notificationCount={42} />
      <Badge hasNotification={false} />
    </HStack>
  )
};
