import { useCallback, useMemo } from "react";
import { FieldErrors, UseFormReturn } from "react-hook-form";

import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { FormModelsDefinition } from "@/context/wizardForm.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import {
  extractErrorType,
  FormSectionEntityType,
  resolveFormSectionEntityType,
  trackFormSectionAnalyticsEvent
} from "@/utils/analytics/formSectionAnalytics";

type UseFormSectionAnalyticsProps = {
  models: FormModelsDefinition;
  steps: FormStepWithValidation[];
  selectedStepIndex: number;
  formHook: UseFormReturn;
};

const getFormModel = (models: FormModelsDefinition) => (Array.isArray(models) ? models[0] : models);

type SectionEventPayload = {
  entityType: FormSectionEntityType;
  entityId?: string | null;
  sectionName: string;
  formStepId: string;
};

export const useFormSectionAnalytics = ({
  models,
  steps,
  selectedStepIndex,
  formHook
}: UseFormSectionAnalyticsProps) => {
  const formModel = useMemo(() => getFormModel(models), [models]);
  const entityType = useMemo(() => resolveFormSectionEntityType(formModel?.model), [formModel?.model]);

  const getSectionPayload = useCallback(
    (stepIndex: number): SectionEventPayload | null => {
      if (entityType == null || stepIndex < 0 || stepIndex >= steps.length) return null;

      const step = steps[stepIndex];
      return {
        entityType,
        entityId: formModel?.uuid,
        sectionName: step.title?.trim() || step.id,
        formStepId: step.id
      };
    },
    [entityType, formModel?.uuid, steps]
  );

  useValueChanged(selectedStepIndex, () => {
    if (selectedStepIndex < 0) return;

    const payload = getSectionPayload(selectedStepIndex);
    if (payload != null) {
      trackFormSectionAnalyticsEvent("section_started", payload);
    }

    void formHook.trigger().then(valid => {
      if (valid || selectedStepIndex >= steps.length) return;

      const errorPayload = getSectionPayload(selectedStepIndex);
      if (errorPayload == null) return;

      trackFormSectionAnalyticsEvent("section_error_triggered", {
        ...errorPayload,
        errorType: extractErrorType(formHook.formState.errors)
      });
    });
  });

  const trackSectionCompleted = useCallback(
    (stepIndex: number) => {
      const payload = getSectionPayload(stepIndex);
      if (payload != null) {
        trackFormSectionAnalyticsEvent("section_completed", payload);
      }
    },
    [getSectionPayload]
  );

  const trackSectionError = useCallback(
    (stepIndex: number, errors: FieldErrors) => {
      const payload = getSectionPayload(stepIndex);
      if (payload == null) return;

      trackFormSectionAnalyticsEvent("section_error_triggered", {
        ...payload,
        errorType: extractErrorType(errors)
      });
    },
    [getSectionPayload]
  );

  return {
    isTrackingEnabled: entityType != null,
    trackSectionCompleted,
    trackSectionError
  };
};
