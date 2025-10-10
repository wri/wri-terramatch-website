import Input from "@/components/elements/Inputs/Input/Input";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { addValidationWith, urlValidator } from "@/utils/yup";

export const UrlField: FormFieldFactory = {
  addValidation: addValidationWith(urlValidator),
  renderInput: (field, sharedProps) => <Input {...sharedProps} type="url" />
};
