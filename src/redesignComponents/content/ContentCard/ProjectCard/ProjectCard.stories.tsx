import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { AreaHectaresIcon, JobsIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

import ProjectCard from "./ProjectCard";
import { ProjectCardMetric } from "./ProjectCardMetricRow";

const buildMetrics = (
  trees: number,
  treesGoal: number,
  area: number,
  areaGoal: number,
  jobs: number,
  jobsGoal?: number
): ProjectCardMetric[] => [
  {
    key: "trees",
    Icon: TreeIcon,
    label: "Trees Planted:",
    color: "secondary.600",
    value: trees,
    goal: treesGoal,
    tooltipContent: "This is the sum of trees planted in this project’s site reports."
  },
  {
    key: "area",
    Icon: AreaHectaresIcon,
    label: "Area Restored (ha):",
    color: "secondary.800",
    value: area,
    goal: areaGoal,
    tooltipContent: "Number of hectares within approved polygons for this project."
  },
  {
    key: "jobs",
    Icon: JobsIcon,
    label: jobsGoal == null ? "Workdays" : "Jobs Created:",
    color: "primary.600",
    value: jobs,
    goal: jobsGoal,
    tooltipContent: "This is the sum of jobs or workdays in all approved reports for this project."
  }
];

const meta: Meta<typeof ProjectCard> = {
  title: "Redesign Components/Content/Content Card/Project Card",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  argTypes: {
    status: {
      control: "select",
      options: ["draft", "pending-approval", "information-required", "approved"],
      description: "Set up status of the project"
    },
    plantingStatus: {
      control: "select",
      options: [null, "not-started", "in-progress", "completed", "not-available"],
      description: "Planting progress; `null` falls back to the Not Available tag"
    },
    nurseriesCount: {
      description: "Omit for frameworks without nurseries to hide the nurseries link"
    },
    hasReports: {
      control: "boolean",
      description: "The reports link is disabled until the project has reports"
    },
    onSitesClick: { action: "sitesClick" },
    onNurseriesClick: { action: "nurseriesClick" },
    onReportsClick: { action: "reportsClick" },
    onViewProjectClick: { action: "viewProjectClick" }
  },
  decorators: [
    Story => (
      <Box maxWidth="41.25rem" padding={8} backgroundColor="neutral.200">
        <Story />
      </Box>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    title: "Project Title",
    organisationName: "Organization Name",
    programmeName: "TerraFund Top 100",
    country: "Kenya",
    countryFlag: "🇰🇪",
    imageUrl: "https://i.pravatar.cc/300?img=12",
    status: "approved",
    plantingStatus: "in-progress",
    metrics: buildMetrics(120000, 200000, 600, 1000, 300, 500),
    sitesCount: 12,
    nurseriesCount: 4,
    hasReports: true
  }
};

export const NoGoalMetricAndNoNurseries: Story = {
  args: {
    ...Default.args,
    programmeName: "PPC",
    plantingStatus: "not-started",
    metrics: buildMetrics(0, 200000, 0, 1000, 0),
    nurseriesCount: undefined,
    hasReports: false
  }
};

export const LongTitle: Story = {
  args: {
    ...Default.args,
    title: "Ecosystem and livelihoods enhancement for People, Nature and Climate in the Kenyan Rift Valley"
  }
};

export const Draft: Story = {
  args: {
    ...Default.args,
    imageUrl: null,
    status: "draft",
    plantingStatus: null,
    metrics: buildMetrics(0, 0, 0, 0, 0, 0),
    sitesCount: 0,
    nurseriesCount: 0,
    hasReports: false
  }
};
