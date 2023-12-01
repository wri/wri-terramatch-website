import { Meta, StoryObj } from "@storybook/react";

import Component from "./FundingsCarouselList";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/FundingOpportunities",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Funding Opportunities",
    items: [
      {
        title: "TerraFund for AFR100: Landscapes ",
        description:
          "The funding application is designed for restoration projects in Africa. This application provides an opportunity for project developers to seek financial support for their restoration initiatives across the African continent.",

        location: "London, United Kingdom",
        status: "active",
        primaryLink: "#",
        secondaryLink: "#"
      },
      {
        title: "TerraFund for AFR100: Landscapes ",
        description:
          "The funding application is designed for restoration projects in Africa. This application provides an opportunity for project developers to seek financial support for their restoration initiatives across the African continent.",

        location: "London, United Kingdom",
        status: "coming-soon",
        primaryLink: "#",
        secondaryLink: "#"
      },
      {
        title: "TerraFund for AFR100: Landscapes ",
        description:
          "The funding application is designed for restoration projects in Africa. This application provides an opportunity for project developers to seek financial support for their restoration initiatives across the African continent.",

        location: "London, United Kingdom",
        status: "inactive",
        primaryLink: "#",
        secondaryLink: "#"
      },
      {
        title: "TerraFund for AFR100: Landscapes ",
        description:
          "The funding application is designed for restoration projects in Africa. This application provides an opportunity for project developers to seek financial support for their restoration initiatives across the African continent.",

        location: "London, United Kingdom",
        status: "active",
        primaryLink: "#",
        secondaryLink: "#"
      }
    ]
  }
};
