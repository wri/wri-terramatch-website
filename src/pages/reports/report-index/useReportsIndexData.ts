import { useMemo } from "react";

import {
  indexNurseryReportConnection,
  indexProjectReportConnection,
  indexSiteReportConnection
} from "@/connections/Entity";
import {
  NurseryReportLightDto,
  ProjectFullDto,
  ProjectReportLightDto,
  SiteReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { useAllPages } from "@/hooks/useConnection";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";

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
  project: ProjectFullDto,
  source: ReportsIndexSource,
  sourceUuid: string,
  allProjects: boolean,
  // Bumped by the bulk actions once the reports they touched have been updated, so the indexes are
  // fetched again instead of serving the snapshot the page loaded with.
  reloadNonce = 0
): ReportsIndexDataState => {
  const { uuid: projectUuid, name: projectName, organisationName } = project;

  useValueChanged(reloadNonce, () => {
    if (reloadNonce === 0) return;
    ApiSlice.pruneIndex("projectReports", "");
    ApiSlice.pruneIndex("siteReports", "");
    ApiSlice.pruneIndex("nurseryReports", "");
  });

  // The "All Projects" view pulls the indexes unfiltered; otherwise they're scoped to the entity the
  // page was opened for, and the indexes that can't hold reports for that entity stay disabled.
  const [projectReportsLoaded, projectReports, projectReportsFailure] = useAllPages(
    indexProjectReportConnection,
    {
      filter: allProjects ? {} : { projectUuid },
      enabled: allProjects || source === "project"
    },
    reloadNonce
  );

  const [siteReportsLoaded, siteReports, siteReportsFailure] = useAllPages(
    indexSiteReportConnection,
    {
      filter: allProjects ? {} : source === "site" ? { siteUuid: sourceUuid } : { projectUuid },
      enabled: allProjects || source !== "nursery"
    },
    reloadNonce
  );

  const [nurseryReportsLoaded, nurseryReports, nurseryReportsFailure] = useAllPages(
    indexNurseryReportConnection,
    {
      filter: allProjects ? {} : source === "nursery" ? { nurseryUuid: sourceUuid } : { projectUuid },
      enabled: allProjects || source !== "site"
    },
    reloadNonce
  );

  const loading = !projectReportsLoaded || !siteReportsLoaded || !nurseryReportsLoaded;
  const error = projectReportsFailure != null || siteReportsFailure != null || nurseryReportsFailure != null;

  const sections = useMemo((): ReportsIndexProjectSection[] => {
    if (loading || error) return [];

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

      // Prefer the project-report uuid when present; site/nursery light DTOs only fill the gap when
      // the project-report index is disabled (site/nursery source views).
      if (type === "project-report") {
        period.projectReportUuid = report.uuid;
      } else if (period.projectReportUuid == null) {
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
  }, [error, loading, nurseryReports, organisationName, projectName, projectReports, projectUuid, siteReports]);

  return { loading, sections, error };
};
