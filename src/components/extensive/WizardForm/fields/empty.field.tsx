import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

export const EmptyField: FormFieldFactory = {
  createValidator: () => undefined,
  renderInput: () => <></>
};
