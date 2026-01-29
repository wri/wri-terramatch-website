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
    progress: {
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
    progress: 50,
    width: "100%",
    height: 8
  }
};

export const Empty: Story = {
  args: {
    progress: 0,
    width: "100%",
    height: 8
  }
};

export const TwentyPercent: Story = {
  args: {
    progress: 20,
    width: "100%",
    height: 8
  }
};

export const FortyPercent: Story = {
  args: {
    progress: 40,
    width: "100%",
    height: 8
  }
};

export const SixtyPercent: Story = {
  args: {
    progress: 60,
    width: "100%",
    height: 8
  }
};

export const EightyPercent: Story = {
  args: {
    progress: 80,
    width: "100%",
    height: 8
  }
};

export const Full: Story = {
  args: {
    progress: 100,
    width: "100%",
    height: 8
  }
};

export const AllProgressLevels: Story = {
  render: () => (
    <VStack gap={4} width="100%" maxWidth="400px">
      <ProgressBar progress={20} />
      <ProgressBar progress={40} />
      <ProgressBar progress={60} />
      <ProgressBar progress={80} />
      <ProgressBar progress={100} />
    </VStack>
  )
};

export const DifferentHeights: Story = {
  render: () => (
    <VStack gap={4} width="100%" maxWidth="400px">
      <ProgressBar progress={60} height={4} />
      <ProgressBar progress={60} height={8} />
      <ProgressBar progress={60} height={12} />
      <ProgressBar progress={60} height={16} />
    </VStack>
  )
};

export const DifferentWidths: Story = {
  render: () => (
    <VStack gap={4} width="100%">
      <ProgressBar progress={60} width="200px" />
      <ProgressBar progress={60} width="300px" />
      <ProgressBar progress={60} width="400px" />
      <ProgressBar progress={60} width="100%" />
    </VStack>
  )
};

export const CustomColors: Story = {
  render: () => (
    <VStack gap={4} width="100%" maxWidth="400px">
      <ProgressBar progress={60} color="#50B6E2" />
      <ProgressBar progress={60} color="#8ECA3F" />
      <ProgressBar progress={60} color="#009E77" />
      <ProgressBar progress={60} color="#A88100" />
    </VStack>
  )
};
