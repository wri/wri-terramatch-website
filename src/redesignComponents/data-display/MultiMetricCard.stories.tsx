import { Flex } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { getThemedColor } from "@/lib/theme";

import { Jobs, Seeds, Tree } from "../foundations/Icons";
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
    title: "Restoration Progress",
    status: "in-progress",
    metrics: [
      {
        title: "Forest Restoration",
        progress: 8500,
        goal: 10000,
        tooltipContent: "Hectares of forest restored",
        icon: <Tree />,
        color: getThemedColor("primary", 600)
      },
      {
        title: "Carbon Sequestration",
        progress: 3200,
        goal: 5000,
        tooltipContent: "Tons of CO2 sequestered",
        icon: <Seeds />,
        color: getThemedColor("secondary", 600)
      },
      {
        title: "Biodiversity Impact",
        progress: 1800,
        goal: 3000,
        tooltipContent: "Species protected",
        icon: <Jobs />,
        color: getThemedColor("secondary", 700)
      }
    ]
  }
};

export const NotStarted: Story = {
  args: {
    title: "Restoration Progress",
    status: "not-started",
    metrics: [
      {
        title: "Forest Restoration",
        progress: 0,
        goal: 0,
        tooltipContent: "Hectares of forest restored",
        icon: <Tree />,
        color: getThemedColor("primary", 600)
      },
      {
        title: "Carbon Sequestration",
        progress: 0,
        goal: 0,
        tooltipContent: "Tons of CO2 sequestered",
        icon: <Seeds />,
        color: getThemedColor("secondary", 600)
      },
      {
        title: "Biodiversity Impact",
        progress: 0,
        goal: 0,
        tooltipContent: "Species protected",
        icon: <Jobs />,
        color: getThemedColor("secondary", 700)
      }
    ]
  }
};
