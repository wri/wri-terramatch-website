import { useT } from "@transifex/react";
import { useMemo } from "react";

import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { Framework } from "@/context/framework.provider";
import { getSchema } from "./utils";

export type FormStepSummaryStatus = "completed" | "active" | "available" | "error";

export type FormStepSummary = {
  id: string;
  title?: string | null;
  status: FormStepSummaryStatus;
};

/**
 * Returns a read-only summary of form steps with validation status (completed / error / active)
 * based on defaultValues. Does not write or submit; used e.g. by Overview to show step progress
 * and link to edit form with formStepId.
 */
export function useFormStepsSummary(
  fieldsProvider: FormFieldsProvider,
  framework: Framework,
  defaultValues?: Record<string, unknown>
): FormStepSummary[] {
  const t = useT();

  return useMemo(() => {
    const stepIds = fieldsProvider.stepIds();
    if (stepIds.length === 0) return [];

    let firstInvalidIndex = -1;

    const steps: FormStepSummary[] = stepIds.map((stepId, index) => {
      const title = fieldsProvider.step(stepId)?.title;
      const fieldIds = fieldsProvider.fieldNames(stepId);
      const schema = getSchema(fieldsProvider, t, framework, fieldIds);

      let valid = true;
      if (defaultValues != null) {
        try {
          schema.validateSync(defaultValues, { abortEarly: true });
        } catch {
          valid = false;
          if (firstInvalidIndex < 0) firstInvalidIndex = index;
        }
      }

      let status: FormStepSummaryStatus;
      if (defaultValues == null) {
        status = "available";
      } else if (valid) {
        status = "completed";
      } else if (index === firstInvalidIndex) {
        status = "active";
      } else {
        status = "error";
      }

      return { id: stepId, title, status };
    });

    return steps;
  }, [fieldsProvider, framework, defaultValues, t]);
}
