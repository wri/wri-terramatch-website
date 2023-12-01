import { Meta, StoryObj } from "@storybook/react";

import Component from "./RadioGroup";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/RadioGroup",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: "Radio Label",
    options: [
      {
        title: "Yes",
        value: true
      },
      {
        title: "No",
        value: false
      }
    ]
  }
};
