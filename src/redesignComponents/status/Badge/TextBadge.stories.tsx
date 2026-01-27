import type { Meta, StoryObj } from "@storybook/react";

import TextBadge from "./TextBadge";

const meta = {
  title: "Redesign Components/Status/TextBadge",
  component: TextBadge,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "The visual variant of the badge"
    },
    children: {
      control: "text",
      description: "The content to display inside the badge"
    }
  }
} satisfies Meta<typeof TextBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "New",
    variant: "primary"
  }
};

export const Secondary: Story = {
  args: {
    children: "Draft",
    variant: "secondary"
  }
};
