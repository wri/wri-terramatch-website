import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import Combobox from "./Combobox";

type ComboboxItem = NonNullable<ComponentProps<typeof Combobox>["initialItems"]>[number];

const meta = {
  title: "Redesign Components/Forms/Input/Combobox",
  component: Combobox,
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
      description: "Size of the combobox"
    },
    required: {
      control: "boolean",
      description: "Whether the field is required"
    },
    disabled: {
      control: "boolean",
      description: "Whether the combobox is disabled"
    },
    multiple: {
      control: "boolean",
      description: "Allow multiple selections"
    },
    showSelectedItems: {
      control: "boolean",
      description: "Show selected items as tags below the input"
    }
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "25rem" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: ComboboxItem[] = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" },
  { label: "Option 4", value: "option-4" },
  { label: "Option 5", value: "option-5" }
];

export const Default: Story = {
  args: {
    label: "Combobox",
    caption: "Search and select an option",
    placeholder: "Search...",
    initialItems: defaultItems
  }
};

export const Required: Story = {
  args: {
    label: "Required selection",
    caption: "Please select one option",
    placeholder: "Search...",
    initialItems: defaultItems,
    required: true
  }
};

export const WithError: Story = {
  args: {
    label: "With Error",
    caption: "Please select an option to continue",
    placeholder: "Search...",
    initialItems: defaultItems,
    errorMessage: "You must select an option to continue",
    required: true
  }
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    caption: "This combobox is disabled",
    placeholder: "Search...",
    initialItems: defaultItems,
    disabled: true
  }
};

export const SmallSize: Story = {
  args: {
    label: "Small size",
    caption: "Compact combobox",
    placeholder: "Search...",
    initialItems: defaultItems,
    size: "small"
  }
};

export const Multiple: Story = {
  args: {
    label: "Multiple with selected items",
    caption: "Selected values appear as tags",
    placeholder: "Search...",
    initialItems: defaultItems,
    multiple: true,
    showSelectedItems: true
  }
};
