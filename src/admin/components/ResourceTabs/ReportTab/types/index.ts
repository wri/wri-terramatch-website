import { TabProps } from "react-admin";
export interface ReportTabProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  type: string;
}
export interface ProjectReport {
  id: string;
  uuid: string;
  status: string;
  createdAt: string;
  reportTitle: string;
  [key: string]: any;
}

export interface DemographicEntry {
  type: string;
  subtype: string;
  name: string | null;
  amount: number;
}
export interface IncludedDemographic {
  type: string;
  id: string;
  attributes: {
    entityType: string;
    entityUuid: string;
    uuid: string;
    type: string;
    collection: string;
    entries: DemographicEntry[];
  };
}
export interface DemographicCounts {
  total: number;
  male: number;
  female: number;
  youth: number;
  nonYouth: number;
}

export interface EmploymentDemographicData {
  fullTimeJobs: DemographicCounts;
  partTimeJobs: DemographicCounts;
  volunteers: DemographicCounts;
}
export interface BeneficiaryData {
  beneficiaries: number;
  farmers: number;
}
export interface Site {
  id: string;
  uuid: string;
  name: string;
  hectaresToRestoreGoal: number;
  totalHectaresRestoredSum?: number;
  totalReportedDisturbances: number;
  climaticDisturbances: number;
  manmadeDisturbances: number;
  ecologicalDisturbances: number;
  siteReports?: SiteReport[];
  [key: string]: any;
}

export interface SiteReport {
  id: string;
  uuid: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  siteUuid: string;
  [key: string]: any;
}

export interface ReportData {
  organization: {
    name: string;
  };
  project: {
    name: string;
    trees: {
      planted: number;
      goal: number;
      percentage: number;
    };
    hectares: {
      restored: number;
      goal: number;
      percentage: number;
    };
    jobs: {
      fullTime: number;
      partTime: number;
    };
  };
  metrics: {
    sites: number;
    survivalRate: number;
    beneficiaries: number;
    smallholderFarmers: number;
  };
  employment: {
    fullTimeJobs: number;
    partTimeJobs: number;
    volunteers: number;
    demographics: {
      fullTime: DemographicCounts;
      partTime: DemographicCounts;
      volunteers: DemographicCounts;
    };
  };
  sites: Array<{
    name: string;
    hectareGoal: number;
    hectaresUnderRestoration: number;
    totalReportedDisturbances: number;
    climaticDisturbances: number;
    manmadeDisturbances: number;
    ecologicalDisturbances: number;
  }>;
}
