import { defaults } from "lodash";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { useForm } from "@/connections/util/Form";
import { FormFieldsProvider } from "@/context/wizardForm.provider";
import {
  GetV2FormsENTITYUUIDResponse,
  useGetV2FormsENTITYUUID,
  useGetV2FormsSubmissionsUUID
} from "@/generated/apiComponents";
import { FormSubmissionRead } from "@/generated/apiSchemas";
import { formDefaultValues } from "@/helpers/customForms";

/**
 * Protects the FE from first rendering with an out of date cached copy of the form data by only
 * returning the form data once `onSettled` has been called on the request.
 */
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

/**
 * Protects the FE from first rendering with an out of date cached copy of the form data by only
 * returning the form data once `onSettled` has been called on the request.
 */
export const useEntityForm = (entity?: string, uuid?: string) => {
  const [formDataValid, setFormDataValid] = useState(false);
  const router = useRouter();
  const {
    data: formData,
    isError: loadError,
    refetch
  } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>(
    {
      pathParams: {
        entity: entity ?? "",
        uuid: uuid ?? ""
      },
      queryParams: { lang: router.locale }
    },
    {
      enabled: entity != null && uuid != null,
      onSettled: () => setFormDataValid(true)
    }
  );

  const [formLoaded, { data: form, loadFailure: formLoadFailure }] = useForm({
    id: formData?.data?.form_uuid,
    enabled: formData?.data?.form_uuid != null
  });

  return formDataValid && formLoaded
    ? { isLoading: false, formData, loadError, refetch, form, formLoadFailure }
    : { isLoading: true };
};

export const useDefaultValues = (
  entityData: GetV2FormsENTITYUUIDResponse | undefined,
  fieldsProvider: FormFieldsProvider
) => {
  const sourceData = useMemo(
    () => defaults(entityData?.update_request?.content ?? {}, entityData?.answers),
    [entityData?.answers, entityData?.update_request?.content]
  );
  return useMemo(() => formDefaultValues(sourceData, fieldsProvider), [sourceData, fieldsProvider]);
};
