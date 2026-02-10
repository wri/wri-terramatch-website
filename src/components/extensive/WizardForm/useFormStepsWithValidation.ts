import { useT } from "@transifex/react";
import { useMemo } from "react";
import * as yup from "yup";

import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { Framework } from "@/context/framework.provider";
import { getSchema } from "./utils";

export type FormStepWithValidation = {
  id: string;
  title?: string | null;
  validation: yup.ObjectSchema<Record<string, unknown>>;
};

export function useFormStepsWithValidation(
  fieldsProvider: FormFieldsProvider,
  framework: Framework
): FormStepWithValidation[] {
  const t = useT();

  return useMemo(
    () =>
      fieldsProvider.stepIds().map(stepId => ({
        id: stepId,
        title: fieldsProvider.step(stepId)?.title,
        validation: getSchema(
          fieldsProvider,
          t,
          framework,
          fieldsProvider.fieldNames(stepId)
        ) as yup.ObjectSchema<Record<string, unknown>>
      })),
    [fieldsProvider, framework, t]
  );
}
