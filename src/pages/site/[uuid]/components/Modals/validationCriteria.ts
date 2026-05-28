import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { shouldShowAsWarning } from "@/helpers/polygonValidation";
import type { ICriteriaCheckItem } from "@/types/validation";

export type CriteriaSeverity = "success" | "warning" | "error";

export const buildPolygonValidationsMap = (validations: ValidationDto[]): Map<string, ValidationDto> =>
  new Map(validations.map(v => [v.polygonUuid, v]));

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
