import { map, uniq } from "lodash";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader, connectionSelector } from "@/connections/util/connectionShortcuts";
import {
  formGet,
  linkedFieldsIndex,
  LinkedFieldsIndexQueryParams,
  optionLabelsGetList,
  optionLabelsIndex
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  FormDto,
  FormQuestionDto,
  FormSectionDto,
  LinkedFieldDto,
  OptionLabelDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

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
      const linkedFieldAttributes = Object.values(linkedFields).map(({ attributes }) => attributes);
      const relevantValues =
        formModelTypes == null
          ? linkedFieldAttributes
          : linkedFieldAttributes.filter(({ formModelType }) => formModelTypes.includes(formModelType));
      // If we've fetched the full index, just return everything. Otherwise, return nothing so that the
      // full index is fetched.
      if (formModelTypes == null) return indexMeta == null ? undefined : relevantValues;

      // For this endpoint, we can assume that if we have at least one member of each of the requested form types, we have everything
      const formTypesInCache = uniq(map(relevantValues, "formType"));
      return formTypesInCache.length === formModelTypes.length ? relevantValues : undefined;
    }
  )
  .enabledProp()
  .buildConnection();
export const useLinkedFields = connectionHook(linkedFieldsConnection);
export const loadLinkedFields = connectionLoader(linkedFieldsConnection);

const formConnection = v3Resource("forms", formGet)
  .singleResource<FormDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .enabledProp()
  .buildConnection();
export const useForm = connectionHook(formConnection);
export const loadForm = connectionLoader(formConnection);

export const sectionsConnection = v3Resource("formSections")
  .listByParentId<FormSectionDto>("formId", { sortProp: "order" })
  .enabledProp()
  .buildConnection();
export const questionsConnection = v3Resource("formQuestions")
  .listByParentId<FormQuestionDto>("sectionId", { sortProp: "order" })
  .buildConnection();
const sectionsSelector = connectionSelector(sectionsConnection);
export const selectSections = (formId: string) => sectionsSelector({ parentId: formId }).data ?? [];
const questionsSelector = connectionSelector(questionsConnection);
export const selectQuestions = (sectionId: string) => questionsSelector({ parentId: sectionId }).data ?? [];

const sectionConnection = v3Resource("formSections").cachedSingleResource<FormSectionDto>().buildConnection();
export const useFormSection = (sectionUuid: string) => useConnection(sectionConnection, { id: sectionUuid })[1]?.data;

const questionConnection = v3Resource("formQuestions").cachedSingleResource<FormQuestionDto>().buildConnection();
const questionSelector = connectionSelector(questionConnection);
export const selectQuestion = (questionUuid: string) => questionSelector({ id: questionUuid }).data;
export const selectChildQuestions = (questionUuid: string) => {
  const { sectionId, uuid } = selectQuestion(questionUuid) ?? {};
  if (sectionId == null || uuid == null) return [];
  return (selectQuestions(sectionId) ?? []).filter(({ parentId }) => parentId === uuid);
};
