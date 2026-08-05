import { ValidationCriteriaDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  COMPLETED_DATA_CRITERIA_ID,
  ESTIMATED_AREA_CRITERIA_ID,
  ICriteriaCheckItem,
  WITHIN_COUNTRY_CRITERIA_ID
} from "@/types/validation";

export const isPolygonValidationChecked = (validationStatus: string | null | undefined): boolean => {
  if (validationStatus == null || validationStatus === "") {
    return false;
  }

  return validationStatus !== "notChecked" && validationStatus !== "not_checked";
};

export const hasValidationCriteria = (validation: ValidationDto | undefined): validation is ValidationDto =>
  validation != null && (validation.criteriaList?.length ?? 0) > 0;

const getLatestCriteriaCreatedAtMs = (validation: ValidationDto): number | null => {
  const timestamps = validation.criteriaList
    .map(criteria => criteria.createdAt)
    .filter((createdAt): createdAt is string => createdAt != null && createdAt !== "")
    .map(createdAt => Date.parse(createdAt))
    .filter(timestamp => !Number.isNaN(timestamp));

  if (timestamps.length === 0) {
    return null;
  }

  return Math.max(...timestamps);
};

export const isValidationFreshAfter = (validation: ValidationDto | undefined, startedAtMs: number): boolean => {
  if (!hasValidationCriteria(validation)) {
    return false;
  }

  const latestCriteriaCreatedAtMs = getLatestCriteriaCreatedAtMs(validation);
  if (latestCriteriaCreatedAtMs == null) {
    return false;
  }

  return latestCriteriaCreatedAtMs >= startedAtMs - 2_000;
};

export const shouldDisplayValidationCriteria = (
  validation: ValidationDto | undefined,
  validationStatus: string | null | undefined
): validation is ValidationDto => isPolygonValidationChecked(validationStatus) && hasValidationCriteria(validation);

export const parseV3ValidationData = (
  criteriaData: ValidationDto,
  validationLabels: Record<number, string>
): ICriteriaCheckItem[] => {
  const existingValidations = new Map<number, ICriteriaCheckItem>(
    criteriaData.criteriaList.map((criteria: ValidationCriteriaDto) => [
      criteria.criteriaId,
      {
        id: criteria.criteriaId,
        date: criteria.createdAt ?? undefined,
        status: criteria.valid,
        label: validationLabels[criteria.criteriaId],
        extra_info: criteria.extraInfo
      }
    ])
  );

  const transformedData: ICriteriaCheckItem[] = Object.entries(validationLabels).map(([id, label]) => {
    const criteriaId = Number(id);
    const existingValidation = existingValidations.get(criteriaId);

    return (
      existingValidation ?? {
        id: criteriaId,
        date: undefined,
        status: true,
        label: String(label),
        extra_info: null
      }
    );
  });

  return transformedData;
};

export const parseValidationDataFromContext = (polygonValidation: any, validationLabels: Record<number, string>) => {
  if (!polygonValidation?.nonValidCriteria) {
    return [];
  }

  const transformedData: ICriteriaCheckItem[] = polygonValidation.nonValidCriteria.map((criteria: any) => {
    return {
      id: criteria.criteria_id,
      date: criteria.latest_created_at,
      status: false, // Non-valid criteria are always false
      label: validationLabels[criteria.criteria_id],
      extra_info: criteria.extra_info
    };
  });

  return transformedData;
};

const EXCLUDED_CRITERIA_IDS = [ESTIMATED_AREA_CRITERIA_ID, WITHIN_COUNTRY_CRITERIA_ID];

interface ExtraInfoItem {
  exists: boolean;
  field: string;
  error?: string;
}

export const isOnlyNumTreesMissing = (extraInfo: any): boolean => {
  if (extraInfo == null) return false;

  try {
    const infoArray: ExtraInfoItem[] = extraInfo;
    const invalidFields = infoArray.filter(info => !info.exists || info.error != null);

    return invalidFields.length === 1 && invalidFields[0].field === "numTrees";
  } catch {
    return false;
  }
};

export const getExcludedCriteriaIds = (criteriaData: ValidationDto): number[] => {
  const baseExcludedIds = [...EXCLUDED_CRITERIA_IDS];

  if (criteriaData?.criteriaList?.length) {
    const dataCompletedCriteria = criteriaData.criteriaList.find(
      criteria => criteria.criteriaId === COMPLETED_DATA_CRITERIA_ID
    );

    if (
      dataCompletedCriteria &&
      !dataCompletedCriteria.valid &&
      isOnlyNumTreesMissing(dataCompletedCriteria.extraInfo)
    ) {
      baseExcludedIds.push(COMPLETED_DATA_CRITERIA_ID);
    }
  }

  return baseExcludedIds;
};

export const isValidCriteriaData = (criteriaData: ValidationDto): boolean => {
  if (!criteriaData?.criteriaList?.length) {
    return true;
  }

  const excludedCriteriaIds = getExcludedCriteriaIds(criteriaData);

  return !criteriaData.criteriaList.some(
    ({ criteriaId, valid }) => !valid && !excludedCriteriaIds.includes(criteriaId)
  );
};

export const hasCompletedDataWhitinStimatedAreaCriteriaInvalid = (criteriaData: any) => {
  if (!criteriaData?.criteriaList?.length) {
    return false;
  }

  return criteriaData.criteriaList.some(
    (criteria: any) =>
      (criteria.criteria_id === ESTIMATED_AREA_CRITERIA_ID || criteria.criteria_id === WITHIN_COUNTRY_CRITERIA_ID) &&
      criteria.valid === 0
  );
};

export const hasCompletedDataWhitinStimatedAreaCriteriaInvalidV3 = (criteriaData: ValidationDto): boolean => {
  if (!criteriaData?.criteriaList?.length) {
    return false;
  }

  const excludedCriteriaIds = getExcludedCriteriaIds(criteriaData);

  return criteriaData.criteriaList.some(
    ({ criteriaId, valid }) => excludedCriteriaIds.includes(criteriaId) && valid === false
  );
};

export const isCompletedDataOrEstimatedArea = (item: ICriteriaCheckItem): boolean => {
  return +item.id === ESTIMATED_AREA_CRITERIA_ID || +item.id === WITHIN_COUNTRY_CRITERIA_ID;
};

export const shouldShowAsWarning = (item: ICriteriaCheckItem): boolean => {
  // Always show as warning for estimated area and country
  if (isCompletedDataOrEstimatedArea(item)) {
    return true;
  }

  // For Data Completed validation, only show as warning if only numTrees is missing
  if (+item.id === COMPLETED_DATA_CRITERIA_ID && !item.status) {
    return isOnlyNumTreesMissing(item.extra_info);
  }

  return false;
};
