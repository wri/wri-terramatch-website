import type { SitePolygonLightDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  getExcludedCriteriaIds,
  hasValidationCriteria,
  parseV3ValidationData,
  shouldDisplayValidationCriteria,
  shouldShowAsWarning
} from "@/helpers/polygonValidation";
import type { ValidationTagState } from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import type { ICriteriaCheckItem } from "@/types/validation";

export type CriteriaSeverity = "success" | "warning" | "error";

const hasPolygonUuid = (validation: ValidationDto): validation is ValidationDto & { polygonUuid: string } =>
  validation.polygonUuid != null && validation.polygonUuid !== "";

export const buildPolygonValidationsMap = (validations: ValidationDto[]): Map<string, ValidationDto> =>
  new Map(validations.filter(hasPolygonUuid).map(validation => [validation.polygonUuid, validation]));

export const mergeValidationsByPolygonUuid = (
  ...sources: Array<Iterable<ValidationDto> | Map<string, ValidationDto>>
): Map<string, ValidationDto> => {
  const merged = new Map<string, ValidationDto>();

  for (const source of sources) {
    const validations = source instanceof Map ? source.values() : source;
    for (const validation of validations) {
      if (!hasPolygonUuid(validation)) {
        continue;
      }
      merged.set(validation.polygonUuid, validation);
    }
  }

  return merged;
};

export const mapValidationDtoToTagState = (validation: ValidationDto | undefined): ValidationTagState | null => {
  if (!hasValidationCriteria(validation)) {
    return null;
  }

  const criteriaList = validation.criteriaList;
  const hasAnyFailing = criteriaList.some(criteria => !criteria.valid);

  if (!hasAnyFailing) {
    return "passed";
  }

  const excludedCriteriaIds = new Set(getExcludedCriteriaIds(validation));
  const hasFailingNonExcluded = criteriaList.some(
    criteria => !criteria.valid && !excludedCriteriaIds.has(criteria.criteriaId)
  );

  return hasFailingNonExcluded ? "failed" : "partially-passed";
};

export const resolveValidationStatusFromCriteria = (
  validationStatus: string | null | undefined,
  validation: ValidationDto | undefined
): string | null => {
  const fromCriteria = mapValidationDtoToTagState(validation);
  if (fromCriteria == null) {
    return validationStatus ?? null;
  }
  if (fromCriteria === "partially-passed") {
    return "partial";
  }
  return fromCriteria;
};

export const withResolvedValidationStatusFromCriteria = (
  polygons: SitePolygonLightDto[],
  validationsByPolygonUuid: Map<string, ValidationDto>
): SitePolygonLightDto[] => {
  let changed = false;
  const next = polygons.map(polygon => {
    const polygonUuid = polygon.polygonUuid;
    if (polygonUuid == null || polygonUuid === "") {
      return polygon;
    }

    const resolved = resolveValidationStatusFromCriteria(
      polygon.validationStatus,
      validationsByPolygonUuid.get(polygonUuid)
    );
    if (resolved === (polygon.validationStatus ?? null)) {
      return polygon;
    }

    changed = true;
    return { ...polygon, validationStatus: resolved };
  });

  return changed ? next : polygons;
};

export const isValidationTagChecked = (validationTag: ValidationTagState): boolean => validationTag !== "not-started";

export const getValidationCriteriaItems = (
  validation: ValidationDto | undefined,
  validationLabels: Record<number, string>,
  validationStatus?: string | null
): ICriteriaCheckItem[] => {
  if (!shouldDisplayValidationCriteria(validation, validationStatus)) {
    return [];
  }

  return parseV3ValidationData(validation, validationLabels);
};

export const getValidationCriteriaItemsForTag = (
  validation: ValidationDto | undefined,
  validationTag: ValidationTagState,
  validationLabels: Record<number, string>
): ICriteriaCheckItem[] => {
  if (!isValidationTagChecked(validationTag)) {
    return [];
  }

  if (!hasValidationCriteria(validation)) {
    return [];
  }

  return parseV3ValidationData(validation, validationLabels);
};

export const getItemSeverity = (item: ICriteriaCheckItem): CriteriaSeverity => {
  if (item.status) return "success";
  if (shouldShowAsWarning(item)) return "warning";
  return "error";
};

export const severityToColor = (severity: CriteriaSeverity): string => {
  if (severity === "success") return "success.500";
  if (severity === "warning") return "warning.500";
  return "error.500";
};
