import { useCallback, useMemo, useState } from "react";

import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";

import {
  EMPTY_SITE_ROLLUP_FILTERS,
  SITE_STATUS_LABELS,
  SiteRollupFilterState
} from "./siteRollupFilter.constants";

type UseSiteRollupFiltersParams = {
  t: (key: string, params?: Record<string, unknown>) => string;
};

/**
 * Site-level filter state for the rollup view — the site analog of `useSitePolygonFilters`. Owns the
 * site-name search box, the filter facets, and the `activeFilterLabels` that drive the toolbar's
 * "Filter (n)" count and tag row. Filtering itself is done by the view (client-side against the
 * already-loaded rollup rows), so there is no server-side query object here.
 */
export const useSiteRollupFilters = ({ t }: UseSiteRollupFiltersParams) => {
  const [siteSearch, setSiteSearch] = useState("");
  const [siteFilters, setSiteFilters] = useState<SiteRollupFilterState>(EMPTY_SITE_ROLLUP_FILTERS);

  const handleClearSiteFilters = useCallback(() => {
    setSiteFilters(EMPTY_SITE_ROLLUP_FILTERS);
    setSiteSearch("");
  }, []);

  const activeFilterLabels = useMemo<SelectedFilter[]>(() => {
    const labels: SelectedFilter[] = [];

    if (siteFilters.status.length > 0) {
      labels.push({
        label: siteFilters.status.map(bucket => t(SITE_STATUS_LABELS[bucket])),
        onRemove: () => setSiteFilters(current => ({ ...current, status: [] })),
        category: t("Status")
      });
    }
    if (siteFilters.onlyOverlaps) {
      labels.push({
        label: t("Overlaps"),
        onRemove: () => setSiteFilters(current => ({ ...current, onlyOverlaps: false }))
      });
    }
    if (siteFilters.hectaresMin !== "" || siteFilters.hectaresMax !== "") {
      const fromLabel = siteFilters.hectaresMin !== "" ? siteFilters.hectaresMin : t("Any");
      const toLabel = siteFilters.hectaresMax !== "" ? siteFilters.hectaresMax : t("Any");
      labels.push({
        label: `${fromLabel} - ${toLabel} ha`,
        onRemove: () => setSiteFilters(current => ({ ...current, hectaresMin: "", hectaresMax: "" })),
        category: t("Hectares")
      });
    }

    return labels;
  }, [siteFilters, t]);

  return {
    siteSearch,
    siteFilters,
    activeFilterLabels,
    setSiteSearch,
    setSiteFilters,
    handleClearSiteFilters
  };
};
