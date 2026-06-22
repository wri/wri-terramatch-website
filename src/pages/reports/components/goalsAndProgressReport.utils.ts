import { ChartCategory } from "@/utils/dashboardUtils";

import { GoalsAndProgressReportMetrics } from "./GoalsAndProgressReportSections";

export const getReportPeriodRestorationChartData = (
  metrics: GoalsAndProgressReportMetrics,
  periodDate?: string | null
): ChartCategory[] => {
  const time = periodDate != null ? new Date(periodDate) : new Date();
  const series = [
    { name: "Tree Planted", value: metrics.treesPlantedCount },
    { name: "Seeding Records", value: metrics.seedsPlantedCount },
    { name: "Trees Regenerating", value: metrics.regeneratedTreesCount }
  ];

  return series
    .filter(({ value }) => value > 0)
    .map(({ name, value }) => ({
      name,
      values: [{ name, time, value }]
    }));
};

export const LABEL_LEGEND = [
  { label: { key: "Trees" }, color: "bg-primary" },
  { label: { key: "Seeds" }, color: "bg-blueCustom-900" },
  { label: { key: "Regenerating" }, color: "bg-secondary-600" }
] as const;
