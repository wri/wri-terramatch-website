import { Meta, StoryObj } from "@storybook/react";

import { AreaHectaresIcon, JobsIcon, TreeIcon } from "../../foundations/Icons";
import IndexMetricCardRow from "./IndexMetricCardRow";

const meta: Meta<typeof IndexMetricCardRow> = {
  title: "Redesign Components/Data Display/Index Metric Card Row",
  component: IndexMetricCardRow,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof IndexMetricCardRow>;

export const SiteIndexProgress: Story = {
  args: {
    cards: [
      {
        key: "trees-growing",
        title: "Trees Growing",
        progress: 1200,
        goal: 4000,
        icon: <TreeIcon />,
        color: "secondary.600",
        variant: "progressBar",
        widthProgressBar: "5rem",
        progressSuffix: "",
        filtered: 800,
        selection: 200
      },
      {
        key: "area-restored",
        title: "Area restored (Ha)",
        progress: 40,
        goal: 100,
        icon: <AreaHectaresIcon />,
        color: "secondary.700",
        variant: "progressBar",
        widthProgressBar: "5rem",
        progressSuffix: ""
      }
    ]
  }
};

export const ReportsIndexTotals: Story = {
  args: {
    cards: [
      {
        key: "trees-growing",
        title: "Trees Growing",
        progress: 540,
        goal: 0,
        icon: <TreeIcon />,
        color: "secondary.600",
        filtered: 120,
        selection: 40,
        metricLabel: "trees_growing"
      },
      {
        key: "jobs",
        title: "Jobs Created",
        progress: 18,
        goal: 0,
        icon: <JobsIcon />,
        color: "primary.600",
        metricLabel: "jobs_created"
      }
    ]
  }
};
