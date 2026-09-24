import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import FrameworkProvider from "@/context/framework.provider";
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
  },
  decorators: [
    (Story, context) => {
      const project = context.args?.project as ProjectFullDto | undefined;
      const frameworkKey = project?.frameworkKey ?? "terrafund";
      return (
        <FrameworkProvider frameworkKey={frameworkKey}>
          <Story />
        </FrameworkProvider>
      );
    }
  ]
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

const mockProject = {
  lightResource: false,
  uuid: "project-1",
  frameworkKey: "terrafund",
  organisationName: "WRI Example Organization",
  organisationUuid: "org-1",
  organisationType: "ngo",
  status: "draft",
  plantingStatus: "in-progress",
  updateRequestStatus: null,
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
  polygonDataSubmission: "no-polygons-submitted",
  readyForBaseline: false,
  isTest: false,
  isArchived: false,
  feedback: null,
  feedbackFields: null,
  cohort: null,
  continent: "Africa",
  states: ["Uganda"],
  projectCountyDistrict: null,
  plantingEndDate: "2026-12-31T00:00:00.000Z",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit, odio lacus dui platea eu aptent aliquam egestas, malesuada class nostra arcu imperdiet suscipit. Molestie posuere nam ullamcorper dui nibh velit himenaeos, taciti felis quam vivamus justo egestas iaculis, nunc volutpat erat augue tempus curabitur. Taciti orci tempus primis erat vulputate purus ornare vehicula, semper sollicitudin feugiat hendrerit viverra etiam torquent nam nisl, fames non nisi morbi egestas vel iaculis.",
  budget: null,
  history: null,
  objectives: null,
  projectSummary: null,
  environmentalGoals: null,
  socioeconomicGoals: null,
  sdgsImpacted: null,
  totalHectaresRestoredGoal: null,
  treesGrownGoal: null,
  jobsCreatedGoal: null,
  survivalRate: null,
  lastReportedSurvivalRate: null,
  landUseTypes: null,
  restorationStrategy: null,
  incomeGeneratingActivities: null,
  seedsPlantedCount: 0,
  regeneratedTreesCount: 0,
  treesRegeneratingSpeciesCount: 0,
  workdayCount: 0,
  selfReportedWorkdayCount: 0,
  combinedWorkdayCount: 0,
  totalJobsCreated: 0,
  totalSites: 0,
  totalNurseries: 0,
  totalProjectReports: 0,
  totalOverdueReports: 0,
  descriptionOfProjectTimeline: null,
  sitingStrategyDescription: null,
  sitingStrategy: null,
  landholderCommEngage: null,
  communityIncentives: null,
  projPartnerInfo: null,
  seedlingsSource: null,
  landTenureProjectArea: null,
  projImpactBiodiv: null,
  projImpactFoodsec: null,
  proposedGovPartners: null,
  treesRestoredPpc: 0,
  detailedInterventionTypes: null,
  assistedNaturalRegenerationList: [],
  goalTreesRestoredAnr: null,
  treesToBeRestoredGoal: 0,
  treesToBePlantedSpeciesGoalTotal: 0,
  seedsGrownGoal: null,
  directSeedingSurvivalRate: null,
  nurserySeedlingsGoal: null,
  application: {
    uuid: "application-1",
    fundingProgrammeName: null,
    projectPitchUuid: null
  },
  media: [],
  socioeconomicBenefits: [],
  file: [],
  otherAdditionalDocuments: [],
  photos: [],
  documentFiles: [],
  programmeSubmission: [],
  proofOfLandTenureMou: [],
  consortiumPartnershipAgreements: [],
  detailedProjectBudget: {
    entityType: "projects",
    entityUuid: "project-1",
    uuid: "",
    collectionName: "detailedProjectBudget",
    url: null,
    thumbUrl: null,
    fileName: "",
    name: "",
    size: 0,
    mimeType: null,
    lat: null,
    lng: null,
    isPublic: false,
    isCover: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    description: null,
    photographer: null,
    createdByUserName: null,
    profileImageScale: null,
    profileImagePosition: null
  },
  projectQaStatus1: null,
  projectQaStatus2: null,
  projectQaStatus3: null,
  projectQaStatus4: null,
  projectQaStatus5: null
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
      plantingStatus: "completed",
      name: "Completed restoration project in the Congo Basin"
    }
  }
};
