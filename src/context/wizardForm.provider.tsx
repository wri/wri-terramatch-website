import { kebabCase } from "lodash";
import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { FieldDefinition, StepDefinition } from "@/components/extensive/WizardForm/types";
import { FormModelType, useForm } from "@/connections/Form";
import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Entity, EntityName } from "@/types/common";
import { isNotNull, toArray } from "@/utils/array";

export type FormModel = {
  model: FormModelType;
  uuid: string;
};

export type FormModelsDefinition = FormModel | FormModel[];

export type FormFieldsProvider = {
  /**
   * Get all step IDs in the form in render order.
   */
  stepIds: () => string[];

  /**
   * Get the step definition for the given step ID.
   */
  step: (id: string) => StepDefinition | undefined;

  /**
   * Get all field names in the step in render order. Does _not_ return fields that have a parent.
   */
  fieldNames: (stepId: string) => string[];

  /**
   * Get the field definition for the given field name.
   */
  fieldByName: (name: string) => FieldDefinition | undefined;

  /**
   * Returns the first field definition that has the given linkedFieldKey.
   */
  fieldByKey: (linkedFieldKey: string) => FieldDefinition | undefined;

  /**
   * Returns the child field names for the given parent field in render order.
   */
  childNames: (parentName: string) => string[];

  /**
   * Returns true if the given field requires feedback.
   */
  feedbackRequired: (fieldId: string) => boolean;
};

const StubFormFieldsProvider: FormFieldsProvider = {
  stepIds: () => [],
  step: () => undefined,
  fieldNames: () => [],
  fieldByName: () => undefined,
  fieldByKey: () => undefined,
  childNames: () => [],
  feedbackRequired: () => false
};

export type LocalStep = StepDefinition & { fields: LocalFieldWithChildren[] };
export type LocalFieldWithChildren = FieldDefinition & { children?: FieldDefinition[] | null };

export const createLocalStepsProvider = (
  localSteps: LocalStep[],
  feedbackRequired: (fieldId: string) => boolean = () => false
): FormFieldsProvider => {
  const stepIds = localSteps.map(({ id }) => id);
  const stepsById = new Map<string, StepDefinition>(localSteps.map(({ fields, ...step }) => [step.id, step]));
  const fieldNames = new Map(localSteps.map(({ id, fields }) => [id, fields.map(({ name }) => name)]));
  const fieldsByName = new Map(
    localSteps.flatMap(({ fields }) =>
      fields.flatMap(
        ({ children, ...field }) =>
          [[field.name, field], ...(children ?? []).map(child => [child.name, child])] as [string, FieldDefinition][]
      )
    )
  );
  const fieldsByKey = new Map(
    [...fieldsByName.values()]
      .filter(({ linkedFieldKey }) => linkedFieldKey != null)
      .map(field => [field.linkedFieldKey as string, field])
  );
  const childNames = new Map<string, string[]>(
    localSteps
      .flatMap(({ fields }) => fields)
      .filter(({ children }) => children != null)
      .map(({ name, children }) => [name, (children ?? []).map(({ name }) => name)])
  );

  return {
    stepIds: () => stepIds ?? [],
    step: (id: string) => stepsById.get(id),
    fieldNames: (stepId: string) => fieldNames.get(stepId) ?? [],
    fieldByName: (name: string) => fieldsByName.get(name),
    fieldByKey: (linkedFieldKey: string) => fieldsByKey.get(linkedFieldKey),
    childNames: (childName: string) => childNames.get(childName) ?? [],
    feedbackRequired
  };
};

/**
 * Create a FormFieldsProvider using a LocalStep[] array.
 *
 * IMPORTANT: `localSteps` is used as a dependency on `useMemo`, and MUST be stable so the provider isn't
 * recreated on every render.
 */
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
  const provider = useMemo(() => {
    // Convert the API form to a valid LocalSteps definition.
    const localSteps: LocalStep[] = (form?.sections ?? [])
      .map(({ id, title, description, questions }): LocalStep | undefined => {
        const fields = questions
          .map((question): LocalFieldWithChildren | undefined => {
            // Only used for including parent questions whose children have been selected
            const children =
              (fieldFilter == null ? question.children : question.children?.filter(fieldFilter)) ?? undefined;
            if (fieldFilter != null && !fieldFilter(question)) {
              // If the field filter says no to this question, return null if it has no children,
              // or if all of its children have been filtered out as well.
              if (children == null || children.length === 0) return undefined;
            }

            // If a parent question has been included, we always include all of its children.
            return question;
          })
          .filter(isNotNull);

        return fields.length === 0 ? undefined : { id, title, description, fields };
      })
      .filter(isNotNull);
    return createLocalStepsProvider(localSteps, (fieldId: string) => feedbackFields?.includes(fieldId) ?? false);
  }, [feedbackFields, fieldFilter, form?.sections]);
  return [formLoaded && enabled, provider];
};

export type OrgFormDetails = {
  uuid?: string;
  currency?: string;
  startMonth?: string | number;
  title?: string;
  type?: string;
};

export type ProjectFormDetails = {
  uuid?: string;
};

type IFormFieldsContext = {
  models: FormModel[];
  fieldsProvider: FormFieldsProvider;
  orgDetails?: OrgFormDetails;
  projectDetails?: ProjectFormDetails;
};

type WizardFormProviderProps = {
  models?: FormModelsDefinition;
  fieldsProvider: FormFieldsProvider;
  orgDetails?: OrgFormDetails;
  projectDetails?: ProjectFormDetails;
};

const WizardFormContext = createContext<IFormFieldsContext>({ models: [], fieldsProvider: StubFormFieldsProvider });

const WizardFormProvider: FC<PropsWithChildren<WizardFormProviderProps>> = ({
  models,
  fieldsProvider,
  orgDetails,
  projectDetails,
  children
}) => {
  const contextModels = useMemo(() => toArray(models), [models]);
  return (
    <WizardFormContext.Provider value={{ models: contextModels, fieldsProvider, orgDetails, projectDetails }}>
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

export const useProjectFormDetails = () => useContext(WizardFormContext).projectDetails;

export default WizardFormProvider;
