import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { buildStore } from "@/utils/testStore";

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
  totalHectaresRestoredSum: 600,
  totalHectaresRestoredGoal: 1000,
  combinedWorkdayCount: 0,
  totalJobsCreated: 300,
  jobsCreatedGoal: 500,
  totalSites: 12,
  totalNurseries: 4,
  totalProjectReports: 3
};

const STORY_REPORTING_FRAMEWORKS: Record<string, string> = {
  ppc: "PPC",
  hbf: "Harit Bharat Fund",
  "terrafund-non-profits": "TerraFund Non-Profits"
};

const STORY_COUNTRIES: Record<string, string> = {
  KEN: "Kenya"
};

const addReportingFramework = (builder: ReturnType<typeof buildStore>, slug: string, name: string) => {
  builder.store.reportingFrameworks[slug] = {
    attributes: {
      uuid: slug,
      name,
      slug,
      projectFormUuid: null,
      projectReportFormUuid: null,
      siteFormUuid: null,
      siteReportFormUuid: null,
      nurseryFormUuid: null,
      nurseryReportFormUuid: null,
      financialReportFormUuid: null,
      disturbanceReportFormUuid: null,
      totalProjectsCount: 0
    }
  };
  return builder;
};

const meta: Meta<typeof ProjectCard> = {
  title: "Redesign Components/Containers/Cards/Project Card",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    storeBuilder: Object.entries(STORY_REPORTING_FRAMEWORKS).reduce(
      (builder, [slug, name]) => addReportingFramework(builder, slug, name),
      buildStore().addGadmCodes("level0", STORY_COUNTRIES)
    )
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

export const WithoutNurseries: Story = {
  args: { project: { ...DEFAULT_PROJECT, frameworkKey: "ppc" } }
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
      treesPlantedCount: 0,
      treesGrownGoal: 0,
      totalHectaresRestoredSum: 0,
      totalHectaresRestoredGoal: 0,
      totalJobsCreated: 0,
      jobsCreatedGoal: null,
      totalSites: 0,
      totalNurseries: 0,
      totalProjectReports: 0
    }
  }
};
