import { useCallback, useEffect, useMemo, useState } from "react";

import { SitePolygonsIndexQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";

import {
  EMPTY_POLYGON_FILTERS,
  PolygonFilterState,
  RESTORATION_PRACTICE_LABELS,
  SUBMISSION_STATUS_LABELS,
  TARGET_LAND_USE_LABELS,
  VALIDATION_STATUS_LABELS
} from "../components/polygonFilter.constants";

type UseSitePolygonFiltersParams = {
  t: (key: string, params?: Record<string, unknown>) => string;
};

export const useSitePolygonFilters = ({ t }: UseSitePolygonFiltersParams) => {
  const [polygonSearch, setPolygonSearch] = useState("");
  const [debouncedPolygonSearch, setDebouncedPolygonSearch] = useState("");
  const [polygonFilters, setPolygonFilters] = useState<PolygonFilterState>(EMPTY_POLYGON_FILTERS);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedPolygonSearch(polygonSearch.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [polygonSearch]);

  const sitePolygonFilter = useMemo(() => {
    const filter: Record<string, unknown> = {};
    if (polygonFilters.polygonStatus.length > 0) filter.polygonStatus = polygonFilters.polygonStatus;
    if (polygonFilters.validationStatus.length > 0) filter.validationStatus = polygonFilters.validationStatus;
    if (polygonFilters.plantStartFrom !== "") filter.plantStartFrom = `${polygonFilters.plantStartFrom}T00:00:00.000Z`;
    if (polygonFilters.plantStartTo !== "") filter.plantStartTo = `${polygonFilters.plantStartTo}T00:00:00.000Z`;
    if (polygonFilters.practice.length > 0) filter.practice = polygonFilters.practice;
    if (polygonFilters.targetSys.length > 0) filter.targetSys = polygonFilters.targetSys;
    if (polygonFilters.hasOverlap) filter.hasOverlap = true;
    if (debouncedPolygonSearch !== "") {
      filter.search = debouncedPolygonSearch;
      filter.searchFields = ["polyName", "polygonUuid"];
    }
    return filter as Partial<SitePolygonsIndexQueryParams>;
  }, [debouncedPolygonSearch, polygonFilters]);

  const handleClearPolygonFilters = useCallback(() => {
    setPolygonFilters(EMPTY_POLYGON_FILTERS);
    setPolygonSearch("");
    setDebouncedPolygonSearch("");
  }, []);

  const activeFilterLabels = useMemo<SelectedFilter[]>(() => {
    const labels: SelectedFilter[] = [];
    if (polygonFilters.polygonStatus.length > 0) {
      labels.push({
        label: polygonFilters.polygonStatus.map(status => t(SUBMISSION_STATUS_LABELS[status])),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, polygonStatus: [] }));
        },
        category: t("Submission")
      });
    }
    if (polygonFilters.validationStatus.length > 0) {
      labels.push({
        label: polygonFilters.validationStatus.map(status => t(VALIDATION_STATUS_LABELS[status])),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, validationStatus: [] }));
        },
        category: t("Validation")
      });
    }
    if (polygonFilters.plantStartFrom !== "" || polygonFilters.plantStartTo !== "") {
      const fromLabel = polygonFilters.plantStartFrom !== "" ? polygonFilters.plantStartFrom : t("Any date");
      const toLabel = polygonFilters.plantStartTo !== "" ? polygonFilters.plantStartTo : t("Any date");
      labels.push({
        label: `${fromLabel} - ${toLabel}`,
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, plantStartFrom: "", plantStartTo: "" }));
        }
      });
    }
    if (polygonFilters.practice.length > 0) {
      labels.push({
        label: polygonFilters.practice.map(practice => t(RESTORATION_PRACTICE_LABELS[practice])),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, practice: [] }));
        }
      });
    }
    if (polygonFilters.targetSys.length > 0) {
      labels.push({
        label: polygonFilters.targetSys.map(targetSys => t(TARGET_LAND_USE_LABELS[targetSys])),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, targetSys: [] }));
        }
      });
    }
    if (polygonFilters.hasOverlap) {
      labels.push({
        label: t("Failed overlap validation"),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, hasOverlap: false }));
        }
      });
    }
    return labels;
  }, [polygonFilters, t]);

  return {
    polygonSearch,
    polygonFilters,
    sitePolygonFilter,
    activeFilterLabels,
    setPolygonSearch,
    setPolygonFilters,
    handleClearPolygonFilters
  };
};
