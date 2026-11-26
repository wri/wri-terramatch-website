import { useCallback, useEffect, useMemo, useState } from "react";

import { useRestorationPracticeLabels } from "@/hooks/translation/useRestorationPracticeLabels";
import { useSubmissionStatusLabels } from "@/hooks/translation/useSubmissionStatusLabels";
import { useTargetLandUseLabels } from "@/hooks/translation/useTargetLandUseLabels";
import { useValidationStatusLabels } from "@/hooks/translation/useValidationStatusLabels";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";

import {
  EMPTY_POLYGON_FILTERS,
  formatCalcAreaRange,
  PolygonFilterState,
  SUBMISSION_CYCLE_LABELS,
  toSitePolygonFilter
} from "../components/polygonFilter.constants";

type UseSitePolygonFiltersParams = {
  t: (key: string, params?: Record<string, unknown>) => string;
};

export const useSitePolygonFilters = ({ t }: UseSitePolygonFiltersParams) => {
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

  const sitePolygonFilter = useMemo(
    () => toSitePolygonFilter(polygonFilters, debouncedPolygonSearch),
    [debouncedPolygonSearch, polygonFilters]
  );

  const handleClearPolygonFilters = useCallback(() => {
    setPolygonFilters(EMPTY_POLYGON_FILTERS);
    setPolygonSearch("");
    setDebouncedPolygonSearch("");
  }, []);

  const activeFilterLabels = useMemo<SelectedFilter[]>(() => {
    const labels: SelectedFilter[] = [];
    if (polygonFilters.showDeleted) {
      labels.push({
        label: t("Deleted Polygons"),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, showDeleted: false }));
        }
      });
    }
    if (polygonFilters.sites.length > 0) {
      labels.push({
        label: polygonFilters.sites.map(({ label }) => label),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, sites: [] }));
        },
        category: t("Site")
      });
    }
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
    const calcAreaLabel = formatCalcAreaRange(t, polygonFilters);
    if (calcAreaLabel != null) {
      labels.push({
        label: calcAreaLabel,
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, calcAreaMin: null, calcAreaMax: null }));
        }
      });
    }
    if (polygonFilters.practice.length > 0) {
      labels.push({
        label: polygonFilters.practice.map(practice => restorationPracticeLabels[practice]),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, practice: [] }));
        },
        category: t("Restoration Practice")
      });
    }
    if (polygonFilters.targetSys.length > 0) {
      labels.push({
        label: polygonFilters.targetSys.map(targetSys => targetLandUseLabels[targetSys]),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, targetSys: [] }));
        },
        category: t("Target Land Use")
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
    if (polygonFilters.hasDisturbance) {
      labels.push({
        label: t("Disturbances"),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, hasDisturbance: false }));
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
