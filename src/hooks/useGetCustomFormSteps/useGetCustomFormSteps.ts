import { useT } from "@transifex/react";
import { useMemo } from "react";

import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import { Framework } from "@/context/framework.provider";
import { FormRead } from "@/generated/apiSchemas";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";
import { Entity } from "@/types/common";

export const useGetCustomFormSteps = (
  schema?: FormRead,
  entity?: Entity,
  framework?: Framework,
  feedback_fields?: string[]
): FormStepSchema[] | undefined => {
  const t = useT();

  return useMemo(
    () => (schema ? getCustomFormSteps(schema, t, entity, framework, feedback_fields) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schema, t, framework]
  );
};

export function useNormalizedFormDefaultValue<T = any>(values: T, schema?: FormStepSchema[]): T {
  return useMemo(() => normalizedFormDefaultValue<T>(values, schema), [values, schema]);
}
