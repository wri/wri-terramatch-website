import { useMemo } from "react";

import { SitePolygonMapIndexFilter, useSitePolygonSummary } from "@/connections/SitePolygons";
import type { SitePolygonSummaryDto } from "@/generated/v3/researchService/researchServiceSchemas";

type UseProjectPolygonMetricsParams = {
  projectUuid: string | null;
  siteUuids: string[];
  polygonFilter: SitePolygonMapIndexFilter;
  hasLevel2Filters: boolean;
  selectedPolygonUuids: string[];
};

export type PolygonMetricTotals = {
  polygonCount: number;
  treesPlanted: number;
  restorationAreaHa: number;
};

const toTotals = (summary: SitePolygonSummaryDto | null | undefined): PolygonMetricTotals | null =>
  summary == null
    ? null
    : {
        polygonCount: summary.totalPolygons,
        treesPlanted: summary.sumNumTrees,
        restorationAreaHa: Math.round(summary.sumCalcArea * 100) / 100
      };

export const useProjectPolygonMetrics = ({
  projectUuid,
  siteUuids,
  polygonFilter,
  hasLevel2Filters,
  selectedPolygonUuids
}: UseProjectPolygonMetricsParams) => {
  const isProjectSelected = projectUuid != null;
  const scope = { entityName: "projects" as const, entityUuid: projectUuid ?? undefined };

  const [, { data: projectSummary }] = useSitePolygonSummary({ ...scope, enabled: isProjectSelected });
  const [, { data: filteredSummary }] = useSitePolygonSummary({
    ...scope,
    siteUuids,
    filter: polygonFilter,
    enabled: isProjectSelected && hasLevel2Filters
  });
  const selectionFilter = useMemo(() => ({ "polygonUuid[]": selectedPolygonUuids }), [selectedPolygonUuids]);
  const [, { data: selectedSummary }] = useSitePolygonSummary({
    ...scope,
    filter: selectionFilter,
    enabled: isProjectSelected && selectedPolygonUuids.length > 0
  });

  return {
    project: toTotals(projectSummary),
    filtered: hasLevel2Filters ? toTotals(filteredSummary) : undefined,
    selected: selectedPolygonUuids.length > 0 ? toTotals(selectedSummary) : undefined
  };
};
