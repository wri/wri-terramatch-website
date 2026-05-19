import type { Meta, StoryObj } from "@storybook/react";

import NotificationIndicator from "./NotificationIndicator";

const meta = {
  title: "Redesign Components/Navigation/NotificationIndicator",
  component: NotificationIndicator,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Notification count or label"
    },
    variant: {
      control: "select",
      options: ["neutral", "alert"],
      description: "Background color variant"
    }
  }
} satisfies Meta<typeof NotificationIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "3",
    variant: "neutral"
  }
};

export const Alert: Story = {
  args: {
    children: "1",
    variant: "alert"
  }
};

export const VariantComparison: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <NotificationIndicator variant="neutral">3</NotificationIndicator>
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", color: "#6B7280" }}>Neutral</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <NotificationIndicator variant="alert">1</NotificationIndicator>
        <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", color: "#6B7280" }}>Alert</p>
      </div>
    </div>
  )
};
