import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Checkbox from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Redesign Components/Forms/Controls/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Optional name for the checkbox"
    },
    value: {
      control: "text",
      description: "Optional value for the checkbox"
    },
    defaultChecked: {
      control: "boolean",
      description: "Whether the checkbox is checked by default"
    },
    disabled: {
      control: "boolean",
      description: "Disables the checkbox when true"
    },
    indeterminate: {
      control: "boolean",
      description: "Shows the checkbox in an indeterminate state"
    },
    children: {
      control: "text",
      description: "Label content rendered next to the checkbox"
    }
  }
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    children: "Label"
  }
};

export const Disabled: Story = {
  args: {
    children: "Label",
    disabled: true,
    defaultChecked: true
  }
};

export const IndeterminateControlled: Story = {
  args: {
    children: "Label"
  },
  render: args => {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);

    return (
      <Checkbox
        {...args}
        checked={checked}
        indeterminate={indeterminate}
        onCheckedChange={({ checked }) => {
          setChecked(checked === true);
          setIndeterminate(false);
        }}
      />
    );
  }
};
