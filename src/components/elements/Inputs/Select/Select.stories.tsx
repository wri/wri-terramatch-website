import { Meta, StoryObj } from "@storybook/react";

import Log from "@/utils/log";

import Component from "./Select";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/Select",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: "Select label",
    description: "Select description",
    placeholder: "placeholder",
    onChange: Log.info,
    options: [
      {
        title: "Option 1",
        value: 1
      },
      {
        title: "Option 2",
        value: 2
      },
      {
        title: "Option 3",
        value: 3
      },
      {
        title: "Option 4",
        value: 4
      },
      {
        title: "Option 5",
        value: 5
      },
      {
        title: "Option 6",
        value: 6
      },
      {
        title: "Option 7",
        value: 7
      },
      {
        title: "Option 8",
        value: 8
      },
      {
        title: "Option 9",
        value: 9
      }
    ]
  }
};
