import { startCase } from "lodash";
import { useEffect, useState } from "react";

import { loadDisturbanceReportIndex, loadFinancialReportIndex, loadSRPReportIndex } from "@/connections/Entity";
import { loadOrganisation } from "@/connections/Organisation";
import {
  DisturbanceReportEntryDto,
  DisturbanceReportLightDto,
  FinancialReportLightDto,
  ProjectFullDto,
  SrpReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import Log from "@/utils/log";

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

const INITIAL_STATE: AdditionalReportsDataState = { loading: false, sections: [], error: false };

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
): AdditionalFinancialReport => {
  const name = "Financial Report";

  return {
    id: report.uuid,
    name,
    type: "financial-report",
    status: resolveReportsIndexStatus(report),
    dueAt: report.dueAt,
    updatedAt: report.updatedAt,
    currency,
    financialYearStart,
    organisationName: report.organisationName ?? null,
    projectName: null,
    year: report.yearOfReport?.toString() ?? null
  };
};

const toSrpReport = (report: SrpReportLightDto): AdditionalSrpReport => {
  const name = "SRP Report";

  return {
    id: report.uuid,
    name,
    type: "srp-report",
    status: resolveReportsIndexStatus(report),
    dueAt: report.dueAt,
    updatedAt: report.updatedAt,
    organisationName: report.organisationName ?? null,
    projectName: report.projectName ?? null,
    year: report.year?.toString() ?? null
  };
};

const toDisturbanceReport = (report: DisturbanceReportLightDto): AdditionalDisturbanceReport => {
  const disturbanceType = getEntryValue(report.entries, "disturbance-type");
  const sitesAffected = getEntryValue(report.entries, "site-affected");
  const typeLabel = typeof disturbanceType === "string" ? startCase(disturbanceType) : "";
  const name = `${typeLabel === "" ? "" : `${typeLabel} `}Disturbance Report`;

  return {
    id: report.uuid,
    name,
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
  const [state, setState] = useState<AdditionalReportsDataState>(INITIAL_STATE);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    const load = async () => {
      setState(current => ({ ...current, loading: true, error: false }));

      try {
        const organisationUuid = project.organisationUuid;
        const indexProps = {
          pageNumber: 1,
          pageSize: 100,
          sortField: "updatedAt",
          sortDirection: "DESC" as const
        };

        const [organisationState, financialState, srpState, disturbanceState] = await Promise.all([
          organisationUuid == null ? Promise.resolve(undefined) : loadOrganisation({ id: organisationUuid }),
          organisationUuid == null
            ? Promise.resolve(undefined)
            : loadFinancialReportIndex({ ...indexProps, filter: { organisationUuid } }),
          loadSRPReportIndex({ ...indexProps, filter: { projectUuid: project.uuid } }),
          loadDisturbanceReportIndex({ ...indexProps, filter: { projectUuid: project.uuid } })
        ]);

        if (
          organisationState?.loadFailure != null ||
          financialState?.loadFailure != null ||
          srpState.loadFailure != null ||
          disturbanceState.loadFailure != null
        ) {
          throw new Error("Unable to load additional reports");
        }

        const organisation = organisationState?.data;
        const financialReports = (financialState?.data ?? []).map(report =>
          toFinancialReport(report, organisation?.currency ?? null, organisation?.finStartMonth ?? null)
        );
        const srpReports = (srpState.data ?? []).map(toSrpReport);
        const disturbanceReports = (disturbanceState.data ?? []).map(toDisturbanceReport);
        const sections: AdditionalReportsEntitySection[] = [];

        if (organisationUuid != null && financialReports.length > 0) {
          sections.push({
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
          sections.push({
            id: project.uuid,
            type: "project",
            name: project.name,
            caption: project.organisationName ?? "",
            groups: projectGroups
          });
        }

        if (active) setState({ loading: false, sections, error: false });
      } catch (error) {
        Log.error("Unable to load additional reports index", { projectUuid: project.uuid, error });
        if (active) setState({ loading: false, sections: [], error: true });
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [enabled, project]);

  return state;
};
