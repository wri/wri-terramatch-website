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

export type ClippedVersionSummary = {
  uuid: string | null;
  polygonUuid: string | null;
  polyName: string | null;
};

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
  relatedPartnerUuids = [],
  allowedGeometryUuids = []
}: {
  previousGeometryUuids?: Array<string | null | undefined>;
  newGeometryUuids?: Array<string | null | undefined>;
  relatedPartnerUuids?: Array<string | null | undefined>;
  allowedGeometryUuids?: Array<string | null | undefined>;
}): string[] => {
  const uuidSet = new Set(
    [...previousGeometryUuids, ...newGeometryUuids, ...relatedPartnerUuids].filter(toNonEmptyUuid)
  );
  const allowedUuidSet = new Set(allowedGeometryUuids.filter(toNonEmptyUuid));

  if (allowedUuidSet.size === 0) {
    return [...uuidSet];
  }

  return [...uuidSet].filter(uuid => allowedUuidSet.has(uuid));
};

export const resolveClippedGeometryUuids = (
  clippedVersions: ClippedVersionSummary[],
  refreshedPolygons: SitePolygonLightDto[]
): string[] => {
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

  const geometryUuids = new Set<string>();
  for (const version of clippedVersions) {
    if (toNonEmptyUuid(version.polygonUuid)) {
      geometryUuids.add(version.polygonUuid);
      continue;
    }

    const bySitePolygonUuid = toNonEmptyUuid(version.uuid) ? refreshedBySitePolygonUuid.get(version.uuid) : undefined;
    if (toNonEmptyUuid(bySitePolygonUuid?.polygonUuid)) {
      geometryUuids.add(bySitePolygonUuid.polygonUuid);
      continue;
    }

    const byName = version.polyName != null ? refreshedByName.get(version.polyName) : undefined;
    if (toNonEmptyUuid(byName?.polygonUuid)) {
      geometryUuids.add(byName.polygonUuid);
    }
  }

  return [...geometryUuids];
};

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

  for (const version of clippedVersions) {
    const clippedPolygon =
      (toNonEmptyUuid(version.polygonUuid) ? refreshedByGeometryUuid.get(version.polygonUuid) : undefined) ??
      (toNonEmptyUuid(version.uuid) ? refreshedBySitePolygonUuid.get(version.uuid) : undefined);
    if (clippedPolygon != null && clippedPolygon.isActive) {
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
    const bySitePolygonUuid = refreshedPolygons.find(polygon => polygon.uuid === context.sitePolygonUuid);
    if (bySitePolygonUuid != null) {
      return bySitePolygonUuid;
    }
  }

  return refreshedPolygons.find(polygon => polygon.polygonUuid === context.previousPolygonUuid);
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
        polygonUuid: toStringOrNull(attributes.polygonUuid),
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
      (version.polygonUuid != null ? refreshedByGeometryUuid.get(version.polygonUuid) : undefined) ??
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
