import type { Meta, StoryObj } from "@storybook/react";

import CheckboxList from "./CheckboxList";

const meta = {
  title: "Redesign Components/Forms/Input/CheckboxList",
  component: CheckboxList,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onCheckedChange: () => {} }
} satisfies Meta<typeof CheckboxList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    checkboxes: [
      {
        children: "Checkbox 1",
        name: "checkbox-1",
        value: "checkbox-1"
      },
      {
        children: "Checkbox 2",
        name: "checkbox-2",
        value: "checkbox-2"
      },
      {
        children: "Checkbox 3",
        name: "checkbox-3",
        value: "checkbox-3"
      }
    ],
    required: true
  }
};

export const WithDefaultValue: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    defaultValue: "checkbox-2",
    checkboxes: [
      {
        children: "Checkbox 1",
        name: "checkbox-1",
        value: "checkbox-1"
      },
      {
        children: "Checkbox 2",
        name: "checkbox-2",
        value: "checkbox-2"
      },
      {
        children: "Checkbox 3",
        name: "checkbox-3",
        value: "checkbox-3"
      }
    ],
    required: true
  }
};

export const Horizontal: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    defaultValue: "checkbox-2",
    checkboxes: [
      {
        children: "Checkbox 1",
        name: "checkbox-1",
        value: "checkbox-1"
      },
      {
        children: "Checkbox 2",
        name: "checkbox-2",
        value: "checkbox-2"
      },
      {
        children: "Checkbox 3",
        name: "checkbox-3",
        value: "checkbox-3"
      }
    ],
    required: true,
    horizontal: true
  }
};

export const WithErrorMessage: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    defaultValue: "checkbox-2",
    errorMessage: "Error Message",
    checkboxes: [
      {
        children: "Checkbox 1",
        name: "checkbox-1",
        value: "checkbox-1"
      },
      {
        children: "Checkbox 2",
        name: "checkbox-2",
        value: "checkbox-2"
      },
      {
        children: "Checkbox 3",
        name: "checkbox-3",
        value: "checkbox-3"
      }
    ],
    required: true
  }
};

export const WithParentCheckbox: Story = {
  render: args => (
    <div style={{ width: "250px" }}>
      <CheckboxList {...args} />
    </div>
  ),
  args: {
    label: { type: "checkbox", label: "Parent", name: "all" },
    defaultValue: "checkbox-2",
    checkboxes: [
      {
        children: "Checkbox 1",
        name: "checkbox-1",
        value: "checkbox-1"
      },
      {
        children: "Checkbox 2",
        name: "checkbox-2",
        value: "checkbox-2"
      },
      {
        children: "Checkbox 3",
        name: "checkbox-3",
        value: "checkbox-3"
      }
    ],
    required: true
  }
};
