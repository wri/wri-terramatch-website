import { Meta, StoryObj } from "@storybook/react";

import Component from "./FundingCard";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/FundingCard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => {
      return (
        <div className="w-[378px]">
          <Story />
        </div>
      );
    }
  ],
  args: {
    title: "TerraFund for AFR100: Landscapes ",
    description:
      "The funding application is designed for restoration projects in Africa. This application provides an opportunity for project developers to seek financial support for their restoration initiatives across the African continent.",

    location: "London, United Kingdom",
    status: "active",
    primaryLink: "#",
    secondaryLink: "#"
  }
};
