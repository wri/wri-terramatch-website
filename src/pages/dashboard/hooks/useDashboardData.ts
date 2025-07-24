import { useEffect, useMemo, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useBoundingBox } from "@/connections/BoundingBox";
import { useDashboardProject, useDashboardProjects } from "@/connections/DashboardEntity";
import { useHectareRestoration } from "@/connections/DashboardHectareRestoration";
import { useTreeRestorationGoal } from "@/connections/DashboardTreeRestorationGoal";
import { useMedia } from "@/connections/EntityAssociation";
import { useImpactStories } from "@/connections/ImpactStory";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useGetV2DashboardJobsCreated, useGetV2DashboardViewProjectUuid } from "@/generated/apiComponents";
import { DashboardProjectsLightDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { useSitePolygonsHectares } from "@/hooks/useSitePolygonsHectares";
import { HookFilters } from "@/types/connection";
import { calculateTotalsFromProjects, createQueryParams, groupProjectsByCountry } from "@/utils/dashboardUtils";
import { convertNamesToCodes } from "@/utils/landscapeUtils";

import { HECTARES_UNDER_RESTORATION_TOOLTIP, JOBS_CREATED_TOOLTIP, TREES_PLANTED_TOOLTIP } from "../constants/tooltips";
import { useDashboardEmploymentData } from "./useDashboardEmploymentData";
import { useDashboardTreeSpeciesData } from "./useDashboardTreeSpeciesData";

const DEFAULT_COHORT: string[] = ["terrafund", "terrafund-landscapes"];
const DEFAULT_ORGANIZATION_TYPES: ("for-profit-organization" | "non-profit-organization")[] = [
  "non-profit-organization",
  "for-profit-organization"
];
const DEFAULT_PROGRAMME_TYPES: ("terrafund" | "terrafund-landscapes" | "enterprises")[] = [
  "terrafund",
  "terrafund-landscapes",
  "enterprises"
];

export const useDashboardData = (filters: any) => {
  const [generalBboxParsed, setGeneralBboxParsed] = useState<BBox | undefined>(undefined);
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

  const { showLoader, hideLoader } = useLoading();

  const { data: jobsCreatedData, isLoading: isLoadingJobsCreated } = useGetV2DashboardJobsCreated<any>(
    { queryParams: queryParams },
    { enabled: !!filters && !filters.uuid }
  );

  const { searchTerm } = useDashboardContext();

  const dashboardProjectsQueryParams = useMemo(() => {
    const params: HookFilters<typeof useDashboardProjects> = {};

    if (filters?.country?.country_slug?.trim() !== "") {
      params.country = filters.country.country_slug;
    }

    if (filters?.landscapes?.length > 0) {
      params.landscapes = convertNamesToCodes(filters.landscapes);
    }

    if (filters?.cohort && filters.cohort.length > 0) {
      params.cohort = filters.cohort;
    } else {
      params.cohort = DEFAULT_COHORT;
    }

    if (filters?.organizations?.length === 1) {
      params["organisationType[]"] = filters.organizations;
    } else {
      params["organisationType[]"] = DEFAULT_ORGANIZATION_TYPES;
    }

    if (filters?.frameworks?.length > 0) {
      params["programmesType[]"] = filters.frameworks;
    } else {
      params["programmesType[]"] = DEFAULT_PROGRAMME_TYPES;
    }

    return params;
  }, [
    filters?.country?.country_slug,
    filters?.landscapes,
    filters?.cohort,
    filters?.organizations,
    filters?.frameworks
  ]);

  const [dashboardProjectsLoaded, { data: dashboardProjectsData }] = useDashboardProjects({
    filter: dashboardProjectsQueryParams
  });

  const activeCountries = useMemo(() => {
    if (!dashboardProjectsData || !Array.isArray(dashboardProjectsData)) {
      return [];
    }
    return groupProjectsByCountry(dashboardProjectsData as DashboardProjectsLightDto[]);
  }, [dashboardProjectsData]);

  const treeRestorationGoalFilter = useMemo(
    () => ({
      "programmesType[]": filters.programmes,
      country: filters.country.country_slug,
      "organisationType[]": filters.organizations,
      landscapes: convertNamesToCodes(filters.landscapes),
      cohort: filters.cohort,
      projectUuid: filters.uuid
    }),
    [
      filters.programmes,
      filters.country.country_slug,
      filters.organizations,
      filters.landscapes,
      filters.cohort,
      filters.uuid
    ]
  );

  const hectareRestorationFilter = useMemo(
    () => ({
      "programmesType[]": filters.programmes,
      country: filters.country.country_slug,
      "organisationType[]": filters.organizations,
      landscapes: convertNamesToCodes(filters.landscapes),
      cohort: filters.cohort,
      projectUuid: filters.uuid
    }),
    [
      filters.programmes,
      filters.country.country_slug,
      filters.organizations,
      filters.landscapes,
      filters.cohort,
      filters.uuid
    ]
  );

  const calculatedTotals = useMemo(() => {
    if (!Array.isArray(dashboardProjectsData)) {
      return null;
    }
    return calculateTotalsFromProjects(dashboardProjectsData as DashboardProjectsLightDto[]);
  }, [dashboardProjectsData]);

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
    filter: treeRestorationGoalFilter
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

  const [isDashboardHectareRestorationLoaded, { data: generalHectaresUnderRestoration }] =
    useHectareRestoration(hectareRestorationFilter);

  const [projectLoaded, { data: singleDashboardProject }] = useDashboardProject({
    id: filters?.uuid ?? null
  });

  const [, { data: coverImage }] = useMedia({
    entity: "projects",
    uuid: filters?.uuid ?? null,
    filter: { isCover: true }
  });

  const dashboardProjects = useMemo((): DashboardProjectsLightDto[] => {
    if (!Array.isArray(dashboardProjectsData) || dashboardProjectsData.length === 0) return [];

    return dashboardProjectsData as DashboardProjectsLightDto[];
  }, [dashboardProjectsData]);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return dashboardProjects;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return dashboardProjects.filter(
      project =>
        project.name?.toLowerCase().includes(lowerSearchTerm) ||
        project.organisationName?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [dashboardProjects, searchTerm]);

  const combinedJobsData = useMemo(() => {
    if (filters.uuid && projectEmploymentData) {
      return projectEmploymentData;
    }
    return jobsCreatedData;
  }, [filters.uuid, projectEmploymentData, jobsCreatedData]);

  const projectBbox = useBoundingBox(filters.uuid ? { projectUuid: filters.uuid } : {});
  const { treeSpeciesData: projectTreeSpeciesData, isLoading: isLoadingProjectTreeSpecies } =
    useDashboardTreeSpeciesData(
      filters.uuid,
      singleDashboardProject?.treesGrownGoal,
      singleDashboardProject?.organisationType
    );

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
    if (!dashboardProjects?.length) return { data: [], bbox: [] };

    const projectsWithCoordinates = dashboardProjects.filter(project => {
      if (!project) return false;

      const long = project.long;
      const lat = project.lat;

      if (long === null || long === undefined || lat === null || lat === undefined) {
        return false;
      }

      const longNum = Number(long);
      const latNum = Number(lat);

      return !isNaN(longNum) && !isNaN(latNum) && !(longNum === 0 && latNum === 0);
    });

    if (!projectsWithCoordinates.length) {
      return { data: [], bbox: [] };
    }

    const transformedData = projectsWithCoordinates.map(project => ({
      uuid: project.uuid ?? "",
      long: Number(project.long) || 0,
      lat: Number(project.lat) || 0,
      name: project.name ?? "",
      type: project.organisationType ?? "",
      organisation: project.organisationName ?? null
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
  }, [dashboardProjects]);

  const topProjectsTable = useMemo(() => {
    if (
      !dashboardProjectsLoaded ||
      !dashboardProjectsData ||
      !Array.isArray(dashboardProjectsData) ||
      dashboardProjectsData.length === 0
    ) {
      return { tableData: [], maxValue: 0 };
    }

    const sorted = dashboardProjectsData
      .filter((project: any) => project && (project.treesPlantedCount || 0) > 0)
      .sort((a: any, b: any) => (b.treesPlantedCount || 0) - (a.treesPlantedCount || 0))
      .slice(0, 5);

    const tableData = sorted.map((project: any) => ({
      label: project.organisationName || "",
      valueText: (project.treesPlantedCount || 0).toLocaleString("en-US"),
      value: project.treesPlantedCount || 0
    }));

    const maxValue = Math.max(...tableData.map(p => p.value), 0) * (7 / 6);

    return { tableData, maxValue };
  }, [dashboardProjectsLoaded, dashboardProjectsData]);

  useEffect(() => {
    if (filters.uuid) {
      if (!projectLoaded) showLoader();
      else hideLoader();
    } else {
      if (!dashboardProjectsLoaded) showLoader();
      else hideLoader();
    }
  }, [dashboardProjectsLoaded, projectLoaded, filters.uuid, showLoader, hideLoader]);

  useEffect(() => {
    if (filters.uuid && singleDashboardProject) {
      setDashboardHeader(prev => [
        {
          ...prev[0],
          value: singleDashboardProject.treesPlantedCount
            ? singleDashboardProject.treesPlantedCount.toLocaleString()
            : "-"
        },
        {
          ...prev[1],
          value: singleDashboardProject.totalHectaresRestoredSum
            ? `${singleDashboardProject.totalHectaresRestoredSum.toFixed(0).toLocaleString()} ha`
            : "-"
        },
        {
          ...prev[2],
          value: singleDashboardProject.totalJobsCreated
            ? singleDashboardProject.totalJobsCreated.toLocaleString()
            : "-"
        }
      ]);
      setNumberTreesPlanted({
        value: singleDashboardProject.treesPlantedCount ?? 0,
        totalValue: singleDashboardProject.treesGrownGoal ?? 0
      });
    } else if (calculatedTotals != null) {
      setDashboardHeader(prev => [
        {
          ...prev[0],
          value: calculatedTotals.totalTreesRestored?.toLocaleString() ?? "-"
        },
        {
          ...prev[1],
          value: calculatedTotals?.totalHectaresRestored
            ? `${calculatedTotals?.totalHectaresRestored.toLocaleString("en-US", { maximumFractionDigits: 0 })} ha`
            : "-"
        },
        {
          ...prev[2],
          value: calculatedTotals?.totalJobsCreated.toLocaleString() ?? "-"
        }
      ]);
      setNumberTreesPlanted({
        value: Number(calculatedTotals?.totalTreesRestored),
        totalValue: Number(calculatedTotals?.totalTreesRestoredGoal)
      });
    }
  }, [calculatedTotals, filters.uuid, singleDashboardProject]);

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
    numberTreesPlanted,
    totalSectionHeader: calculatedTotals,
    hectaresUnderRestoration: finalHectaresUnderRestoration,
    isLoadingJobsCreated: isLoadingJobsCreated || (filters.uuid && isLoadingProjectEmployment),
    isLoadingTreeRestorationGoal: treeRestorationGoalLoaded ?? (filters.uuid && isLoadingProjectTreeSpecies),
    isLoadingX: isDashboardHectareRestorationLoaded ?? (filters.uuid && isLoadingProjectHectares),
    isLoadingHectaresUnderRestoration: finalIsLoadingHectaresUnderRestoration,
    singleDashboardProject,
    projectLoaded,
    coverImage,
    topProject: topProjectsTable,
    activeCountries,
    activeProjects: filteredProjects,
    allAvailableProjects: dashboardProjects,
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
