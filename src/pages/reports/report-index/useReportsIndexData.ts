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
import { Connected, ConnectionProps } from "@/types/connection";
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
 */
export const useReportsIndexData = (
  project: ProjectLightDto,
  source: ReportsIndexSource,
  sourceUuid: string,
  allProjects: boolean
): ReportsIndexDataState => {
  const { uuid: projectUuid, name: projectName, organisationName, organisationUuid } = project;

  const props = useMemo(() => {
    const props: ConnectionProps<typeof taskIndexConnection> = {};

    if (allProjects || source === "project") {
      if (!allProjects) props.filter = { projectUuid };
      props.sideloads = ["projectReports", "siteReports", "nurseryReports"];
    } else if (source === "site") {
      props.filter = { siteUuid: sourceUuid };
      props.sideloads = ["siteReports"];
    } else if (source === "nursery") {
      props.filter = { nurseryUuid: sourceUuid };
      props.sideloads = ["nurseryReports"];
    }

    return props;
  }, [allProjects, projectUuid, source, sourceUuid]);
  // TODO: this will need to load page by page with infinite scroll behavior in a future ticket.
  const [tasksLoaded, tasks, taskFailure] = useAllPages(taskIndexConnection, props);
  // These are all cached because they were sideloaded on the tasks index request.
  const projectReports = useTasksReports(tasks, "projectReportUuid", useLightProjectReportList);
  const siteReports = useTasksReports(tasks, "siteReportUuids", useLightSiteReportList);
  const nurseryReports = useTasksReports(tasks, "nurseryReportUuids", useLightNurseryReportList);

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

      if (period.projectReportUuid == null) {
        period.projectReportUuid =
          type === "project-report"
            ? report.uuid
            : (report as SiteReportLightDto | NurseryReportLightDto).projectReportUuid;
      }

      period.reports.push(toReport(report, type));
    };

    if (allProjects || source === "project") {
      projectReports.forEach(report => addReport(report, "project-report"));
      siteReports.forEach(report => addReport(report, "site-report"));
      nurseryReports.forEach(report => addReport(report, "nursery-report"));
    } else if (source === "site") {
      // In the case of sites and nurseries we have to filter down to the reports that are associated
      // with the source. When requesting a given type of sideload (e.g. site-reports), the BE sends
      // every report of that type on the task index request. This is important for keeping the
      // client side cache store coherent - the definition of a given task in an index needs to
      // remain the same regardless of how it was fetched. It can't pretend that a task only
      // contains reports for a single site, even if that's how it was requested in a given index
      // call.
      siteReports.filter(report => report.siteUuid === sourceUuid).forEach(report => addReport(report, "site-report"));
    } else if (source === "nursery") {
      nurseryReports
        .filter(report => report.nurseryUuid === sourceUuid)
        .forEach(report => addReport(report, "nursery-report"));
    }

    return Array.from(draftsByProject.values())
      .map(({ periodsByDueAt, ...draft }) => ({
        ...draft,
        periods: Array.from(periodsByDueAt.values()).sort(byDueAtDescending)
      }))
      .sort(byNameAscending);
  }, [
    tasksLoaded,
    taskFailure,
    allProjects,
    source,
    projectUuid,
    projectName,
    organisationName,
    organisationUuid,
    projectReports,
    siteReports,
    nurseryReports,
    sourceUuid
  ]);

  return { loading: !tasksLoaded, sections, error: taskFailure != null };
};
