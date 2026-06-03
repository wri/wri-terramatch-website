import { useMemo } from "react";

import { usePolygonValidation } from "@/connections/Validation";
import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { parseV3ValidationData, shouldDisplayValidationCriteria } from "@/helpers/polygonValidation";
import { ICriteriaCheckItem, OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import { checkPolygonFixability, PolygonFixabilityResult } from "@/utils/polygonFixValidation";

export type PolygonValidationCriteriaState = {
  validation: ValidationDto | undefined;
  items: ICriteriaCheckItem[];
  hasValidation: boolean;
  failedCount: number;
  totalItems: number;
  lastValidationDate: Date | null;
  hasOverlaps: boolean;
  fixabilityResult: PolygonFixabilityResult | null;
};

const EMPTY_STATE: PolygonValidationCriteriaState = {
  validation: undefined,
  items: [],
  hasValidation: false,
  failedCount: 0,
  totalItems: 0,
  lastValidationDate: null,
  hasOverlaps: false,
  fixabilityResult: null
};

export const usePolygonValidationCriteria = (
  polygonUuid: string | null | undefined,
  validationStatus?: string | null
): PolygonValidationCriteriaState => {
  const validation = usePolygonValidation({
    polygonUuid: polygonUuid ?? ""
  });

  return useMemo(() => {
    if (!shouldDisplayValidationCriteria(validation, validationStatus)) {
      return EMPTY_STATE;
    }

    const items = parseV3ValidationData(validation);
    const failedCount = items.filter(item => !item.status).length;
    const lastValidationDate = items.reduce<Date | null>((latestDate, record) => {
      if (record.date == null) {
        return latestDate;
      }

      const currentDate = new Date(record.date);
      if (latestDate == null || currentDate > latestDate) {
        return currentDate;
      }

      return latestDate;
    }, null);

    const overlapCriteria = items.find(
      item => Number(item.id) === OVERLAPPING_CRITERIA_ID && !item.status && item.extra_info != null
    );

    const fixabilityResult =
      overlapCriteria != null && Array.isArray(overlapCriteria.extra_info)
        ? checkPolygonFixability(overlapCriteria.extra_info)
        : null;

    const hasOverlaps = items.some(item => Number(item.id) === OVERLAPPING_CRITERIA_ID && !item.status);

    return {
      validation,
      items,
      hasValidation: true,
      failedCount,
      totalItems: items.length,
      lastValidationDate,
      hasOverlaps,
      fixabilityResult
    };
  }, [validation, validationStatus]);
};
