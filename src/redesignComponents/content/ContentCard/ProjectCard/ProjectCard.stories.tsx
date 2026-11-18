import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import ProjectCard from "./ProjectCard";

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
      description: "Submission status of the project"
    },
    plantingStatus: {
      control: "select",
      options: [null, "not-started", "in-progress", "completed", "not-available"],
      description: "Planting progress; `null` falls back to the Not Available tag"
    },
    isIncomplete: {
      control: "boolean",
      description: "Greys out the metric icons and disables the sites, nurseries and reports actions"
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
    programmeName: "Programme",
    country: "Country",
    imageUrl: "https://i.pravatar.cc/300?img=12",
    status: "approved",
    plantingStatus: "in-progress",
    treesGrown: { value: 120000, goal: 200000, tooltipContent: "Trees grown to date against the project goal" },
    areaRestored: { value: 600, goal: 1000, tooltipContent: "Hectares restored against the project goal" },
    jobsCreated: { value: 300, goal: 500, tooltipContent: "Jobs created against the project goal" },
    sitesCount: 12,
    nurseriesCount: 4
  }
};

export const Incomplete: Story = {
  args: {
    title: "Project Title",
    organisationName: "Organization Name",
    programmeName: "Programme",
    country: "Country",
    imageUrl: null,
    status: "draft",
    plantingStatus: null,
    treesGrown: { value: 0, goal: 0, tooltipContent: "Trees grown to date against the project goal" },
    areaRestored: { value: 0, goal: 0, tooltipContent: "Hectares restored against the project goal" },
    jobsCreated: { value: 0, goal: 0, tooltipContent: "Jobs created against the project goal" },
    sitesCount: 0,
    nurseriesCount: 0,
    isIncomplete: true
  }
};
