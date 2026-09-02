import { isValid, parse } from "date-fns";

import { FormFullDto, StageDto } from "@/generated/v3/entityService/entityServiceSchemas";

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const REPORT_FORM_TYPES = new Set<NonNullable<FormFullDto["type"]>>([
  "project-report",
  "site-report",
  "nursery-report",
  "financial-report",
  "disturbance-report",
  "srp-report"
]);

const ENTITY_ESTABLISHMENT_FORM_TYPES = new Set<NonNullable<FormFullDto["type"]>>(["project", "site", "nursery"]);

export const findStageDeadline = (
  stages: StageDto[] | null | undefined,
  options: { stageUuid?: string | null; formUuid?: string }
): string | undefined => {
  if (stages == null || stages.length === 0) return undefined;

  if (options.stageUuid != null) {
    return stages.find(stage => stage.uuid === options.stageUuid)?.deadlineAt ?? undefined;
  }

  if (options.formUuid != null) {
    return stages.find(stage => stage.formUuid === options.formUuid)?.deadlineAt ?? undefined;
  }

  return undefined;
};

export const shouldShowFormIntroDeadline = (formType?: FormFullDto["type"] | null): boolean => {
  if (formType == null) return false;
  if (ENTITY_ESTABLISHMENT_FORM_TYPES.has(formType)) return false;
  return formType === "application" || REPORT_FORM_TYPES.has(formType);
};

export const resolveFormIntroDeadline = ({
  formType,
  stages,
  stageUuid,
  formUuid,
  reportDueAt
}: {
  formType?: FormFullDto["type"] | null;
  stages?: StageDto[] | null;
  stageUuid?: string | null;
  formUuid?: string;
  reportDueAt?: string | null;
}): string | undefined => {
  if (!shouldShowFormIntroDeadline(formType)) return undefined;

  if (formType === "application") {
    return findStageDeadline(stages, { stageUuid, formUuid });
  }

  return reportDueAt ?? undefined;
};

export const toLocalCalendarDate = (value?: string | null): Date | undefined => {
  if (value == null || value === "") return undefined;

  const datePart = value.trim().slice(0, 10);
  if (!ISO_DATE_ONLY.test(datePart)) return undefined;

  const parsed = parse(datePart, "yyyy-MM-dd", new Date());
  return isValid(parsed) ? parsed : undefined;
};
