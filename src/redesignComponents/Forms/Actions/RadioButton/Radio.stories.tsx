import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import RadioButtonGroup from "./Radio";
import type { RadioOption } from "./types";

type ComponentType = typeof RadioButtonGroup;

const meta: Meta<ComponentType> = {
  title: "Redesign Components/Forms/Controls/Radio Button",
  component: RadioButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name of the radio group"
    },
    horizontal: {
      control: "boolean",
      description: "Display radio buttons horizontally"
    },
    customGap: {
      control: "text",
      description: "Custom gap between radio buttons (e.g. '0.25rem')"
    },
    options: {
      control: "object",
      description: "Array of radio options with value, label and disabled"
    }
  }
};

export default meta;

type Story = StoryObj<ComponentType>;

const defaultOptions: RadioOption[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" }
];

export const SingleRadio: Story = {
  args: {
    name: "single-radio",
    value: "1",
    options: [{ value: "1", label: "One" }]
  },
  render: args => {
    const [value, setValue] = useState(args.value as string | undefined);

    return (
      <RadioButtonGroup
        {...args}
        value={value}
        onChange={(_, selectedValue) => {
          setValue(selectedValue);
        }}
      />
    );
  }
};

export const DefaultChecked: Story = {
  args: {
    name: "default-checked",
    value: "2",
    options: defaultOptions
  },
  render: args => {
    const [value, setValue] = useState(args.value as string | undefined);

    return (
      <RadioButtonGroup
        {...args}
        value={value}
        onChange={(_, selectedValue) => {
          setValue(selectedValue);
        }}
      />
    );
  }
};

export const DisabledOptions: Story = {
  args: {
    name: "disabled-options",
    value: "2",
    options: [
      { value: "1", label: "Option 1", disabled: true },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" },
      { value: "4", label: "Option 4", disabled: true }
    ]
  },
  render: args => {
    const [value, setValue] = useState(args.value as string | undefined);

    return (
      <RadioButtonGroup
        {...args}
        value={value}
        onChange={(_, selectedValue) => {
          setValue(selectedValue);
        }}
      />
    );
  }
};
