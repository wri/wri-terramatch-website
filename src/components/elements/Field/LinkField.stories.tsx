import { Meta, StoryObj } from "@storybook/react";

import Component from "./LinkField";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Fields/LinkField",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: "News Article",
    value: "Visit",
    url: "https://google.com",
    external: true
  }
};
