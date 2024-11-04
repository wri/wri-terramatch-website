import { useEffect, useMemo, useState } from "react";

import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import {
  useGetV2DashboardActiveCountries,
  useGetV2DashboardActiveProjects,
  useGetV2DashboardCountryCountry,
  useGetV2DashboardGetPolygonsStatuses,
  useGetV2DashboardGetProjects,
  useGetV2DashboardIndicatorHectaresRestoration,
  useGetV2DashboardJobsCreated,
  useGetV2DashboardProjectDetailsProject,
  useGetV2DashboardTopTreesPlanted,
  useGetV2DashboardTotalSectionHeader,
  useGetV2DashboardTreeRestorationGoal,
  useGetV2DashboardViewProjectList,
  useGetV2DashboardVolunteersSurvivalRate
} from "@/generated/apiComponents";
import { DashboardTreeRestorationGoalResponse } from "@/generated/apiSchemas";
import { createQueryParams } from "@/utils/dashboardUtils";

import { BBox } from "./../../../components/elements/Map-mapbox/GeoJSON";

export const useDashboardData = (filters: any) => {
  const [topProject, setTopProjects] = useState<any>([]);
  const [countryBboxParsed, setCountryBboxParsed] = useState<BBox | undefined>(undefined);

  const [dashboardHeader, setDashboardHeader] = useState([
    {
      label: "Trees Planted",
      value: "0"
    },
    {
      label: "Hectares Under Restoration",
      value: "0 ha"
    },
    {
      label: "Jobs Created",
      value: "0"
    }
  ]);
  const projectUuid = filters.project?.project_uuid;
  const queryParamsCountryProject: any = (country?: string, project?: string) => {
    if (country) {
      return { country: country };
    } else if (project) {
      return { uuid: project };
    } else {
      return {};
    }
  };
  const { data: listViewProjects } = useGetV2DashboardViewProjectList<any>({});
  const { data: centroidsDataProjects } = useGetV2DashboardGetProjects<any>({
    queryParams: queryParamsCountryProject(filters.country.country_slug, projectUuid)
  });
  const { data: polygonsData } = useGetV2DashboardGetPolygonsStatuses<any>({
    queryParams: queryParamsCountryProject(filters.country.country_slug, projectUuid)
  });
  const [numberTreesPlanted, setNumberTreesPlanted] = useState({
    value: 0,
    totalValue: 0
  });
  const { data: countryBbox } = useGetV2DashboardCountryCountry({
    pathParams: { country: filters.country.country_slug }
  });
  const [updateFilters, setUpdateFilters] = useState<any>({});
  useEffect(() => {
    const parsedFilters = {
      programmes: filters.programmes,
      country: filters.country.country_slug,
      "organisations.type": filters.organizations,
      landscapes: filters.landscapes,
      "v2_projects.uuid": filters.uuid
    };
    setUpdateFilters(parsedFilters);
  }, [filters]);
  const queryParams: any = useMemo(() => createQueryParams(updateFilters), [updateFilters]);

  const activeProjectsQueryParams: any = useMemo(() => {
    const modifiedFilters = {
      ...updateFilters,
      "v2_projects.uuid": ""
    };
    return createQueryParams(modifiedFilters);
  }, [updateFilters]);

  const { showLoader, hideLoader } = useLoading();
  const {
    data: totalSectionHeader,
    refetch: refetchTotalSectionHeader,
    isLoading
  } = useGetV2DashboardTotalSectionHeader<any>({ queryParams: queryParams }, { enabled: !!filters });
  const { data: jobsCreatedData } = useGetV2DashboardJobsCreated<any>(
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

  const filteredProjects = activeProjects?.data?.filter((project: { name: string | null }) =>
    project?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const { data: dashboardRestorationGoalData } =
    useGetV2DashboardTreeRestorationGoal<DashboardTreeRestorationGoalResponse>({
      queryParams: queryParams
    });

  const { data: dashboardVolunteersSurvivalRate } = useGetV2DashboardVolunteersSurvivalRate<any>({
    queryParams: queryParams
  });

  const { data: hectaresUnderRestoration } = useGetV2DashboardIndicatorHectaresRestoration<any>({
    queryParams: queryParams
  });
  const { data: dashboardProjectDetails } = useGetV2DashboardProjectDetailsProject<any>(
    { pathParams: { project: filters.uuid } },
    { enabled: !!filters.uuid }
  );

  useEffect(() => {
    if (topData?.data) {
      const projects = topData.data.top_projects_most_planted_trees.slice(0, 5);
      const tableData = projects.map((project: { organization: string; project: string; trees_planted: number }) => ({
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
    if (
      totalSectionHeader?.total_trees_restored &&
      totalSectionHeader?.total_hectares_restored &&
      totalSectionHeader?.total_entries
    ) {
      setDashboardHeader(prev => [
        { ...prev[0], value: totalSectionHeader.total_trees_restored.toLocaleString() },
        { ...prev[1], value: `${totalSectionHeader.total_hectares_restored.toLocaleString()} ha` },
        { ...prev[2], value: totalSectionHeader.total_entries.toLocaleString() }
      ]);
      setNumberTreesPlanted({
        value: totalSectionHeader.total_trees_restored,
        totalValue: totalSectionHeader.total_trees_restored_goal
      });
    } else {
      setDashboardHeader([
        { label: "Trees Planted", value: "Loading" },
        { label: "Hectares Under Restoration", value: "Loading" },
        { label: "Jobs Created", value: "Loading" }
      ]);
      setNumberTreesPlanted({ value: 0, totalValue: 0 });
      setTimeout(() => {
        refetchTotalSectionHeader();
      }, 5000);
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
    dashboardProjectDetails,
    topProject,
    refetchTotalSectionHeader,
    activeCountries,
    activeProjects: filteredProjects,
    centroidsDataProjects: centroidsDataProjects?.data,
    listViewProjects,
    polygonsData: polygonsData?.data ?? {},
    countryBbox: countryBboxParsed
  };
};
