export interface OverlapExtraInfo {
  poly_uuid: string;
  poly_name: string;
  percentage: number;
  intersection_area: number;
  intersect_smaller: boolean;
  site_name: string;
}

export interface PolygonFixabilityResult {
  canBeFixed: boolean;
  reasons: string[];
  overlapDetails: OverlapExtraInfo[];
}

export const checkPolygonFixability = (
  extraInfo: any[] | Record<string, any> | null | undefined
): PolygonFixabilityResult => {
  if (!extraInfo) {
    return {
      canBeFixed: false,
      reasons: ["No overlap data available"],
      overlapDetails: []
    };
  }

  const overlapData = Array.isArray(extraInfo) ? extraInfo : [extraInfo];

  const overlapDetails: OverlapExtraInfo[] = overlapData;
  const reasons: string[] = [];
  let canBeFixed = true;

  for (const overlap of overlapDetails) {
    const percentageValid = overlap.percentage <= 3.5;
    const areaValid = overlap.intersection_area ? overlap.intersection_area <= 0.1 : true;

    if (!percentageValid) {
      canBeFixed = false;
      reasons.push(
        `Overlap percentage (${overlap.percentage.toFixed(2)}%) exceeds 3.5% limit for polygon "${overlap.poly_name}"`
      );
    }

    if (overlap.intersection_area && !areaValid) {
      canBeFixed = false;
      reasons.push(
        `Overlap area (${overlap.intersection_area.toFixed(4)} ha) exceeds 0.1 ha limit for polygon "${
          overlap.poly_name
        }"`
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
  polygons: Array<{ extra_info?: any[] | Record<string, any> | null }>
): {
  fixableCount: number;
  totalCount: number;
  fixablePolygons: Array<{ polygon: any; result: PolygonFixabilityResult }>;
  unfixablePolygons: Array<{ polygon: any; result: PolygonFixabilityResult }>;
} => {
  const fixablePolygons: Array<{ polygon: any; result: PolygonFixabilityResult }> = [];
  const unfixablePolygons: Array<{ polygon: any; result: PolygonFixabilityResult }> = [];

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
  t: (key: string, options?: any) => string
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
