import { Framework } from "@/context/framework.provider";
import type { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";

export type SiteIndexStatus = Extract<
  TagSubmissionState,
  "draft" | "pending-approval" | "information-required" | "approved" | "due" | "not-started"
>;

export type SiteIndexUpdate =
  | Extract<SiteIndexStatus, "draft" | "pending-approval" | "information-required">
  | "complete";

export type SiteIndexMetric = {
  progress: number;
  goal: number;
};

export interface SiteIndexSite {
  id: string;
  name: string;
  frameworkKey: Framework;
  status: SiteIndexStatus;
  update: SiteIndexUpdate;
  updateRequestStatus: "draft" | "pending-approval" | "approved" | "information-required" | null;
  createdAt: string;
  plantingStatus: string | null;
  treesPlantedCount: number;
  totalHectaresRestoredSum: number;
  hectaresToRestoreGoal: number | null;
}

export interface SiteIndexProject {
  id: string;
  name: string;
  frameworkKey: Framework;
  organisationName: string;
  attentionCount: number;
  metrics: {
    treesGrowing?: SiteIndexMetric;
    saplingsGrowing?: SiteIndexMetric;
    treesPlanted?: SiteIndexMetric;
    treesRegenerated?: SiteIndexMetric;
    areaRestored: SiteIndexMetric;
    workdays?: SiteIndexMetric;
  };
  sites: SiteIndexSite[];
}
