import { useEffect, useState } from "react";

import { loadLightNurseryReportList, loadLightProjectReport, loadLightSiteReportList } from "@/connections/Entity";
import { loadTask, loadTasks } from "@/connections/Task";
import {
  NurseryReportLightDto,
  ProjectReportLightDto,
  SiteReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import Log from "@/utils/log";

import { ReportsIndexPeriod, ReportsIndexReport, ReportsIndexReportType } from "./reportIndex.types";
import { ReportsIndexSource, resolveReportsIndexStatus } from "./reportIndex.utils";

type ReportsIndexDataState = {
  loading: boolean;
  periods: ReportsIndexPeriod[];
  error: boolean;
};

type ReportsIndexRawReport = ProjectReportLightDto | SiteReportLightDto | NurseryReportLightDto;

const toReport = (report: ReportsIndexRawReport, type: ReportsIndexReportType): ReportsIndexReport => {
  const name =
    type === "project-report"
      ? (report as ProjectReportLightDto).title
      : type === "site-report"
      ? (report as SiteReportLightDto).reportTitle ?? (report as SiteReportLightDto).siteName
      : (report as NurseryReportLightDto).reportTitle ??
        (report as NurseryReportLightDto).title ??
        (report as NurseryReportLightDto).nurseryName;
  const sourceName =
    type === "project-report"
      ? report.projectName
      : type === "site-report"
      ? (report as SiteReportLightDto).siteName
      : (report as NurseryReportLightDto).nurseryName;

  return {
    id: report.uuid,
    name,
    sourceName: sourceName ?? "",
    projectName: report.projectName ?? "",
    type,
    status: resolveReportsIndexStatus(report),
    updatedAt: report.updatedAt
  };
};

const belongsToSource = (report: ReportsIndexRawReport, source: ReportsIndexSource, sourceUuid: string) => {
  if (source === "project") return report.projectUuid === sourceUuid;
  if (source === "site") return "siteUuid" in report && report.siteUuid === sourceUuid;
  return "nurseryUuid" in report && report.nurseryUuid === sourceUuid;
};

export const useReportsIndexData = (
  projectUuid: string,
  source: ReportsIndexSource,
  sourceUuid: string
): ReportsIndexDataState => {
  const [state, setState] = useState<ReportsIndexDataState>({ loading: true, periods: [], error: false });

  useEffect(() => {
    let active = true;

    const load = async () => {
      setState({ loading: true, periods: [], error: false });

      try {
        const taskIndex = await loadTasks({
          filter: { projectUuid },
          pageNumber: 1,
          pageSize: 100,
          sortField: "dueAt",
          sortDirection: "DESC"
        });

        if (taskIndex.loadFailure != null) throw new Error("Unable to load reporting tasks");

        const periods = await Promise.all(
          (taskIndex.data ?? []).map(async task => {
            const taskState = await loadTask({ id: task.uuid });
            if (taskState.loadFailure != null) throw new Error(`Unable to load task ${task.uuid}`);

            const siteReportUuids = taskState.siteReportUuids ?? [];
            const nurseryReportUuids = taskState.nurseryReportUuids ?? [];
            const [projectReportState, siteReportsState, nurseryReportsState] = await Promise.all([
              taskState.projectReportUuid == null
                ? Promise.resolve({ data: undefined })
                : loadLightProjectReport({ id: taskState.projectReportUuid }),
              siteReportUuids.length === 0
                ? Promise.resolve({ data: [] as SiteReportLightDto[] })
                : loadLightSiteReportList({ ids: siteReportUuids }),
              nurseryReportUuids.length === 0
                ? Promise.resolve({ data: [] as NurseryReportLightDto[] })
                : loadLightNurseryReportList({ ids: nurseryReportUuids })
            ]);

            const reports = [
              ...(projectReportState.data == null || !belongsToSource(projectReportState.data, source, sourceUuid)
                ? []
                : [toReport(projectReportState.data, "project-report")]),
              ...(siteReportsState.data ?? [])
                .filter(report => belongsToSource(report, source, sourceUuid))
                .map(report => toReport(report, "site-report")),
              ...(nurseryReportsState.data ?? [])
                .filter(report => belongsToSource(report, source, sourceUuid))
                .map(report => toReport(report, "nursery-report"))
            ];

            return {
              id: task.uuid,
              task,
              metrics: {
                treesPlantedCount: taskState.data?.treesPlantedCount ?? 0,
                seedsPlantedCount: taskState.data?.seedsPlantedCount ?? 0,
                regeneratedTreesCount: taskState.data?.regeneratedTreesCount ?? 0,
                jobsCreated: taskState.data?.jobsCreated ?? 0
              },
              reports
            };
          })
        );

        if (active) {
          setState({
            loading: false,
            periods: periods.filter(period => period.reports.length > 0),
            error: false
          });
        }
      } catch (error) {
        Log.error("Unable to load reports index", { projectUuid, source, sourceUuid, error });
        if (active) setState({ loading: false, periods: [], error: true });
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [projectUuid, source, sourceUuid]);

  return state;
};
