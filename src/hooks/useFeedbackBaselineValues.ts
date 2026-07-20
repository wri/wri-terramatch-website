import { cloneDeep } from "lodash";
import { useMemo } from "react";

import { FormEntity, useUpdateRequest } from "@/connections/Form";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { FormDataDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formDefaultValues } from "@/helpers/customForms";

type UseFeedbackBaselineValuesArgs = {
  entity: FormEntity;
  uuid: string;
  formData: FormDataDto | undefined;
  fieldsProvider: FormFieldsProvider;
  providerLoaded: boolean;
  enabled?: boolean;
};

/**
 * Baseline values for resolving change-request / information-required feedback.
 * Prefer updateRequest.entityAnswers so Save & Exit → reopen does not compare against the saved draft.
 */
export const useFeedbackBaselineValues = ({
  entity,
  uuid,
  formData,
  fieldsProvider,
  providerLoaded,
  enabled = true
}: UseFeedbackBaselineValuesArgs) => {
  const [updateRequestLoaded, { data: updateRequest }] = useUpdateRequest({
    entity,
    uuid,
    enabled: enabled && uuid != null
  });

  const feedbackBaselineValues = useMemo(() => {
    if (!providerLoaded || !updateRequestLoaded || formData == null) return undefined;

    // Clone before formDefaultValues — that helper mutates the answers object in place.
    const answers = updateRequest?.entityAnswers ?? formData.answers;
    if (answers == null) return formDefaultValues({}, fieldsProvider);

    return formDefaultValues(cloneDeep(answers), fieldsProvider);
  }, [fieldsProvider, formData, providerLoaded, updateRequest?.entityAnswers, updateRequestLoaded]);

  return {
    feedbackBaselineValues,
    updateRequestLoaded,
    updateRequest
  };
};
