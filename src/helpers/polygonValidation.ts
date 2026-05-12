import { validationLabels } from "@/components/elements/MapPolygonPanel/ChecklistInformation";
import { ValidationCriteriaDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  COMPLETED_DATA_CRITERIA_ID,
  ESTIMATED_AREA_CRITERIA_ID,
  ICriteriaCheckItem,
  WITHIN_COUNTRY_CRITERIA_ID
} from "@/types/validation";

export const parseV3ValidationData = (criteriaData: ValidationDto): ICriteriaCheckItem[] => {
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

export const parseValidationDataFromContext = (polygonValidation: any) => {
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

    const DATA_COMPLETENESS_FIELDS = new Set([
      "polyName",
      "poly_name",
      "practice",
      "targetSys",
      "target_sys",
      "distr",
      "numTrees",
      "num_trees",
      "plantStart",
      "plantstart"
    ]);

    const dataFields = infoArray.filter(info => DATA_COMPLETENESS_FIELDS.has(info.field));

    if (dataFields.length === 0) return false;

    const invalidFields = dataFields.filter(info => !info.exists || info.error != null);

    const isNumTreesField = (field: string) => field === "numTrees" || field === "num_trees";
    return invalidFields.length === 1 && isNumTreesField(invalidFields[0].field);
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
