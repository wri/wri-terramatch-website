import { Meta, StoryObj } from "@storybook/react";

import Component from "./LandingPageSectionLayout";

const meta: Meta<typeof Component> = {
  title: "Components/Generic/Layouts/LandingPageSectionLayout",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: <div className="h-[400px] w-[400px] bg-neutral-200">Children</div>,
    title: "Title",
    preTitle: "preTitle"
  }
};
