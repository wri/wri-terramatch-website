export interface OverlapExtraInfo {
  polyUuid: string;
  polyName: string;
  percentage: number;
  intersectionArea: number;
  intersectSmaller: boolean;
  siteName: string;
}

export interface PolygonFixabilityResult {
  canBeFixed: boolean;
  reasons: string[];
  overlapDetails: OverlapExtraInfo[];
}

const MAX_OVERLAP_PERCENTAGE = 3.5;
const MAX_OVERLAP_AREA_HECTARES = 0.118;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === "object" && !Array.isArray(value);

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const toStringValue = (value: unknown): string => (typeof value === "string" ? value : "");

const normalizeOverlapInfo = (value: unknown): OverlapExtraInfo | null => {
  if (!isRecord(value)) {
    return null;
  }

  const percentage = toNumber(value.percentage);
  const intersectionArea = toNumber(value.intersectionArea);

  if (percentage == null || intersectionArea == null) {
    return null;
  }

  return {
    polyUuid: toStringValue(value.polyUuid),
    polyName: toStringValue(value.polyName),
    percentage,
    intersectionArea,
    intersectSmaller: value.intersectSmaller === true,
    siteName: toStringValue(value.siteName)
  };
};

export const checkPolygonFixability = (
  extraInfo: unknown[] | Record<string, unknown> | null | undefined
): PolygonFixabilityResult => {
  if (extraInfo == null) {
    return {
      canBeFixed: false,
      reasons: ["No overlap data available"],
      overlapDetails: []
    };
  }

  const overlapData = Array.isArray(extraInfo) ? extraInfo : [extraInfo];
  const overlapDetails = overlapData
    .map(overlap => normalizeOverlapInfo(overlap))
    .filter((overlap): overlap is OverlapExtraInfo => overlap != null);

  const reasons: string[] = [];
  let canBeFixed = overlapDetails.length > 0;

  if (overlapDetails.length === 0) {
    reasons.push("No overlap data available");
  }

  for (const overlap of overlapDetails) {
    const percentageValid = overlap.percentage <= MAX_OVERLAP_PERCENTAGE;
    const areaValid = overlap.intersectionArea <= MAX_OVERLAP_AREA_HECTARES;

    if (!percentageValid) {
      canBeFixed = false;
      reasons.push(
        `Overlap percentage (${overlap.percentage.toFixed(2)}%) exceeds ${MAX_OVERLAP_PERCENTAGE}% limit for polygon "${
          overlap.polyName
        }"`
      );
    }

    if (!areaValid) {
      canBeFixed = false;
      reasons.push(
        `Overlap area (${overlap.intersectionArea.toFixed(
          4
        )} ha) exceeds ${MAX_OVERLAP_AREA_HECTARES} ha limit for polygon "${overlap.polyName}"`
      );
    }
  }

  return {
    canBeFixed,
    reasons,
    overlapDetails
  };
};

export const checkPolygonsFixability = (
  polygons: Array<{ extra_info?: unknown[] | Record<string, unknown> | null }>
): {
  fixableCount: number;
  totalCount: number;
  fixablePolygons: Array<{
    polygon: { extra_info?: unknown[] | Record<string, unknown> | null };
    result: PolygonFixabilityResult;
  }>;
  unfixablePolygons: Array<{
    polygon: { extra_info?: unknown[] | Record<string, unknown> | null };
    result: PolygonFixabilityResult;
  }>;
} => {
  const fixablePolygons: Array<{
    polygon: { extra_info?: unknown[] | Record<string, unknown> | null };
    result: PolygonFixabilityResult;
  }> = [];
  const unfixablePolygons: Array<{
    polygon: { extra_info?: unknown[] | Record<string, unknown> | null };
    result: PolygonFixabilityResult;
  }> = [];

  for (const polygon of polygons) {
    const result = checkPolygonFixability(polygon.extra_info ?? null);

    if (result.canBeFixed) {
      fixablePolygons.push({ polygon, result });
    } else {
      unfixablePolygons.push({ polygon, result });
    }
  }

  return {
    fixableCount: fixablePolygons.length,
    totalCount: polygons.length,
    fixablePolygons,
    unfixablePolygons
  };
};

export const getFixabilitySummaryMessage = (
  fixableCount: number,
  totalCount: number,
  t: (key: string, options?: Record<string, unknown>) => string
): string => {
  if (fixableCount === 0) {
    return t("No polygons can be fixed. All overlaps exceed the fixable limits.");
  } else if (fixableCount === totalCount) {
    return t("All {count} polygons can be fixed.", { count: totalCount });
  } else {
    return t("{fixable} out of {total} polygons can be fixed.", {
      fixable: fixableCount,
      total: totalCount
    });
  }
};
