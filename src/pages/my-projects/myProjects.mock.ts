import { ProgressState } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";

export type MyProjectStatus = "draft" | "pending-approval" | "information-required" | "approved";

export type MyProject = {
  uuid: string;
  name: string;
  organisationName: string;
  frameworkKey: string;
  programmeName: string;
  countryCode: string;
  countryName: string;
  imageUrl: string | null;
  status: MyProjectStatus;
  plantingStatus: ProgressState;
  treesCount: number;
  treesGoal: number;
  hectaresRestored: number;
  hectaresGoal: number;
  /** Workdays for PPC (which has no goal), jobs for every other framework. */
  jobsCount: number;
  jobsGoal: number;
  sitesCount: number;
  nurseriesCount: number;
  hasReports: boolean;
};

// TODO: design-only mock. Replace with the project index connection when this page is wired to the API.
const MOCK_PROJECT_TEMPLATES: MyProject[] = [
  {
    uuid: "mock-project-1",
    name: "Greening Australia PPC Project",
    organisationName: "Greening Australia",
    frameworkKey: "ppc",
    programmeName: "PPC",
    countryCode: "AU",
    countryName: "Australia",
    imageUrl: "https://picsum.photos/seed/tm-project-1/160",
    status: "approved",
    plantingStatus: "not-started",
    treesCount: 0,
    treesGoal: 250000,
    hectaresRestored: 0,
    hectaresGoal: 1200,
    jobsCount: 0,
    jobsGoal: 0,
    sitesCount: 10,
    nurseriesCount: 0,
    hasReports: false
  },
  {
    uuid: "mock-project-2",
    name: "Faja Lobi Reforestation Project",
    organisationName: "Faja Lobi",
    frameworkKey: "ppc",
    programmeName: "PPC",
    countryCode: "CD",
    countryName: "Democratic Republic of the Congo",
    imageUrl: "https://picsum.photos/seed/tm-project-2/160",
    status: "approved",
    plantingStatus: "in-progress",
    treesCount: 148200,
    treesGoal: 250000,
    hectaresRestored: 730,
    hectaresGoal: 1200,
    jobsCount: 5460,
    jobsGoal: 0,
    sitesCount: 10,
    nurseriesCount: 0,
    hasReports: true
  },
  {
    uuid: "mock-project-3",
    name: "Ecosystem and livelihoods enhancement for People, Nature and Climate in the Kenyan Rift Valley",
    organisationName: "International Tree Foundation (ITF)",
    frameworkKey: "terrafund-non-profits",
    programmeName: "TerraFund Top 100",
    countryCode: "KE",
    countryName: "Kenya",
    imageUrl: "https://picsum.photos/seed/tm-project-3/160",
    status: "approved",
    plantingStatus: "in-progress",
    treesCount: 312400,
    treesGoal: 520000,
    hectaresRestored: 1840,
    hectaresGoal: 3000,
    jobsCount: 612,
    jobsGoal: 1000,
    sitesCount: 10,
    nurseriesCount: 2,
    hasReports: true
  },
  {
    uuid: "mock-project-4",
    name: "Restoring Côte",
    organisationName: "SOS-Forêts",
    frameworkKey: "terrafund-non-profits",
    programmeName: "TerraFund Top 100",
    countryCode: "CI",
    countryName: "Côte d'Ivoire",
    imageUrl: "https://picsum.photos/seed/tm-project-4/160",
    status: "information-required",
    plantingStatus: "not-available",
    treesCount: 0,
    treesGoal: 80000,
    hectaresRestored: 0,
    hectaresGoal: 950,
    jobsCount: 0,
    jobsGoal: 340,
    sitesCount: 8,
    nurseriesCount: 4,
    hasReports: false
  },
  {
    uuid: "mock-project-5",
    name: "Bôndy Mangrove Restoration",
    organisationName: "Bôndy",
    frameworkKey: "terrafund-enterprises",
    programmeName: "TerraFund Top 100",
    countryCode: "MG",
    countryName: "Madagascar",
    imageUrl: null,
    status: "draft",
    plantingStatus: "not-available",
    treesCount: 0,
    treesGoal: 0,
    hectaresRestored: 0,
    hectaresGoal: 0,
    jobsCount: 0,
    jobsGoal: 0,
    sitesCount: 0,
    nurseriesCount: 0,
    hasReports: false
  },
  {
    uuid: "mock-project-6",
    name: "Murray-Darling Woodland Recovery",
    organisationName: "Greening Australia",
    frameworkKey: "ppc",
    programmeName: "PPC",
    countryCode: "AU",
    countryName: "Australia",
    imageUrl: "https://picsum.photos/seed/tm-project-6/160",
    status: "approved",
    plantingStatus: "not-started",
    treesCount: 0,
    treesGoal: 64000,
    hectaresRestored: 0,
    hectaresGoal: 2100,
    jobsCount: 318,
    jobsGoal: 0,
    sitesCount: 10,
    nurseriesCount: 0,
    hasReports: false
  },
  {
    uuid: "mock-project-7",
    name: "Restoring Côte: Phase Two",
    organisationName: "SOS-Forêts",
    frameworkKey: "terrafund-non-profits",
    programmeName: "TerraFund Top 100",
    countryCode: "CI",
    countryName: "Côte d'Ivoire",
    imageUrl: "https://picsum.photos/seed/tm-project-7/160",
    status: "pending-approval",
    plantingStatus: "not-available",
    treesCount: 0,
    treesGoal: 45000,
    hectaresRestored: 0,
    hectaresGoal: 6200,
    jobsCount: 0,
    jobsGoal: 1150,
    sitesCount: 0,
    nurseriesCount: 0,
    hasReports: false
  },
  {
    uuid: "mock-project-8",
    name: "Western Ghats Sapling Corridors",
    organisationName: "Harit Bharat Collective",
    frameworkKey: "hbf",
    programmeName: "Harit Bharat Fund",
    countryCode: "IN",
    countryName: "India",
    imageUrl: "https://picsum.photos/seed/tm-project-8/160",
    status: "approved",
    plantingStatus: "completed",
    treesCount: 96000,
    treesGoal: 96000,
    hectaresRestored: 410,
    hectaresGoal: 450,
    jobsCount: 228,
    jobsGoal: 240,
    sitesCount: 6,
    nurseriesCount: 0,
    hasReports: true
  }
];

export const MOCK_MY_PROJECTS: MyProject[] = [
  ...MOCK_PROJECT_TEMPLATES,
  ...MOCK_PROJECT_TEMPLATES.map(project => ({ ...project, uuid: `${project.uuid}-b` })),
  ...MOCK_PROJECT_TEMPLATES.slice(0, 4).map(project => ({ ...project, uuid: `${project.uuid}-c` }))
];
