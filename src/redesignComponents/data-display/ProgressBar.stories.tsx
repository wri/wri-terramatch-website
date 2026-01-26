import { VStack } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import ProgressBar from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Redesign Components/Data Display/Progress Bar",
  component: ProgressBar,
  parameters: {
    layout: "padded"
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress value between 0 and 100"
    },
    width: {
      control: "text",
      description: "Width of the progress bar"
    },
    height: {
      control: { type: "number", min: 4, max: 32, step: 2 },
      description: "Height of the progress bar in pixels"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 50,
    width: "100%",
    height: 8
  }
};

export const Empty: Story = {
  args: {
    value: 0,
    width: "100%",
    height: 8
  }
};

export const TwentyPercent: Story = {
  args: {
    value: 20,
    width: "100%",
    height: 8
  }
};

export const FortyPercent: Story = {
  args: {
    value: 40,
    width: "100%",
    height: 8
  }
};

export const SixtyPercent: Story = {
  args: {
    value: 60,
    width: "100%",
    height: 8
  }
};

export const EightyPercent: Story = {
  args: {
    value: 80,
    width: "100%",
    height: 8
  }
};

export const Full: Story = {
  args: {
    value: 100,
    width: "100%",
    height: 8
  }
};

export const AllProgressLevels: Story = {
  render: () => (
    <VStack gap={4} width="100%" maxWidth="400px">
      <ProgressBar value={20} />
      <ProgressBar value={40} />
      <ProgressBar value={60} />
      <ProgressBar value={80} />
      <ProgressBar value={100} />
    </VStack>
  )
};

export const DifferentHeights: Story = {
  render: () => (
    <VStack gap={4} width="100%" maxWidth="400px">
      <ProgressBar value={60} height={4} />
      <ProgressBar value={60} height={8} />
      <ProgressBar value={60} height={12} />
      <ProgressBar value={60} height={16} />
    </VStack>
  )
};

export const DifferentWidths: Story = {
  render: () => (
    <VStack gap={4} width="100%">
      <ProgressBar value={60} width="200px" />
      <ProgressBar value={60} width="300px" />
      <ProgressBar value={60} width="400px" />
      <ProgressBar value={60} width="100%" />
    </VStack>
  )
};

export const CustomColors: Story = {
  render: () => (
    <VStack gap={4} width="100%" maxWidth="400px">
      <ProgressBar value={60} color="#50B6E2" />
      <ProgressBar value={60} color="#8ECA3F" />
      <ProgressBar value={60} color="#009E77" />
      <ProgressBar value={60} color="#A88100" />
    </VStack>
  )
};
