import { Meta, StoryObj } from "@storybook/react";

import Component from "./CookieBanner";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/CookieBanner",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {}
};
