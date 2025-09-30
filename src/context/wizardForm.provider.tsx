import { kebabCase, orderBy, uniq } from "lodash";
import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { OrgFormDetails } from "@/components/elements/Inputs/FinancialTableInput/types";
import { FieldDefinition, StepDefinition } from "@/components/extensive/WizardForm/types";
import { questionDtoToDefinition } from "@/components/extensive/WizardForm/utils";
import { selectQuestion, selectQuestions, selectSections, useForm } from "@/connections/util/Form";
import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Entity, EntityName } from "@/types/common";
import { isNotNull, toArray } from "@/utils/array";

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

export type LocalStep = StepDefinition & { fields: LocalFieldWithChildren[] };
export type LocalFieldWithChildren = FieldDefinition & { children?: FieldDefinition[] };

const createLocalStepsProvider = (
  localSteps: LocalStep[],
  feedbackRequired: (fieldId: string) => boolean = () => false
): FormFieldsProvider => {
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
    feedbackRequired
  };
};

export const useLocalStepsProvider = (localSteps: LocalStep[]) =>
  useMemo(() => createLocalStepsProvider(localSteps), [localSteps]);

// Returns a boolean indicating whether the form is loaded, and the fields provider.
export const useApiFieldsProvider = (
  formUuid?: string | null,
  feedbackFields?: string[] | null,
  fieldFilter?: (field: FormQuestionDto) => boolean
): [boolean, FormFieldsProvider] => {
  const enabled = formUuid != null;
  const [formLoaded, { data: form }] = useForm({ id: formUuid ?? undefined, enabled: formUuid != null });
  const provider = useMemo(
    // It's important that this memoized result depends on the loaded form in some way (here it's
    // using the UUID from the form response instead of formUuid in the args) so that this memoized
    // result recalculates when the form is done loading.
    () => {
      // Convert the API form to a valid LocalSteps definition.
      const localSteps: LocalStep[] =
        form?.uuid == null
          ? []
          : selectSections(form.uuid).reduce((steps, section) => {
              const allQuestions = selectQuestions(section.uuid);
              const filteredQuestions = fieldFilter == null ? allQuestions : allQuestions.filter(fieldFilter);
              // It's possible our filter included a child question but not its parent.
              const missingParentIds = uniq(
                filteredQuestions
                  .filter(
                    ({ parentId }) => parentId != null && filteredQuestions.find(q => q.uuid === parentId) == null
                  )
                  .map(({ parentId }) => parentId)
                  .filter(isNotNull)
              );
              const questions =
                missingParentIds.length === 0
                  ? filteredQuestions
                  : orderBy(
                      [...filteredQuestions, ...missingParentIds.map(id => selectQuestion(id)).filter(isNotNull)],
                      "order"
                    );

              // Remove steps that have no questions left after filtering.
              if (questions.length === 0) return steps;

              const { uuid, ...step } = section;
              const fields = questions
                .filter(({ parentId }) => parentId == null)
                .map(question => ({
                  ...questionDtoToDefinition(question),
                  children: questions.filter(({ parentId }) => parentId === question.uuid).map(questionDtoToDefinition)
                }));
              return [...steps, { ...step, id: uuid, fields }];
            }, [] as LocalStep[]);
      return createLocalStepsProvider(localSteps, (fieldId: string) => feedbackFields?.includes(fieldId) ?? false);
    },
    [feedbackFields, fieldFilter, form?.uuid]
  );
  return [formLoaded && enabled, provider];
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
