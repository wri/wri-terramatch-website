import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import ProjectCard, { ProjectCardProject } from "./ProjectCard";

const DEFAULT_PROJECT: ProjectCardProject = {
  uuid: "story-project",
  name: "Project Title",
  frameworkKey: "terrafund-non-profits",
  organisationName: "Organization Name",
  status: "approved",
  plantingStatus: "in-progress",
  level0Project: ["KEN"],
  treesPlantedCount: 120000,
  seedsPlantedCount: 0,
  regeneratedTreesCount: 0,
  treesGrownGoal: 200000,
  treesPlantedGoal: 0,
  totalHectaresRestoredSum: 600,
  totalHectaresRestoredGoal: 1000,
  combinedWorkdayCount: 0,
  totalJobsCreated: 300,
  jobsCreatedGoal: 500,
  fullTimeJobsGoal: 0,
  totalSites: 12,
  totalNurseries: 4,
  totalProjectReports: 3
};

const meta: Meta<typeof ProjectCard> = {
  title: "Redesign Components/Containers/Cards/Project Card",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
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
  args: { project: DEFAULT_PROJECT }
};

export const PpcWorkdaysAndNoNurseries: Story = {
  args: {
    project: {
      ...DEFAULT_PROJECT,
      frameworkKey: "ppc",
      plantingStatus: "not-started",
      treesPlantedCount: 0,
      totalHectaresRestoredSum: 0,
      combinedWorkdayCount: 0,
      totalNurseries: 0,
      totalProjectReports: 0
    }
  }
};

export const LongTitle: Story = {
  args: {
    project: {
      ...DEFAULT_PROJECT,
      name: "Ecosystem and livelihoods enhancement for People, Nature and Climate in the Kenyan Rift Valley"
    }
  }
};

export const Draft: Story = {
  args: {
    project: {
      ...DEFAULT_PROJECT,
      status: "draft",
      plantingStatus: null,
      treesPlantedCount: null,
      treesGrownGoal: null,
      totalHectaresRestoredSum: 0,
      totalHectaresRestoredGoal: null,
      totalJobsCreated: 0,
      jobsCreatedGoal: null,
      totalSites: 0,
      totalNurseries: 0,
      totalProjectReports: 0
    }
  }
};
