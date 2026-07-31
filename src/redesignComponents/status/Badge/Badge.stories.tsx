import { HStack, Text, VStack } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

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
    },
    size: {
      control: "select",
      options: ["small", "large"],
      description: "Size of the notification indicator and count"
    },
    children: {
      control: false,
      description: "Custom icon that replaces the default notification icon"
    },
    labels: {
      control: false,
      description: "Localization overrides for badge aria labels"
    }
  }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const Small: Story = {
  args: {
    size: "small",
    hasNotification: true,
    notificationCount: 5
  }
};

export const Large: Story = {
  args: {
    size: "large",
    hasNotification: true,
    notificationCount: 5
  }
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

export const NotificationCountWithLabel: Story = {
  args: {
    label: "Label",
    hasNotification: true,
    notificationCount: 5
  }
};

export const WithCustomIcon: Story = {
  args: {
    hasNotification: true,
    notificationCount: 3,
    size: "large",
    children: <PlaceholderIcon color="currentColor" className="h-6 w-6" />
  }
};

export const SizeComparison: Story = {
  render: () => (
    <HStack gap={8} alignItems="flex-end">
      <VStack gap={2}>
        <Badge size="small" hasNotification notificationCount={5} />
        <Text textStyle="200">Small</Text>
      </VStack>
      <VStack gap={2}>
        <Badge size="large" hasNotification notificationCount={5} />
        <Text textStyle="200">Large</Text>
      </VStack>
      <VStack gap={2}>
        <Badge size="small" hasNotification notificationCount={99} label="Label" />
        <Text textStyle="200">Small + label</Text>
      </VStack>
      <VStack gap={2}>
        <Badge size="large" hasNotification notificationCount={99} label="Label" />
        <Text textStyle="200">Large + label</Text>
      </VStack>
    </HStack>
  )
};

export const AllVariants: Story = {
  render: () => (
    <HStack gap={4} flexWrap="wrap">
      <Badge />
      <Badge hasNotification />
      <Badge size="small" hasNotification notificationCount={3} />
      <Badge size="large" hasNotification notificationCount={42} />
      <Badge size="large" hasNotification={false} label="Label" />
      <Badge size="small" hasNotification notificationCount={2}>
        <PlaceholderIcon color="currentColor" className="h-4 w-4" />
      </Badge>
    </HStack>
  )
};
