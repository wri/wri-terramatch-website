import { FieldErrors } from "react-hook-form";

import { FormModelType } from "@/connections/Form";
import { FormSectionEventName, getFormSectionAnalyticsContext, trackFormSectionEvent } from "@/utils/ga4";

export type FormSectionEntityType = "project" | "site" | "nursery";

const TRACKED_ENTITY_TYPES: Partial<Record<FormModelType, FormSectionEntityType>> = {
  projects: "project",
  sites: "site",
  nurseries: "nursery",
  projectReports: "project",
  siteReports: "site",
  nurseryReports: "nursery"
};

export const resolveFormSectionEntityType = (model?: FormModelType | null): FormSectionEntityType | null => {
  if (model == null) return null;
  return TRACKED_ENTITY_TYPES[model] ?? null;
};

export const extractErrorType = (errors: FieldErrors): string | undefined => {
  const [firstFieldName] = Object.keys(errors);
  if (firstFieldName == null) return undefined;

  const fieldError = errors[firstFieldName];
  if (fieldError == null || typeof fieldError !== "object") return firstFieldName;

  if ("type" in fieldError && fieldError.type != null) return String(fieldError.type);
  if ("message" in fieldError && fieldError.message != null) return String(fieldError.message);

  return firstFieldName;
};

export const trackFormSectionAnalyticsEvent = (
  eventName: FormSectionEventName,
  {
    entityType,
    entityId,
    sectionName,
    formStepId,
    errorType
  }: {
    entityType: FormSectionEntityType;
    entityId?: string | null;
    sectionName: string;
    formStepId: string;
    errorType?: string | null;
  }
): void => {
  trackFormSectionEvent(
    eventName,
    getFormSectionAnalyticsContext({
      entityType,
      entityId,
      sectionName,
      formStepId,
      errorType
    })
  );
};
