import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { FieldDefinition, FormDefinition, StepDefinition } from "@/components/extensive/WizardForm/types";
import { questionDtoToDefinition } from "@/components/extensive/WizardForm/utils";
import { selectQuestions, selectSection, selectSections, useForm } from "@/connections/util/Form";
import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { toArray } from "@/utils/array";

type FormModelType = NonNullable<FormQuestionDto["model"]>;

export type FormModel = {
  model: FormModelType;
  uuid: string;
};

export type FormModelsDefinition = FormModel | FormModel[];

export type FormFieldsProvider = {
  form: () => FormDefinition | undefined;
  // Returns the step IDs in the order they should be displayed in the form.
  stepIds: () => string[];
  step: (id: string) => StepDefinition | undefined;
  fieldIds: (sectionId: string) => string[];
  fieldById: (id: string) => FieldDefinition | undefined;
  fieldByKey: (linkedFieldKey: string) => FieldDefinition | undefined;
  childIds: (fieldId: string) => string[];
};

const StubFormFieldsProvider: FormFieldsProvider = {
  form: () => undefined,
  stepIds: () => [],
  step: () => undefined,
  fieldIds: () => [],
  fieldById: () => undefined,
  fieldByKey: () => undefined,
  childIds: () => []
};

// Returns a boolean indicating whether the form is loaded, and the fields provider.
export const useApiFieldsProvider = (formUuid?: string | null): [boolean, FormFieldsProvider] => {
  const [, { data: form }] = useForm({ id: formUuid ?? undefined, enabled: formUuid != null });
  const provider = useMemo<FormFieldsProvider>(() => {
    // section ids and question ids are sorted at the connection level based on the `order` field.
    const stepIds = form == null ? [] : selectSections(form.uuid).map(({ uuid }) => uuid);
    const stepsById =
      form == null ? new Map<string, StepDefinition>() : new Map(stepIds.map(id => [id, { id, ...selectSection(id) }]));
    const fieldIds =
      form == null
        ? new Map<string, string[]>()
        : new Map(
            stepIds.map(id => [
              id,
              selectQuestions(id)
                .filter(({ parentId }) => parentId == null)
                .map(({ uuid }) => uuid)
            ])
          );
    const fieldsById =
      form == null
        ? new Map<string, FieldDefinition>()
        : new Map(
            stepIds.flatMap(sectionId =>
              selectQuestions(sectionId).map(question => [question.uuid, questionDtoToDefinition(question)])
            )
          );
    const fieldsByKey = new Map(
      [...fieldsById.values()]
        .filter(({ linkedFieldKey }) => linkedFieldKey != null)
        .map(field => [field.linkedFieldKey as string, field])
    );

    const childIds = stepIds
      .flatMap(id => selectQuestions(id))
      .filter(({ parentId }) => parentId != null)
      .reduce((map, { uuid, parentId }) => {
        const list = map.get(parentId!) ?? [];
        map.set(parentId!, [...list, uuid]);
        return map;
      }, new Map<string, string[]>());

    return {
      form: () => form,
      stepIds: () => stepIds ?? [],
      step: (id: string) => stepsById.get(id),
      fieldIds: (sectionId: string) => fieldIds.get(sectionId) ?? [],
      fieldById: (id: string) => fieldsById.get(id),
      fieldByKey: (linkedFieldKey: string) => fieldsByKey.get(linkedFieldKey),
      childIds: (fieldId: string) => childIds.get(fieldId) ?? []
    };
  }, [form]);
  return [form != null, provider];
};

type IFormFieldsContext = {
  models: FormModel[];
  fieldsProvider: FormFieldsProvider;
};

type WizardFormProviderProps = {
  models: FormModelsDefinition;
  fieldsProvider: FormFieldsProvider;
};

const WizardFormContext = createContext<IFormFieldsContext>({ models: [], fieldsProvider: StubFormFieldsProvider });

const WizardFormProvider: FC<PropsWithChildren<WizardFormProviderProps>> = ({ models, fieldsProvider, children }) => {
  const contextModels = useMemo(() => toArray(models), [models]);
  return (
    <WizardFormContext.Provider value={{ models: contextModels, fieldsProvider }}>
      {children}
    </WizardFormContext.Provider>
  );
};

export const useFormModelUuid = (type?: FormModelType | null) =>
  useContext(WizardFormContext).models.find(m => m.model === type)?.uuid;

export const useFieldsProvider = () => useContext(WizardFormContext).fieldsProvider;

export default WizardFormProvider;
