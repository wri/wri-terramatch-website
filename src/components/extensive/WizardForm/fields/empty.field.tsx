import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

export const EmptyField: FormFieldFactory = {
  addValidation: () => {},
  renderInput: () => <></>
};
