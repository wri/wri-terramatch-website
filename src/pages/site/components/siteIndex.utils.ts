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

export const isSiteApproved = (site: Pick<SiteIndexSite, "status">): boolean => site.status === "approved";

export const SITE_INDEX_ATTENTION_STATUSES: ReadonlySet<SiteIndexStatus> = new Set([
  "draft",
  "information-required",
  "due"
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

const metric = (progress: number | null | undefined, goal: number | null | undefined): SiteIndexMetric => ({
  progress: progress ?? 0,
  goal: goal ?? 0
});

const firstPositiveGoal = (...values: Array<number | null | undefined>) =>
  values.find(value => value != null && value > 0) ?? 0;

export const buildProjectMetrics = (
  frameworkKey: Framework,
  project: ProjectFullDto | ProjectLightDto | undefined,
  sites: SiteIndexSite[]
): SiteIndexProject["metrics"] => {
  const siteTreesPlanted = sites.reduce((total, site) => total + site.treesPlantedCount, 0);
  const siteAreaRestored = sites.reduce((total, site) => total + site.totalHectaresRestoredSum, 0);
  const siteAreaGoal = sites.reduce((total, site) => total + (site.hectaresToRestoreGoal ?? 0), 0);
  const fullProject = project != null && project.lightResource === false ? (project as ProjectFullDto) : undefined;

  const treesPlanted = fullProject?.treesPlantedCount ?? project?.treesPlantedCount ?? siteTreesPlanted;
  const treesFromReportsAnr = fullProject?.regeneratedTreesCount ?? 0;
  const combinedTreesProgress = treesPlanted + (fullProject?.seedsPlantedCount ?? 0) + treesFromReportsAnr;
  const treesGoal = firstPositiveGoal(fullProject?.treesGrownGoal);
  const restoredAreaProgress =
    fullProject?.totalHectaresRestoredSum ?? project?.totalHectaresRestoredSum ?? siteAreaRestored;
  const restoredAreaGoal = firstPositiveGoal(fullProject?.totalHectaresRestoredGoal, siteAreaGoal);

  if (frameworkKey === Framework.HBF) {
    return {
      saplingsGrowing: metric(combinedTreesProgress, firstPositiveGoal(fullProject?.nurserySeedlingsGoal, treesGoal)),
      areaRestored: metric(restoredAreaProgress, restoredAreaGoal)
    };
  }

  if (isTerrafund(frameworkKey)) {
    return {
      treesPlanted: metric(treesPlanted, treesGoal),
      treesRegenerated: metric(fullProject?.treesRestoredPpc, treesGoal),
      areaRestored: metric(restoredAreaProgress, restoredAreaGoal)
    };
  }

  return {
    treesGrowing: metric(combinedTreesProgress, treesGoal),
    areaRestored: metric(restoredAreaProgress, restoredAreaGoal),
    workdays: metric(fullProject?.combinedWorkdayCount ?? fullProject?.workdayCount, fullProject?.jobsCreatedGoal)
  };
};

export const getSitesRequiringAttention = (sites: SiteIndexSite[]): number =>
  sites.filter(site => SITE_INDEX_ATTENTION_STATUSES.has(site.status)).length;

export const filterSiteIndexSites = (
  sites: SiteIndexSite[],
  options: {
    search?: string;
    statusFilters?: SiteIndexStatus[];
    updateFilter?: SiteIndexUpdate | null;
  }
): SiteIndexSite[] => {
  const query = options.search?.trim().toLowerCase() ?? "";
  const statusFilters = options.statusFilters ?? [];
  const updateFilter = options.updateFilter ?? null;

  return sites.filter(site => {
    const matchesSearch = query === "" || site.name.toLowerCase().includes(query);
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(site.status);
    const matchesUpdate = updateFilter == null || site.update === updateFilter;

    return matchesSearch && matchesStatus && matchesUpdate;
  });
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

export const toSiteIndexProject = (
  project: ProjectLightDto,
  options?: {
    fullProject?: ProjectFullDto | null;
    sites?: SiteIndexSite[];
    sitesLoaded?: boolean;
    sitesLoading?: boolean;
  }
): SiteIndexProject => {
  const frameworkKey = toFramework(project.frameworkKey);
  const sites = (options?.sites ?? []).map(site => ({ ...site, frameworkKey }));
  const sitesLoaded = options?.sitesLoaded ?? false;

  return {
    id: project.uuid,
    name: project.name?.trim() ?? "-",
    frameworkKey,
    organisationName: project.organisationName?.trim() ?? "-",
    attentionCount: sitesLoaded ? getSitesRequiringAttention(sites) : 0,
    metrics: buildProjectMetrics(frameworkKey, options?.fullProject ?? project, sites),
    sites,
    sitesLoaded,
    sitesLoading: options?.sitesLoading ?? false
  };
};

const normalize = (value?: string | null) => value?.trim().toLocaleLowerCase() ?? "";

const getProjectMatch = (site: SiteIndexLightDto, projects: ProjectLightDto[]) => {
  if (site.projectUuid != null && site.projectUuid !== "") {
    const projectByUuid = projects.find(project => project.uuid === site.projectUuid);
    if (projectByUuid != null) {
      return projectByUuid;
    }
  }

  const siteProjectName = normalize(site.projectName);
  const nameMatches = projects.filter(
    project => normalize(project.name) === siteProjectName || normalize(project.shortName) === siteProjectName
  );
  if (nameMatches.length === 1) {
    return nameMatches[0];
  }

  const frameworkMatches = nameMatches.filter(project => project.frameworkKey === site.frameworkKey);
  if (frameworkMatches.length === 1) {
    return frameworkMatches[0];
  }

  return nameMatches[0];
};

const getFallbackSectionId = (site: SiteLightDto) => [normalize(site.projectName), site.frameworkKey ?? ""].join(":");

export const groupSitesByProject = (
  projects: ProjectLightDto[],
  sites: SiteLightDto[],
  fullProjectsById: Map<string, ProjectFullDto>
): SiteIndexProject[] => {
  const sectionsById = new Map<string, { project?: ProjectLightDto; projectName: string; sites: SiteIndexSite[] }>();

  sites.forEach(site => {
    const project = getProjectMatch(site, projects);
    const sectionId = project?.uuid ?? getFallbackSectionId(site);
    const mappedSite = mapSiteToIndexSite(site, toFramework(project?.frameworkKey ?? site.frameworkKey));
    const current = sectionsById.get(sectionId);

    if (current != null) {
      current.sites.push(mappedSite);
      return;
    }

    sectionsById.set(sectionId, {
      project,
      projectName: project?.name?.trim() || site.projectName?.trim() || "-",
      sites: [mappedSite]
    });
  });

  return Array.from(sectionsById.entries())
    .map(([id, section]) => {
      if (section.project != null) {
        return toSiteIndexProject(section.project, {
          fullProject: fullProjectsById.get(section.project.uuid),
          sites: section.sites,
          sitesLoaded: false
        });
      }

      const firstSite = section.sites[0];

      return {
        id,
        name: section.projectName,
        frameworkKey: firstSite?.frameworkKey ?? Framework.UNDEFINED,
        organisationName: "-",
        attentionCount: getSitesRequiringAttention(section.sites),
        metrics: buildProjectMetrics(firstSite?.frameworkKey ?? Framework.UNDEFINED, undefined, section.sites),
        sites: section.sites,
        sitesLoaded: true,
        sitesLoading: false
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
};
