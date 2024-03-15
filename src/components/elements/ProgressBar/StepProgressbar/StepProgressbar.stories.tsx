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
    labels: ["Step 1", "Step 2", "Step 3", "Step 4"]
  }
};

export const Secondary = {
  args: {
    color: "secondary",
    value: 50,
    labels: ["Step 1", "Step 2", "Step 3", "Step 4"]
  }
};

export const Tertiary: Story = {
  args: {
    color: "tertiary",
    value: 50,
    labels: ["Step 1", "Step 2", "Step 3", "Step 4"]
  }
};

export const Success: Story = {
  args: {
    color: "success",
    value: 50,
    labels: ["Step 1", "Step 2", "Step 3", "Step 4"]
  }
};

export const Error: Story = {
  args: {
    color: "error",
    value: 50,
    labels: ["Step 1", "Step 2", "Step 3", "Step 4"]
  }
};
