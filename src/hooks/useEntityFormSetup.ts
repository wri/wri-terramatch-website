import { useRouter } from "next/router";
import { useMemo } from "react";

import { useFormStepsWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { FormEntity } from "@/connections/Form";
import { Framework, toFramework } from "@/context/framework.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { v3EntityName } from "@/helpers/entity";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { EntityName } from "@/types/common";

export const useEntityFormSetup = (entityName: EntityName, entityUUID: string) => {
  const router = useRouter();
  const mode = router.query.mode as string | undefined;

  const model = useMemo(
    () => ({ model: v3EntityName(entityName) as FormEntity, uuid: entityUUID }),
    [entityName, entityUUID]
  );

  const { formData, isLoading: isFormLoading, loadFailure, formLoadFailure } = useEntityForm(model.model, entityUUID);

  const framework = toFramework(formData?.frameworkKey) as Framework;

  const feedbackFields = useMemo(
    () => (mode?.includes("provide-feedback") ? formData?.feedbackFields ?? [] : []),
    [formData?.feedbackFields, mode]
  );

  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(formData?.formUuid, feedbackFields);
  const defaultValues = useDefaultValues(formData, fieldsProvider);
  const steps = useFormStepsWithValidation(fieldsProvider, framework);

  const isReady = !isFormLoading && providerLoaded;

  return {
    model,
    formData,
    framework,
    feedbackFields,
    fieldsProvider,
    defaultValues,
    steps,
    isFormLoading,
    providerLoaded,
    isReady,
    loadFailure,
    formLoadFailure
  };
};
