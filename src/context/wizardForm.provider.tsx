import { kebabCase } from "lodash";
import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { OrgFormDetails } from "@/components/elements/Inputs/FinancialTableInput/types";
import { FieldDefinition, StepDefinition } from "@/components/extensive/WizardForm/types";
import { questionDtoToDefinition } from "@/components/extensive/WizardForm/utils";
import { selectQuestions, selectSections, useForm } from "@/connections/util/Form";
import { FormQuestionDto, FormSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Entity, EntityName } from "@/types/common";
import { toArray } from "@/utils/array";

type FormModelType = NonNullable<FormQuestionDto["model"]>;

export type FormModel = {
  model: FormModelType;
  uuid: string;
};

export type FormModelsDefinition = FormModel | FormModel[];

export type FormFieldsProvider = {
  // Returns the step IDs in the order they should be displayed in the form.
  stepIds: () => string[];
  step: (id: string) => StepDefinition | undefined;
  fieldIds: (stepId: string) => string[];
  fieldById: (id: string) => FieldDefinition | undefined;
  fieldByKey: (linkedFieldKey: string) => FieldDefinition | undefined;
  childIds: (fieldId: string) => string[];
  feedbackRequired: (fieldId: string) => boolean;
};

const StubFormFieldsProvider: FormFieldsProvider = {
  stepIds: () => [],
  step: () => undefined,
  fieldIds: () => [],
  fieldById: () => undefined,
  fieldByKey: () => undefined,
  childIds: () => [],
  feedbackRequired: () => false
};

export type LocalSteps = (StepDefinition & {
  fields: (FieldDefinition & { children?: FieldDefinition[] })[];
})[];

export const useLocalStepsProvider = (localSteps: LocalSteps): FormFieldsProvider => {
  return useMemo<FormFieldsProvider>(() => {
    const stepIds = localSteps.map(({ id }) => id);
    const stepsById = new Map<string, StepDefinition>(localSteps.map(({ fields, ...step }) => [step.id, step]));
    const fieldIds = new Map(localSteps.map(({ id, fields }) => [id, fields.map(({ name }) => name)]));
    const fieldsById = new Map(
      localSteps.flatMap(({ fields }) =>
        fields.flatMap(
          ({ children, ...field }) =>
            [[field.name, field], ...(children ?? []).map(child => [child.name, child])] as [string, FieldDefinition][]
        )
      )
    );
    const fieldsByKey = new Map(
      [...fieldsById.values()]
        .filter(({ linkedFieldKey }) => linkedFieldKey != null)
        .map(field => [field.linkedFieldKey as string, field])
    );
    const childIds = new Map<string, string[]>(
      localSteps
        .flatMap(({ fields }) => fields)
        .filter(({ children }) => children != null)
        .map(({ name, children }) => [name, (children ?? []).map(({ name }) => name)])
    );

    return {
      stepIds: () => stepIds ?? [],
      step: (id: string) => stepsById.get(id),
      fieldIds: (stepIds: string) => fieldIds.get(stepIds) ?? [],
      fieldById: (id: string) => fieldsById.get(id),
      fieldByKey: (linkedFieldKey: string) => fieldsByKey.get(linkedFieldKey),
      childIds: (fieldId: string) => childIds.get(fieldId) ?? [],
      feedbackRequired: () => false
    };
  }, [localSteps]);
};

/**
 * Creates a fields provider for a given form UUID. IMPORTANT: The form _must already have been cached
 * in the connection store at the time this function is called for this provider to be valid_.
 */
export const createApiFieldsProvider = (
  formUuid?: string,
  feedbackFields?: string[] | null,
  fieldFilter: (field: FormQuestionDto) => boolean = () => true
) => {
  // start by building a structure of the whole form from what's cached in the API store, and by
  // using the optional fieldFilter.
  // sections and questions are sorted at the connection level based on the `order` field.
  const stepsById = new Map<string, StepDefinition>();
  const fieldsById = new Map<string, FieldDefinition>();
  const sections =
    formUuid == null
      ? []
      : selectSections(formUuid).reduce((steps, section) => {
          const questions = selectQuestions(section.uuid).filter(fieldFilter);
          // If the only questions left after ones that have a parent, then this is effectively
          // an empty step and will be skipped.
          if (questions.filter(({ parentId }) => parentId == null).length == 0) return steps;

          const { uuid, ...step } = section;
          stepsById.set(uuid, { id: uuid, ...step });
          for (const question of questions) {
            fieldsById.set(question.uuid, questionDtoToDefinition(question));
          }

          return [...steps, { ...section, fields: questions }];
        }, [] as (FormSectionDto & { fields: FormQuestionDto[] })[]);

  // memoize a bunch of stuff to make the provider fast
  const stepIds = [...stepsById.keys()];
  const fieldIds = new Map(
    sections.map(step => [step.uuid, step.fields.filter(({ parentId }) => parentId == null).map(({ uuid }) => uuid)])
  );
  const fieldsByKey = new Map(
    [...fieldsById.values()]
      .filter(({ linkedFieldKey }) => linkedFieldKey != null)
      .map(field => [field.linkedFieldKey as string, field])
  );

  const childIds = sections
    .flatMap(({ fields }) => fields)
    .filter(({ parentId }) => parentId != null)
    .reduce((map, { uuid, parentId }) => {
      const list = map.get(parentId!) ?? [];
      map.set(parentId!, [...list, uuid]);
      return map;
    }, new Map<string, string[]>());

  return {
    stepIds: () => stepIds ?? [],
    step: (id: string) => stepsById.get(id),
    fieldIds: (stepId: string) => fieldIds.get(stepId) ?? [],
    fieldById: (id: string) => fieldsById.get(id),
    fieldByKey: (linkedFieldKey: string) => fieldsByKey.get(linkedFieldKey),
    childIds: (fieldId: string) => childIds.get(fieldId) ?? [],
    feedbackRequired: (fieldId: string) => feedbackFields?.includes(fieldId) ?? false
  };
};

// Returns a boolean indicating whether the form is loaded, and the fields provider.
export const useApiFieldsProvider = (
  formUuid?: string | null,
  feedbackFields?: string[] | null,
  fieldFilter: (field: FormQuestionDto) => boolean = () => true
): [boolean, FormFieldsProvider] => {
  const enabled = formUuid != null;
  const formLoaded = useForm({ id: formUuid ?? undefined, enabled: formUuid != null })[0] && enabled;
  const provider = useMemo(
    () => createApiFieldsProvider(formUuid ?? undefined, feedbackFields, fieldFilter),
    [feedbackFields, fieldFilter, formUuid]
  );
  return [formLoaded, provider];
};

type IFormFieldsContext = {
  models: FormModel[];
  fieldsProvider: FormFieldsProvider;
  orgDetails?: OrgFormDetails;
};

type WizardFormProviderProps = {
  models?: FormModelsDefinition;
  fieldsProvider: FormFieldsProvider;
  orgDetails?: OrgFormDetails;
};

const WizardFormContext = createContext<IFormFieldsContext>({ models: [], fieldsProvider: StubFormFieldsProvider });

const WizardFormProvider: FC<PropsWithChildren<WizardFormProviderProps>> = ({
  models,
  fieldsProvider,
  orgDetails,
  children
}) => {
  const contextModels = useMemo(() => toArray(models), [models]);
  return (
    <WizardFormContext.Provider value={{ models: contextModels, fieldsProvider, orgDetails }}>
      {children}
    </WizardFormContext.Provider>
  );
};

export const useFormModelUuid = (type?: FormModelType | null) =>
  useContext(WizardFormContext).models.find(m => m.model === type)?.uuid;

export const useFieldsProvider = () => useContext(WizardFormContext).fieldsProvider;

export const useFormEntities = () => {
  const { models } = useContext(WizardFormContext);
  return useMemo<Entity[]>(
    () =>
      (models ?? [])
        .filter(({ model }) => model != null && model !== "organisations")
        .map(({ model, uuid }) => ({
          entityName: kebabCase(model) as EntityName,
          entityUUID: uuid
        })),
    [models]
  );
};

export const useOrgFormDetails = () => useContext(WizardFormContext).orgDetails;

export default WizardFormProvider;
