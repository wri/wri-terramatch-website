import {
  ESTIMATED_AREA_CRITERIA_ID,
  ICriteriaCheckItem,
  PLANT_START_DATE_CRITERIA_ID,
  WITHIN_COUNTRY_CRITERIA_ID
} from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import { validationLabels } from "@/components/elements/MapPolygonPanel/ChecklistInformation";

export const parseV3ValidationData = (criteriaData: any) => {
  return criteriaData.criteriaList.map((criteria: any) => {
    return {
      id: criteria.criteriaId,
      date: criteria.createdAt,
      status: criteria.valid,
      label: validationLabels[criteria.criteriaId],
      extra_info: criteria.extraInfo
    };
  });
};

export const parseValidationDataFromContext = (polygonValidation: any) => {
  if (!polygonValidation?.nonValidCriteria) {
    return [];
  }
  console.log("polygonValidation context", polygonValidation);
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

export const isValidCriteriaData = (criteriaData: any) => {
  if (!criteriaData?.criteriaList?.length) {
    return true;
  }
  return !criteriaData.criteriaList.some(
    (criteria: any) =>
      criteria.criteria_id !== ESTIMATED_AREA_CRITERIA_ID &&
      criteria.criteria_id !== WITHIN_COUNTRY_CRITERIA_ID &&
      criteria.criteria_id !== PLANT_START_DATE_CRITERIA_ID &&
      criteria.valid !== 1
  );
};

export const hasCompletedDataWhitinStimatedAreaCriteriaInvalid = (criteriaData: any) => {
  if (!criteriaData?.criteriaList?.length) {
    return false;
  }

  return criteriaData.criteriaList.some(
    (criteria: any) =>
      (criteria.criteria_id === ESTIMATED_AREA_CRITERIA_ID ||
        criteria.criteria_id === WITHIN_COUNTRY_CRITERIA_ID ||
        criteria.criteria_id === PLANT_START_DATE_CRITERIA_ID) &&
      criteria.valid === 0
  );
};

export const hasCompletedDataWhitinStimatedAreaCriteriaInvalidV3 = (criteriaData: any) => {
  if (!criteriaData?.criteriaList?.length) {
    return false;
  }

  return criteriaData.criteriaList.some(
    (criteria: any) =>
      (criteria.criteriaId === ESTIMATED_AREA_CRITERIA_ID ||
        criteria.criteriaId === WITHIN_COUNTRY_CRITERIA_ID ||
        criteria.criteriaId === PLANT_START_DATE_CRITERIA_ID) &&
      criteria.valid === false
  );
};

export const isCompletedDataOrEstimatedArea = (item: ICriteriaCheckItem) => {
  return (
    +item.id === ESTIMATED_AREA_CRITERIA_ID ||
    +item.id === WITHIN_COUNTRY_CRITERIA_ID ||
    +item.id === PLANT_START_DATE_CRITERIA_ID
  );
};
