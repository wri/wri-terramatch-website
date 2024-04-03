import { Meta, StoryObj } from "@storybook/react";

import Component, { StepProgressbarProps } from "./StepProgressbar";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/ProgressBar/StepProgressBar",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args: StepProgressbarProps) => (
    <div className="flex items-center justify-center p-8">
      <Component {...args} />
    </div>
  ),
  args: {
    color: "primary",
    value: 25,
    labels: [
      { id: "Step 1", label: "Step 1" },
      { id: "Step 2", label: "Step 2" },
      { id: "Step 3", label: "Step 3" },
      { id: "Step 4", label: "Step 4" }
    ]
  }
};

export const Secondary = {
  args: {
    color: "secondary",
    value: 50,
    labels: [
      { id: "Step 1", label: "Step 1" },
      { id: "Step 2", label: "Step 2" },
      { id: "Step 3", label: "Step 3" },
      { id: "Step 4", label: "Step 4" }
    ]
  }
};

export const Tertiary: Story = {
  args: {
    color: "tertiary",
    value: 50,
    labels: [
      { id: "Step 1", label: "Step 1" },
      { id: "Step 2", label: "Step 2" },
      { id: "Step 3", label: "Step 3" },
      { id: "Step 4", label: "Step 4" }
    ]
  }
};

export const Success: Story = {
  args: {
    color: "success",
    value: 50,
    labels: [
      { id: "Step 1", label: "Step 1" },
      { id: "Step 2", label: "Step 2" },
      { id: "Step 3", label: "Step 3" },
      { id: "Step 4", label: "Step 4" }
    ]
  }
};

export const Error: Story = {
  args: {
    color: "error",
    value: 50,
    labels: [
      { id: "Step 1", label: "Step 1" },
      { id: "Step 2", label: "Step 2" },
      { id: "Step 3", label: "Step 3" },
      { id: "Step 4", label: "Step 4" }
    ]
  }
};
