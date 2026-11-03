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

export const Open: Story = {
  args: {
    defaultOpen: true,
    defaultValue: "label-1"
  }
};

export const Grouped: Story = {
  args: {
    defaultOpen: true,
    defaultValue: "all",
    label: "View:",
    items: [
      { label: "All", value: "all" },
      { label: "Project Name 1", value: "project-1", group: "Projects" },
      { label: "Project Name 2", value: "project-2", group: "Projects" },
      { label: "Project Name 3", value: "project-3", group: "Projects" },
      { label: "Organization Name 1", value: "organization-1", group: "Organizations" },
      { label: "Organization Name 2", value: "organization-2", group: "Organizations" }
    ]
  }
};

export const Disabled: Story = {
  args: {
    defaultValue: "label-1",
    disabled: true
  }
};
