import type { Meta, StoryObj } from "@storybook/react";

import CheckboxList from "./CheckboxList";

const meta = {
  title: "Redesign Components/Forms/Input/Checkbox List",
  component: CheckboxList,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    horizontal: {
      control: "boolean",
      description: "Display checkboxes horizontally"
    },
    required: {
      control: "boolean",
      description: "Whether the field is required"
    },
    hideCheckedCounter: {
      control: "boolean",
      description: "Hide the count of checked items"
    },
    hideExpandToggle: {
      control: "boolean",
      description: "Hide the expand/collapse toggle"
    }
  },
  args: { onCheckedChange: () => {} },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "25rem" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof CheckboxList>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultCheckboxes = [
  { name: "option-1", children: "Option 1" },
  { name: "option-2", children: "Option 2" },
  { name: "option-3", children: "Option 3" }
];

export const Default: Story = {
  args: {
    label: "Select options",
    caption: "Choose one or more options from the list",
    checkboxes: defaultCheckboxes
  }
};

export const Required: Story = {
  args: {
    label: "Required preferences",
    caption: "Please select at least one option",
    checkboxes: defaultCheckboxes,
    required: true
  }
};

export const Horizontal: Story = {
  args: {
    label: "Inline options",
    caption: "Options displayed horizontally",
    checkboxes: defaultCheckboxes,
    horizontal: true
  }
};

export const WithDefaultValue: Story = {
  args: {
    label: "With Default Value",
    caption: "Option 1 is pre-selected",
    checkboxes: defaultCheckboxes
  }
};

export const WithError: Story = {
  args: {
    label: "With Error",
    caption: "Please accept all to continue",
    checkboxes: [
      { name: "option-1", children: "Option 1" },
      { name: "option-2", children: "Option 2" }
    ],
    errorMessage: "You must accept all agreements to continue",
    required: true
  }
};

export const HorizontalWithError: Story = {
  args: {
    label: "Inline options",
    caption: "Options displayed horizontally",
    checkboxes: defaultCheckboxes,
    horizontal: true,
    errorMessage: "You must accept all agreements to continue",
    required: true
  }
};

export const WithDisabledOption: Story = {
  args: {
    label: "With Disabled Option",
    caption: "Option 3 is disabled",
    checkboxes: [
      { name: "Option 1", children: "Option 1" },
      { name: "Option 2", children: "Option 2" },
      { name: "Option 3", children: "Option 3 (Coming soon)", disabled: true }
    ]
  }
};
