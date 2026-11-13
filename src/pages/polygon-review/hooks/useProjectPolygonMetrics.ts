import { isEmpty } from "lodash";
import { useMemo } from "react";

import { SitePolygonMapIndexFilter, useSitePolygonSummary } from "@/connections/SitePolygons";
import type { SitePolygonSummaryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import type { CalcAreaBounds } from "@/pages/site/[uuid]/components/polygonFilter.constants";

type UseProjectPolygonMetricsParams = {
  projectUuid: string | null;
  siteUuids: string[];
  polygonFilter: SitePolygonMapIndexFilter;
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

const toCalcAreaBounds = (summary: SitePolygonSummaryDto | null | undefined): CalcAreaBounds | undefined => {
  if (summary?.minCalcArea == null || summary.maxCalcArea == null) return undefined;
  const { minCalcArea, maxCalcArea } = summary;
  if (Math.round(maxCalcArea * 100) <= Math.round(minCalcArea * 100)) return undefined;
  return { min: Math.floor(minCalcArea * 100) / 100, max: Math.ceil(maxCalcArea * 100) / 100 };
};

export const useProjectPolygonMetrics = ({
  projectUuid,
  siteUuids,
  polygonFilter,
  selectedPolygonUuids
}: UseProjectPolygonMetricsParams) => {
  const isProjectSelected = projectUuid != null;
  const scope = { entityName: "projects" as const, entityUuid: projectUuid ?? undefined };

  const hasSiteFilter = siteUuids.length > 0;
  const hasPolygonFilter = !isEmpty(polygonFilter);

  const [, { data: projectSummary }] = useSitePolygonSummary({ ...scope, enabled: isProjectSelected });
  const [, { data: sitesSummary }] = useSitePolygonSummary({
    ...scope,
    siteUuids,
    enabled: isProjectSelected && hasSiteFilter
  });
  const [, { data: filteredSummary }] = useSitePolygonSummary({
    ...scope,
    siteUuids,
    filter: polygonFilter,
    enabled: isProjectSelected && hasPolygonFilter
  });
  // The unfiltered project summary gives the hectares filter a range that stays put while other filters change.
  const calcAreaBounds = useMemo(() => toCalcAreaBounds(projectSummary), [projectSummary]);
  const selectionFilter = useMemo(() => ({ "polygonUuid[]": selectedPolygonUuids }), [selectedPolygonUuids]);
  const [, { data: selectedSummary }] = useSitePolygonSummary({
    ...scope,
    filter: selectionFilter,
    enabled: isProjectSelected && selectedPolygonUuids.length > 0
  });

  return {
    project: toTotals(projectSummary),
    calcAreaBounds,
    sites: hasSiteFilter ? toTotals(sitesSummary) : undefined,
    // With only a site filter active, the filtered totals are the selected sites' totals.
    filtered: hasPolygonFilter ? toTotals(filteredSummary) : hasSiteFilter ? toTotals(sitesSummary) : undefined,
    selected: selectedPolygonUuids.length > 0 ? toTotals(selectedSummary) : undefined
  };
};
