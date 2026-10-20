import { Framework, isTerrafund } from "@/context/framework.provider";
import type { EntityExportAllQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import type { ProjectFullDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { appendQueryParams } from "@/utils/appendQueryParams";
import { isAbsentChangeRequestStatus } from "@/utils/changeRequestStatusDisplay";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import type {
  SiteIndexMetric,
  SiteIndexProject,
  SiteIndexSite,
  SiteIndexStatus,
  SiteIndexUpdate
} from "./siteIndex.types";

export const ALL_PROJECTS_VIEW = "all";

export const SITE_INDEX_ORIGIN = "sites";

export const getSiteDetailUrl = (siteUuid: string, fromSiteIndex: boolean, tab?: string): string =>
  appendQueryParams(getEntityDetailPageLink("sites", siteUuid, tab), {
    origin: fromSiteIndex ? SITE_INDEX_ORIGIN : undefined
  });

export const isSiteApproved = (site: Pick<SiteIndexSite, "status">): boolean => site.status === "approved";

export const SITE_INDEX_ATTENTION_STATUSES: ReadonlySet<SiteIndexStatus> = new Set([
  "draft",
  "information-required",
  "due"
]);

export const getSiteCreateUrl = (project: Pick<SiteIndexProject, "id" | "frameworkKey">): string =>
  `/entity/sites/create/${project.frameworkKey}?parent_name=projects&parent_uuid=${project.id}`;

export const toSiteIndexStatus = (status: string | null | undefined): SiteIndexStatus => {
  const mapped = mapStatusToTagStateEntity(status)?.type;
  if (
    mapped === "draft" ||
    mapped === "pending-approval" ||
    mapped === "information-required" ||
    mapped === "approved"
  ) {
    return mapped;
  }
  return "draft";
};

export const toSiteIndexUpdate = (updateRequestStatus: string | null | undefined): SiteIndexUpdate | null => {
  if (isAbsentChangeRequestStatus(updateRequestStatus)) {
    return null;
  }
  if (updateRequestStatus === "approved") {
    return "complete";
  }
  if (
    updateRequestStatus === "draft" ||
    updateRequestStatus === "pending-approval" ||
    updateRequestStatus === "information-required"
  ) {
    return updateRequestStatus;
  }
  return null;
};

export const mapSiteToIndexSite = (site: SiteLightDto, frameworkKey: Framework): SiteIndexSite => ({
  id: site.uuid,
  name: site.name?.trim() ?? "-",
  frameworkKey,
  status: toSiteIndexStatus(site.status),
  update: toSiteIndexUpdate(site.updateRequestStatus),
  updateRequestStatus: site.updateRequestStatus,
  createdAt: site.createdAt,
  updatedAt: site.updatedAt,
  plantingStatus: site.plantingStatus,
  treesPlantedCount: site.treesPlantedCount ?? 0,
  totalHectaresRestoredSum: site.totalHectaresRestoredSum ?? 0,
  hectaresToRestoreGoal: site.hectaresToRestoreGoal
});

type SiteExportFrameworkKey = NonNullable<EntityExportAllQueryParams["frameworkKey"]>;

export const groupSiteUuidsByFramework = (sites: SiteIndexSite[]) => {
  const grouped = new Map<SiteExportFrameworkKey, string[]>();

  sites.forEach(site => {
    if (site.frameworkKey === Framework.UNDEFINED) {
      return;
    }

    const frameworkKey = site.frameworkKey as SiteExportFrameworkKey;
    const uuids = grouped.get(frameworkKey) ?? [];
    uuids.push(site.id);
    grouped.set(frameworkKey, uuids);
  });

  return Array.from(grouped, ([frameworkKey, uuids]) => ({ frameworkKey, uuids }));
};

export const toSiteIndexUpdateRequestStatus = (
  update: SiteIndexUpdate | null | undefined
): NonNullable<SiteLightDto["updateRequestStatus"]> | undefined => {
  if (update == null) {
    return undefined;
  }
  if (update === "complete") {
    return "approved";
  }
  return update;
};

const metric = (progress: number | null | undefined, goal: number | null | undefined): SiteIndexMetric => ({
  progress: progress ?? 0,
  goal: goal ?? 0
});

const firstPositiveGoal = (...values: Array<number | null | undefined>) =>
  values.find(value => value != null && value > 0) ?? 0;

/**
 * Project header metrics. The full project supplies the values and goals; until it has loaded, the totals
 * from the sites meta endpoint stand in for the sums the index used to compute from loaded sites.
 */
export const buildProjectMetrics = (
  frameworkKey: Framework,
  project: ProjectFullDto | undefined,
  totals: { treesPlanted: number; hectaresRestored: number }
): SiteIndexProject["metrics"] => {
  const treesPlanted = project?.treesPlantedCount ?? totals.treesPlanted;
  const treesFromReportsAnr = project?.regeneratedTreesCount ?? 0;
  const combinedTreesProgress = treesPlanted + (project?.seedsPlantedCount ?? 0) + treesFromReportsAnr;
  const treesGoal = firstPositiveGoal(project?.treesGrownGoal);
  const restoredAreaProgress = project?.totalHectaresRestoredSum ?? totals.hectaresRestored;
  const restoredAreaGoal = firstPositiveGoal(project?.totalHectaresRestoredGoal);

  if (frameworkKey === Framework.HBF) {
    return {
      saplingsGrowing: metric(combinedTreesProgress, firstPositiveGoal(project?.nurserySeedlingsGoal, treesGoal)),
      areaRestored: metric(restoredAreaProgress, restoredAreaGoal)
    };
  }

  if (isTerrafund(frameworkKey)) {
    return {
      treesPlanted: metric(treesPlanted, treesGoal),
      treesRegenerated: metric(project?.treesRestoredPpc, treesGoal),
      areaRestored: metric(restoredAreaProgress, restoredAreaGoal)
    };
  }

  return {
    treesGrowing: metric(combinedTreesProgress, treesGoal),
    areaRestored: metric(restoredAreaProgress, restoredAreaGoal),
    workdays: metric(project?.combinedWorkdayCount ?? project?.workdayCount, project?.jobsCreatedGoal)
  };
};
