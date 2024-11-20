import { useEffect, useMemo, useState } from "react";

import { useMyUser } from "@/connections/User";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import {
  useGetV2DashboardActiveCountries,
  useGetV2DashboardActiveProjects,
  useGetV2DashboardCountryCountry,
  useGetV2DashboardGetBboxProject,
  useGetV2DashboardGetPolygonsStatuses,
  useGetV2DashboardGetProjects,
  useGetV2DashboardIndicatorHectaresRestoration,
  useGetV2DashboardJobsCreated,
  useGetV2DashboardProjectDetailsProject,
  useGetV2DashboardTopTreesPlanted,
  useGetV2DashboardTotalSectionHeader,
  useGetV2DashboardTreeRestorationGoal,
  useGetV2DashboardViewProjectUuid,
  useGetV2DashboardVolunteersSurvivalRate
} from "@/generated/apiComponents";
import { DashboardTreeRestorationGoalResponse } from "@/generated/apiSchemas";
import { createQueryParams } from "@/utils/dashboardUtils";

import { HECTARES_UNDER_RESTORATION_TOOLTIP, JOBS_CREATED_TOOLTIP, TREES_PLANTED_TOOLTIP } from "../constants/tooltips";
import { BBox } from "./../../../components/elements/Map-mapbox/GeoJSON";

export const useDashboardData = (filters: any) => {
  const [topProject, setTopProjects] = useState<any>([]);
  const [countryBboxParsed, setCountryBboxParsed] = useState<BBox | undefined>(undefined);
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
  const { data: countryBbox } = useGetV2DashboardCountryCountry(
    {
      pathParams: { country: filters.country.country_slug }
    },
    {
      enabled: !!filters.country.country_slug
    }
  );
  const [updateFilters, setUpdateFilters] = useState<any>({});
  useEffect(() => {
    const parsedFilters = {
      programmes: filters.programmes,
      country: filters.country.country_slug,
      organisationType: filters.organizations,
      landscapes: filters.landscapes,
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

  const activeProjectsQueryParams: any = useMemo(() => {
    const modifiedFilters = {
      ...updateFilters,
      projectUuid: ""
    };
    return createQueryParams(modifiedFilters);
  }, [updateFilters]);

  const { showLoader, hideLoader } = useLoading();
  const {
    data: totalSectionHeader,
    refetch: refetchTotalSectionHeader,
    isLoading
  } = useGetV2DashboardTotalSectionHeader<any>({ queryParams: queryParams }, { enabled: !!filters });
  const { data: jobsCreatedData, isLoading: isLoadingJobsCreated } = useGetV2DashboardJobsCreated<any>(
    { queryParams: queryParams },
    { enabled: !!filters }
  );
  const { data: topData } = useGetV2DashboardTopTreesPlanted<any>({ queryParams: queryParams });

  const { data: activeCountries } = useGetV2DashboardActiveCountries<any>(
    { queryParams: queryParams },
    { enabled: !!filters }
  );

  const { searchTerm } = useDashboardContext();
  const { data: activeProjects } = useGetV2DashboardActiveProjects<any>(
    { queryParams: activeProjectsQueryParams },
    { enabled: !!searchTerm || !!filters }
  );
  const shouldSendQueryParamsForCentroids = !(filters.uuid && user?.primaryRole === "government");

  const { data: centroidsDataProjects } = useGetV2DashboardGetProjects<any>({
    queryParams: shouldSendQueryParamsForCentroids ? queryParams : undefined
  });
  const { data: polygonsData } = useGetV2DashboardGetPolygonsStatuses<any>(
    {
      queryParams: queryParams
    },
    {
      enabled: !!filters.uuid && isUserAllowed?.allowed === true && user?.primaryRole !== "government"
    }
  );

  const filteredProjects = activeProjects?.data?.filter((project: { name: string | null }) =>
    project?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const { data: dashboardRestorationGoalData, isLoading: isLoadingTreeRestorationGoal } =
    useGetV2DashboardTreeRestorationGoal<DashboardTreeRestorationGoalResponse>({
      queryParams: queryParams
    });

  const { data: dashboardVolunteersSurvivalRate, isLoading: isLoadingVolunteers } =
    useGetV2DashboardVolunteersSurvivalRate<any>({
      queryParams: queryParams
    });

  const { data: hectaresUnderRestoration, isLoading: isLoadingHectaresUnderRestoration } =
    useGetV2DashboardIndicatorHectaresRestoration<any>({
      queryParams: queryParams
    });
  const { data: dashboardProjectDetails } = useGetV2DashboardProjectDetailsProject<any>(
    { pathParams: { project: filters.uuid } },
    { enabled: !!filters.uuid }
  );
  const { data: projectBbox } = useGetV2DashboardGetBboxProject<any>(
    {
      queryParams: queryParams
    },
    {
      enabled: !!filters.uuid
    }
  );
  useEffect(() => {
    if (topData?.top_projects_most_planted_trees) {
      const projects = topData?.top_projects_most_planted_trees?.slice(0, 5);
      const tableData = projects?.map((project: { organization: string; project: string; trees_planted: number }) => ({
        label: project.organization,
        valueText: project.trees_planted.toLocaleString("en-US"),
        value: project.trees_planted
      }));
      setTopProjects({ tableData, maxValue: Math.max(...projects.map((p: any) => p.trees_planted)) * (7 / 6) });
    }
  }, [topData]);

  useEffect(() => {
    if (isLoading) showLoader();
    else hideLoader();
  }, [isLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (totalSectionHeader) {
      setDashboardHeader(prev => [
        {
          ...prev[0],
          value: totalSectionHeader.total_trees_restored
            ? totalSectionHeader.total_trees_restored.toLocaleString()
            : "-"
        },
        {
          ...prev[1],
          value: totalSectionHeader.total_hectares_restored
            ? `${totalSectionHeader.total_hectares_restored.toLocaleString()} ha`
            : "-"
        },
        {
          ...prev[2],
          value: totalSectionHeader.total_entries ? totalSectionHeader.total_entries.toLocaleString() : "-"
        }
      ]);
      setNumberTreesPlanted({
        value: totalSectionHeader.total_trees_restored,
        totalValue: totalSectionHeader.total_trees_restored_goal
      });
    }
  }, [totalSectionHeader]);
  useEffect(() => {
    if (countryBbox && Array.isArray(countryBbox.bbox) && countryBbox.bbox.length > 1) {
      setCountryBboxParsed(countryBbox.bbox[1] as unknown as BBox);
    } else {
      setCountryBboxParsed(undefined);
    }
  }, [countryBbox]);

  return {
    dashboardHeader,
    dashboardRestorationGoalData,
    jobsCreatedData,
    dashboardVolunteersSurvivalRate,
    numberTreesPlanted,
    totalSectionHeader,
    hectaresUnderRestoration,
    isLoadingJobsCreated,
    isLoadingTreeRestorationGoal,
    isLoadingVolunteers,
    isLoadingHectaresUnderRestoration,
    dashboardProjectDetails,
    topProject,
    refetchTotalSectionHeader,
    activeCountries,
    activeProjects: filteredProjects,
    centroidsDataProjects: centroidsDataProjects?.data,
    polygonsData: polygonsData?.data ?? {},
    countryBbox: countryBboxParsed,
    isUserAllowed,
    projectBbox: projectBbox?.bbox
  };
};
