import isArray from "lodash/isArray";
import { useMemo } from "react";

import { useLightNurseryReportList, useLightProjectReportList, useLightSiteReportList } from "@/connections/Entity";
import { taskIndexConnection, TaskRelationships } from "@/connections/Task";
import { IdsProp, ListConnection } from "@/connections/util/apiConnectionFactory";
import {
  NurseryReportLightDto,
  ProjectLightDto,
  ProjectReportLightDto,
  SiteReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { useAllPages } from "@/hooks/useConnection";
import { Connected } from "@/types/connection";
import { isNotNull } from "@/utils/array";

import {
  ReportsIndexPeriod,
  ReportsIndexProjectSection,
  ReportsIndexReport,
  ReportsIndexReportType
} from "./reportIndex.types";
import { ReportsIndexSource, resolveReportsIndexStatus } from "./reportIndex.utils";

type ReportsIndexDataState = {
  loading: boolean;
  sections: ReportsIndexProjectSection[];
  error: boolean;
};

type ReportsIndexRawReport = ProjectReportLightDto | SiteReportLightDto | NurseryReportLightDto;

const UNSCHEDULED_PERIOD = "unscheduled";

const toReport = (report: ReportsIndexRawReport, type: ReportsIndexReportType): ReportsIndexReport => {
  const name =
    type === "project-report"
      ? (report as ProjectReportLightDto).title
      : type === "site-report"
      ? (report as SiteReportLightDto).siteName
      : (report as NurseryReportLightDto).nurseryName;

  return {
    id: report.uuid,
    name,
    projectName: report.projectName ?? "",
    type,
    status: resolveReportsIndexStatus(report),
    nothingToReport: "nothingToReport" in report && report.nothingToReport === true,
    updateRequestStatus: report.updateRequestStatus ?? null,
    completion: report.completion,
    updatedAt: report.updatedAt
  };
};

const resolveProjectReportUuid = (report: ReportsIndexRawReport, type: ReportsIndexReportType) => {
  if (type === "project-report") return report.uuid;
  if ("projectReportUuid" in report) return report.projectReportUuid ?? null;
  return null;
};

const byDueAtDescending = (a: ReportsIndexPeriod, b: ReportsIndexPeriod) =>
  (b.dueAt ?? "").localeCompare(a.dueAt ?? "");

const byNameAscending = (a: ReportsIndexProjectSection, b: ReportsIndexProjectSection) =>
  (a.name ?? "").localeCompare(b.name ?? "");

type ProjectSectionDraft = Omit<ReportsIndexProjectSection, "periods"> & {
  periodsByDueAt: Map<string, ReportsIndexPeriod>;
};

const useTasksReports = <LightDto>(
  tasks: TaskRelationships[],
  prop: keyof TaskRelationships,
  useDtoList: (props: IdsProp) => Connected<ListConnection<LightDto>>
) => {
  const ids = useMemo(
    () =>
      tasks
        .map(task => (isArray(task[prop]) ? task[prop] : (task[prop] as string | undefined)) as (string | undefined)[])
        .flat()
        .filter(isNotNull),
    [prop, tasks]
  );
  const [, { data: reports = [] }] = useDtoList({ ids });
  return reports;
};

/**
 * Loads the progress reports (project, site and nursery) that belong to the entity the reports page
 * was opened for, or to every project in the "All Projects" view, and groups them by project and
 * then by reporting period.
 *
 * The reports are read straight from their indexes rather than walking the reporting tasks one by
 * one: the "All Projects" view would need a request per task across every project, and the index
 * DTOs already carry everything a period needs (due date and framework). Period metric values are
 * loaded lazily from the project report when a period accordion opens.
 */
export const useReportsIndexData = (
  project: ProjectLightDto,
  source: ReportsIndexSource,
  sourceUuid: string,
  allProjects: boolean
): ReportsIndexDataState => {
  const { uuid: projectUuid, name: projectName, organisationName, organisationUuid } = project;

  // TODO: this will need to load page by page with infinite scroll behavior in a future ticket.
  const [tasksLoaded, tasks, taskFailure] = useAllPages(taskIndexConnection, {
    filter: { projectUuid },
    sideloadReports: true
  });
  // These are all cached because they were sideloaded on the tasks index request.
  const projectReports = useTasksReports(tasks, "projectReportUuid", useLightProjectReportList);
  const siteReports = useTasksReports(tasks, "siteReportUuids", useLightSiteReportList);
  const nurseryReports = useTasksReports(tasks, "nurseryReportUuids", useLightNurseryReportList);

  // TODO: add site / nursery filtering on the tasks index and only sideload the reports associated
  //  with that site or nursery. Maybe consider an array of sideloads so that the BE doesn't
  //  sideload the SRP reports which this page doesn't want for some reason.
  // The "All Projects" view pulls the indexes unfiltered; otherwise they're scoped to the entity the
  // page was opened for, and the indexes that can't hold reports for that entity stay disabled.
  // const [projectReportsLoaded, projectReports, projectReportsFailure] = useAllPages(indexProjectReportConnection, {
  //   filter: allProjects ? {} : { projectUuid },
  //   enabled: allProjects || source === "project"
  // });
  //
  // const [siteReportsLoaded, siteReports, siteReportsFailure] = useAllPages(indexSiteReportConnection, {
  //   filter: allProjects ? {} : source === "site" ? { siteUuid: sourceUuid } : { projectUuid },
  //   enabled: allProjects || source !== "nursery"
  // });
  //
  // const [nurseryReportsLoaded, nurseryReports, nurseryReportsFailure] = useAllPages(indexNurseryReportConnection, {
  //   filter: allProjects ? {} : source === "nursery" ? { nurseryUuid: sourceUuid } : { projectUuid },
  //   enabled: allProjects || source !== "site"
  // });

  const projectReportsEnabled = allProjects || source === "project";

  const sections = useMemo((): ReportsIndexProjectSection[] => {
    if (!tasksLoaded || taskFailure != null) return [];

    const draftsByProject = new Map<string, ProjectSectionDraft>();

    const addReport = (report: ReportsIndexRawReport, type: ReportsIndexReportType) => {
      const reportProjectUuid = report.projectUuid;
      if (reportProjectUuid == null) return;

      let draft = draftsByProject.get(reportProjectUuid);
      if (draft == null) {
        draft = {
          id: reportProjectUuid,
          name: report.projectName ?? (reportProjectUuid === projectUuid ? projectName : null),
          organisationName: report.organisationName ?? (reportProjectUuid === projectUuid ? organisationName : null),
          organisationUuid: report.organisationUuid ?? (reportProjectUuid === projectUuid ? organisationUuid : null),
          periodsByDueAt: new Map()
        };
        draftsByProject.set(reportProjectUuid, draft);
      }

      const periodKey = report.dueAt ?? UNSCHEDULED_PERIOD;
      let period = draft.periodsByDueAt.get(periodKey);
      if (period == null) {
        period = {
          id: `${reportProjectUuid}-${periodKey}`,
          dueAt: report.dueAt,
          frameworkKey: report.frameworkKey,
          projectReportUuid: null,
          reports: []
        };
        draft.periodsByDueAt.set(periodKey, period);
      }

      // Prefer the project-report uuid when present. Site/nursery DTOs only fill the gap after the
      // project-report index has finished, so a partial first page cannot trigger metric fetches
      // against a stale or unauthorized project-report id.
      if (type === "project-report") {
        period.projectReportUuid = report.uuid;
      } else if (period.projectReportUuid == null && !projectReportsEnabled) {
        period.projectReportUuid = resolveProjectReportUuid(report, type);
      }

      period.reports.push(toReport(report, type));
    };

    projectReports.forEach(report => addReport(report, "project-report"));
    siteReports.forEach(report => addReport(report, "site-report"));
    nurseryReports.forEach(report => addReport(report, "nursery-report"));

    return Array.from(draftsByProject.values())
      .map(({ periodsByDueAt, ...draft }) => ({
        ...draft,
        periods: Array.from(periodsByDueAt.values()).sort(byDueAtDescending)
      }))
      .sort(byNameAscending);
  }, [
    tasksLoaded,
    taskFailure,
    projectReports,
    siteReports,
    nurseryReports,
    projectReportsEnabled,
    projectUuid,
    projectName,
    organisationName,
    organisationUuid
  ]);

  return { loading: !tasksLoaded, sections, error: taskFailure != null };
};
