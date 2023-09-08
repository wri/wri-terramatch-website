import { useT } from "@transifex/react";
import { useMemo } from "react";

import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import { FormRead } from "@/generated/apiSchemas";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";

export const useGetCustomFormSteps = (schema?: FormRead): FormStepSchema[] | undefined => {
  const t = useT();

  return useMemo(
    () => (schema ? getCustomFormSteps(schema, t) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schema, t]
  );
};

export function useNormalizedFormDefaultValue<T = any>(values: T, schema?: FormStepSchema[]): T {
  return useMemo(() => normalizedFormDefaultValue<T>(values, schema), [values, schema]);
}
