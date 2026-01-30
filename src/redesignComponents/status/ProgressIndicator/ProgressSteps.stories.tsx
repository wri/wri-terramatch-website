import type { Meta, StoryObj } from "@storybook/react";

import { ProgressSteps } from "./ProgressSteps";
import type { StepProps } from "./types";

const meta = {
  title: "Redesign Components/Status/Progress Indicator/ProgressSteps",
  component: ProgressSteps,
  parameters: {
    layout: "padded"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof ProgressSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleSteps: StepProps[] = [
  {
    index: 1,
    status: "completed",
    label: "Label"
  },
  {
    index: 2,
    status: "completed",
    label: "Label"
  },
  {
    index: 3,
    status: "completed",
    label: "Label"
  },
  {
    index: 4,
    status: "error",
    label: "Label"
  },
  {
    index: 5,
    status: "active",
    label: "Label"
  },
  {
    index: 6,
    status: "available",
    label: "Label"
  },
  {
    index: 7,
    status: "available",
    label: "Label"
  }
];

export const Default: Story = {
  args: {
    steps: exampleSteps
  }
};
