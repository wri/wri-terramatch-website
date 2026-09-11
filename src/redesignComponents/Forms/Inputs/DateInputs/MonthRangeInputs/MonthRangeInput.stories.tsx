import { CalendarDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react";

import MonthRangeInput from "./MonthRangeInput";

const meta = {
  title: "Redesign Components/Forms/Input/Month Range Inputs",
  component: MonthRangeInput,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "16rem" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof MonthRangeInput>;

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

export const WithDefaultValue: Story = {
  args: {
    label: "Reporting Period",
    caption: "Select a start and end month",
    required: true,
    defaultValue: [new CalendarDate(2026, 5, 1), new CalendarDate(2026, 8, 31)]
  }
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "17.6875rem" }}>
      <MonthRangeInput label="Label" required />
      <MonthRangeInput label="Label" />
      <MonthRangeInput label="Label" caption="Caption" required />
      <MonthRangeInput label="Label" required errorMessage="Error Message" />
      <MonthRangeInput label="Label" disabled />
      <MonthRangeInput label="Label" size="small" required />
      <MonthRangeInput
        label="With default"
        defaultValue={[new CalendarDate(2026, 5, 1), new CalendarDate(2026, 8, 31)]}
        required
      />
    </div>
  )
};
