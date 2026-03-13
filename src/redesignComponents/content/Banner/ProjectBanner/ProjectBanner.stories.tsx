import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
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
  onTabClick: action("Tab clicked")
};

const mockBreadcrumbs = [
  { label: "Projects", link: "/", icon: <ProjectIcon className="!text-theme-primary-900" /> },
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
  name: "Restoration project in the Uganda Basin",
  shortName: "Congo Basin Project",
  plantingStartDate: "2024-01-01T00:00:00.000Z",
  country: "Uganda",
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
  states: ["Uganda"],
  projectCountyDistrict: null,
  plantingEndDate: "2026-12-31T00:00:00.000Z",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit, odio lacus dui platea eu aptent aliquam egestas, malesuada class nostra arcu imperdiet suscipit. Molestie posuere nam ullamcorper dui nibh velit himenaeos, taciti felis quam vivamus justo egestas iaculis, nunc volutpat erat augue tempus curabitur. Taciti orci tempus primis erat vulputate purus ornare vehicula, semper sollicitudin feugiat hendrerit viverra etiam torquent nam nisl, fames non nisi morbi egestas vel iaculis."
} as ProjectFullDto;

const baseArgs: ProjectBannerProps = {
  breadcrumbs: mockBreadcrumbs,
  suffix: (
    <Button variant="borderless" size="small" className="underline underline-offset-2">
      Reports
    </Button>
  ),
  toolbar: {
    tabBar: mockTabBar
  },
  project: mockProject,
  onAddTeamClick: action("Add team clicked"),
  gotoTeamMembers: action("Go to team members clicked")
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
