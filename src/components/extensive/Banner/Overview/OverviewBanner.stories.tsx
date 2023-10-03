import { Meta, StoryObj } from "@storybook/react";

import Component from "./OverviewBanner";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Banner/OverviewBanner",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Reforestation in Bournemouth",
    subtitle: "Bournemouth, United Kingdom",
    pillText: "Pitch",
    bgImage: "/images/bg-hero-banner-2.webp"
  }
};
