import type { Meta, StoryObj } from "@storybook/react";

import DateRangeInput from "./DateRangeInput";

const meta = {
  title: "Redesign Components/Forms/Input/DateRangeInput",
  component: DateRangeInput,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof DateRangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
