import {
  COMPLETED_DATA_CRITERIA_ID,
  ESTIMATED_AREA_CRITERIA_ID,
  ICriteriaCheckItem,
  WITHIN_COUNTRY_CRITERIA_ID
} from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import { validationLabels } from "@/components/elements/MapPolygonPanel/ChecklistInformation";

export const parseValidationData = (criteriaData: any) => {
  const transformedData: ICriteriaCheckItem[] = criteriaData.criteria_list.map((criteria: any) => {
    return {
      id: criteria.criteria_id,
      date: criteria.latest_created_at,
      status: criteria.valid === 1,
      label: validationLabels[criteria.criteria_id],
      extra_info: criteria.extra_info
    };
  });
  return transformedData;
};

export const isValidCriteriaData = (criteriaData: any) => {
  if (!criteriaData?.criteria_list?.length) {
    return true;
  }
  return !criteriaData.criteria_list.some(
    (criteria: any) =>
      criteria.criteria_id !== ESTIMATED_AREA_CRITERIA_ID &&
      criteria.criteria_id !== COMPLETED_DATA_CRITERIA_ID &&
      criteria.criteria_id !== WITHIN_COUNTRY_CRITERIA_ID &&
      criteria.valid !== 1
  );
};

export const hasCompletedDataWhitinStimatedAreaCriteriaInvalid = (criteriaData: any) => {
  if (!criteriaData?.criteria_list?.length) {
    return false;
  }

  return criteriaData.criteria_list.some(
    (criteria: any) =>
      (criteria.criteria_id === ESTIMATED_AREA_CRITERIA_ID ||
        criteria.criteria_id === COMPLETED_DATA_CRITERIA_ID ||
        criteria.criteria_id === WITHIN_COUNTRY_CRITERIA_ID) &&
      criteria.valid === 0
  );
};

export const isCompletedDataOrEstimatedArea = (item: ICriteriaCheckItem) => {
  return (
    +item.id === COMPLETED_DATA_CRITERIA_ID ||
    +item.id === ESTIMATED_AREA_CRITERIA_ID ||
    +item.id === WITHIN_COUNTRY_CRITERIA_ID
  );
};
