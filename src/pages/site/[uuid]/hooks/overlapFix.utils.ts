import type {
  SitePolygonLightDto,
  ValidationCriteriaDto,
  ValidationDto
} from "@/generated/v3/researchService/researchServiceSchemas";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import { checkPolygonFixability, PolygonFixabilityResult } from "@/utils/polygonFixValidation";

import type { OverlapFixPolygon } from "../components/Modals/OverlapFix";
import type { PolygonTableRow } from "../components/PolygonTableRow";

export type OverlapFixCandidate = OverlapFixPolygon & {
  fixabilityResult: PolygonFixabilityResult;
  reasons: string[];
};

export type OverlapFixSelectionSummary = {
  overlapCandidates: OverlapFixCandidate[];
  fixableCandidates: OverlapFixCandidate[];
  notFixableCandidates: OverlapFixCandidate[];
};

export const canAutoFixOverlapSelection = (summary: OverlapFixSelectionSummary): boolean =>
  summary.fixableCandidates.length > 0;

export const hasOverlapFailureInSelection = (summary: OverlapFixSelectionSummary): boolean =>
  summary.overlapCandidates.length > 0;

export type ClippedVersionSummary = { uuid: string | null; polyName: string | null };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === "object" && !Array.isArray(value);

const getResourceAttributes = (value: unknown): Record<string, unknown> | null => {
  if (!isRecord(value) || !isRecord(value.attributes)) {
    return null;
  }

  return value.attributes;
};

const toStringOrNull = (value: unknown): string | null => (typeof value === "string" && value !== "" ? value : null);

const toNonEmptyUuid = (value: string | null | undefined): value is string => value != null && value !== "";

const buildSitePolygonLookupMaps = (polygons: SitePolygonLightDto[]) => {
  const byGeometryUuid = new Map<string, SitePolygonLightDto>();
  const bySitePolygonUuid = new Map<string, SitePolygonLightDto>();

  for (const polygon of polygons) {
    if (polygon.polygonUuid != null && polygon.polygonUuid !== "") {
      byGeometryUuid.set(polygon.polygonUuid, polygon);
    }
    if (polygon.uuid != null && polygon.uuid !== "") {
      bySitePolygonUuid.set(polygon.uuid, polygon);
    }
  }

  return { byGeometryUuid, bySitePolygonUuid };
};

/** Map clipped version DTOs (site-polygon UUIDs) to geometry UUIDs for validation APIs. */
export const resolveGeometryUuidsFromClippedVersions = (
  clippedVersions: ClippedVersionSummary[],
  refreshedPolygons: SitePolygonLightDto[]
): string[] => {
  const { byGeometryUuid, bySitePolygonUuid } = buildSitePolygonLookupMaps(refreshedPolygons);

  return [
    ...new Set(
      clippedVersions.flatMap(version => {
        if (!toNonEmptyUuid(version.uuid)) {
          return [];
        }

        const polygon = bySitePolygonUuid.get(version.uuid) ?? byGeometryUuid.get(version.uuid);
        return toNonEmptyUuid(polygon?.polygonUuid) ? [polygon.polygonUuid] : [];
      })
    )
  ];
};

const getPolygonDisplayName = (polygon: SitePolygonLightDto | undefined, row: PolygonTableRow): string =>
  polygon?.name ?? row.polygonName;

export const getOverlapCriteria = (validation: ValidationDto | undefined): ValidationCriteriaDto | undefined =>
  validation?.criteriaList.find(
    criteria => criteria.criteriaId === OVERLAPPING_CRITERIA_ID && criteria.valid === false
  );

export const hasOverlapValidationFailure = (validation: ValidationDto | undefined): boolean =>
  getOverlapCriteria(validation) != null;

export const buildOverlapFailureValidationsMap = (
  validations: Iterable<ValidationDto>,
  currentPolygonUuids: ReadonlySet<string>
): Map<string, ValidationDto> => {
  const overlapFailures = new Map<string, ValidationDto>();

  for (const validation of validations) {
    const polygonUuid = validation.polygonUuid;
    if (polygonUuid == null || polygonUuid === "" || !currentPolygonUuids.has(polygonUuid)) {
      continue;
    }
    if (!hasOverlapValidationFailure(validation)) {
      continue;
    }
    overlapFailures.set(polygonUuid, validation);
  }

  return overlapFailures;
};

export const collectRelatedPartnerUuidsFromFixability = (
  results: Array<PolygonFixabilityResult | null | undefined>
): string[] => {
  const uuids = new Set<string>();

  for (const result of results) {
    for (const detail of result?.overlapDetails ?? []) {
      if (toNonEmptyUuid(detail.polyUuid)) {
        uuids.add(detail.polyUuid);
      }
    }
  }

  return [...uuids];
};

export const collectGeometryUuidsForValidationUiClear = ({
  previousGeometryUuids = [],
  newGeometryUuids = [],
  relatedPartnerUuids = []
}: {
  previousGeometryUuids?: Array<string | null | undefined>;
  newGeometryUuids?: Array<string | null | undefined>;
  relatedPartnerUuids?: Array<string | null | undefined>;
}): string[] => [
  ...new Set([...previousGeometryUuids, ...newGeometryUuids, ...relatedPartnerUuids].filter(toNonEmptyUuid))
];

/** UUIDs the backend revalidates after clipping — excludes replaced previous geometries. */
export const collectGeometryUuidsForValidationPoll = ({
  newGeometryUuids = [],
  relatedPartnerUuids = []
}: {
  newGeometryUuids?: Array<string | null | undefined>;
  relatedPartnerUuids?: Array<string | null | undefined>;
}): string[] => [...new Set([...newGeometryUuids, ...relatedPartnerUuids].filter(toNonEmptyUuid))];

export const getSelectedOverlapFixSummary = (
  selectedRows: PolygonTableRow[],
  polygonValidations: Map<string, ValidationDto>,
  polygonsData: SitePolygonLightDto[]
): OverlapFixSelectionSummary => {
  const polygonByUuid = new Map(
    polygonsData
      .map(polygon => {
        const uuid = polygon.polygonUuid ?? polygon.uuid;
        return uuid != null && uuid !== "" ? ([uuid, polygon] as const) : null;
      })
      .filter((entry): entry is readonly [string, SitePolygonLightDto] => entry != null)
  );

  const overlapCandidates: OverlapFixCandidate[] = [];
  const fixableCandidates: OverlapFixCandidate[] = [];
  const notFixableCandidates: OverlapFixCandidate[] = [];

  for (const row of selectedRows) {
    const overlapCriteria = getOverlapCriteria(polygonValidations.get(row.id));

    if (overlapCriteria == null) {
      continue;
    }

    const fixabilityResult = checkPolygonFixability(overlapCriteria.extraInfo);
    const candidate: OverlapFixCandidate = {
      id: row.id,
      name: getPolygonDisplayName(polygonByUuid.get(row.id), row),
      fixabilityResult,
      reasons: fixabilityResult.reasons
    };

    overlapCandidates.push(candidate);

    if (fixabilityResult.canBeFixed) {
      fixableCandidates.push(candidate);
    } else {
      notFixableCandidates.push(candidate);
    }
  }

  return {
    overlapCandidates,
    fixableCandidates,
    notFixableCandidates
  };
};

export const resolveActivePolygonAfterOverlapFix = (
  refreshedPolygons: SitePolygonLightDto[],
  context: {
    previousPolygonUuid: string;
    primaryUuid?: string | null;
    sitePolygonUuid?: string | null;
  },
  clippedVersions: ClippedVersionSummary[] = []
): SitePolygonLightDto | undefined => {
  const { byGeometryUuid, bySitePolygonUuid } = buildSitePolygonLookupMaps(refreshedPolygons);

  for (const version of clippedVersions) {
    if (!toNonEmptyUuid(version.uuid)) {
      continue;
    }

    // ClippedVersionDto.uuid is the site-polygon version id; fall back to geometry id for safety.
    const clippedPolygon = bySitePolygonUuid.get(version.uuid) ?? byGeometryUuid.get(version.uuid);
    if (clippedPolygon != null) {
      return clippedPolygon;
    }
  }

  if (context.primaryUuid != null && context.primaryUuid !== "") {
    const activeVersion = refreshedPolygons.find(
      polygon => polygon.primaryUuid === context.primaryUuid && polygon.isActive
    );
    if (activeVersion != null) {
      return activeVersion;
    }
  }

  if (context.sitePolygonUuid != null && context.sitePolygonUuid !== "") {
    const bySitePolygonUuidMatch = bySitePolygonUuid.get(context.sitePolygonUuid);
    if (bySitePolygonUuidMatch != null) {
      return bySitePolygonUuidMatch;
    }
  }

  return byGeometryUuid.get(context.previousPolygonUuid);
};

export const extractClippedVersions = (response: unknown): ClippedVersionSummary[] => {
  if (!isRecord(response)) {
    return [];
  }

  const data = response.data;
  const resources = Array.isArray(data) ? data : data != null ? [data] : [];

  return resources
    .map(resource => {
      const attributes = getResourceAttributes(resource);

      if (attributes == null) {
        return null;
      }

      return {
        uuid: toStringOrNull(attributes.uuid),
        polyName: toStringOrNull(attributes.polyName)
      };
    })
    .filter((version): version is ClippedVersionSummary => version != null);
};

export const buildOverlapFixResultPolygons = (
  fixedVersions: ClippedVersionSummary[],
  fixableCandidates: OverlapFixCandidate[],
  notFixableCandidates: OverlapFixCandidate[],
  refreshedPolygons: SitePolygonLightDto[],
  refreshedOverlapValidations: ValidationDto[] = []
): { polygonsFixed: OverlapFixPolygon[]; polygonsNotFixed: OverlapFixPolygon[] } => {
  const refreshedByGeometryUuid = new Map(
    refreshedPolygons
      .map(polygon =>
        polygon.polygonUuid != null && polygon.polygonUuid !== "" ? ([polygon.polygonUuid, polygon] as const) : null
      )
      .filter((entry): entry is readonly [string, SitePolygonLightDto] => entry != null)
  );
  const refreshedBySitePolygonUuid = new Map(
    refreshedPolygons
      .map(polygon => (polygon.uuid != null && polygon.uuid !== "" ? ([polygon.uuid, polygon] as const) : null))
      .filter((entry): entry is readonly [string, SitePolygonLightDto] => entry != null)
  );
  const refreshedByName = new Map(
    refreshedPolygons
      .map(polygon => (polygon.name != null && polygon.name !== "" ? ([polygon.name, polygon] as const) : null))
      .filter((entry): entry is readonly [string, SitePolygonLightDto] => entry != null)
  );
  const candidateByName = new Map(fixableCandidates.map(candidate => [candidate.name, candidate]));
  const refreshedOverlapValidationByUuid = new Map(
    refreshedOverlapValidations.map(validation => [validation.polygonUuid, validation])
  );

  const fixedVersionPolygons = fixedVersions.flatMap(version => {
    const refreshedPolygon =
      (version.uuid != null ? refreshedByGeometryUuid.get(version.uuid) : undefined) ??
      (version.uuid != null ? refreshedBySitePolygonUuid.get(version.uuid) : undefined) ??
      (version.polyName != null ? refreshedByName.get(version.polyName) : undefined);
    const candidate = version.polyName != null ? candidateByName.get(version.polyName) : undefined;
    const polygonUuid = refreshedPolygon?.polygonUuid ?? refreshedPolygon?.uuid ?? candidate?.id;
    const name = refreshedPolygon?.name ?? version.polyName ?? candidate?.name;

    if (polygonUuid == null || polygonUuid === "" || name == null || name === "") {
      return [];
    }

    return [{ id: polygonUuid, name }];
  });

  const fixedVersionByName = new Map(fixedVersionPolygons.map(polygon => [polygon.name, polygon]));
  const fixedCandidateIds = new Set<string>();
  const polygonsFixed = fixableCandidates.flatMap(candidate => {
    const fixedVersion = fixedVersionByName.get(candidate.name);
    const refreshedPolygon =
      (fixedVersion?.id != null ? refreshedByGeometryUuid.get(fixedVersion.id) : undefined) ??
      (fixedVersion?.id != null ? refreshedBySitePolygonUuid.get(fixedVersion.id) : undefined) ??
      refreshedByGeometryUuid.get(candidate.id) ??
      refreshedBySitePolygonUuid.get(candidate.id) ??
      refreshedByName.get(candidate.name);
    const id = refreshedPolygon?.polygonUuid ?? refreshedPolygon?.uuid ?? fixedVersion?.id ?? candidate.id;
    const name = refreshedPolygon?.name ?? fixedVersion?.name ?? candidate.name;

    if (hasOverlapValidationFailure(refreshedOverlapValidationByUuid.get(id))) {
      return [];
    }

    fixedCandidateIds.add(candidate.id);
    return [{ id, name }];
  });

  const polygonsNotFixed = [
    ...notFixableCandidates,
    ...fixableCandidates.filter(candidate => !fixedCandidateIds.has(candidate.id))
  ].map(({ id, name }) => ({ id, name }));

  return {
    polygonsFixed,
    polygonsNotFixed
  };
};
