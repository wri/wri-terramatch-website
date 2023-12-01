import { Meta, StoryObj } from "@storybook/react";

import Component from "./UpcomingOpportunitiesCard";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/UpcomingOpportunitiesCard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {
    title: "Land Accelerator fund",
    buttonText: "Find out more",
    buttonLink: "/",
    className: "bg-landAcceleratorThumb"
  }
};
