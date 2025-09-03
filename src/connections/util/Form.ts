import { map, uniq } from "lodash";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  formGet,
  linkedFieldsIndex,
  LinkedFieldsIndexQueryParams,
  optionLabelsGetList,
  optionLabelsIndex
} from "@/generated/v3/entityService/entityServiceComponents";
import { FormDto, LinkedFieldDto, OptionLabelDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const useOptionLabels = connectionHook(
  v3Resource("optionLabels", optionLabelsIndex)
    .multipleResources<OptionLabelDto>(({ ids }) => ({ queryParams: { ids: ids ?? [] } }))
    .buildConnection()
);

export const useOptionList = connectionHook(
  v3Resource("optionLabels", optionLabelsGetList)
    .index<OptionLabelDto, { listKey?: string | null }>(({ listKey }) =>
      listKey == null ? undefined : { pathParams: { listKey } }
    )
    .enabledProp()
    .buildConnection()
);

export type FormType = NonNullable<LinkedFieldsIndexQueryParams["formTypes"]>[number];
const linkedFieldsConnection = v3Resource("linkedFields", linkedFieldsIndex)
  .filterResources<LinkedFieldDto, { formTypes?: FormType[] }>(
    ({ formTypes }) => ({ queryParams: { formTypes } }),
    ({ formTypes }, indexMeta, linkedFields) => {
      const linkedFieldAttributes = Object.values(linkedFields).map(({ attributes }) => attributes);
      const relevantValues =
        formTypes == null
          ? linkedFieldAttributes
          : linkedFieldAttributes.filter(({ formType }) => formTypes.includes(formType));
      // If we've fetched the full index, just return everything. Otherwise, return nothing so that the
      // full index is fetched.
      if (formTypes == null) return indexMeta == null ? undefined : relevantValues;

      // For this endpoint, we can assume that if we have at least one member of each of the requested form types, we have everything
      const formTypesInCache = uniq(map(relevantValues, "formType"));
      return formTypesInCache.length === formTypes.length ? relevantValues : undefined;
    }
  )
  .enabledProp()
  .buildConnection();
export const useLinkedFields = connectionHook(linkedFieldsConnection);
export const loadLinkedFields = connectionLoader(linkedFieldsConnection);

const formConnection = v3Resource("forms", formGet)
  .singleResource<FormDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .buildConnection();
export const useForm = connectionHook(formConnection);
