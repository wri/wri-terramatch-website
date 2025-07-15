import { useCallback, useEffect, useMemo, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useBoundingBox } from "@/connections/BoundingBox";
import { useHectareRestoration } from "@/connections/DashboardHectareRestoration";
import { useTotalSectionHeader } from "@/connections/DashboardTotalSectionHeaders";
import { useTreeRestorationGoal } from "@/connections/DashboardTreeRestorationGoal";
import { useFullProject, useProjectIndex } from "@/connections/Entity";
import { useMedia } from "@/connections/EntityAssociation";
import { useImpactStories } from "@/connections/ImpactStory";
import { useMyUser } from "@/connections/User";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import {
  useGetV2DashboardActiveCountries,
  useGetV2DashboardActiveProjects,
  useGetV2DashboardJobsCreated,
  useGetV2DashboardViewProjectUuid,
  useGetV2DashboardVolunteersSurvivalRate
} from "@/generated/apiComponents";
import { useSitePolygonsHectares } from "@/hooks/useSitePolygonsHectares";
import { HookFilters } from "@/types/connection";
import { createQueryParams } from "@/utils/dashboardUtils";
import { convertNamesToCodes } from "@/utils/landscapeUtils";

import { HECTARES_UNDER_RESTORATION_TOOLTIP, JOBS_CREATED_TOOLTIP, TREES_PLANTED_TOOLTIP } from "../constants/tooltips";
import { useDashboardEmploymentData } from "./useDashboardEmploymentData";
import { useDashboardTreeSpeciesData } from "./useDashboardTreeSpeciesData";

// Unified project interface for internal processing until we have all the data from V3 after applying authentication
export interface ProcessedProject {
  uuid: string;
  name: string;
  organisation: string;
  organisationType: string;
  country_slug: string;
  programme?: string;
  trees_under_restoration: number;
  hectares_under_restoration: number;
  jobs_created: number;
  lat?: string | number | null;
  long?: string | number | null;
  // Legacy field for compatibility with HeaderDashboard
  project_country?: string;
  // V3 specific fields
  organisationName?: string;
  treesPlantedCount?: number;
  totalHectaresRestoredSum?: number;
  totalJobsCreated?: number;
  isV3Data?: boolean;
}

interface ExtendedProject extends ProcessedProject {
  country?: string;
}

type UnifiedProjectForCoordinates = ProcessedProject | ExtendedProject;

// Function to convert V3 project to V2-compatible structure
const convertV3ToProcessed = (v3Project: any): ProcessedProject => ({
  uuid: v3Project.uuid,
  name: v3Project.name || "",
  organisation: v3Project.organisationName || "",
  organisationType: v3Project.organisationType || "",
  country_slug: v3Project.country || "",
  programme: v3Project.frameworkKey,
  trees_under_restoration: v3Project.treesPlantedCount || 0,
  hectares_under_restoration: v3Project.totalHectaresRestoredSum || 0,
  jobs_created: v3Project.totalJobsCreated || 0,
  lat: v3Project.lat,
  long: v3Project.long,
  // Legacy field for compatibility with HeaderDashboard
  project_country: v3Project.country || "",
  // Keep V3 fields for potential future use
  organisationName: v3Project.organisationName,
  treesPlantedCount: v3Project.treesPlantedCount,
  totalHectaresRestoredSum: v3Project.totalHectaresRestoredSum,
  totalJobsCreated: v3Project.totalJobsCreated,
  isV3Data: true
});

// Function to convert V2 project to processed structure
const convertV2ToProcessed = (v2Project: any): ProcessedProject => ({
  uuid: v2Project.uuid,
  name: v2Project.name || "",
  organisation: v2Project.organisation || "",
  organisationType: v2Project.organisationType || "",
  country_slug: v2Project.country_slug || "",
  programme: v2Project.programme,
  trees_under_restoration: v2Project.trees_under_restoration || 0,
  hectares_under_restoration: v2Project.hectares_under_restoration || 0,
  jobs_created: v2Project.jobs_created || 0,
  lat: v2Project.lat,
  long: v2Project.long,
  // Legacy field for compatibility with HeaderDashboard
  project_country: v2Project.project_country || v2Project.country_slug || "",
  isV3Data: false
});

export const useDashboardData = (filters: any) => {
  const [topProject, setTopProjects] = useState<any>([]);
  const [generalBboxParsed, setGeneralBboxParsed] = useState<BBox | undefined>(undefined);
  const [, { user }] = useMyUser();
  const [dashboardHeader, setDashboardHeader] = useState([
    {
      label: "Trees Planted",
      value: "Loading...",
      tooltip: TREES_PLANTED_TOOLTIP
    },
    {
      label: "Hectares Under Restoration",
      value: "Loading...",
      tooltip: HECTARES_UNDER_RESTORATION_TOOLTIP
    },
    {
      label: "Jobs Created",
      value: "Loading...",
      tooltip: JOBS_CREATED_TOOLTIP
    }
  ]);
  const [numberTreesPlanted, setNumberTreesPlanted] = useState({
    value: 0,
    totalValue: 0
  });
  const generalBbox = useBoundingBox({
    landscapes: convertNamesToCodes(filters.landscapes),
    country: filters.country.country_slug
  });
  const [updateFilters, setUpdateFilters] = useState<any>({});
  useEffect(() => {
    const parsedFilters = {
      programmes: filters.programmes,
      country: filters.country.country_slug,
      organisationType: filters.organizations,
      landscapes: convertNamesToCodes(filters.landscapes),
      cohort: filters.cohort,
      projectUuid: filters.uuid
    };
    setUpdateFilters(parsedFilters);
  }, [filters]);
  const queryParams: any = useMemo(() => createQueryParams(updateFilters), [updateFilters]);
  const { data: isUserAllowed } = useGetV2DashboardViewProjectUuid<any>(
    {
      pathParams: { uuid: filters.uuid }
    },
    {
      enabled: !!filters.uuid
    }
  );

  const { formattedJobsData: projectEmploymentData, isLoading: isLoadingProjectEmployment } =
    useDashboardEmploymentData(filters.uuid);

  const {
    data: projectHectaresData,
    isLoading: isLoadingProjectHectares,
    allPolygonsData
  } = useSitePolygonsHectares(filters.uuid);

  const activeProjectsQueryParams: any = useMemo(() => {
    const modifiedFilters = {
      ...updateFilters,
      projectUuid: ""
    };
    return createQueryParams(modifiedFilters);
  }, [updateFilters]);

  const { showLoader, hideLoader } = useLoading();

  const [isDashboardHeaderLoaded, { data: totalSectionHeader }] = useTotalSectionHeader({
    filter: {
      "programmesType[]": filters.programmes,
      country: filters.country.country_slug,
      "organisationType[]": filters.organizations,
      landscapes: convertNamesToCodes(filters.landscapes),
      cohort: filters.cohort,
      projectUuid: filters.uuid
    }
  });

  const { data: jobsCreatedData, isLoading: isLoadingJobsCreated } = useGetV2DashboardJobsCreated<any>(
    { queryParams: queryParams },
    { enabled: !!filters && !filters.uuid }
  );

  const { data: activeCountries } = useGetV2DashboardActiveCountries<any>(
    { queryParams: queryParams },
    { enabled: !!filters }
  );

  const { searchTerm } = useDashboardContext();
  const { data: v2ActiveProjects } = useGetV2DashboardActiveProjects<any>(
    { queryParams: activeProjectsQueryParams },
    { enabled: !!filters }
  );

  const polygonsData = useMemo(() => {
    if (!allPolygonsData || allPolygonsData.length === 0) {
      return {
        centroids: [],
        data: {}
      };
    }

    const centroids: { lat: number; long: number; uuid: string; status: string }[] = [];
    const data: { [status: string]: string[] } = {};

    allPolygonsData.forEach(polygon => {
      if (polygon.lat && polygon.long && polygon.polygonUuid && polygon.status) {
        centroids.push({
          lat: polygon.lat,
          long: polygon.long,
          uuid: polygon.polygonUuid,
          status: polygon.status
        });
      }

      if (polygon.status && polygon.polygonUuid) {
        if (!data[polygon.status]) {
          data[polygon.status] = [];
        }
        data[polygon.status].push(polygon.polygonUuid);
      }
    });

    return { centroids, data };
  }, [allPolygonsData]);

  const [treeRestorationGoalLoaded, { data: dashboardRestorationGoalData }] = useTreeRestorationGoal({
    filter: {
      "programmesType[]": filters.programmes,
      country: filters.country.country_slug,
      "organisationType[]": filters.organizations,
      landscapes: convertNamesToCodes(filters.landscapes),
      cohort: filters.cohort,
      projectUuid: filters.uuid
    }
  });

  const transformedTreeRestorationGoalData = useMemo(() => {
    if (!dashboardRestorationGoalData) return null;

    const transformTreeRestorationArray = (data: any[]) => {
      return data.map(item => ({
        ...item,
        treeSpeciesPercentage:
          item.treeSpeciesGoal > 0 ? parseFloat(((item.treeSpeciesAmount / item.treeSpeciesGoal) * 100).toFixed(3)) : 0
      }));
    };

    return {
      ...dashboardRestorationGoalData,
      treesUnderRestorationActualTotal: transformTreeRestorationArray(
        dashboardRestorationGoalData.treesUnderRestorationActualTotal ?? []
      ),
      treesUnderRestorationActualForProfit: transformTreeRestorationArray(
        dashboardRestorationGoalData.treesUnderRestorationActualForProfit ?? []
      ),
      treesUnderRestorationActualNonProfit: transformTreeRestorationArray(
        dashboardRestorationGoalData.treesUnderRestorationActualNonProfit ?? []
      )
    };
  }, [dashboardRestorationGoalData]);

  const { data: dashboardVolunteersSurvivalRate, isLoading: isLoadingVolunteers } =
    useGetV2DashboardVolunteersSurvivalRate<any>({
      queryParams: queryParams
    });

  const generalHectaresUnderRestoration = useHectareRestoration({
    "programmesType[]": filters.programmes,
    country: filters.country.country_slug,
    "organisationType[]": filters.organizations,
    landscapes: convertNamesToCodes(filters.landscapes),
    cohort: filters.cohort,
    projectUuid: filters.uuid
  });

  const [projectLoaded, { data: projectFullDto }] = useFullProject({ id: filters?.uuid! });
  const [, { data: coverImage }] = useMedia({
    entity: "projects",
    uuid: filters?.uuid ?? null,
    filter: { isCover: true }
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 100;
  const [allV3Projects, setAllV3Projects] = useState<any[]>([]);
  const [isLoadingV3Projects, setIsLoadingV3Projects] = useState(false);
  const [hasMoreV3Projects, setHasMoreV3Projects] = useState(true);
  const [totalV3Projects, setTotalV3Projects] = useState(0);

  const filterParams = useMemo(() => {
    const params: HookFilters<typeof useProjectIndex> = {
      status: "approved"
    };

    if (filters?.country?.country_slug?.trim() !== "") {
      params.country = filters.country.country_slug;
    }

    if (filters?.landscapes?.length > 0) {
      params.landscape = convertNamesToCodes(filters.landscapes);
    }

    if (filters?.cohort && filters.cohort.length > 0) {
      params.cohort = filters.cohort;
    } else {
      params.cohort = ["terrafund", "terrafund-landscapes"];
    }

    if (filters?.organizations?.length === 1) {
      params.organisationType = filters.organizations;
    } else {
      params.organisationType = ["non-profit-organization", "for-profit-organization"];
    }

    if (filters?.frameworks?.length > 0) {
      params.frameworkKey = filters.frameworks;
    } else {
      params.frameworkKey = ["terrafund", "terrafund-landscapes", "enterprises"];
    }

    return params;
  }, [
    filters?.country?.country_slug,
    filters?.landscapes,
    filters?.cohort,
    filters?.organizations,
    filters?.frameworks
  ]);

  useEffect(() => {
    setPage(1);
    setAllV3Projects([]);
    setHasMoreV3Projects(true);
    setTotalV3Projects(0);
    setIsLoadingV3Projects(false);
  }, [filterParams]);

  const [v3ProjectsLoaded, { data: currentPageV3Projects, indexTotal }] = useProjectIndex({
    pageSize: PAGE_SIZE,
    pageNumber: page,
    filter: filterParams
  });

  useEffect(() => {
    if (indexTotal !== undefined) {
      setTotalV3Projects(indexTotal);
    }
  }, [indexTotal]);

  useEffect(() => {
    if (v3ProjectsLoaded && currentPageV3Projects) {
      setAllV3Projects(prevProjects => {
        if (page === 1) {
          setHasMoreV3Projects(currentPageV3Projects.length < totalV3Projects);
          return [...currentPageV3Projects];
        }

        const existingProjectsMap = new Map(prevProjects.map(p => [p.uuid, p]));
        const newUniqueProjects = currentPageV3Projects.filter(p => !existingProjectsMap.has(p.uuid));
        const mergedProjects = [...prevProjects, ...newUniqueProjects];

        setHasMoreV3Projects(mergedProjects.length < totalV3Projects && newUniqueProjects.length > 0);
        return mergedProjects;
      });

      setIsLoadingV3Projects(false);
    } else if (!v3ProjectsLoaded) {
      setIsLoadingV3Projects(true);
    }
  }, [currentPageV3Projects, page, v3ProjectsLoaded, totalV3Projects]);

  const loadMoreV3Projects = useCallback(() => {
    if (hasMoreV3Projects && !isLoadingV3Projects) {
      setIsLoadingV3Projects(true);
      setPage(prev => prev + 1);
    }
  }, [hasMoreV3Projects, isLoadingV3Projects]);

  useEffect(() => {
    if (
      hasMoreV3Projects &&
      !isLoadingV3Projects &&
      allV3Projects.length > 0 &&
      allV3Projects.length < totalV3Projects &&
      v3ProjectsLoaded
    ) {
      loadMoreV3Projects();
    }
  }, [
    allV3Projects.length,
    hasMoreV3Projects,
    isLoadingV3Projects,
    loadMoreV3Projects,
    v3ProjectsLoaded,
    totalV3Projects
  ]);

  const processedProjects = useMemo((): ProcessedProject[] => {
    const useV3Data = allV3Projects.length > 0 && (!user || user?.primaryRole !== "government");

    if (useV3Data) {
      const v2ProjectsMap = new Map<string, any>();
      if (v2ActiveProjects?.data) {
        v2ActiveProjects.data.forEach((project: any) => {
          if (project.uuid) {
            v2ProjectsMap.set(project.uuid, project);
          }
        });
      }

      return allV3Projects.map(v3Project => {
        const v2Project = v2ProjectsMap.get(v3Project.uuid);
        const convertedProject = convertV3ToProcessed(v3Project);

        if (v2Project && v2Project.jobs_created !== undefined) {
          convertedProject.jobs_created = v2Project.jobs_created;
          convertedProject.totalJobsCreated = v2Project.jobs_created;
        }

        return convertedProject;
      });
    } else if (v2ActiveProjects?.data) {
      return v2ActiveProjects.data.map(convertV2ToProcessed);
    }

    return [];
  }, [allV3Projects, v2ActiveProjects, user]);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return processedProjects;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return processedProjects.filter(
      project =>
        project.name?.toLowerCase().includes(lowerSearchTerm) ||
        project.organisation?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [processedProjects, searchTerm]);

  const activeProjects = filteredProjects;

  const allAvailableProjects = useMemo(() => {
    return processedProjects.map(project => ({
      uuid: project.uuid,
      name: project.name,
      organisationName: project.organisation,
      organisationType: project.organisationType,
      country: project.country_slug,
      treesPlantedCount: project.trees_under_restoration,
      totalHectaresRestoredSum: project.hectares_under_restoration,
      totalJobsCreated: project.jobs_created,
      lat: project.lat,
      long: project.long,
      // Add fields for compatibility with ProcessedProject
      organisation: project.organisation,
      country_slug: project.country_slug,
      trees_under_restoration: project.trees_under_restoration,
      hectares_under_restoration: project.hectares_under_restoration,
      jobs_created: project.jobs_created
    }));
  }, [processedProjects]);

  const topProjects = useMemo(() => {
    if (!(allV3Projects.length && !hasMoreV3Projects && !isLoadingV3Projects)) return [];
    return allV3Projects
      .filter(project => (project?.treesPlantedCount || 0) > 0)
      .sort((a, b) => (b.treesPlantedCount || 0) - (a.treesPlantedCount || 0))
      .slice(0, 5)
      .map(project => ({
        organization: project.organisationName || "",
        project: project.name || "",
        trees_planted: project.treesPlantedCount || 0,
        uuid: project.uuid || ""
      }));
  }, [allV3Projects, hasMoreV3Projects, isLoadingV3Projects]);

  const combinedJobsData = useMemo(() => {
    if (filters.uuid && projectEmploymentData) {
      return projectEmploymentData;
    }
    return jobsCreatedData;
  }, [filters.uuid, projectEmploymentData, jobsCreatedData]);

  const projectBbox = useBoundingBox(filters.uuid ? { projectUuid: filters.uuid } : {});
  const { treeSpeciesData: projectTreeSpeciesData, isLoading: isLoadingProjectTreeSpecies } =
    useDashboardTreeSpeciesData(filters.uuid, projectFullDto?.treesGrownGoal, projectFullDto?.organisationType);

  const combinedHectaresData = useMemo(() => {
    if (filters.uuid && projectTreeSpeciesData) {
      return projectTreeSpeciesData;
    } else {
      return transformedTreeRestorationGoalData;
    }
  }, [filters.uuid, projectTreeSpeciesData, transformedTreeRestorationGoalData]);

  const finalHectaresUnderRestoration = useMemo(() => {
    if (filters.uuid && projectHectaresData) {
      return projectHectaresData;
    }
    return generalHectaresUnderRestoration;
  }, [filters.uuid, projectHectaresData, generalHectaresUnderRestoration]);

  const finalIsLoadingHectaresUnderRestoration = useMemo(() => {
    if (filters.uuid) {
      return isLoadingProjectHectares;
    }
  }, [filters.uuid, isLoadingProjectHectares]);

  const centroidsDataProjects = useMemo(() => {
    const projectsToUse: UnifiedProjectForCoordinates[] =
      allAvailableProjects?.length > 0 ? allAvailableProjects : activeProjects ?? [];

    if (!projectsToUse?.length) return { data: [], bbox: [] };

    const projectsWithCoordinates = projectsToUse.filter((project: UnifiedProjectForCoordinates) => {
      if (!project) return false;

      const long = project.long;
      const lat = project.lat;

      if (long === null || long === undefined || long === "" || lat === null || lat === undefined || lat === "") {
        return false;
      }

      const longNum = Number(long);
      const latNum = Number(lat);

      return !isNaN(longNum) && !isNaN(latNum) && !(longNum === 0 && latNum === 0);
    });

    if (!projectsWithCoordinates.length) {
      return { data: [], bbox: [] };
    }

    const transformedData = projectsWithCoordinates.map((project: UnifiedProjectForCoordinates) => ({
      uuid: project.uuid ?? "",
      long: Number(project.long) || 0,
      lat: Number(project.lat) || 0,
      name: project.name ?? "",
      type: project.organisationType ?? "",
      organisation: project.organisationName ?? project.organisation ?? null
    }));

    try {
      const longitudes = transformedData.map((p: { long: number }) => p.long).filter((value: number) => !isNaN(value));

      const latitudes = transformedData.map((p: { lat: number }) => p.lat).filter((value: number) => !isNaN(value));

      if (longitudes.length === 0 || latitudes.length === 0) {
        return { data: transformedData, bbox: [] };
      }

      const minLong = Math.min(...longitudes);
      const minLat = Math.min(...latitudes);
      const maxLong = Math.max(...longitudes);
      const maxLat = Math.max(...latitudes);

      return {
        data: transformedData,
        bbox: [minLong, minLat, maxLong, maxLat]
      };
    } catch (error) {
      console.error("Error calculating bbox:", error);
      return { data: transformedData, bbox: [] };
    }
  }, [allAvailableProjects, activeProjects]);

  useEffect(() => {
    if (!(allAvailableProjects.length && !hasMoreV3Projects && !isLoadingV3Projects) || topProjects.length === 0)
      return;
    const tableData = topProjects.map(project => ({
      label: project.organization,
      valueText: project.trees_planted.toLocaleString("en-US"),
      value: project.trees_planted
    }));
    setTopProjects({
      tableData,
      maxValue: Math.max(...topProjects.map(p => p.trees_planted)) * (7 / 6)
    });
  }, [allAvailableProjects, hasMoreV3Projects, isLoadingV3Projects, topProjects]);

  useEffect(() => {
    if (filters.uuid) {
      if (!projectLoaded) showLoader();
      else hideLoader();
    } else {
      if (!isDashboardHeaderLoaded) showLoader();
      else hideLoader();
    }
  }, [isDashboardHeaderLoaded, projectLoaded, filters.uuid, showLoader, hideLoader]);

  useEffect(() => {
    if (filters.uuid && projectFullDto) {
      setDashboardHeader(prev => [
        {
          ...prev[0],
          value: projectFullDto.treesPlantedCount ? projectFullDto.treesPlantedCount.toLocaleString() : "-"
        },
        {
          ...prev[1],
          value: projectFullDto.totalHectaresRestoredSum
            ? `${projectFullDto.totalHectaresRestoredSum.toFixed(0).toLocaleString()} ha`
            : "-"
        },
        {
          ...prev[2],
          value: projectFullDto.totalJobsCreated ? projectFullDto.totalJobsCreated.toLocaleString() : "-"
        }
      ]);
      setNumberTreesPlanted({
        value: projectFullDto.treesPlantedCount ?? 0,
        totalValue: projectFullDto.treesGrownGoal ?? 0
      });
    } else if (totalSectionHeader != null) {
      console.log("setting dashboard header", totalSectionHeader);
      setDashboardHeader(prev => [
        {
          ...prev[0],
          value: totalSectionHeader.totalTreesRestored?.toLocaleString() ?? "-"
        },
        {
          ...prev[1],
          value: totalSectionHeader?.totalHectaresRestored
            ? `${totalSectionHeader?.totalHectaresRestored.toLocaleString()} ha`
            : "-"
        },
        {
          ...prev[2],
          value: totalSectionHeader?.totalEntries.toLocaleString() ?? "-"
        }
      ]);
      setNumberTreesPlanted({
        value: Number(totalSectionHeader?.totalTreesRestored),
        totalValue: Number(totalSectionHeader?.totalTreesRestoredGoal)
      });
    }
  }, [totalSectionHeader, filters.uuid, projectFullDto]);

  useEffect(() => {
    if (generalBbox && Array.isArray(generalBbox) && generalBbox.length > 1) {
      setGeneralBboxParsed(generalBbox as BBox);
    } else if (centroidsDataProjects?.bbox && centroidsDataProjects.bbox.length > 0) {
      setGeneralBboxParsed(centroidsDataProjects.bbox as BBox);
    } else {
      setGeneralBboxParsed(undefined);
    }
  }, [generalBbox, centroidsDataProjects]);

  const [isLoaded, { data: impactStories }] = useImpactStories({
    filter: {
      status: "published",
      country: filters.country?.country_slug,
      "organisationType[]": filters.organizations ? filters.organizations : [],
      projectUuid: filters.uuid
    }
  });

  const transformedStories = useMemo(
    () =>
      impactStories?.map((story: any) => ({
        uuid: story.uuid,
        title: story.title,
        date: story.date,
        content: story?.content ?? "",
        category: story.category,
        thumbnail: story.thumbnail?.url ?? "",
        organization: {
          name: story.organization?.name ?? "",
          category: story.category,
          country:
            story.organization?.countries?.length > 0
              ? story.organization.countries.map((c: any) => c.label).join(", ")
              : "No country",
          countries_data: story.organization?.countries ?? [],
          facebook_url: story.organization?.facebook_url ?? "",
          instagram_url: story.organization?.instagram_url ?? "",
          linkedin_url: story.organization?.linkedin_url ?? "",
          twitter_url: story.organization?.twitter_url ?? ""
        },
        status: story.status
      })) || [],
    [impactStories]
  );

  return {
    dashboardHeader,
    dashboardRestorationGoalData: combinedHectaresData,
    jobsCreatedData: combinedJobsData,
    dashboardVolunteersSurvivalRate,
    numberTreesPlanted,
    totalSectionHeader: totalSectionHeader,
    hectaresUnderRestoration: finalHectaresUnderRestoration,
    isLoadingJobsCreated: isLoadingJobsCreated || (filters.uuid && isLoadingProjectEmployment),
    isLoadingTreeRestorationGoal: treeRestorationGoalLoaded ?? (filters.uuid && isLoadingProjectTreeSpecies),
    isLoadingX: filters.uuid && isLoadingProjectHectares,
    isLoadingVolunteers,
    isLoadingHectaresUnderRestoration: finalIsLoadingHectaresUnderRestoration,
    projectFullDto,
    projectLoaded,
    coverImage,
    topProject,
    activeCountries,
    activeProjects: filteredProjects,
    allAvailableProjects: allAvailableProjects,
    centroidsDataProjects: centroidsDataProjects?.data,
    polygonsData: polygonsData,
    isUserAllowed,
    projectBbox: projectBbox,
    generalBbox: generalBboxParsed,
    transformedStories,
    isLoadingImpactStories: !isLoaded,
    lastUpdatedAt: dashboardRestorationGoalData?.lastUpdatedAt
  };
};
