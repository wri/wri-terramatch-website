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

type ClippedVersionSummary = {
  uuid: string | null;
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

const getPolygonDisplayName = (polygon: SitePolygonLightDto | undefined, row: PolygonTableRow): string =>
  polygon?.name ?? row.polygonName;

const getOverlapCriteria = (validation: ValidationDto | undefined): ValidationCriteriaDto | undefined =>
  validation?.criteriaList.find(
    criteria => criteria.criteriaId === OVERLAPPING_CRITERIA_ID && criteria.valid === false
  );

const hasOverlapError = (validation: ValidationDto | undefined): boolean => getOverlapCriteria(validation) != null;

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

    if (hasOverlapError(refreshedOverlapValidationByUuid.get(id))) {
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
