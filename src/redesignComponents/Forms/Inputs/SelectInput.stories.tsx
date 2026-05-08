import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import SelectInput from "./SelectInput";

type SelectItem = ComponentProps<typeof SelectInput>["items"][number];

const meta = {
  title: "Redesign Components/Forms/Input/Select Input",
  component: SelectInput,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text when no value is selected"
    },
    size: {
      control: "select",
      options: ["default", "small"],
      description: "Size of the select input"
    },
    required: {
      control: "boolean",
      description: "Whether the field is required"
    },
    disabled: {
      control: "boolean",
      description: "Whether the select is disabled"
    },
    multiple: {
      control: "boolean",
      description: "Allow multiple selections"
    }
  },
  args: { onChange: action("onChange") },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "25rem" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: SelectItem[] = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" }
];

const itemsWithCaption: SelectItem[] = [
  { label: "Option 1", caption: "First option", value: "option-1" },
  { label: "Option 2", caption: "Second option", value: "option-2" },
  { label: "Option 3", caption: "Third option", value: "option-3" }
];

export const Default: Story = {
  args: {
    label: "Select an option",
    caption: "Choose one option from the list",
    placeholder: "Select...",
    items: defaultItems
  }
};

export const Required: Story = {
  args: {
    label: "Required selection",
    caption: "Please select one option",
    placeholder: "Select...",
    items: defaultItems,
    required: true
  }
};

export const WithDefaultValue: Story = {
  args: {
    label: "With Default Value",
    caption: "Option 2 is pre-selected",
    placeholder: "Select...",
    items: defaultItems,
    defaultValue: ["option-2"]
  }
};

export const WithError: Story = {
  args: {
    label: "With Error",
    caption: "Please select an option to continue",
    placeholder: "Select...",
    items: defaultItems,
    errorMessage: "You must select an option to continue",
    required: true
  }
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    caption: "This select is disabled",
    placeholder: "Select...",
    items: defaultItems,
    disabled: true
  }
};

export const SmallSize: Story = {
  args: {
    label: "Small size",
    caption: "Compact select input",
    placeholder: "Select...",
    items: defaultItems,
    size: "small"
  }
};

export const WithCaptions: Story = {
  args: {
    label: "With item captions",
    caption: "Items include additional descriptions",
    placeholder: "Select...",
    items: itemsWithCaption
  }
};

export const Multiple: Story = {
  args: {
    label: "Multiple selection",
    caption: "Choose one or more options",
    placeholder: "Select multiple...",
    items: defaultItems,
    multiple: true
  }
};

export const MultipleWithDefaultValue: Story = {
  args: {
    label: "Multiple with default",
    caption: "Option 1 and 3 are pre-selected",
    placeholder: "Select multiple...",
    items: defaultItems,
    multiple: true,
    defaultValue: ["option-1", "option-3"]
  }
};
