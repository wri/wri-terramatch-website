import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { FormEntity, useEntityFormData, useForm } from "@/connections/Form";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import { useGetV2FormsSubmissionsUUID } from "@/generated/apiComponents";
import { FormSubmissionRead } from "@/generated/apiSchemas";
import { FormDataDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formDefaultValues } from "@/helpers/customForms";

export const useFormSubmission = (uuid?: string) => {
  const [formDataValid, setFormDataValid] = useState(false);
  const router = useRouter();
  const { data: formData } = useGetV2FormsSubmissionsUUID<{ data: FormSubmissionRead }>(
    { pathParams: { uuid: uuid ?? "" }, queryParams: { lang: router.locale } },
    {
      enabled: uuid != null,
      onSettled: () => setFormDataValid(true)
    }
  );

  const [formLoaded, { data: form, loadFailure: formLoadFailure }] = useForm({
    id: formData?.data?.form_uuid,
    enabled: formData?.data?.form_uuid != null
  });

  return formDataValid && formLoaded ? { isLoading: false, formData, form, formLoadFailure } : { isLoading: true };
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
