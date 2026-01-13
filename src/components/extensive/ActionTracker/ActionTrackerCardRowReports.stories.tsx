import { Meta, StoryObj } from "@storybook/react";

import { StatusEnum } from "@/components/elements/Status/constants/statusMap";

import Component from "./ActionTrackerCardRowReports";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/ActionTracker/CardRowReports",
  component: Component
};
export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "TerraFund for AFR100: Landscapes - Non Profits",
    subtitle: "<strong>Stage:</strong> Expression of Interest",
    status: StatusEnum.EDIT,
    statusText: "Draft",
    updatedAt: "Updated: 2024-01-15",
    updatedBy: "By: John Doe"
  }
};
