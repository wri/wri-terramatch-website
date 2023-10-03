import { Meta, StoryObj } from "@storybook/react";

import Component from "./HeroBanner";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Banner/HeroBanner",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "People growing trees the right way",
    subtitle: "Unlocking the funding and training opportunities needed to grow millions of trees the right way.",
    ctaLink: "auth/signup",
    ctaText: "Sign up"
  }
};
