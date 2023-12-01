import { useT } from "@transifex/react";
import { useMemo } from "react";

import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import { FormRead } from "@/generated/apiSchemas";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";
import { Entity } from "@/types/common";

export const useGetCustomFormSteps = (
  schema?: FormRead,
  entity?: Entity,
  feedback_fields?: string[]
): FormStepSchema[] | undefined => {
  const t = useT();

  return useMemo(
    () => (schema ? getCustomFormSteps(schema, t, entity, feedback_fields) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schema, t]
  );
};

export function useNormalizedFormDefaultValue<T = any>(values: T, schema?: FormStepSchema[], isMigrated?: boolean): T {
  return useMemo(() => normalizedFormDefaultValue<T>(values, schema, isMigrated), [values, schema, isMigrated]);
}
