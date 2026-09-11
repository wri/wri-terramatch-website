import { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { getOverlapCriteria } from "@/pages/site/[uuid]/hooks/overlapFix.utils";
import { checkPolygonFixability } from "@/utils/polygonFixValidation";

/**
 * A deduped cross-site (or same-site) overlap pair, derived client-side from criteria 3
 * (OVERLAPPING) validation failures loaded for a project. The backend OVERLAPPING validator
 * compares every active polygon against every other active polygon in the project (see
 * `overlapping.validator.ts`), so both sides of a pair carry a failing criteria result — this util
 * dedupes those symmetric failures into one entry per unordered pair.
 */
export type ProjectOverlapPair = {
  /** Stable dedupe key: the two polygon uuids, sorted, joined with "|". */
  key: string;
  aUuid: string;
  aName: string;
  aSiteId?: string;
  aSiteName?: string;
  bUuid: string;
  bName: string;
  bSiteId?: string;
  bSiteName?: string;
  percentage: number;
  intersectionArea: number;
  /** True when the two polygons belong to different sites within the project. */
  crossSite: boolean;
};

const buildPairKey = (aUuid: string, bUuid: string): string => [aUuid, bUuid].sort().join("|");

/**
 * Builds deduped overlap pairs from a project's OVERLAPPING (criteria 3) validation results and its
 * currently-loaded polygons. Pure/presentational — no requests.
 *
 * @param overlapValidationsByPolygonUuid Validations keyed by polygon (geometry) uuid, already
 *   filtered to OVERLAPPING failures (e.g. `useSitePolygonOverlap().overlapValidationsByPolygonUuid`).
 * @param polygonsData The project's currently-loaded polygons, used to resolve names/site identity.
 */
export const buildProjectOverlapPairs = (
  overlapValidationsByPolygonUuid: Map<string, ValidationDto>,
  polygonsData: SitePolygonLightDto[]
): ProjectOverlapPair[] => {
  const polygonByUuid = new Map<string, SitePolygonLightDto>();
  for (const polygon of polygonsData) {
    const uuid = polygon.polygonUuid ?? polygon.uuid;
    if (uuid != null && uuid !== "") {
      polygonByUuid.set(uuid, polygon);
    }
  }

  const pairsByKey = new Map<string, ProjectOverlapPair>();

  for (const [polygonUuid, validation] of overlapValidationsByPolygonUuid) {
    const overlapCriteria = getOverlapCriteria(validation);
    if (overlapCriteria == null) {
      continue;
    }

    const { overlapDetails } = checkPolygonFixability(overlapCriteria.extraInfo);
    const aPolygon = polygonByUuid.get(polygonUuid);
    const aName = aPolygon?.name ?? polygonUuid;
    const aSiteId = aPolygon?.siteId ?? undefined;
    const aSiteName = aPolygon?.siteName ?? undefined;

    for (const detail of overlapDetails) {
      if (detail.polyUuid === "" || detail.polyUuid === polygonUuid) {
        continue;
      }

      const key = buildPairKey(polygonUuid, detail.polyUuid);
      const existing = pairsByKey.get(key);
      if (existing != null) {
        // Both sides of a symmetric overlap report it; keep the larger percentage / intersection area
        // (the authoritative figure) rather than whichever side happened to be iterated first — Map
        // order is not guaranteed, so a skip would understate the overlap.
        existing.percentage = Math.max(existing.percentage, detail.percentage);
        existing.intersectionArea = Math.max(existing.intersectionArea, detail.intersectionArea);
        continue;
      }

      const bPolygon = polygonByUuid.get(detail.polyUuid);
      // The partner's siteUuid isn't carried in extraInfo (only siteName is) — resolve it from the
      // loaded polygon list when available (see plan risk #4: ambiguous only when the partner is
      // filtered out of the currently-loaded page).
      const bSiteId = bPolygon?.siteId ?? undefined;
      const bSiteName = bPolygon?.siteName ?? (detail.siteName !== "" ? detail.siteName : undefined);
      const bName = bPolygon?.name ?? (detail.polyName !== "" ? detail.polyName : detail.polyUuid);

      const crossSite =
        aSiteId != null && bSiteId != null
          ? aSiteId !== bSiteId
          : aSiteName != null && bSiteName != null
          ? aSiteName !== bSiteName
          : // Partner site identity unknown (filtered out and unnamed) — assume cross-site so the
            // anomaly isn't silently hidden from the stepper.
            true;

      pairsByKey.set(key, {
        key,
        aUuid: polygonUuid,
        aName,
        aSiteId,
        aSiteName,
        bUuid: detail.polyUuid,
        bName,
        bSiteId,
        bSiteName,
        percentage: detail.percentage,
        intersectionArea: detail.intersectionArea,
        crossSite
      });
    }
  }

  return Array.from(pairsByKey.values());
};
