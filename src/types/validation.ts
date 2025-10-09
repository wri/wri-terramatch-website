// Shared validation types for both V2 and V3 validation systems

export interface ICriteriaCheckItem {
  id: string | number;
  status: boolean;
  label: string;
  date?: string;
  extra_info?: Record<string, any> | null;
}

export const ESTIMATED_AREA_CRITERIA_ID = 12;
export const COMPLETED_DATA_CRITERIA_ID = 14;
export const OVERLAPPING_CRITERIA_ID = 3;
export const WITHIN_COUNTRY_CRITERIA_ID = 7;
export const PLANT_START_DATE_CRITERIA_ID = 15;
