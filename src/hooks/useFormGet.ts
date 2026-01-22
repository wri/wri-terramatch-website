import { useMemo } from "react";

import { FormEntity, useEntityFormData, useForm } from "@/connections/Form";
import { useSubmission } from "@/connections/FormSubmission";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { FormDataDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formDefaultValues } from "@/helpers/customForms";

export const useFormSubmission = (uuid?: string) => {
  const enabled = uuid != null;
  const [formDataLoaded, { data: formData, loadFailure }] = useSubmission({ id: uuid, enabled });

  const [formLoaded, { data: form, loadFailure: formLoadFailure }] = useForm({
    id: formData?.formUuid ?? undefined,
    enabled: formData?.formUuid != null
  });

  return enabled && formDataLoaded && formLoaded
    ? { isLoading: false, formData, loadFailure, form, formLoadFailure }
    : { isLoading: true };
};

export const useEntityForm = (entity?: FormEntity, uuid?: string) => {
  const enabled = entity != null && uuid != null;
  const [formDataLoaded, { data: formData, loadFailure }] = useEntityFormData({ entity, uuid, enabled });
  const [formLoaded, { data: form, loadFailure: formLoadFailure }] = useForm({
    id: formData?.formUuid,
    enabled: formData?.formUuid != null
  });

  return enabled && formDataLoaded && formLoaded
    ? { isLoading: false, formData, loadFailure, form, formLoadFailure }
    : { isLoading: true };
};

export const useDefaultValues = (entityData: FormDataDto | undefined, fieldsProvider: FormFieldsProvider) => {
  const sourceData = useMemo(() => entityData?.answers ?? {}, [entityData?.answers]);
  return useMemo(() => formDefaultValues(sourceData, fieldsProvider), [sourceData, fieldsProvider]);
};
