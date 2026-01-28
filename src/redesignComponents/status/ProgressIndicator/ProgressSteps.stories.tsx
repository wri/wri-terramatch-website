import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { Edit } from "@/redesignComponents/foundations/Icons";

import { ProgressSteps } from "./ProgressSteps";

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

const exampleSteps = [
  {
    index: 1,
    status: "completed",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 2,
    status: "completed",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 3,
    status: "completed",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 4,
    status: "error",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 5,
    status: "active",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 6,
    status: "disabled",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 7,
    status: "disabled",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  }
];

export const Default: Story = {
  args: {
    steps: exampleSteps
  }
};

export const LongList: Story = {
  render: () => {
    const steps = Array.from({ length: 10 }, (_, i) => ({
      index: i + 1,
      status: i < 4 ? "completed" : i === 4 ? "active" : "disabled",
      label: `Step ${i + 1}`
    }));

    return (
      <Box maxW="200px">
        <ProgressSteps steps={steps} />
      </Box>
    );
  }
};
