import { Meta, StoryObj } from "@storybook/react";

import Component from "./ActionTrackerCardRow";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/ActionTracker/CardRow",
  component: Component
};
export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "TerraFund for AFR100: Landscapes - Non Profits",
    subtitle: "<strong>Stage:</strong> Expression of Interest",
    status: "edit",
    statusText: "Draft",
    ctaText: "Continue Draft",
    ctaLink: "/"
  }
};
