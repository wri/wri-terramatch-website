import { Flex } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { Placeholder } from "../foundations/Icons";
import DonutChart from "./DonutChart";

const meta: Meta<typeof DonutChart> = {
  title: "Redesign Components/Data Display/Donut Chart",
  component: DonutChart,
  parameters: {
    layout: "padded"
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress value between 0 and 100"
    },
    size: {
      control: { type: "number", min: 40, max: 200, step: 10 },
      description: "Size of the donut chart in pixels"
    }
  }
};

export default meta;
type Story = StoryObj<typeof DonutChart>;

export const Default: Story = {
  args: {
    value: 50
  }
};

export const Empty: Story = {
  args: {
    value: 0
  }
};

export const Quarter: Story = {
  args: {
    value: 25
  }
};

export const Half: Story = {
  args: {
    value: 50
  }
};

export const ThreeQuarters: Story = {
  args: {
    value: 75
  }
};

export const Full: Story = {
  args: {
    value: 100
  }
};

export const AllProgressLevels: Story = {
  render: () => (
    <Flex gap={6} alignItems="center" flexWrap="wrap">
      <DonutChart value={0} />
      <DonutChart value={25} />
      <DonutChart value={50} />
      <DonutChart value={75} />
      <DonutChart value={100} />
    </Flex>
  )
};

export const DifferentSizes: Story = {
  render: () => (
    <Flex gap={6} alignItems="center" flexWrap="wrap">
      <DonutChart value={60} size={60} />
      <DonutChart value={60} size={80} />
      <DonutChart value={60} size={100} />
      <DonutChart value={60} size={120} />
    </Flex>
  )
};
export const WithChildren: Story = {
  args: {
    value: 100,
    children: <Placeholder boxSize={6} color="primary.600" />
  }
};
