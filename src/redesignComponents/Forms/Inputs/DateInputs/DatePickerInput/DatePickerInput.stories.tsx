import type { Meta, StoryObj } from "@storybook/react";

import DatePickerInput from "./DatePickerInput";

const meta = {
  title: "Redesign Components/Forms/Input/Date Picker Input",
  component: DatePickerInput,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "283px" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof DatePickerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    required: true
  }
};

export const WithCaption: Story = {
  args: {
    label: "Label",
    caption: "Caption",
    required: true
  }
};

export const Optional: Story = {
  args: {
    label: "Label"
  }
};

export const WithError: Story = {
  args: {
    label: "Label",
    required: true,
    caption: "Caption",
    errorMessage: "Error Message"
  }
};

export const SmallSize: Story = {
  args: {
    label: "Label",
    size: "small",
    required: true
  }
};

export const Disabled: Story = {
  args: {
    label: "Label",
    disabled: true
  }
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "283px" }}>
      <DatePickerInput label="Label" required />
      <DatePickerInput label="Label" />
      <DatePickerInput label="Label" caption="Caption" required />
      <DatePickerInput label="Label" required errorMessage="Error Message" />
      <DatePickerInput label="Label" disabled />
      <DatePickerInput label="Label" size="small" required />
    </div>
  )
};
