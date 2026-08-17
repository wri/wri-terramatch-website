import type { Meta, StoryObj } from "@storybook/react";

import DateRangeInput from "./DateRangeInput";

const meta = {
  title: "Redesign Components/Forms/Input/Date Range Inputs",
  component: DateRangeInput,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "17.6875rem" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof DateRangeInput>;

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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "17.6875rem" }}>
      <DateRangeInput label="Label" required />
      <DateRangeInput label="Label" />
      <DateRangeInput label="Label" caption="Caption" required />
      <DateRangeInput label="Label" required errorMessage="Error Message" />
      <DateRangeInput label="Label" disabled />
      <DateRangeInput label="Label" size="small" required />
    </div>
  )
};
