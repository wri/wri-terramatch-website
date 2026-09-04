import { Framework } from "@/context/framework.provider";
import type { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";

export type SiteIndexStatus = Extract<
  TagSubmissionState,
  "draft" | "pending-approval" | "information-required" | "approved" | "due" | "not-started"
>;

export interface SiteIndexSite {
  id: string;
  name: string;
  changeRequest: SiteIndexStatus;
  status: SiteIndexStatus;
  dateCreated?: string;
}

export interface SiteIndexProject {
  id: string;
  name: string;
  frameworkKey: Framework;
  organisationName: string;
  attentionCount: number;
  metrics: {
    treesGrowing?: { progress: number; goal: number };
    saplingsGrowing?: { progress: number; goal: number };
    treesPlanted?: { progress: number; goal: number };
    treesRegenerated?: { progress: number; goal: number };
    areaRestored: { progress: number; goal: number };
    workdays?: { progress: number; goal: number };
  };
  sites: SiteIndexSite[];
}

const baseSites: SiteIndexSite[] = [
  {
    id: "northern-watershed",
    name: "Northern Watershed Site",
    changeRequest: "pending-approval",
    status: "pending-approval",
    dateCreated: "14/08/2026"
  },
  {
    id: "kijani-community",
    name: "Kijani Community Site",
    changeRequest: "draft",
    status: "information-required",
    dateCreated: "02/08/2026"
  },
  {
    id: "riverbank-recovery",
    name: "Riverbank Recovery Site",
    changeRequest: "information-required",
    status: "information-required",
    dateCreated: "26/07/2026"
  },
  {
    id: "highland-forest",
    name: "Highland Forest Site",
    changeRequest: "draft",
    status: "due"
  },
  {
    id: "coastal-mangrove",
    name: "Coastal Mangrove Site",
    changeRequest: "due",
    status: "due"
  },
  {
    id: "green-valley",
    name: "Green Valley Site",
    changeRequest: "draft",
    status: "approved",
    dateCreated: "11/06/2026"
  },
  {
    id: "acacia-corridor",
    name: "Acacia Corridor Site",
    changeRequest: "approved",
    status: "approved",
    dateCreated: "30/05/2026"
  },
  {
    id: "lake-basin",
    name: "Lake Basin Site",
    changeRequest: "pending-approval",
    status: "pending-approval",
    dateCreated: "21/05/2026"
  },
  {
    id: "community-long-name",
    name: "Community Site with a very long name that truncates safely",
    changeRequest: "draft",
    status: "not-started",
    dateCreated: "09/05/2026"
  },
  {
    id: "dryland-restoration",
    name: "Dryland Restoration Site",
    changeRequest: "approved",
    status: "approved",
    dateCreated: "28/04/2026"
  },
  {
    id: "mountain-springs",
    name: "Mountain Springs Site",
    changeRequest: "draft",
    status: "not-started",
    dateCreated: "07/04/2026"
  }
];

export const siteIndexProjects: SiteIndexProject[] = [
  {
    id: "project-1",
    name: "Restoring the Northern Watersheds",
    frameworkKey: Framework.PPC,
    organisationName: "Green Future Alliance",
    attentionCount: 15,
    metrics: {
      treesGrowing: { progress: 624000, goal: 1000000 },
      areaRestored: { progress: 2460, goal: 4000 },
      workdays: { progress: 18800, goal: 30000 }
    },
    sites: baseSites
  },
  {
    id: "project-2",
    name: "Community Forest Recovery",
    frameworkKey: Framework.HBF,
    organisationName: "Kijani Restoration Network",
    attentionCount: 4,
    metrics: {
      saplingsGrowing: { progress: 185000, goal: 350000 },
      areaRestored: { progress: 980, goal: 1800 }
    },
    sites: baseSites.slice(0, 5).map(site => ({ ...site, id: `p2-${site.id}` }))
  },
  {
    id: "project-3",
    name: "Coastal Ecosystems Programme",
    frameworkKey: Framework.TF,
    organisationName: "Blue Green Foundation",
    attentionCount: 2,
    metrics: {
      treesPlanted: { progress: 94000, goal: 200000 },
      treesRegenerated: { progress: 56000, goal: 120000 },
      areaRestored: { progress: 710, goal: 1500 }
    },
    sites: baseSites.slice(4, 9).map(site => ({ ...site, id: `p3-${site.id}` }))
  }
];
