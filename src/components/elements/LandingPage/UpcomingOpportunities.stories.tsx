import { Meta, StoryObj } from "@storybook/react";

import Component from "./UpcomingOpportunities";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/LandingPage/UpcomingOpportunities",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Upcoming Opportunities in TerraMatch",
    items: [
      {
        title: "Land Accelerator Africa 2022",
        buttonText: "Find out more",
        buttonLink: "/",
        className: "bg-landAcceleratorAfricaThumb"
      },
      {
        title: "Terramatch RFP",
        buttonText: "Find out more",
        buttonLink: "/",
        className: "bg-terrafundRFPThumb"
      },
      {
        title: "Land Accelerator fund",
        buttonText: "Find out more",
        buttonLink: "/",
        className: "bg-landAcceleratorThumb"
      }
    ]
  }
};
