import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import FrameworkProvider from "@/context/framework.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import ProjectHeader from "./ProjectHeader";

// Create a QueryClient instance for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
});

// Mock fetch to avoid hitting real endpoints in Storybook
// Note: This is a simple mock. For more complex scenarios, consider using MSW (Mock Service Worker)
if (typeof (globalThis as any).fetch !== "function" || !(globalThis as any).__project_header_mock_fetch__) {
  (globalThis as any).__project_header_mock_fetch__ = true;
  const originalFetch = (globalThis as any).fetch;
  (globalThis as any).fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : (input as URL).toString();

    // Mock partners endpoint
    if (url.includes("/v2/projects/") && url.includes("/partners")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com"
            },
            {
              first_name: "Jane",
              last_name: "Smith",
              email: "jane.smith@example.com"
            }
          ]
        })
      } as Response;
    }

    // For other endpoints, use original fetch if available, otherwise return empty response
    if (originalFetch && typeof originalFetch === "function") {
      return originalFetch(input);
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({})
    } as Response;
  };
}

// Helper function to create a minimal mock project
const createMockProject = (overrides: Partial<ProjectFullDto> = {}): ProjectFullDto => {
  const baseProject: ProjectFullDto = {
    lightResource: false,
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    frameworkKey: "terrafund",
    organisationName: "Organisation Name",
    organisationUuid: "550e8400-e29b-41d4-a716-446655440001",
    organisationType: "NGO",
    status: "approved",
    plantingStatus: "in-progress",
    updateRequestStatus: null,
    name: "Project Name",
    shortName: "PN",
    plantingStartDate: "2024-01-01T00:00:00Z",
    country: "Ghana",
    lat: 9.145,
    long: 38.7667,
    totalHectaresRestoredSum: 1000,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    treesPlantedCount: 50000,
    jobsCreatedGoal: null,
    seedsGrownGoal: null,
    isTest: false,
    feedback: null,
    feedbackFields: null,
    cohort: null,
    continent: "Africa",
    states: null,
    projectCountyDistrict: null,
    plantingEndDate: "2026-12-31T00:00:00Z",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    budget: 1000000,
    history: null,
    objectives: null,
    environmentalGoals: null,
    socioeconomicGoals: null,
    sdgsImpacted: null,
    totalHectaresRestoredGoal: 2000,
    treesGrownGoal: 100000,
    treesToBeRestoredGoal: 85000,
    treesToBePlantedSpeciesGoalTotal: 475000,
    survivalRate: 85,
    lastReportedSurvivalRate: 85,
    landUseTypes: null,
    restorationStrategy: null,
    incomeGeneratingActivities: null,
    seedsPlantedCount: 0,
    regeneratedTreesCount: 0,
    workdayCount: 0,
    selfReportedWorkdayCount: 0,
    combinedWorkdayCount: 0,
    totalJobsCreated: 0,
    totalSites: 5,
    totalNurseries: 2,
    totalProjectReports: 10,
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
    directSeedingSurvivalRate: null,
    nurserySeedlingsGoal: null,
    application: {
      uuid: "550e8400-e29b-41d4-a716-446655440002",
      fundingProgrammeName: "Restoration Fund",
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
    detailedProjectBudget: {
      entityType: "projects",
      entityUuid: "550e8400-e29b-41d4-a716-446655440000",
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
      createdAt: "2024-01-01T00:00:00Z",
      description: null,
      photographer: null,
      createdByUserName: null,
      profileImageScale: null,
      profileImagePosition: null
    },
    consortiumPartnershipAgreements: [],
    treesRegeneratingSpeciesCount: 0
  };

  return { ...baseProject, ...overrides };
};

const meta: Meta<typeof ProjectHeader> = {
  title: "Redesign Components/Content/Headers/Project Header",
  component: ProjectHeader,
  tags: ["autodocs"],
  argTypes: {
    project: {
      control: "object",
      description: "The project data object"
    }
  },
  decorators: [
    (Story, context) => {
      const project = context.args?.project as ProjectFullDto | undefined;
      const frameworkKey = project?.frameworkKey ?? "terrafund";
      return (
        <QueryClientProvider client={queryClient}>
          <FrameworkProvider frameworkKey={frameworkKey}>
            <Story />
          </FrameworkProvider>
        </QueryClientProvider>
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof ProjectHeader>;

export const Default: Story = {
  args: {
    project: createMockProject({
      name: "Project Name",
      plantingStatus: "in-progress",
      country: "Ghana",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
  }
};

/**
 * Project header with not-started progress tag
 */
export const NotStarted: Story = {
  args: {
    project: createMockProject({
      name: "Project Name",
      plantingStatus: "not-started",
      country: "Ghana",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
  }
};

/**
 * Project header with in-progress tag
 */
export const InProgress: Story = {
  args: {
    project: createMockProject({
      name: "Project Name",
      plantingStatus: "in-progress",
      country: "Ghana",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
  }
};

/**
 * Project header with complete progress tag
 */
export const Complete: Story = {
  args: {
    project: createMockProject({
      name: "Project Name",
      plantingStatus: "completed",
      country: "Ghana",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
  }
};

/**
 * Project header without description
 */
export const WithoutDescription: Story = {
  args: {
    project: createMockProject({
      name: "Project Name",
      plantingStatus: "in-progress",
      country: "Ghana",
      description: null
    })
  }
};

/**
 * Project header without team (no partners data)
 */
export const WithoutTeam: Story = {
  args: {
    project: createMockProject({
      name: "Project Name",
      plantingStatus: "in-progress",
      country: "Ghana",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      plantingStartDate: "2024-04-01T00:00:00Z",
      plantingEndDate: "2026-03-31T00:00:00Z"
    })
  }
};

/**
 * All progress tag states comparison
 */
export const AllProgressStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <ProjectHeader
        onAddTeamClick={() => {}}
        gotoTeamMembers={() => {}}
        project={createMockProject({
          name: "Project Name",
          plantingStatus: "not-started",
          country: "Ghana",
          plantingStartDate: "2025-01-01T00:00:00Z",
          plantingEndDate: "2026-12-31T00:00:00Z",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        })}
      />
      <ProjectHeader
        onAddTeamClick={() => {}}
        gotoTeamMembers={() => {}}
        project={createMockProject({
          name: "Project Name",
          plantingStatus: "in-progress",
          country: "Ghana",
          plantingStartDate: "2024-01-01T00:00:00Z",
          plantingEndDate: "2025-12-31T00:00:00Z",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        })}
      />
      <ProjectHeader
        onAddTeamClick={() => {}}
        gotoTeamMembers={() => {}}
        project={createMockProject({
          name: "Project Name",
          plantingStatus: "completed",
          country: "Ghana",
          plantingStartDate: "2022-01-01T00:00:00Z",
          plantingEndDate: "2023-12-31T00:00:00Z",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        })}
      />
    </div>
  )
};
