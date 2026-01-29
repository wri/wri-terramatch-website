import { SimpleGrid } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { getThemedColor } from "@/lib/theme";

import { Landscape, Tree } from "../foundations/Icons";
import MetricCard from "./MetricCard";

const meta: Meta<typeof MetricCard> = {
  title: "Redesign Components/Data Display/Metric Card",
  component: MetricCard,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["simple", "progressBar", "donutChart"],
      description: "Card variant type"
    }
  }
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Simple: Story = {
  args: {
    title: "Total Projects",
    progress: 1234,
    goal: 10000,
    tooltipContent: "Total number of active projects",
    variant: "simple",
    icon: <Landscape />
  }
};

export const ProgressBar: Story = {
  args: {
    title: "Completed Tasks",
    progress: 750,
    goal: 1000,
    tooltipContent: "Tasks completed out of total",
    variant: "progressBar",
    icon: <Tree />
  }
};

export const DonutChart: Story = {
  args: {
    title: "Area Coverage",
    progress: 5000,
    goal: 10000,
    tooltipContent: "Total area covered in hectares",
    variant: "donutChart",
    icon: <Landscape />
  }
};

export const AllVariants: Story = {
  render: () => (
    <SimpleGrid columns={3} gap={4} width="100%">
      <MetricCard
        title="Simple Stat"
        progress={1234}
        goal={10000}
        tooltipContent="Simple metric card"
        variant="simple"
        icon={<Landscape />}
      />
      <MetricCard
        title="Progress Bar"
        progress={750}
        goal={1000}
        tooltipContent="Progress bar variant"
        variant="progressBar"
        icon={<Tree />}
        color="secondary.600"
      />
      <MetricCard
        title="Donut Chart"
        progress={5000}
        goal={10000}
        tooltipContent="Donut chart variant"
        variant="donutChart"
        icon={<Landscape />}
        color={getThemedColor("secondary", 700)}
      />
    </SimpleGrid>
  )
};

export const HighProgress: Story = {
  args: {
    title: "Almost Complete",
    progress: 9500,
    goal: 10000,
    tooltipContent: "Nearly completed metric",
    variant: "donutChart",
    icon: <Tree />
  }
};

export const LowProgress: Story = {
  args: {
    title: "Just Started",
    progress: 250,
    goal: 10000,
    tooltipContent: "Low progress metric",
    variant: "progressBar",
    icon: <Landscape />
  }
};

export const ZeroProgress: Story = {
  args: {
    title: "No Progress",
    progress: 0,
    goal: 10000,
    tooltipContent: "No progress made yet",
    variant: "donutChart",
    icon: <Landscape />
  }
};
