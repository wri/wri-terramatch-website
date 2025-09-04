import { useRouter } from "next/router";
import { useState } from "react";

import { useForm } from "@/connections/util/Form";
import {
  GetV2FormsENTITYUUIDResponse,
  useGetV2FormsENTITYUUID,
  useGetV2FormsSubmissionsUUID
} from "@/generated/apiComponents";
import { FormSubmissionRead } from "@/generated/apiSchemas";

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

  return { isLoading: !formDataValid, formData: formDataValid ? formData : undefined };
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
