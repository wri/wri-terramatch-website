// TODO TM-4219: temporary mock data for the Organization Overview, typed as the API data it stands in
// for. Replace with the real connections before merging.
import { FinancialIndicatorDto, FundingTypeDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";

import type { OrganisationLatestFinancialReport } from "./FinancialCharts";
import type { OrganisationProjectTotals } from "./KeyIndicatorsInsights";
import type { OrganisationSetUpStep } from "./OrganizationSetUpSection";

const MOCK_REPORT_UUID = "mock-financial-report-uuid";

/** Use "for-profit-organization" to see the Net Profit and Current Ratio charts. */
export const MOCK_ORGANISATION: Pick<OrganisationFullDto, "description" | "type"> = {
  type: "non-profit-organization",
  description:
    "We are a community-led restoration organization working with smallholder farmers to restore degraded land " +
    "through agroforestry and assisted natural regeneration. Since 2015 we have trained more than 3,000 farmers, " +
    "set up 12 community nurseries and planted native species across three districts. Our work combines " +
    "restoration with livelihoods: every site is managed by local cooperatives that sell fruit, honey and timber " +
    "from the restored land, and we monitor survival rates with the communities every season."
};

export const MOCK_SET_UP_STEPS: OrganisationSetUpStep[] = [
  { title: "Organization Details", completed: true },
  { title: "Organizational Governance", completed: true },
  { title: "Social Media Presence", completed: true },
  { title: "Organization Profile", completed: true },
  { title: "Financial History", completed: false },
  { title: "Past Community Engagement Experience", completed: false },
  { title: "Past Restoration Experience", completed: false }
];

export const MOCK_ORGANISATION_PROJECTS: OrganisationProjectTotals[] = [
  {
    uuid: "mock-project-1",
    frameworkKey: "terrafund",
    treesPlantedCount: 18250,
    seedsPlantedCount: 3200,
    regeneratedTreesCount: 1500,
    treesGrownGoal: 40000,
    totalHectaresRestoredSum: 120.5,
    totalHectaresRestoredGoal: 300,
    totalJobsCreated: 45,
    jobsCreatedGoal: 80,
    combinedWorkdayCount: 5200
  },
  {
    uuid: "mock-project-2",
    frameworkKey: "terrafund",
    treesPlantedCount: 9600,
    seedsPlantedCount: 0,
    regeneratedTreesCount: 800,
    treesGrownGoal: 25000,
    totalHectaresRestoredSum: 64,
    totalHectaresRestoredGoal: 150,
    totalJobsCreated: 22,
    jobsCreatedGoal: 40,
    combinedWorkdayCount: 2100
  },
  {
    uuid: "mock-project-3",
    frameworkKey: "terrafund",
    treesPlantedCount: null,
    seedsPlantedCount: 0,
    regeneratedTreesCount: 0,
    treesGrownGoal: 10000,
    totalHectaresRestoredSum: 0,
    totalHectaresRestoredGoal: 50,
    totalJobsCreated: 0,
    jobsCreatedGoal: 15,
    combinedWorkdayCount: 0
  }
];

const indicator = (
  collection: string,
  year: number,
  amount: number | null,
  exchangeRate: number | null = null
): FinancialIndicatorDto => ({
  entityType: "financialReports",
  entityUuid: MOCK_REPORT_UUID,
  collection,
  description: null,
  amount,
  exchangeRate,
  year,
  documentation: null
});

const funding = (year: number, amount: number, source: string): FundingTypeDto => ({
  entityType: "financialReports",
  entityUuid: MOCK_REPORT_UUID,
  source,
  amount,
  year,
  type: "grant",
  organisationName: "Mock Organization",
  organisationUuid: "mock-organisation-uuid",
  financialReportId: 1
});

const MOCK_YEARS = [
  { year: 2022, budget: 100000, revenue: 9000000, expenses: 9500000, assets: 400000, liabilities: 400000 },
  { year: 2023, budget: 160000, revenue: 6000000, expenses: 6000000, assets: 520000, liabilities: 1300000 },
  { year: 2024, budget: 160000, revenue: 3500000, expenses: 3200000, assets: 1250000, liabilities: 500000 },
  { year: 2025, budget: 215000, revenue: 6000000, expenses: 6000000, assets: 120000, liabilities: 1200000 },
  { year: 2026, budget: 270000, revenue: 9500000, expenses: 9300000, assets: 10000, liabilities: 1000000 }
];

export const MOCK_LATEST_FINANCIAL_REPORT: OrganisationLatestFinancialReport = {
  uuid: MOCK_REPORT_UUID,
  currency: "USD",
  financialCollection: MOCK_YEARS.flatMap(({ year, budget, revenue, expenses, assets, liabilities }) => [
    indicator("budget", year, budget),
    indicator("revenue", year, revenue),
    indicator("expenses", year, expenses),
    indicator("current-assets", year, assets),
    indicator("current-liabilities", year, liabilities)
  ]),
  fundingTypes: [
    funding(2022, 150000, "Foundation grant"),
    funding(2022, 55000, "Government"),
    funding(2023, 120000, "Foundation grant"),
    funding(2024, 165000, "Impact investor"),
    funding(2025, 80000, "Foundation grant"),
    funding(2026, 38000, "Government")
  ]
};
