import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
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

export const buildPolygonValidationsMap = (validations: ValidationDto[]): Map<string, ValidationDto> =>
  new Map(validations.map(v => [v.polygonUuid, v]));

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

export const isValidationTagChecked = (validationTag: ValidationTagState): boolean => validationTag !== "not-started";

export const getValidationCriteriaItems = (
  validation: ValidationDto | undefined,
  validationStatus?: string | null
): ICriteriaCheckItem[] => {
  if (!shouldDisplayValidationCriteria(validation, validationStatus)) {
    return [];
  }

  return parseV3ValidationData(validation);
};

export const getValidationCriteriaItemsForTag = (
  validation: ValidationDto | undefined,
  validationTag: ValidationTagState
): ICriteriaCheckItem[] => {
  if (!isValidationTagChecked(validationTag)) {
    return [];
  }

  if (!hasValidationCriteria(validation)) {
    return [];
  }

  return parseV3ValidationData(validation);
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
