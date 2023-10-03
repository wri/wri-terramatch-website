import { Meta, StoryObj } from "@storybook/react";
import Image from "public/images/terrafund-afr-100-explainer.webp";

import Component from "./AlternatingSection";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/LandingPage/AlternatingSection",
  component: Component
};
export default meta;
type Story = StoryObj<typeof Component>;

export const Right: Story = {
  args: {
    title: "TerraFund for AFR100",
    description:
      "A partnership of WRI, One Tree Planted, and Realize Impact, in 2022, TerraFund for AFR100 invested in Africa’s Top 100 locally led land restoration projects. Located across 27 member countries of the AFR100 Initiative, these community-based non-profits and enterprises received grants or loans of $50,000 to $500,000 each. Now, TerraMatch is tracking their progress by combining field-collected data with insights from WRI’s Land & Carbon Lab.",
    buttonText: "Learn more",
    buttonLink: "/",
    imageSrc: Image
  }
};

export const Left: Story = {
  args: {
    title: "TerraFund for AFR100",
    description:
      "A partnership of WRI, One Tree Planted, and Realize Impact, in 2022, TerraFund for AFR100 invested in Africa’s Top 100 locally led land restoration projects. Located across 27 member countries of the AFR100 Initiative, these community-based non-profits and enterprises received grants or loans of $50,000 to $500,000 each. Now, TerraMatch is tracking their progress by combining field-collected data with insights from WRI’s Land & Carbon Lab.",
    buttonText: "Learn more",
    buttonLink: "/",
    imageSrc: Image,
    className: "flex-row-reverse"
  }
};
