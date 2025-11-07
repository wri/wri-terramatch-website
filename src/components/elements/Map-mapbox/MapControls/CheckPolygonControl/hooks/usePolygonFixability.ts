import { useEffect, useState } from "react";

import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import { checkPolygonsFixability, getFixabilitySummaryMessage } from "@/utils/polygonFixValidation";

interface FixabilityResult {
  fixableCount: number;
  totalCount: number;
  canFixAny: boolean;
}

export const usePolygonFixability = (overlapValidations: any[]) => {
  const [hasOverlaps, setHasOverlaps] = useState(false);
  const [fixabilityResult, setFixabilityResult] = useState<FixabilityResult>({
    fixableCount: 0,
    totalCount: 0,
    canFixAny: false
  });

  useEffect(() => {
    setHasOverlaps(overlapValidations.length > 0);

    if (overlapValidations.length > 0) {
      const polygonsWithOverlaps = overlapValidations.map(validation => {
        const overlapCriteria = validation.criteriaList.find(
          (criteria: any) => criteria.criteriaId === OVERLAPPING_CRITERIA_ID
        );
        return {
          extra_info: overlapCriteria?.extraInfo
        };
      });

      const result = checkPolygonsFixability(polygonsWithOverlaps);
      setFixabilityResult({
        fixableCount: result.fixableCount,
        totalCount: result.totalCount,
        canFixAny: result.fixableCount > 0
      });
    } else {
      setFixabilityResult({ fixableCount: 0, totalCount: 0, canFixAny: false });
    }
  }, [overlapValidations]);

  const getFixabilityMessage = (t: (key: string) => string) => {
    if (hasOverlaps) {
      return fixabilityResult.canFixAny
        ? getFixabilitySummaryMessage(fixabilityResult.fixableCount, fixabilityResult.totalCount, t)
        : t(
            "Overlapping polygons detected but cannot be fixed. Overlaps exceed the fixable limits (≤3.5% and ≤0.1 ha)."
          );
    }
    return t("No overlapping polygons found.");
  };

  return {
    hasOverlaps,
    fixabilityResult,
    getFixabilityMessage
  };
};
