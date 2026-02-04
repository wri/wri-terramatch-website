import { SimpleGrid } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { getThemedColor } from "@/lib/theme";

import { Placeholder } from "../../foundations/Icons";
import MetricCard from "./MetricCard";

const meta: Meta<typeof MetricCard> = {
  title: "Redesign Components/Data Display/Metric Card",
  component: MetricCard,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["medium", "large", "progressBar", "donutChart"],
      description: "Card variant type"
    }
  }
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Medium: Story = {
  args: {
    title: "Stat label",
    progress: 1234,
    goal: 10000,
    variant: "medium",
    icon: <Placeholder />
  }
};

export const Large: Story = {
  args: {
    title: "Stat label",
    progress: 1234,
    goal: 10000,
    variant: "large",
    icon: <Placeholder />
  }
};

export const ProgressBar: Story = {
  args: {
    title: "Stat label",
    progress: 750,
    goal: 1000,
    variant: "progressBar",
    icon: <Placeholder />
  }
};

export const DonutChart: Story = {
  args: {
    title: "Stat label",
    progress: 5000,
    goal: 10000,
    variant: "donutChart",
    icon: <Placeholder />
  }
};

export const AllVariants: Story = {
  render: () => (
    <SimpleGrid columns={3} gap={4} width="100%">
      <MetricCard title="Stat label" progress={1234} goal={10000} variant="medium" icon={<Placeholder />} />
      <MetricCard title="Stat label" progress={1234} goal={10000} variant="large" icon={<Placeholder />} />
      <MetricCard
        title="Stat label"
        progress={750}
        goal={1000}
        variant="progressBar"
        icon={<Placeholder />}
        color="secondary.600"
      />
      <MetricCard
        title="Stat label"
        progress={5000}
        goal={10000}
        variant="donutChart"
        icon={<Placeholder />}
        color={getThemedColor("secondary", 700)}
      />
    </SimpleGrid>
  )
};

export const HighProgress: Story = {
  args: {
    title: "Stat label",
    progress: 9500,
    goal: 10000,
    variant: "donutChart",
    icon: <Placeholder />
  }
};

export const LowProgress: Story = {
  args: {
    title: "Stat label",
    progress: 250,
    goal: 10000,
    variant: "progressBar",
    icon: <Placeholder />
  }
};

export const ZeroProgress: Story = {
  args: {
    title: "Stat label",
    progress: 0,
    goal: 10000,
    variant: "donutChart",
    icon: <Placeholder />
  }
};
