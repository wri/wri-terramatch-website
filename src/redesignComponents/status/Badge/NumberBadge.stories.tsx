import { Grid, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import NumberBadge from "./NumberBadge";

const meta = {
  title: "Redesign Components/Status/NumberBadge",
  component: NumberBadge,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    count: {
      control: { type: "number", min: 0 },
      description: "Number to display. Counts above 99 render as 99+ and nothing renders when it is 0 or less"
    },
    variant: {
      control: "select",
      options: ["notification", "information"],
      description: "Color treatment of the badge"
    },
    size: {
      control: "select",
      options: ["small", "large"],
      description: "Size of the badge, matching the count bubble sizes of the Badge component"
    },
    ariaLabel: {
      control: "text",
      description: "Describes the count for screen readers, needed because counts above 99 render as 99+"
    }
  }
} satisfies Meta<typeof NumberBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 5
  }
};

export const Notification: Story = {
  args: {
    count: 5,
    variant: "notification"
  }
};

export const Information: Story = {
  args: {
    count: 5,
    variant: "information"
  }
};

export const Small: Story = {
  args: {
    count: 5,
    size: "small"
  }
};

export const HighCount: Story = {
  args: {
    count: 9999,
    ariaLabel: "9999 unread comments"
  }
};

export const AllVariants: Story = {
  args: {
    count: 999
  },
  render: () => (
    <Grid templateColumns="auto auto auto" gap={6} alignItems="center" justifyItems="center">
      <div />
      <Text textStyle="300">Small</Text>
      <Text textStyle="300">Large</Text>

      <Text textStyle="300">Notification</Text>
      <NumberBadge count={999} size="small" variant="notification" />
      <NumberBadge count={999} size="large" variant="notification" />

      <Text textStyle="300">Information</Text>
      <NumberBadge count={999} size="small" variant="information" />
      <NumberBadge count={999} size="large" variant="information" />
    </Grid>
  )
};
