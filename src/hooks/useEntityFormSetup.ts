import { useMemo } from "react";

import { useFormStepsWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { FormEntity } from "@/connections/Form";
import { Framework, toFramework } from "@/context/framework.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { v3EntityName } from "@/helpers/entity";
import { useFeedbackBaselineValues } from "@/hooks/useFeedbackBaselineValues";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { EntityName } from "@/types/common";

export const useEntityFormSetup = (entityName: EntityName, entityUUID: string) => {
  const model = useMemo(
    () => ({ model: v3EntityName(entityName) as FormEntity, uuid: entityUUID }),
    [entityName, entityUUID]
  );

  const { formData, isLoading: isFormLoading, loadFailure, formLoadFailure } = useEntityForm(model.model, entityUUID);

  const framework = toFramework(formData?.frameworkKey) as Framework;

  const feedbackFields = useMemo(() => formData?.feedbackFields ?? [], [formData?.feedbackFields]);

  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formData?.formUuid, feedbackFields);
  const defaultValues = useDefaultValues(formData, fieldsProvider);
  const steps = useFormStepsWithValidation(fieldsProvider, framework);

  const { feedbackBaselineValues, updateRequestLoaded } = useFeedbackBaselineValues({
    entity: model.model,
    uuid: entityUUID,
    formData,
    fieldsProvider,
    providerLoaded
  });

  const isReady = !isFormLoading && providerLoaded && updateRequestLoaded && feedbackBaselineValues != null;

  return {
    model,
    formData,
    framework,
    feedbackFields,
    fieldsProvider,
    defaultValues,
    feedbackBaselineValues,
    steps,
    isFormLoading,
    providerLoaded,
    isReady,
    loadFailure,
    formLoadFailure
  };
};
