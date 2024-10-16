import { useEffect, useMemo, useState } from "react";

import { useLoading } from "@/context/loaderAdmin.provider";
import {
  useGetV2DashboardJobsCreated,
  useGetV2DashboardTopTreesPlanted,
  useGetV2DashboardTotalSectionHeader,
  useGetV2DashboardTreeRestorationGoal
} from "@/generated/apiComponents";
import { DashboardTreeRestorationGoalResponse } from "@/generated/apiSchemas";
import { createQueryParams } from "@/utils/dashboardUtils";

export const useDashboardData = (filters: any) => {
  const [topProject, setTopProjects] = useState<any>([]);
  const [dashboardHeader, setDashboardHeader] = useState([
    {
      label: "Trees Planted",
      value: "0",
      tooltip: "Total number of trees planted by funded projects to date."
    },
    {
      label: "Hectares Under Restoration",
      value: "0 ha",
      tooltip: "Total land area with active restoration interventions."
    },
    {
      label: "Jobs Created",
      value: "0",
      tooltip: "Number of jobs created to date."
    }
  ]);
  const [totalFtJobs, setTotalFtJobs] = useState({ value: 0 });
  const [totalPtJobs, setTotalPtJobs] = useState({ value: 0 });
  const [numberTreesPlanted, setNumberTreesPlanted] = useState({
    value: 0,
    totalValue: 0
  });
  const [updateFilters, setUpdateFilters] = useState<any>({});
  useEffect(() => {
    const parsedFilters = {
      programmes: filters.programmes,
      country: filters.country.country_slug,
      "organisations.type": filters.organizations,
      landscapes: filters.landscapes
    };
    setUpdateFilters(parsedFilters);
  }, [filters]);

  const queryParams: any = useMemo(() => createQueryParams(updateFilters), [updateFilters]);
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

  const { data: dashboardRestorationGoalData } =
    useGetV2DashboardTreeRestorationGoal<DashboardTreeRestorationGoalResponse>({
      queryParams: queryParams
    });

  useEffect(() => {
    if (jobsCreatedData?.data?.total_ft) {
      setTotalFtJobs({ value: jobsCreatedData?.data?.total_ft });
    }
    if (jobsCreatedData?.data?.total_pt) {
      setTotalPtJobs({ value: jobsCreatedData?.data?.total_pt });
    }
  }, [jobsCreatedData]);

  useEffect(() => {
    if (topData?.data) {
      const projects = topData.data.top_projects_most_planted_trees.slice(0, 5);
      const tableData = projects.map((project: { project: string; trees_planted: number }) => ({
        label: project.project,
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
        { ...prev[0], value: totalSectionHeader.total_trees_restored.toLocaleString() },
        { ...prev[1], value: `${totalSectionHeader.total_hectares_restored.toLocaleString()} ha` },
        { ...prev[2], value: totalSectionHeader.total_entries.toLocaleString() }
      ]);
      setNumberTreesPlanted({
        value: totalSectionHeader.total_trees_restored,
        totalValue: totalSectionHeader.total_trees_restored_goal
      });
    }
  }, [totalSectionHeader]);

  return {
    dashboardHeader,
    dashboardRestorationGoalData,
    totalFtJobs,
    totalPtJobs,
    numberTreesPlanted,
    topProject,
    refetchTotalSectionHeader
  };
};
