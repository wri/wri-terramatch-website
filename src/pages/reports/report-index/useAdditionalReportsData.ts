import { startCase } from "lodash";
import { useMemo } from "react";

import { useDisturbanceReportIndex, useFinancialReportIndex, useSRPReportIndex } from "@/connections/Entity";
import { useOrganisation } from "@/connections/Organisation";
import { useMyUser } from "@/connections/User";
import {
  DisturbanceReportEntryDto,
  DisturbanceReportLightDto,
  FinancialReportLightDto,
  ProjectFullDto,
  SrpReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";

import {
  AdditionalDisturbanceReport,
  AdditionalFinancialReport,
  AdditionalReportGroup,
  AdditionalReportsEntitySection,
  AdditionalSrpReport
} from "./reportIndex.types";
import { resolveReportsIndexStatus } from "./reportIndex.utils";

type AdditionalReportsDataState = {
  loading: boolean;
  sections: AdditionalReportsEntitySection[];
  error: boolean;
};

const INDEX_PROPS = {
  pageNumber: 1,
  pageSize: 100,
  sortField: "updatedAt",
  sortDirection: "DESC" as const
};

const getEntryValue = (entries: DisturbanceReportEntryDto[] | null, name: string): unknown => {
  const value = entries?.find(entry => entry.name === name)?.value;
  if (typeof value !== "string" || !value.startsWith("[")) return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const toFinancialReport = (
  report: FinancialReportLightDto,
  currency: string | null,
  financialYearStart: number | null
): AdditionalFinancialReport => ({
  id: report.uuid,
  name: "Financial Report",
  type: "financial-report",
  status: resolveReportsIndexStatus(report),
  updateRequestStatus: report.updateRequestStatus ?? null,
  dueAt: report.dueAt,
  updatedAt: report.updatedAt,
  currency,
  financialYearStart,
  completion: null,
  organisationName: report.organisationName ?? null,
  projectName: null,
  year: report.yearOfReport?.toString() ?? null
});

const toSrpReport = (report: SrpReportLightDto): AdditionalSrpReport => ({
  id: report.uuid,
  name: "SRP Report",
  type: "srp-report",
  status: resolveReportsIndexStatus(report),
  updateRequestStatus: report.updateRequestStatus ?? null,
  dueAt: report.dueAt,
  updatedAt: report.updatedAt,
  completion: report.completion,
  organisationName: report.organisationName ?? null,
  projectName: report.projectName ?? null,
  year: report.year?.toString() ?? null
});

const toDisturbanceReport = (report: DisturbanceReportLightDto): AdditionalDisturbanceReport => {
  const disturbanceType = getEntryValue(report.entries, "disturbance-type");
  const sitesAffected = getEntryValue(report.entries, "site-affected");
  const typeLabel = typeof disturbanceType === "string" ? startCase(disturbanceType) : "";

  return {
    id: report.uuid,
    name: `${typeLabel === "" ? "" : `${typeLabel} `}Disturbance Report`,
    type: "disturbance-report",
    status: resolveReportsIndexStatus(report),
    updateRequestStatus: report.updateRequestStatus ?? null,
    dueAt: null,
    dateOfDisturbance: report.disturbanceStartDate,
    updatedAt: report.updatedAt,
    completion: null,
    sitesAffected: Array.isArray(sitesAffected) ? sitesAffected.length : 0,
    intensity: report.intensity ?? (getEntryValue(report.entries, "intensity") as string | null),
    organisationName: report.organisationName ?? null,
    projectName: report.projectName ?? null,
    year: null
  };
};

type ProjectSectionDraft = {
  id: string;
  name: string | null;
  caption: string;
  organisationUuid: string | null;
  srpReports: AdditionalSrpReport[];
  disturbanceReports: AdditionalDisturbanceReport[];
};

type ProjectScopedReport = {
  projectUuid: string | null;
  projectName: string | null;
  organisationName: string | null;
  organisationUuid: string | null;
};

export const useAdditionalReportsData = (
  project: ProjectFullDto,
  enabled: boolean,
  allProjects: boolean
): AdditionalReportsDataState => {
  const [userLoaded, { user }] = useMyUser();
  const organisationUuid = user?.organisationUuid ?? null;
  const loadOrganisationData = enabled && organisationUuid != null;
  const projectFilter = allProjects ? {} : { projectUuid: project.uuid };

  const [organisationLoaded, { data: organisation, loadFailure: organisationFailure }] = useOrganisation(
    loadOrganisationData ? { id: organisationUuid } : {}
  );

  const [financialLoaded, { data: financialData, loadFailure: financialFailure }] = useFinancialReportIndex({
    ...INDEX_PROPS,
    filter: { organisationUuid: organisationUuid ?? "" },
    enabled: loadOrganisationData
  });

  const [srpLoaded, { data: srpData, loadFailure: srpFailure }] = useSRPReportIndex({
    ...INDEX_PROPS,
    filter: projectFilter,
    enabled
  });

  const [disturbanceLoaded, { data: disturbanceData, loadFailure: disturbanceFailure }] = useDisturbanceReportIndex({
    ...INDEX_PROPS,
    filter: projectFilter,
    enabled
  });

  const organisationReady = !loadOrganisationData || organisationLoaded;
  const financialReady = !loadOrganisationData || financialLoaded;
  const loading = enabled && (!userLoaded || !(organisationReady && financialReady && srpLoaded && disturbanceLoaded));
  const error =
    enabled &&
    (organisationFailure != null || financialFailure != null || srpFailure != null || disturbanceFailure != null);

  const sections = useMemo((): AdditionalReportsEntitySection[] => {
    if (!enabled || loading || error) return [];

    const financialReports = (financialData ?? []).map(report =>
      toFinancialReport(report, organisation?.currency ?? null, organisation?.finStartMonth ?? null)
    );
    const nextSections: AdditionalReportsEntitySection[] = [];

    if (allProjects && organisationUuid != null && financialReports.length > 0) {
      nextSections.push({
        id: organisationUuid,
        type: "organisation",
        name: organisation?.name ?? project.organisationName,
        caption: "Organisation",
        organisationUuid,
        groups: [{ id: "financial-reports", type: "financial-report", reports: financialReports }]
      });
    }

    // SRP and disturbance reports hang off a project, so they get one accordion per project. In the
    // single project view this collapses to the one project being looked at.
    const draftsByProject = new Map<string, ProjectSectionDraft>();

    const draftFor = (report: ProjectScopedReport) => {
      const projectUuid = report.projectUuid ?? project.uuid;
      let draft = draftsByProject.get(projectUuid);

      if (draft == null) {
        draft = {
          id: projectUuid,
          name: report.projectName ?? (projectUuid === project.uuid ? project.name : null),
          caption: report.organisationName ?? project.organisationName ?? "",
          organisationUuid: report.organisationUuid ?? project.organisationUuid,
          srpReports: [],
          disturbanceReports: []
        };
        draftsByProject.set(projectUuid, draft);
      }

      return draft;
    };

    (srpData ?? []).forEach(report => draftFor(report).srpReports.push(toSrpReport(report)));
    (disturbanceData ?? []).forEach(report => draftFor(report).disturbanceReports.push(toDisturbanceReport(report)));

    const projectSections = Array.from(draftsByProject.values())
      .map(draft => {
        const groups: AdditionalReportGroup[] = [
          ...(draft.srpReports.length === 0
            ? []
            : [{ id: `${draft.id}-annual-srp`, type: "srp-report" as const, reports: draft.srpReports }]),
          ...(draft.disturbanceReports.length === 0
            ? []
            : [
                {
                  id: `${draft.id}-disturbance-reports`,
                  type: "disturbance-report" as const,
                  reports: draft.disturbanceReports
                }
              ])
        ];

        return {
          id: draft.id,
          type: "project" as const,
          name: draft.name,
          caption: draft.caption,
          organisationUuid: draft.organisationUuid,
          groups
        };
      })
      .filter(section => section.groups.length > 0)
      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

    if (!allProjects && financialReports.length > 0) {
      const financialGroup: AdditionalReportGroup = {
        id: "financial-reports",
        type: "financial-report",
        reports: financialReports
      };
      const currentProjectIndex = projectSections.findIndex(section => section.id === project.uuid);
      if (currentProjectIndex >= 0) {
        projectSections[currentProjectIndex] = {
          ...projectSections[currentProjectIndex],
          groups: [financialGroup, ...projectSections[currentProjectIndex].groups]
        };
      } else {
        projectSections.unshift({
          id: project.uuid,
          type: "project",
          name: project.name,
          caption: project.organisationName ?? "",
          organisationUuid: project.organisationUuid,
          groups: [financialGroup]
        });
      }
    }

    return [...nextSections, ...projectSections];
  }, [
    allProjects,
    disturbanceData,
    enabled,
    error,
    financialData,
    loading,
    organisation?.currency,
    organisation?.finStartMonth,
    organisation?.name,
    organisationUuid,
    project.name,
    project.organisationName,
    project.organisationUuid,
    project.uuid,
    srpData
  ]);

  if (!enabled) return { loading: false, sections: [], error: false };

  return { loading, sections, error };
};
