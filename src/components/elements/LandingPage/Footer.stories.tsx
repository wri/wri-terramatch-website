import { Meta, StoryObj } from "@storybook/react";

import Component from "./Footer";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/LandingPage/Footer",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {};
