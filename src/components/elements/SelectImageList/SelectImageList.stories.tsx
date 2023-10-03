import { Meta, StoryObj } from "@storybook/react";

import { sustainableDevelopmentGoalsOptions } from "@/constants/options/sustainableDevelopmentGoals";

import Component from "./SelectImageList";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/SelectImageList",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    options: sustainableDevelopmentGoalsOptions(),
    selectedValues: [
      "no-poverty",
      "good-health-and-well-being",
      "quality-education",
      "affordable-and-clean-energy",
      "climate-action"
    ]
  }
};
