import { FormFullDto, StageDto } from "@/generated/v3/entityService/entityServiceSchemas";

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
