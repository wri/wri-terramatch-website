import { useEffect, useMemo, useState } from "react";

import { useMyUser } from "@/connections/User";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import {
  useGetV2DashboardActiveCountries,
  useGetV2DashboardActiveProjects,
  useGetV2DashboardBboxCountryLandscape,
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
  useGetV2DashboardVolunteersSurvivalRate,
  useGetV2ImpactStories
} from "@/generated/apiComponents";
import { DashboardTreeRestorationGoalResponse } from "@/generated/apiSchemas";
import { createQueryParams } from "@/utils/dashboardUtils";

import { HECTARES_UNDER_RESTORATION_TOOLTIP, JOBS_CREATED_TOOLTIP, TREES_PLANTED_TOOLTIP } from "../constants/tooltips";
import { BBox } from "./../../../components/elements/Map-mapbox/GeoJSON";

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
  const { data: generalBbox } = useGetV2DashboardBboxCountryLandscape(
    {
      queryParams: {
        landscapes: filters.landscapes?.join(","),
        country: filters.country.country_slug
      }
    },
    {
      enabled: !!filters.landscapes?.length || !!filters.country.country_slug
    }
  );
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

  const filteredProjects = activeProjects?.data?.filter(
    (project: { name: string | null; organisation: string | null }) =>
      project?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      project?.organisation?.toLowerCase().includes(searchTerm?.toLowerCase())
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
  const { data: dashboardProjectDetails, isLoading: isLoadingProjectDetails } =
    useGetV2DashboardProjectDetailsProject<any>({ pathParams: { project: filters.uuid } }, { enabled: !!filters.uuid });
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
    if (generalBbox && Array.isArray(generalBbox.bbox) && generalBbox.bbox.length > 1) {
      setGeneralBboxParsed(generalBbox.bbox as unknown as BBox);
    } else {
      setGeneralBboxParsed(undefined);
    }
  }, [generalBbox]);
  const queryString = useMemo(() => {
    const finalFilters = {
      status: ["published"],
      country: filters.country?.country_slug ? [filters.country.country_slug] : [],
      organizationType: filters.organizations ? filters.organizations : []
    };
    return createQueryParams(finalFilters);
  }, [filters.country?.country_slug, filters.organizations]);

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
    isLoadingProjectDetails,
    topProject,
    refetchTotalSectionHeader,
    activeCountries,
    activeProjects: filteredProjects,
    centroidsDataProjects: centroidsDataProjects?.data,
    polygonsData: polygonsData?.data ?? {},
    isUserAllowed,
    projectBbox: projectBbox?.bbox,
    generalBbox: generalBboxParsed,
    transformedStories,
    isLoadingImpactStories
  };
};
