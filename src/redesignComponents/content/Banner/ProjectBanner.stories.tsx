import type { Meta, StoryObj } from "@storybook/react";

import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronRight } from "@/redesignComponents/foundations/Icons";
import { TabBarWriProps } from "@/redesignComponents/navigation/TabBar/TabBar";

import ProjectBanner, { ProjectBannerProps } from "./ProjectBanner";

const meta: Meta<typeof ProjectBanner> = {
  title: "Redesign Components/Content/Banner/Project Banner",
  component: ProjectBanner,
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof ProjectBanner>;

const mockTabBar: TabBarWriProps = {
  tabs: [
    { value: "overview", label: "Overview" },
    { value: "reports", label: "Reports" },
    { value: "team", label: "Team" }
  ],
  defaultValue: "overview",
  onTabClick: (tabValue: string) => console.log("Tab clicked:", tabValue)
};

const mockBreadcrumbs = [
  { label: "Home", link: "/", icon: <ChevronRight /> },
  { label: "Projects", link: "/projects" },
  { label: "Restoration project in the Congo Basin", link: "/projects/1" }
];

const mockProject: ProjectFullDto = {
  lightResource: false,
  uuid: "project-1",
  frameworkKey: "standard",
  organisationName: "WRI Example Organization",
  organisationUuid: "org-1",
  organisationType: "ngo",
  status: "started",
  plantingStatus: "in-progress",
  updateRequestStatus: "no-update",
  name: "Restoration project in the Congo Basin",
  shortName: "Congo Basin Project",
  plantingStartDate: "2024-01-01T00:00:00.000Z",
  country: "Republic of the Congo",
  lat: null,
  long: null,
  totalHectaresRestoredSum: 1500,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-06-01T00:00:00.000Z",
  treesPlantedCount: 500000,
  isTest: false,
  feedback: null,
  feedbackFields: null,
  cohort: null,
  continent: "Africa",
  states: ["Republic of the Congo"],
  projectCountyDistrict: null,
  plantingEndDate: "2026-12-31T00:00:00.000Z",
  description: "High-impact restoration project in the Congo Basin."
} as ProjectFullDto;

const baseArgs: ProjectBannerProps = {
  breadcrumbs: mockBreadcrumbs,
  suffix: (
    <Button variant="secondary" size="small" rightIcon={<ChevronRight />}>
      Edit project
    </Button>
  ),
  toolbar: {
    tabBar: mockTabBar
  },
  project: mockProject,
  onAddTeamClick: () => {
    console.log("Add team clicked");
  },
  gotoTeamMembers: () => {
    console.log("Go to team members clicked");
  }
};

export const Default: Story = {
  args: baseArgs
};

export const CompletedProject: Story = {
  args: {
    ...baseArgs,
    project: {
      ...baseArgs.project,
      plantingStatus: "completed" as ProjectFullDto["plantingStatus"],
      name: "Completed restoration project in the Congo Basin"
    }
  }
};
