import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { FormQuestionDto } from "@/generated/v3/entityService/entityServiceSchemas";

type FormModelType = NonNullable<FormQuestionDto["model"]>;

export type FormModel = {
  model: FormModelType;
  uuid: string;
};

// A user of this context may either provide a single model or an array of models. If an array of
// models is provided, useMemo should be used to prevent egregious re-renders.
type FormModelProviderProps = Partial<FormModel> & {
  models?: FormModel[];
};

interface IFormModelContext {
  models: FormModel[];
}

const FormModelContext = createContext<IFormModelContext>({ models: [] });

const FormModelProvider: FC<PropsWithChildren<FormModelProviderProps>> = ({ models, model, uuid, children }) => {
  const contextModels = useMemo(
    () => (models != null ? models : model != null && uuid != null ? [{ model, uuid }] : []),
    [model, models, uuid]
  );
  return <FormModelContext.Provider value={{ models: contextModels }}>{children}</FormModelContext.Provider>;
};

export const useFormModelUuid = (type?: FormModelType | null) =>
  useContext(FormModelContext).models.find(m => m.model === type)?.uuid;

export default FormModelProvider;
