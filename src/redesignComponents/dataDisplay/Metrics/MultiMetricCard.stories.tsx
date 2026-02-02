import { Flex } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { getThemedColor } from "@/lib/theme";

import { Placeholder } from "../foundations/Icons";
import MultiMetricCard from "./MultiMetricCard";

const meta: Meta<typeof MultiMetricCard> = {
  title: "Redesign Components/Data Display/Multi Metric Card",
  component: MultiMetricCard,
  tags: ["autodocs"],
  render: args => (
    <Flex direction="column" gap={3} backgroundColor="neutral.200">
      <MultiMetricCard {...args} />
    </Flex>
  )
};

export default meta;
type Story = StoryObj<typeof MultiMetricCard>;

export const Default: Story = {
  args: {
    title: "Label",
    status: "in-progress",
    metrics: [
      {
        title: "Stat label",
        progress: 8500,
        goal: 10000,
        icon: <Placeholder />,
        color: getThemedColor("primary", 600)
      },
      {
        title: "Stat label",
        progress: 3200,
        goal: 5000,
        icon: <Placeholder />,
        color: getThemedColor("secondary", 600)
      },
      {
        title: "Stat label",
        progress: 1800,
        goal: 3000,
        icon: <Placeholder />,
        color: getThemedColor("secondary", 700)
      }
    ]
  },
  render: args => (
    <Flex direction="column" gap={3} backgroundColor="neutral.200" width="300px" padding={5}>
      <MultiMetricCard {...args} />
    </Flex>
  )
};

export const NotStarted: Story = {
  args: {
    title: "Label",
    status: "not-started",
    metrics: [
      {
        title: "Stat label",
        progress: 0,
        goal: 0,
        icon: <Placeholder />,
        color: getThemedColor("primary", 600)
      },
      {
        title: "Stat label",
        progress: 0,
        goal: 0,
        icon: <Placeholder />,
        color: getThemedColor("secondary", 600)
      },
      {
        title: "Stat label",
        progress: 0,
        goal: 0,
        icon: <Placeholder />,
        color: getThemedColor("secondary", 700)
      }
    ]
  },
  render: args => (
    <Flex direction="column" gap={3} backgroundColor="neutral.200" padding={5} width="300px">
      <MultiMetricCard {...args} />
    </Flex>
  )
};
