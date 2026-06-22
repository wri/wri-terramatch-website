import { SimpleGrid } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { getThemedColor } from "@/lib/theme";

import { PlaceholderIcon } from "../../foundations/Icons";
import MetricCard from "./MetricCard";

const meta: Meta<typeof MetricCard> = {
  title: "Redesign Components/Data Display/Metric Card",
  component: MetricCard,
  tags: ["autodocs"],
  parameters: {},
  decorators: [
    Story => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Story />
      </div>
    )
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["medium", "large", "progressBar", "donutChart"],
      description: "Card variant type"
    },
    progressSuffix: {
      control: "text",
      description: "Suffix displayed next to progress value"
    },
    goalSuffix: {
      control: "text",
      description: "Suffix displayed next to goal value"
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
    icon: <PlaceholderIcon />,
    tooltipContent: "This is a tooltip",
    className: "w-fit"
  }
};

export const MediumWithSelection: Story = {
  args: {
    title: "Stat label",
    progress: 1234,
    goal: 10000,
    progressSuffix: "ha",
    variant: "medium",
    icon: <PlaceholderIcon />,
    tooltipContent: "This is a tooltip",
    className: "w-fit",
    selection: 1000
  }
};

export const Large: Story = {
  args: {
    title: "Stat label",
    progress: 1234,
    goal: 10000,
    variant: "large",
    icon: <PlaceholderIcon />,
    tooltipContent: "This is a tooltip",
    className: "w-fit"
  }
};

export const ProgressBar: Story = {
  args: {
    title: "Stat label",
    progress: 750,
    goal: 1000,
    variant: "progressBar",
    icon: <PlaceholderIcon />,
    tooltipContent: "This is a tooltip",
    className: "w-[30rem]"
  }
};

export const DonutChart: Story = {
  args: {
    title: "Stat label",
    progress: 5000,
    goal: 10000,
    variant: "donutChart",
    icon: <PlaceholderIcon />,
    tooltipContent: "This is a tooltip",
    className: "w-fit"
  }
};

export const AllVariants: Story = {
  render: () => (
    <SimpleGrid columns={2} gap={4} width="100%">
      <MetricCard
        title="Stat label"
        progress={1234}
        goal={10000}
        variant="medium"
        icon={<PlaceholderIcon />}
        tooltipContent="This is a tooltip"
      />
      <MetricCard
        title="Stat label"
        progress={1234}
        goal={10000}
        variant="large"
        icon={<PlaceholderIcon />}
        tooltipContent="This is a tooltip"
      />
      <MetricCard
        title="Stat label"
        progress={750}
        goal={1000}
        variant="progressBar"
        icon={<PlaceholderIcon />}
        tooltipContent="This is a tooltip"
        color="secondary.600"
        className="col-span-2"
      />
      <MetricCard
        title="Stat label"
        progress={5000}
        goal={10000}
        variant="donutChart"
        icon={<PlaceholderIcon />}
        color={getThemedColor("secondary", 700)}
        tooltipContent="This is a tooltip"
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
    icon: <PlaceholderIcon />,
    tooltipContent: "This is a tooltip",
    className: "w-fit"
  }
};

export const LowProgress: Story = {
  args: {
    title: "Stat label",
    progress: 250,
    goal: 10000,
    variant: "progressBar",
    icon: <PlaceholderIcon />,
    tooltipContent: "This is a tooltip",
    className: "w-[30rem]"
  }
};

export const ZeroProgress: Story = {
  args: {
    title: "Stat label",
    progress: 0,
    goal: 10000,
    variant: "donutChart",
    icon: <PlaceholderIcon />,
    tooltipContent: "This is a tooltip",
    className: "w-fit"
  }
};
