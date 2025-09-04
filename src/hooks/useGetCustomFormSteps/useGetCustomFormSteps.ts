import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useMemo } from "react";

import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import { useForm } from "@/connections/util/Form";
import { Framework } from "@/context/framework.provider";
import { FormRead } from "@/generated/apiSchemas";
import { formDataNormalizer, formDefaultValues, getCustomFormSteps } from "@/helpers/customForms";
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

export function useFormDefaultValues(values: Dictionary<any>, formUuid?: string) {
  const [formIsLoaded] = useForm({ id: formUuid, enabled: formUuid != null });
  return useMemo(
    () => (formIsLoaded && formUuid != null ? formDefaultValues(values, formUuid) : values),
    [formIsLoaded, formUuid, values]
  );
}

export function useNormalizer(formUuid?: string) {
  const [formIsLoaded] = useForm({ id: formUuid, enabled: formUuid != null });
  return useMemo(
    () => (formIsLoaded && formUuid != null ? formDataNormalizer(formUuid) : (values: Dictionary<any>) => values),
    [formIsLoaded, formUuid]
  );
}
