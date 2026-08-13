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
  dueAt: report.dueAt,
  updatedAt: report.updatedAt,
  currency,
  financialYearStart,
  organisationName: report.organisationName ?? null,
  projectName: null,
  year: report.yearOfReport?.toString() ?? null
});

const toSrpReport = (report: SrpReportLightDto): AdditionalSrpReport => ({
  id: report.uuid,
  name: "SRP Report",
  type: "srp-report",
  status: resolveReportsIndexStatus(report),
  dueAt: report.dueAt,
  updatedAt: report.updatedAt,
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
    dueAt: null,
    dateOfDisturbance: report.disturbanceStartDate,
    updatedAt: report.updatedAt,
    sitesAffected: Array.isArray(sitesAffected) ? sitesAffected.length : 0,
    intensity: report.intensity ?? (getEntryValue(report.entries, "intensity") as string | null),
    organisationName: report.organisationName ?? null,
    projectName: report.projectName ?? null,
    year: null
  };
};

export const useAdditionalReportsData = (project: ProjectFullDto, enabled: boolean): AdditionalReportsDataState => {
  const [userLoaded, { user }] = useMyUser();
  const organisationUuid = user?.organisationUuid ?? null;
  const loadOrganisationData = enabled && organisationUuid != null;

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
    filter: { projectUuid: project.uuid },
    enabled
  });

  const [disturbanceLoaded, { data: disturbanceData, loadFailure: disturbanceFailure }] = useDisturbanceReportIndex({
    ...INDEX_PROPS,
    filter: { projectUuid: project.uuid },
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
    const srpReports = (srpData ?? []).map(toSrpReport);
    const disturbanceReports = (disturbanceData ?? []).map(toDisturbanceReport);
    const nextSections: AdditionalReportsEntitySection[] = [];

    if (organisationUuid != null && financialReports.length > 0) {
      nextSections.push({
        id: organisationUuid,
        type: "organisation",
        name: organisation?.name ?? project.organisationName,
        caption: "Organisation",
        groups: [{ id: "financial-reports", type: "financial-report", reports: financialReports }]
      });
    }

    const projectGroups = [
      ...(srpReports.length === 0 ? [] : [{ id: "annual-srp", type: "srp-report" as const, reports: srpReports }]),
      ...(disturbanceReports.length === 0
        ? []
        : [{ id: "disturbance-reports", type: "disturbance-report" as const, reports: disturbanceReports }])
    ];

    if (projectGroups.length > 0) {
      nextSections.push({
        id: project.uuid,
        type: "project",
        name: project.name,
        caption: project.organisationName ?? "",
        groups: projectGroups
      });
    }

    return nextSections;
  }, [
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
    project.uuid,
    srpData
  ]);

  if (!enabled) return { loading: false, sections: [], error: false };

  return { loading, sections, error };
};
