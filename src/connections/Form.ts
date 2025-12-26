import { map, uniq } from "lodash";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import {
  formCreate,
  formDataGet,
  FormDataGetPathParams,
  formDataUpdate,
  formDelete,
  formGet,
  formIndex,
  FormIndexQueryParams,
  formUpdate,
  linkedFieldsIndex,
  LinkedFieldsIndexQueryParams,
  optionLabelsGetList,
  optionLabelsIndex,
  updateRequestGet,
  UpdateRequestGetPathParams,
  updateRequestUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  FormDataDto,
  FormFullDto,
  FormLightDto,
  LinkedFieldDto,
  OptionLabelDto,
  UpdateRequestDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { Filter } from "@/types/connection";

import { resourceCreator, resourceUpdater } from "./util/resourceMutator";

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

export type FormModelType = NonNullable<LinkedFieldsIndexQueryParams["formModelTypes"]>[number];
const linkedFieldsConnection = v3Resource("linkedFields", linkedFieldsIndex)
  .filterResources<LinkedFieldDto, { formModelTypes?: FormModelType[] }>(
    ({ formModelTypes }) => ({ queryParams: { formModelTypes } }),
    ({ formModelTypes }, indexMeta, linkedFields) => {
      const linkedFieldAttributes = map(linkedFields, "attributes");
      const relevantValues =
        formModelTypes == null
          ? linkedFieldAttributes
          : linkedFieldAttributes.filter(({ formModelType }) => formModelTypes.includes(formModelType));
      // If we've fetched the full index, just return everything. Otherwise, return nothing so that the
      // full index is fetched.
      if (formModelTypes == null) return indexMeta == null ? undefined : relevantValues;

      // For this endpoint, we can assume that if we have at least one member of each of the requested form types, we have everything
      const formTypesInCache = uniq(map(relevantValues, "formModelType"));
      return formTypesInCache.length === formModelTypes.length ? relevantValues : undefined;
    }
  )
  .enabledProp()
  .buildConnection();
export const useLinkedFields = connectionHook(linkedFieldsConnection);

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
  .update(formUpdate)
  .buildConnection();
export const useForm = connectionHook(formConnection);
export const loadForm = connectionLoader(formConnection);
export const deleteForm = deleterAsync("forms", formDelete, uuid => ({ pathParams: { uuid } }));
export const updateForm = resourceUpdater(formConnection);

const createFormConnection = v3Resource("forms", formCreate).create<FormFullDto>().buildConnection();
export const createForm = resourceCreator(createFormConnection);
export const useFormCreate = connectionHook(createFormConnection);

export type FormEntity = FormDataGetPathParams["entity"];
const idFactory = (props: { entity?: FormEntity; uuid?: string }) => `${props.entity}|${props.uuid}`;

const entityFormDataConnection = v3Resource("formData", formDataGet)
  .singleByCustomId<FormDataDto, Partial<FormDataGetPathParams>>(
    ({ entity, uuid }) => (entity == null || uuid == null ? undefined : { pathParams: { entity, uuid } }),
    idFactory
  )
  .update(formDataUpdate, idFactory)
  .enabledProp()
  .buildConnection();
export const useEntityFormData = connectionHook(entityFormDataConnection);

const updateRequestConnection = v3Resource("updateRequests", updateRequestGet)
  .singleByCustomId<UpdateRequestDto, Partial<UpdateRequestGetPathParams>>(
    ({ entity, uuid }) => (entity == null || uuid == null ? undefined : { pathParams: { entity, uuid } }),
    idFactory
  )
  .update(updateRequestUpdate, idFactory)
  .enabledProp()
  .buildConnection();
export const useUpdateRequest = connectionHook(updateRequestConnection);
