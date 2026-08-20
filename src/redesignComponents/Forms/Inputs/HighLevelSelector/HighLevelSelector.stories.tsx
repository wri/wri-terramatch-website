import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import HighLevelSelector, { HighLevelSelectorItem } from ".";

const folders: HighLevelSelectorItem[] = [
  { label: "Label 1", value: "label-1" },
  { label: "Label 2", value: "label-2" },
  { label: "Label 3", value: "label-3" },
  { label: "Label 4", value: "label-4" }
];

const meta = {
  title: "Redesign Components/Forms/Input/High-level Selector",
  component: HighLevelSelector,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    autocomplete: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    defaultOpen: { control: "boolean" }
  },
  args: {
    items: folders,
    label: "Label",
    placeholder: "Label",
    width: "25rem",
    onChange: action("onChange"),
    onInputChange: action("onInputChange"),
    onOpenChange: action("onOpenChange")
  }
} satisfies Meta<typeof HighLevelSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "label-1"
  }
};

export const Autocomplete: Story = {
  args: {
    autocomplete: true
  }
};

export const Open: Story = {
  args: {
    defaultOpen: true,
    defaultValue: "label-1"
  }
};

export const Disabled: Story = {
  args: {
    defaultValue: "label-1",
    disabled: true
  }
};
