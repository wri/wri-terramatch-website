import { Framework, isTerrafund, toFramework } from "@/context/framework.provider";
import type { EntityExportAllQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import type { ProjectFullDto, ProjectLightDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
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

export const SITE_INDEX_ATTENTION_STATUSES: ReadonlySet<SiteIndexStatus> = new Set([
  "draft",
  "information-required",
  "due",
  "not-started"
]);

type SiteIndexLightDto = SiteLightDto & {
  projectUuid?: string | null;
};

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

export const toSiteIndexUpdate = (updateRequestStatus: string | null | undefined): SiteIndexUpdate => {
  if (isAbsentChangeRequestStatus(updateRequestStatus) || updateRequestStatus === "approved") {
    return "complete";
  }
  if (
    updateRequestStatus === "draft" ||
    updateRequestStatus === "pending-approval" ||
    updateRequestStatus === "information-required"
  ) {
    return updateRequestStatus;
  }
  return "complete";
};

export const mapSiteToIndexSite = (site: SiteLightDto, frameworkKey: Framework): SiteIndexSite => ({
  id: site.uuid,
  name: site.name?.trim() || "Unnamed site",
  frameworkKey,
  status: toSiteIndexStatus(site.status),
  update: toSiteIndexUpdate(site.updateRequestStatus),
  updateRequestStatus: site.updateRequestStatus,
  createdAt: site.createdAt,
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

const metric = (progress: number | null | undefined, goal: number | null | undefined): SiteIndexMetric => ({
  progress: progress ?? 0,
  goal: goal ?? 0
});

export const buildProjectMetrics = (
  frameworkKey: Framework,
  project: ProjectFullDto | ProjectLightDto | undefined,
  sites: SiteIndexSite[]
): SiteIndexProject["metrics"] => {
  const treesPlanted = sites.reduce((total, site) => total + site.treesPlantedCount, 0);
  const areaRestored = sites.reduce((total, site) => total + site.totalHectaresRestoredSum, 0);
  const areaGoal = sites.reduce((total, site) => total + (site.hectaresToRestoreGoal ?? 0), 0);
  const fullProject = project != null && project.lightResource === false ? (project as ProjectFullDto) : undefined;

  const treesProgress = fullProject?.treesPlantedCount ?? treesPlanted;
  const treesGoal = fullProject?.treesGrownGoal ?? 0;
  const restoredAreaProgress = fullProject?.totalHectaresRestoredSum ?? areaRestored;
  const restoredAreaGoal = fullProject?.totalHectaresRestoredGoal ?? areaGoal;

  if (frameworkKey === Framework.HBF) {
    return {
      saplingsGrowing: metric(treesProgress, fullProject?.nurserySeedlingsGoal ?? treesGoal),
      areaRestored: metric(restoredAreaProgress, restoredAreaGoal)
    };
  }

  if (isTerrafund(frameworkKey)) {
    return {
      treesPlanted: metric(treesProgress, treesGoal),
      treesRegenerated: metric(fullProject?.treesRestoredPpc, treesGoal),
      areaRestored: metric(restoredAreaProgress, restoredAreaGoal)
    };
  }

  return {
    treesGrowing: metric(fullProject?.treesRestoredPpc ?? treesProgress, treesGoal),
    areaRestored: metric(restoredAreaProgress, restoredAreaGoal),
    workdays: metric(fullProject?.combinedWorkdayCount ?? fullProject?.workdayCount, fullProject?.jobsCreatedGoal)
  };
};

export const getSitesRequiringAttention = (sites: SiteIndexSite[]): number =>
  sites.filter(site => SITE_INDEX_ATTENTION_STATUSES.has(site.status)).length;

const resolveProjectUuid = (site: SiteIndexLightDto, projects: ProjectLightDto[]): string | null => {
  if (site.projectUuid != null && site.projectUuid !== "") {
    return site.projectUuid;
  }

  const nameMatches = projects.filter(project => project.name === site.projectName);
  if (nameMatches.length === 1) {
    return nameMatches[0].uuid;
  }

  const frameworkMatches = nameMatches.filter(project => project.frameworkKey === site.frameworkKey);
  if (frameworkMatches.length === 1) {
    return frameworkMatches[0].uuid;
  }

  return nameMatches[0]?.uuid ?? null;
};

export const groupSitesByProject = (
  projects: ProjectLightDto[],
  sites: SiteLightDto[],
  fullProjectsById: Map<string, ProjectFullDto>
): SiteIndexProject[] => {
  const sitesByProjectUuid = new Map<string, SiteIndexSite[]>();

  sites.forEach(site => {
    const projectUuid = resolveProjectUuid(site, projects);
    if (projectUuid == null) {
      return;
    }

    const mappedSite = mapSiteToIndexSite(site, toFramework(site.frameworkKey));
    const current = sitesByProjectUuid.get(projectUuid) ?? [];
    current.push(mappedSite);
    sitesByProjectUuid.set(projectUuid, current);
  });

  return projects
    .map(project => {
      const frameworkKey = toFramework(project.frameworkKey);
      const projectSites = (sitesByProjectUuid.get(project.uuid) ?? []).map(site => ({ ...site, frameworkKey }));

      return {
        id: project.uuid,
        name: project.name?.trim() || "Unnamed project",
        frameworkKey,
        organisationName: project.organisationName?.trim() || "",
        attentionCount: getSitesRequiringAttention(projectSites),
        metrics: buildProjectMetrics(frameworkKey, fullProjectsById.get(project.uuid) ?? project, projectSites),
        sites: projectSites
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
};
