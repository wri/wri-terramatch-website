import { Dictionary } from "lodash";
import { useMemo } from "react";

import { useForm } from "@/connections/util/Form";
import { formDefaultValues } from "@/helpers/customForms";

export function useFormDefaultValues(values?: Dictionary<any>, formUuid?: string) {
  const [formIsLoaded] = useForm({ id: formUuid, enabled: formUuid != null });
  return useMemo(
    () => (formIsLoaded && formUuid != null ? formDefaultValues(values, formUuid) : values),
    [formIsLoaded, formUuid, values]
  );
}
