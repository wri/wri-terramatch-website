import { useEffect, useMemo, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useBoundingBox } from "@/connections/BoundingBox";
import { useDashboardProject, useDashboardProjects, useDashboardSitePolygons } from "@/connections/DashboardEntity";
import { useHectareRestoration } from "@/connections/DashboardHectareRestoration";
import { useJobsCreated } from "@/connections/DashboardJobsCreatedConnection";
import { useTreeRestorationGoal } from "@/connections/DashboardTreeRestorationGoal";
import { useMedia } from "@/connections/EntityAssociation";
import { useImpactStories } from "@/connections/ImpactStory";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { DashboardProjectsLightDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { HookFilters } from "@/types/connection";
import { calculateTotalsFromProjects, groupProjectsByCountry } from "@/utils/dashboardUtils";
import { convertNamesToCodes } from "@/utils/landscapeUtils";

export const TREES_PLANTED_TOOLTIP =
  "Total number of trees planted by funded projects to date, as reported through six-month progress reports.";

export const HECTARES_UNDER_RESTORATION_TOOLTIP =
  "Total land area measured in hectares with active restoration interventions, tallied by the total area of polygons submitted by projects and approved by data quality analysts.";

export const JOBS_CREATED_TOOLTIP =
  "Number of people newly employed directly by the project. Terrafund defines a job as any individual or person, aged 18 years or older, that is directly compensated by a project at any time to support their restoration activities.";

const DEFAULT_COHORT: string[] = ["terrafund", "terrafund-landscapes", "terrafund-enterprises-rolling"];
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

  const [, { data: dashboardSitePolygonsData }] = useDashboardSitePolygons({
    filter: {
      polygonStatus: ["approved"],
      projectUuid: filters.uuid || ""
    },
    enabled: !!filters.uuid
  });

  const { showLoader, hideLoader } = useLoading();

  const dashboardV3Filter = useMemo<HookFilters<typeof useJobsCreated>>(
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

  const [isLoadingJobsCreated, { data: jobsCreatedData }] = useJobsCreated({
    filter: dashboardV3Filter
  });

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
    if (dashboardProjectsData == null || !Array.isArray(dashboardProjectsData)) {
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

  const calculatedTotals = useMemo(() => {
    if (!Array.isArray(dashboardProjectsData)) {
      return null;
    }
    return calculateTotalsFromProjects(dashboardProjectsData as DashboardProjectsLightDto[]);
  }, [dashboardProjectsData]);

  const polygonsData = useMemo(() => {
    if (dashboardSitePolygonsData == null || dashboardSitePolygonsData.length === 0) {
      return {
        centroids: [],
        data: {}
      };
    }

    const centroids: { lat: number; long: number; uuid: string; status: string }[] = [];
    const data: { [status: string]: string[] } = {};

    dashboardSitePolygonsData.forEach(polygon => {
      if (polygon.lat != null && polygon.long != null && polygon.polygonUuid != null && polygon.status != null) {
        centroids.push({
          lat: polygon.lat,
          long: polygon.long,
          uuid: polygon.polygonUuid,
          status: polygon.status
        });
      }

      if (polygon.status != null && polygon.polygonUuid != null) {
        if (data[polygon.status] == null) {
          data[polygon.status] = [];
        }
        data[polygon.status].push(polygon.polygonUuid);
      }
    });

    return { centroids, data };
  }, [dashboardSitePolygonsData]);

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

  const [isLoadingHectaresUnderRestoration, { data: generalHectaresUnderRestoration }] = useHectareRestoration({
    filter: dashboardV3Filter
  });

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

  const projectBbox = useBoundingBox(filters.uuid ? { projectUuid: filters.uuid } : {});

  const centroidsDataProjects = useMemo(() => {
    if (dashboardProjects == null || dashboardProjects.length === 0) return { data: [], bbox: [] };

    const projectsWithCoordinates = dashboardProjects.filter(project => {
      if (project == null) return false;

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
    } else if (centroidsDataProjects?.bbox != null && centroidsDataProjects.bbox.length > 0) {
      setGeneralBboxParsed(centroidsDataProjects.bbox as BBox);
    } else {
      setGeneralBboxParsed(undefined);
    }
  }, [generalBbox, centroidsDataProjects]);

  const [isLoaded, { data: impactStories }] = useImpactStories({
    filter: {
      ...(filters.country?.country_slug ? { country: filters.country.country_slug } : {}),
      ...(filters.uuid ? { projectUuid: filters.uuid } : {}),
      status: "published"
    }
  });

  const transformedStories = useMemo(
    () =>
      impactStories
        ?.map((story: any) => ({
          uuid: story.attributes?.uuid || story.uuid,
          title: story.attributes?.title || story.title,
          date: story.attributes?.date || story.date,
          thumbnail:
            story.attributes?.thumbnail?.thumbUrl ||
            story.thumbnail?.thumbUrl ||
            story.attributes?.thumbnail ||
            story.thumbnail ||
            "",
          organization: {
            name: story.attributes?.organization?.name || story.organization?.name || "",
            country:
              story.attributes?.organization?.countries?.length > 0
                ? story.attributes.organization.countries.map((c: any) => c.label).join(", ")
                : story.organization?.countries?.length > 0
                ? story.organization.countries.map((c: any) => c.label).join(", ")
                : "No country"
          }
        }))
        .reverse() || [],
    [impactStories]
  );

  const isUserAllowed = useMemo(() => {
    if (filters.uuid) {
      return { allowed: singleDashboardProject?.hasAccess ?? false };
    }
    return undefined;
  }, [filters.uuid, singleDashboardProject?.hasAccess]);

  return {
    dashboardHeader,
    dashboardRestorationGoalData: transformedTreeRestorationGoalData,
    jobsCreatedData,
    numberTreesPlanted,
    totalSectionHeader: calculatedTotals,
    hectaresUnderRestoration: generalHectaresUnderRestoration,
    isLoadingJobsCreated: isLoadingJobsCreated,
    isLoadingTreeRestorationGoal: treeRestorationGoalLoaded,
    isLoadingHectaresUnderRestoration,
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
