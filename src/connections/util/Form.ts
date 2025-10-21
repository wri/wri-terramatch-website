import { map, uniq } from "lodash";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  formGet,
  formIndex,
  FormIndexQueryParams,
  linkedFieldsIndex,
  LinkedFieldsIndexQueryParams,
  optionLabelsGetList,
  optionLabelsIndex
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  FormFullDto,
  FormLightDto,
  LinkedFieldDto,
  OptionLabelDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { Filter } from "@/types/connection";

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

export type FormModelType = NonNullable<LinkedFieldsIndexQueryParams["formTypes"]>[number];
const linkedFieldsConnection = v3Resource("linkedFields", linkedFieldsIndex)
  .filterResources<LinkedFieldDto, { formTypes?: FormModelType[] }>(
    ({ formTypes }) => ({ queryParams: { formTypes } }),
    ({ formTypes }, indexMeta, linkedFields) => {
      const linkedFieldAttributes = map(linkedFields, "attributes");
      const relevantValues =
        formTypes == null
          ? linkedFieldAttributes
          : linkedFieldAttributes.filter(({ formModelType }) => formTypes.includes(formModelType));
      // If we've fetched the full index, just return everything. Otherwise, return nothing so that the
      // full index is fetched.
      if (formTypes == null) return indexMeta == null ? undefined : relevantValues;

      // For this endpoint, we can assume that if we have at least one member of each of the requested form types, we have everything
      const formTypesInCache = uniq(map(relevantValues, "formModelType"));
      return formTypesInCache.length === formTypes.length ? relevantValues : undefined;
    }
  )
  .enabledProp()
  .buildConnection();
export const useLinkedFields = connectionHook(linkedFieldsConnection);
export const loadLinkedFields = connectionLoader(linkedFieldsConnection);

const formIndexConnection = v3Resource("forms", formIndex)
  .index<FormLightDto>()
  .pagination()
  .filter<Filter<FormIndexQueryParams>>()
  .buildConnection();
export const loadFormIndex = connectionLoader(formIndexConnection);

const formConnection = v3Resource("forms", formGet)
  .singleFullResource<FormFullDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .enabledProp()
  .addProps<{ translated?: boolean }>(
    ({ translated }) => ({ queryParams: { translated } }),
    ({ data }, { translated }) => data?.translated === (translated ?? true)
  )
  .buildConnection();
export const useForm = connectionHook(formConnection);
export const loadForm = connectionLoader(formConnection);
