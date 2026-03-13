import type { Meta, StoryObj } from "@storybook/react";

import Switch from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Redesign Components/Forms/Controls/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name of the switch, passed back in the onChange callback"
    },
    defaultChecked: {
      control: "boolean",
      description: "Whether the switch should be checked by default"
    },
    disabled: {
      control: "boolean",
      description: "Disables the switch when true"
    },
    isLabelOnLeft: {
      control: "boolean",
      description: "Positions the label on the left side of the switch"
    },
    children: {
      control: "text",
      description: "Label content rendered next to the switch"
    }
  }
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    name: "default"
  }
};

export const Label: Story = {
  args: {
    name: "label",
    children: "Label"
  }
};

export const LabelOnLeft: Story = {
  args: {
    name: "label-on-left",
    children: "Label on the left",
    isLabelOnLeft: true
  }
};

export const Disabled: Story = {
  args: {
    name: "disabled",
    children: "Disabled switch",
    disabled: true
  }
};

export const DefaultChecked: Story = {
  args: {
    name: "default-checked",
    children: "Enabled by default",
    defaultChecked: true
  }
};
