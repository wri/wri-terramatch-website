import { useEffect, useState } from "react";

import { loadFullProjectReport, loadLightNurseryReportList, loadLightSiteReportList } from "@/connections/Entity";
import { loadTask, loadTasks } from "@/connections/Task";
import {
  NurseryReportLightDto,
  ProjectReportFullDto,
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

type ReportsIndexRawReport = ProjectReportLightDto | ProjectReportFullDto | SiteReportLightDto | NurseryReportLightDto;

const toReport = (report: ReportsIndexRawReport, type: ReportsIndexReportType): ReportsIndexReport => {
  const name =
    type === "project-report"
      ? (report as ProjectReportLightDto | ProjectReportFullDto).title
      : type === "site-report"
      ? (report as SiteReportLightDto).siteName
      : (report as NurseryReportLightDto).nurseryName;

  return {
    id: report.uuid,
    name,
    projectName: report.projectName ?? "",
    type,
    status: resolveReportsIndexStatus(report),
    updateRequestStatus: report.updateRequestStatus ?? null,
    completion: report.completion,
    updatedAt: report.updatedAt
  };
};

const belongsToSource = (report: ReportsIndexRawReport, source: ReportsIndexSource, sourceUuid: string) => {
  if (source === "project") return report.projectUuid === sourceUuid;
  if (source === "site") return "siteUuid" in report && report.siteUuid === sourceUuid;
  return "nurseryUuid" in report && report.nurseryUuid === sourceUuid;
};

const isPresentReport = (report: ReportsIndexRawReport | undefined | null): report is ReportsIndexRawReport =>
  report != null;

export const useReportsIndexData = (
  projectUuid: string,
  source: ReportsIndexSource,
  sourceUuid: string,
  reloadNonce = 0
): ReportsIndexDataState => {
  const [state, setState] = useState<ReportsIndexDataState>({ loading: true, periods: [], error: false });

  useEffect(() => {
    let active = true;

    const load = async () => {
      setState(current => ({ ...current, loading: current.periods.length === 0, error: false }));

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
            const projectReportUuid = taskState.projectReportUuid ?? null;
            const [projectReportState, siteReportsState, nurseryReportsState] = await Promise.all([
              projectReportUuid == null
                ? Promise.resolve({ data: undefined as ProjectReportFullDto | undefined })
                : loadFullProjectReport({ id: projectReportUuid }),
              siteReportUuids.length === 0
                ? Promise.resolve({ data: [] as SiteReportLightDto[] })
                : loadLightSiteReportList({ ids: siteReportUuids }),
              nurseryReportUuids.length === 0
                ? Promise.resolve({ data: [] as NurseryReportLightDto[] })
                : loadLightNurseryReportList({ ids: nurseryReportUuids })
            ]);

            const projectReport = projectReportState.data;
            const reports = [
              ...(projectReport == null || !belongsToSource(projectReport, source, sourceUuid)
                ? []
                : [toReport(projectReport, "project-report")]),
              ...(siteReportsState.data ?? [])
                .filter(isPresentReport)
                .filter(report => belongsToSource(report, source, sourceUuid))
                .map(report => toReport(report, "site-report")),
              ...(nurseryReportsState.data ?? [])
                .filter(isPresentReport)
                .filter(report => belongsToSource(report, source, sourceUuid))
                .map(report => toReport(report, "nursery-report"))
            ];

            return {
              id: task.uuid,
              task,
              projectReportUuid,
              metrics: {
                treesPlantedCount: projectReport?.treesPlantedCount ?? taskState.data?.treesPlantedCount ?? 0,
                seedsPlantedCount: projectReport?.seedsPlantedCount ?? 0,
                regeneratedTreesCount: projectReport?.regeneratedTreesCount ?? 0
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
  }, [projectUuid, reloadNonce, source, sourceUuid]);

  return state;
};
