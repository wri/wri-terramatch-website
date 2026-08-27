import { startCase } from "lodash";
import { useMemo } from "react";

import {
  indexDisturbanceReportConnection,
  indexFinancialReportConnection,
  indexSRPReportConnection
} from "@/connections/Entity";
import { useOrganisation } from "@/connections/Organisation";
import {
  DisturbanceReportEntryDto,
  DisturbanceReportLightDto,
  FinancialReportLightDto,
  ProjectFullDto,
  SrpReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { useAllPages } from "@/hooks/useConnection";

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
  nothingToReport: "nothingToReport" in report && report.nothingToReport === true,
  updateRequestStatus: report.updateRequestStatus ?? null,
  dueAt: report.dueAt,
  updatedAt: report.updatedAt,
  currency,
  financialYearStart,
  completion: null,
  organisationName: report.organisationName ?? null,
  organisationUuid: report.organisationUuid ?? null,
  projectName: null,
  year: report.yearOfReport?.toString() ?? null
});

const toSrpReport = (report: SrpReportLightDto): AdditionalSrpReport => ({
  id: report.uuid,
  name: "SRP Report",
  type: "srp-report",
  status: resolveReportsIndexStatus(report),
  nothingToReport: "nothingToReport" in report && report.nothingToReport === true,
  updateRequestStatus: report.updateRequestStatus ?? null,
  dueAt: report.dueAt,
  updatedAt: report.updatedAt,
  completion: report.completion,
  organisationName: report.organisationName ?? null,
  organisationUuid: report.organisationUuid ?? null,
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
    nothingToReport: "nothingToReport" in report && report.nothingToReport === true,
    updateRequestStatus: report.updateRequestStatus ?? null,
    dueAt: null,
    dateOfDisturbance: report.disturbanceStartDate,
    updatedAt: report.updatedAt,
    completion: null,
    sitesAffected: Array.isArray(sitesAffected) ? sitesAffected.length : 0,
    intensity: report.intensity ?? (getEntryValue(report.entries, "intensity") as string | null),
    organisationName: report.organisationName ?? null,
    organisationUuid: report.organisationUuid ?? null,
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

type OrganisationSectionDraft = {
  id: string;
  name: string | null;
  organisationUuid: string | null;
  financialReports: AdditionalFinancialReport[];
  projects: Map<string, ProjectSectionDraft>;
};

type ProjectScopedReport = {
  projectUuid: string | null;
  projectName: string | null;
  organisationName: string | null;
  organisationUuid: string | null;
};

const UNKNOWN_ORGANISATION = "unknown";

const toProjectSection = (draft: ProjectSectionDraft): AdditionalReportsEntitySection | null => {
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

  if (groups.length === 0) return null;

  return {
    id: draft.id,
    type: "project",
    name: draft.name,
    caption: draft.caption,
    organisationUuid: draft.organisationUuid,
    groups
  };
};

/**
 * Additional Reports are organisation-first: financial reports hang off the org, SRP and
 * disturbance reports hang off each project inside that org.
 */
export const useAdditionalReportsData = (
  project: ProjectFullDto,
  enabled: boolean,
  organisationUuid: string | null
): AdditionalReportsDataState => {
  const loadOrganisationData = enabled && organisationUuid != null;
  const indexFilter = organisationUuid == null ? {} : { organisationUuid };

  const [organisationLoaded, { data: organisation }] = useOrganisation(
    loadOrganisationData ? { id: organisationUuid } : {}
  );

  const [financialLoaded, financialData, financialFailure] = useAllPages(indexFinancialReportConnection, {
    ...INDEX_PROPS,
    filter: indexFilter,
    enabled
  });

  const [srpLoaded, srpData, srpFailure] = useAllPages(indexSRPReportConnection, {
    ...INDEX_PROPS,
    filter: indexFilter,
    enabled
  });

  const [disturbanceLoaded, disturbanceData, disturbanceFailure] = useAllPages(indexDisturbanceReportConnection, {
    ...INDEX_PROPS,
    filter: indexFilter,
    enabled
  });

  const organisationReady = !loadOrganisationData || organisationLoaded;
  const loading = enabled && !(organisationReady && financialLoaded && srpLoaded && disturbanceLoaded);
  // Financial reports are optional on this tab: a failed unfiltered "All" fetch must not hide SRP
  // and disturbance reports that already loaded.
  const error = enabled && (srpFailure != null || disturbanceFailure != null);

  const sections = useMemo((): AdditionalReportsEntitySection[] => {
    if (!enabled || loading || error) return [];

    const draftsByOrganisation = new Map<string, OrganisationSectionDraft>();

    const organisationDraft = (uuid: string | null, name: string | null) => {
      const organisationId = uuid ?? UNKNOWN_ORGANISATION;
      let draft = draftsByOrganisation.get(organisationId);
      if (draft == null) {
        draft = {
          id: organisationId,
          name,
          organisationUuid: uuid,
          financialReports: [],
          projects: new Map()
        };
        draftsByOrganisation.set(organisationId, draft);
      } else if (draft.name == null && name != null) {
        draft.name = name;
      }
      return draft;
    };

    const projectDraft = (report: ProjectScopedReport) => {
      const projectUuid = report.projectUuid ?? project.uuid;
      const org = organisationDraft(
        report.organisationUuid ?? project.organisationUuid,
        report.organisationName ?? project.organisationName
      );
      let draft = org.projects.get(projectUuid);
      if (draft == null) {
        draft = {
          id: projectUuid,
          name: report.projectName ?? (projectUuid === project.uuid ? project.name : null),
          caption: report.organisationName ?? project.organisationName ?? "",
          organisationUuid: report.organisationUuid ?? project.organisationUuid,
          srpReports: [],
          disturbanceReports: []
        };
        org.projects.set(projectUuid, draft);
      }
      return draft;
    };

    (financialFailure != null ? [] : financialData).forEach(report => {
      const isScopedOrganisation = organisationUuid != null && report.organisationUuid === organisationUuid;
      organisationDraft(report.organisationUuid, report.organisationName).financialReports.push(
        toFinancialReport(
          report,
          isScopedOrganisation ? organisation?.currency ?? null : null,
          isScopedOrganisation ? organisation?.finStartMonth ?? null : null
        )
      );
    });
    srpData.forEach(report => projectDraft(report).srpReports.push(toSrpReport(report)));
    disturbanceData.forEach(report => projectDraft(report).disturbanceReports.push(toDisturbanceReport(report)));

    return Array.from(draftsByOrganisation.values())
      .map(draft => {
        const children = Array.from(draft.projects.values())
          .map(toProjectSection)
          .filter((section): section is AdditionalReportsEntitySection => section != null)
          .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        const groups: AdditionalReportGroup[] =
          draft.financialReports.length === 0
            ? []
            : [
                {
                  id: `${draft.id}-financial-reports`,
                  type: "financial-report",
                  reports: draft.financialReports
                }
              ];

        return {
          id: draft.id,
          type: "organisation" as const,
          name: draft.name,
          caption: "Organisation",
          organisationUuid: draft.organisationUuid,
          groups,
          children
        };
      })
      .filter(section => section.groups.length > 0 || (section.children?.length ?? 0) > 0)
      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
  }, [
    disturbanceData,
    enabled,
    error,
    financialData,
    financialFailure,
    loading,
    organisation?.currency,
    organisation?.finStartMonth,
    project.name,
    project.organisationName,
    project.organisationUuid,
    project.uuid,
    organisationUuid,
    srpData
  ]);

  if (!enabled) return { loading: false, sections: [], error: false };

  return { loading, sections, error };
};
