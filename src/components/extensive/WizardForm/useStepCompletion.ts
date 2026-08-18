import { Dictionary } from "lodash";
import { useMemo } from "react";

import { FormFieldsProvider } from "@/context/wizardForm.provider";

import { hasUnresolvedFeedbackInStep } from "./feedbackUtils";
import { FormStepWithValidation } from "./useFormStepsWithValidation";

export interface StepCompletion {
  id: string;
  /** Valid per the step's yup schema AND no unresolved reviewer feedback. */
  completed: boolean;
}

export interface StepCompletionResult {
  stepCompletions: StepCompletion[];
  /** True only when there is at least one step and every step is completed. */
  allStepsCompleted: boolean;
}

/**
 * Shared completion logic for the wizard steps of an entity. This is the single source of truth for
 * both the Overview progress bar (see `EntitySetUpSection`) and the consolidated Overview details
 * section (`EntityDetailsSection`): a step is "completed" when it passes its yup validation and
 * carries no unresolved feedback, matching exactly what the progress rows and the `SharedDetails`
 * accordion headers already show.
 */
export const useStepCompletion = (
  steps: FormStepWithValidation[],
  defaultValues: Dictionary<unknown> | undefined,
  fieldsProvider: FormFieldsProvider,
  feedbackFields: string[] | null | undefined,
  feedbackBaselineValues: Dictionary<unknown> | undefined
): StepCompletionResult =>
  useMemo(() => {
    const stepCompletions: StepCompletion[] = steps.map(step => {
      const valid = defaultValues == null || step.validation.isValidSync(defaultValues);
      const hasUnresolvedFeedback =
        defaultValues != null &&
        feedbackBaselineValues != null &&
        hasUnresolvedFeedbackInStep(fieldsProvider, step.id, feedbackFields, defaultValues, feedbackBaselineValues);
      return { id: step.id, completed: valid && !hasUnresolvedFeedback };
    });
    const allStepsCompleted = stepCompletions.length > 0 && stepCompletions.every(({ completed }) => completed);
    return { stepCompletions, allStepsCompleted };
  }, [steps, defaultValues, fieldsProvider, feedbackFields, feedbackBaselineValues]);
