import { useCallback, useEffect, useMemo, useState } from "react";

import { useBoundingBox } from "@/connections/BoundingBox";
import { useTotalSectionHeader } from "@/connections/DashboardTotalSectionHeaders";
import { useFullProject, useProjectIndex } from "@/connections/Entity";
import { useMedia } from "@/connections/EntityAssociation";
import { useMyUser } from "@/connections/User";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import {
  useGetV2DashboardActiveCountries,
  useGetV2DashboardActiveProjects,
  useGetV2DashboardGetPolygonsStatuses,
  useGetV2DashboardIndicatorHectaresRestoration,
  useGetV2DashboardJobsCreated,
  useGetV2DashboardTreeRestorationGoal,
  useGetV2DashboardViewProjectUuid,
  useGetV2DashboardVolunteersSurvivalRate,
  useGetV2ImpactStories
} from "@/generated/apiComponents";
import { DashboardTreeRestorationGoalResponse } from "@/generated/apiSchemas";
import { useSitePolygonsHectares } from "@/hooks/useSitePolygonsHectares";
import { createQueryParams } from "@/utils/dashboardUtils";

import { HECTARES_UNDER_RESTORATION_TOOLTIP, JOBS_CREATED_TOOLTIP, TREES_PLANTED_TOOLTIP } from "../constants/tooltips";
import { BBox } from "./../../../components/elements/Map-mapbox/GeoJSON";
import { useDashboardEmploymentData } from "./useDashboardEmploymentData";
import { useDashboardTreeSpeciesData } from "./useDashboardTreeSpeciesData";

const LANDSCAPE_SLUGS = {
  "Ghana Cocoa Belt": "gcb",
  "Greater Rift Valley of Kenya": "grv",
  "Lake Kivu & Rusizi River Basin": "ikr"
} as const;

//TODO: remove this once we have the correct landscape slugs for all filters
const getLandscapeSlugs = (landscapes: string[]) => {
  return landscapes.map(landscape => LANDSCAPE_SLUGS[landscape as keyof typeof LANDSCAPE_SLUGS] ?? landscape);
};

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
  const [, { bbox: generalBbox }] = useBoundingBox({
    landscapes: getLandscapeSlugs(filters.landscapes),
    country: filters.country.country_slug
  });
  const [updateFilters, setUpdateFilters] = useState<any>({});
  useEffect(() => {
    const parsedFilters = {
      programmes: filters.programmes,
      country: filters.country.country_slug,
      organisationType: filters.organizations,
      landscapes: filters.landscapes,
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

  const { data: projectHectaresData, isLoading: isLoadingProjectHectares } = useSitePolygonsHectares(filters.uuid);

  const activeProjectsQueryParams: any = useMemo(() => {
    const modifiedFilters = {
      ...updateFilters,
      projectUuid: ""
    };
    return createQueryParams(modifiedFilters);
  }, [updateFilters]);

  const { showLoader, hideLoader } = useLoading();

  const [isLoaded, { data: totalSectionHeader }] = useTotalSectionHeader({
    "programmesType[]": filters.programmes,
    country: filters.country.country_slug,
    "organisationType[]": filters.organizations,
    landscapes: filters.landscapes,
    cohort: filters.cohort,
    projectUuid: filters.uuid
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
  const { data: activeProjects } = useGetV2DashboardActiveProjects<any>(
    { queryParams: activeProjectsQueryParams },
    { enabled: !!searchTerm || !!filters }
  );

  const { data: polygonsData } = useGetV2DashboardGetPolygonsStatuses<any>(
    {
      queryParams: queryParams
    },
    {
      enabled: !!filters.uuid && isUserAllowed?.allowed === true && user?.primaryRole !== "government"
    }
  );

  const filteredProjects = activeProjects?.data?.filter(
    (project: { name: string | null; organisation: string | null }) =>
      project?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      project?.organisation?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const { data: dashboardRestorationGoalData, isLoading: isLoadingTreeRestorationGoal } =
    useGetV2DashboardTreeRestorationGoal<DashboardTreeRestorationGoalResponse>(
      {
        queryParams: queryParams
      },
      {
        enabled: !!filters && !filters.uuid
      }
    );

  const { data: dashboardVolunteersSurvivalRate, isLoading: isLoadingVolunteers } =
    useGetV2DashboardVolunteersSurvivalRate<any>({
      queryParams: queryParams
    });

  const { data: generalHectaresUnderRestoration, isLoading: isLoadingGeneralHectaresUnderRestoration } =
    useGetV2DashboardIndicatorHectaresRestoration<any>(
      {
        queryParams: queryParams
      },
      {
        enabled: !!filters && !filters.uuid
      }
    );

  const [projectLoaded, { entity: projectFullDto }] = useFullProject({ uuid: filters?.uuid! });
  const [, { association: coverImage }] = useMedia({
    entity: "projects",
    uuid: filters?.uuid ?? null,
    queryParams: { isCover: true }
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 100;
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);

  const filterParams = useMemo(() => {
    const params: any = {
      status: "approved"
    };

    if (filters?.country?.country_slug?.trim() !== "") {
      params.country = filters.country.country_slug;
    }

    if (filters?.landscapes?.length > 0) {
      params.landscape = filters.landscapes;
    }

    if (filters?.cohort) {
      if (Array.isArray(filters.cohort)) {
        params.cohort = filters.cohort;
      } else {
        params.cohort = [filters.cohort];
      }
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
    setAllProjects([]);
    setHasMoreProjects(true);
    setTotalProjects(0);
    setIsLoadingProjects(false);
  }, [filterParams]);

  const [projectsLoaded, { entities: currentPageProjects, indexTotal }] = useProjectIndex({
    pageSize: PAGE_SIZE,
    pageNumber: page,
    filter: filterParams
  });

  useEffect(() => {
    if (indexTotal !== undefined) {
      setTotalProjects(indexTotal);
    }
  }, [indexTotal]);

  useEffect(() => {
    if (projectsLoaded && currentPageProjects) {
      setAllProjects(prevProjects => {
        if (page === 1) {
          setHasMoreProjects(currentPageProjects.length < totalProjects);
          return [...currentPageProjects];
        }

        const existingProjectsMap = new Map(prevProjects.map(p => [p.uuid, p]));

        const newUniqueProjects = currentPageProjects.filter(p => !existingProjectsMap.has(p.uuid));

        const mergedProjects = [...prevProjects, ...newUniqueProjects];

        setHasMoreProjects(mergedProjects.length < totalProjects && newUniqueProjects.length > 0);

        return mergedProjects;
      });

      setIsLoadingProjects(false);
    } else if (!projectsLoaded) {
      setIsLoadingProjects(true);
    }
  }, [currentPageProjects, page, projectsLoaded, totalProjects]);

  const topProjects = useMemo(() => {
    if (!allProjects?.length || isLoadingProjects) {
      return [];
    }

    const filteredProjects = allProjects.filter(project => project?.treesPlantedCount > 0);
    const sortedProjects = filteredProjects
      .sort((a, b) => (b.treesPlantedCount ?? 0) - (a.treesPlantedCount ?? 0))
      .slice(0, 5)
      .map(project => ({
        organization: project.organisationName ?? "",
        project: project.name ?? "",
        trees_planted: project.treesPlantedCount ?? 0,
        uuid: project.uuid ?? ""
      }));

    return sortedProjects;
  }, [allProjects, isLoadingProjects]);

  const loadMoreProjects = useCallback(() => {
    if (hasMoreProjects && !isLoadingProjects) {
      setIsLoadingProjects(true);
      setPage(prev => prev + 1);
    }
  }, [hasMoreProjects, isLoadingProjects]);

  useEffect(() => {
    if (
      hasMoreProjects &&
      !isLoadingProjects &&
      allProjects.length > 0 &&
      allProjects.length < totalProjects &&
      projectsLoaded
    ) {
      loadMoreProjects();
    }
  }, [allProjects.length, hasMoreProjects, isLoadingProjects, loadMoreProjects, projectsLoaded, totalProjects]);

  const combinedJobsData = useMemo(() => {
    if (filters.uuid && projectEmploymentData) {
      return projectEmploymentData;
    }
    return jobsCreatedData;
  }, [filters.uuid, projectEmploymentData, jobsCreatedData]);

  const [, { bbox: projectBbox }] = useBoundingBox(filters.uuid ? { projectUuid: filters.uuid } : undefined);
  const { treeSpeciesData: projectTreeSpeciesData, isLoading: isLoadingProjectTreeSpecies } =
    useDashboardTreeSpeciesData(filters.uuid, projectFullDto?.treesGrownGoal, projectFullDto?.organisationType);

  const combinedHectaresData = useMemo(() => {
    if (filters.uuid && projectTreeSpeciesData) {
      return projectTreeSpeciesData;
    } else {
      return dashboardRestorationGoalData;
    }
  }, [filters.uuid, projectTreeSpeciesData, dashboardRestorationGoalData]);

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
    return isLoadingGeneralHectaresUnderRestoration;
  }, [filters.uuid, isLoadingProjectHectares, isLoadingGeneralHectaresUnderRestoration]);

  const centroidsDataProjects = useMemo(() => {
    const projectsToUse = allProjects?.length > 0 ? allProjects : activeProjects?.data ?? [];

    if (!projectsToUse?.length) return { data: [], bbox: [] };

    interface ProjectData {
      uuid?: string;
      long?: string | number | null;
      lat?: string | number | null;
      name?: string;
      organisationType?: string;
      programme?: string;
      organisationName?: string;
      organisation?: string;
    }

    const projectsWithCoordinates = projectsToUse.filter((project: ProjectData) => {
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

    const transformedData = projectsWithCoordinates.map((project: ProjectData) => ({
      uuid: project.uuid ?? "",
      long: project.long?.toString() ?? "0",
      lat: project.lat?.toString() ?? "0",
      name: project.name ?? "",
      type: project.organisationType ?? "",
      organisation: project.organisationName ?? project.organisation ?? null
    }));

    try {
      const longitudes = transformedData
        .map((p: { long: string }) => parseFloat(p.long))
        .filter((value: number) => !isNaN(value));

      const latitudes = transformedData
        .map((p: { lat: string }) => parseFloat(p.lat))
        .filter((value: number) => !isNaN(value));

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
  }, [allProjects, activeProjects]);

  useEffect(() => {
    if (topProjects) {
      const projects = topProjects.slice(0, 5);
      const tableData = projects?.map((project: { organization: string; project: string; trees_planted: number }) => ({
        label: project.organization,
        valueText: project.trees_planted.toLocaleString("en-US"),
        value: project.trees_planted
      }));
      setTopProjects({ tableData, maxValue: Math.max(...projects.map((p: any) => p.trees_planted)) * (7 / 6) });
    }
  }, [topProjects]);

  useEffect(() => {
    if (filters.uuid) {
      if (!projectLoaded) {
        showLoader();
      } else {
        hideLoader();
      }
    } else {
      if (!isLoaded) {
        showLoader();
      } else {
        hideLoader();
      }
    }
  }, [isLoaded, projectLoaded, filters.uuid, showLoader, hideLoader]);

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
  const queryString = useMemo(() => {
    const finalFilters = {
      status: ["published"],
      country: filters.country?.country_slug ? [filters.country.country_slug] : [],
      organizationType: filters.organizations ? filters.organizations : [],
      uuid: filters.uuid
    };
    return createQueryParams(finalFilters);
  }, [filters.country?.country_slug, filters.organizations, filters.uuid]);

  const { data: impactStoriesResponse, isLoading: isLoadingImpactStories } = useGetV2ImpactStories({
    queryParams: queryString as any
  });

  const transformedStories = useMemo(
    () =>
      impactStoriesResponse?.data?.map((story: any) => ({
        uuid: story.uuid,
        title: story.title,
        date: story.date,
        content: story?.content ? JSON.parse(story.content) : "",
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
    [impactStoriesResponse?.data]
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
    isLoadingTreeRestorationGoal: isLoadingTreeRestorationGoal ?? (filters.uuid && isLoadingProjectTreeSpecies),
    isLoadingVolunteers,
    isLoadingHectaresUnderRestoration: finalIsLoadingHectaresUnderRestoration,
    projectFullDto,
    projectLoaded,
    coverImage,
    topProject,
    activeCountries,
    activeProjects: filteredProjects,
    centroidsDataProjects: centroidsDataProjects?.data,
    polygonsData: polygonsData ?? {},
    isUserAllowed,
    projectBbox: projectBbox,
    generalBbox: generalBboxParsed,
    transformedStories,
    isLoadingImpactStories
  };
};
