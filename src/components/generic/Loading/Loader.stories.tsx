import { Meta, StoryObj } from "@storybook/react";

import Component from "./Loader";

const meta: Meta<typeof Component> = {
  title: "Components/Generic/Loader",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {};
