import { useCallback, useEffect, useMemo, useState } from "react";

import { SitePolygonsIndexQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import { useRestorationPracticeLabels } from "@/hooks/translation/useRestorationPracticeLabels";
import { useSubmissionStatusLabels } from "@/hooks/translation/useSubmissionStatusLabels";
import { useTargetLandUseLabels } from "@/hooks/translation/useTargetLandUseLabels";
import { useValidationStatusLabels } from "@/hooks/translation/useValidationStatusLabels";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import { trackPolygonFilterCleared } from "@/utils/polygonAnalytics";

import {
  EMPTY_POLYGON_FILTERS,
  PolygonFilterState,
  SUBMISSION_CYCLE_LABELS
} from "../components/polygonFilter.constants";

type UseSitePolygonFiltersParams = {
  siteUuid: string;
  t: (key: string, params?: Record<string, unknown>) => string;
};

export const useSitePolygonFilters = ({ siteUuid, t }: UseSitePolygonFiltersParams) => {
  const submissionStatusLabels = useSubmissionStatusLabels();
  const validationStatusLabels = useValidationStatusLabels();
  const restorationPracticeLabels = useRestorationPracticeLabels();
  const targetLandUseLabels = useTargetLandUseLabels();
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
    if (polygonFilters.submissionCycle.length > 0) filter.submissionCycle = polygonFilters.submissionCycle;
    if (polygonFilters.hasOverlap) filter.hasOverlap = true;
    if (debouncedPolygonSearch !== "") {
      filter.search = debouncedPolygonSearch;
      filter.searchFields = ["polyName", "polygonUuid"];
    }
    return filter as Partial<SitePolygonsIndexQueryParams>;
  }, [debouncedPolygonSearch, polygonFilters]);

  const handleClearPolygonFilters = useCallback(() => {
    trackPolygonFilterCleared({ siteUuid });
    setPolygonFilters(EMPTY_POLYGON_FILTERS);
    setPolygonSearch("");
    setDebouncedPolygonSearch("");
  }, [siteUuid]);

  const activeFilterLabels = useMemo<SelectedFilter[]>(() => {
    const labels: SelectedFilter[] = [];
    if (polygonFilters.polygonStatus.length > 0) {
      labels.push({
        label: polygonFilters.polygonStatus.map(status => submissionStatusLabels[status]),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, polygonStatus: [] }));
        },
        category: t("Submission")
      });
    }
    if (polygonFilters.validationStatus.length > 0) {
      labels.push({
        label: polygonFilters.validationStatus.map(status => validationStatusLabels[status]),
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
        label: polygonFilters.practice.map(practice => restorationPracticeLabels[practice]),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, practice: [] }));
        }
      });
    }
    if (polygonFilters.targetSys.length > 0) {
      labels.push({
        label: polygonFilters.targetSys.map(targetSys => targetLandUseLabels[targetSys]),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, targetSys: [] }));
        }
      });
    }
    if (polygonFilters.submissionCycle.length > 0) {
      labels.push({
        label: polygonFilters.submissionCycle.map(cycle => SUBMISSION_CYCLE_LABELS[cycle]),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, submissionCycle: [] }));
        },
        category: t("Submission Cycle")
      });
    }
    if (polygonFilters.hasOverlap) {
      labels.push({
        label: t("Overlaps"),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, hasOverlap: false }));
        }
      });
    }
    return labels;
  }, [
    polygonFilters,
    restorationPracticeLabels,
    submissionStatusLabels,
    t,
    targetLandUseLabels,
    validationStatusLabels
  ]);

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
