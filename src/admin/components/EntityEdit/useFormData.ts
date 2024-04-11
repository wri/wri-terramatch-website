import { useRef } from "react";

import {
  GetV2FormsENTITYUUIDResponse,
  useGetV2FormsENTITYUUID,
  usePutV2FormsENTITYUUID
} from "@/generated/apiComponents";
import { pluralEntityNameToSingular } from "@/helpers/entity";
import {
  useGetCustomFormSteps,
  useNormalizedFormDefaultValue
} from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";
import { EntityName } from "@/types/common";

export default function useFormData(entity: EntityName, uuid: string) {
  const {
    mutate: updateEntity,
    data: updateData,
    error,
    isSuccess,
    isLoading: isUpdating
  } = usePutV2FormsENTITYUUID({});

  const {
    data: formResponse,
    isLoading,
    isError: loadError
  } = useGetV2FormsENTITYUUID({ pathParams: { entity, uuid } });

  // @ts-ignore
  const formData = (formResponse?.data ?? {}) as GetV2FormsENTITYUUIDResponse;

  const formSteps = useGetCustomFormSteps(formData.form, {
    entityName: pluralEntityNameToSingular(entity),
    entityUUID: uuid
  });

  // updateData will briefly be null while the update is in progress, and during that period we want to
  // make sure to keep using the previous value, so we need to use a ref to track that state.
  const contentDataRef = useRef<GetV2FormsENTITYUUIDResponse | null>(null);
  if (contentDataRef.current == null && formData?.answers != null) {
    contentDataRef.current = formData;
  } else if (updateData != null) {
    // @ts-ignore
    contentDataRef.current = updateData?.data;
  }

  const values = useNormalizedFormDefaultValue(
    contentDataRef.current?.update_request?.content ?? contentDataRef.current?.answers,
    formSteps
  );

  // @ts-ignore
  const { form_title: title } = formData;

  return { isLoading, loadError, isUpdating, isSuccess, error, updateEntity, formSteps, values, title };
}
